angular.module('ba.shared.directives.typeahead', ['ba.shared.util.debounce', 'ba.shared.util.position'])
    /**
     * A helper service that can parse typeahead's syntax (string provided by users)
     * Extracted to a separate service for ease of unit testing
     */
    .factory('baTypeaheadParser', ['$parse', function ($parse) {
        //                      00000111000000000000022200000000000000003333333333333330000000000044000
        var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
        return {
            parse: function (input) {
                var match = input.match(TYPEAHEAD_REGEXP);
                if (!match) {
                    throw new Error(
                        'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
                        ' but got "' + input + '".');
                }

                return {
                    itemName: match[3],
                    source: $parse(match[4]),
                    viewMapper: $parse(match[2] || match[1]),
                    modelMapper: $parse(match[1])
                };
            }
        };
    }])

    .controller('BaTypeaheadController', ['$scope', '$element', '$attrs', '$compile', '$parse', '$q', '$timeout', '$document', '$window', '$rootScope', '$$debounce', '$position', 'baTypeaheadParser', '$interpolate',
        function (originalScope, element, attrs, $compile, $parse, $q, $timeout, $document, $window, $rootScope, $$debounce, $position, typeaheadParser, $interpolate) {
            var HOT_KEYS = [9, 13, 27, 38, 40];
            var eventDebounceTime = 200;
            var modelCtrl, ngModelOptions;
            //SUPPORTED ATTRIBUTES (OPTIONS)

            //minimal no of characters that needs to be entered before typeahead kicks-in
            var minLength = originalScope.$eval(attrs.baTypeaheadMinLength);
            if (!minLength && minLength !== 0) {
                minLength = 1;
            }

            //minimal wait time after last character typed before typeahead kicks-in
            var waitTime = originalScope.$eval(attrs.baTypeaheadWaitMs) || 0;

            //should it restrict model values to the ones selected from the popup only?
            var isEditable = originalScope.$eval(attrs.baTypeaheadEditable) !== false;
            originalScope.$watch(attrs.baTypeaheadEditable, function (newVal) {
                isEditable = newVal !== false;
            });

            originalScope.$watch(attrs.baTypeaheadFocusOn, function (newVal) {
                if (newVal) {
                    $timeout(function () {
                        element[0].focus();
                    }, 0);
                } else {
                    destroyBlur();
                }
            });

            //binding to a variable that indicates if matches are being retrieved asynchronously
            var isLoadingSetter = $parse(attrs.baTypeaheadLoading).assign || angular.noop;

            var onSelectNoMatchCallback = $parse(attrs.baTypeaheadOnSelectNoMatch) || angular.noop;
            var hasOnSelectNoMatchCallback = !!attrs.baTypeaheadOnSelectNoMatch;

            //a callback executed when a match is selected
            var onSelectCallback = $parse(attrs.baTypeaheadOnSelect) || angular.noop;
            var onCancelCallback = $parse(attrs.baTypeaheadOnCancel) || angular.noop;
            var rejectOnCallback = $parse(attrs.baTypeaheadRejectOn) || angular.noop;
            var placeholderOnFocus = originalScope.$eval(attrs.baTypeaheadPlaceholderOnFocus);

            //should it select highlighted popup value when losing focus?
            var isSelectOnBlur = angular.isDefined(attrs.baTypeaheadSelectOnBlur) ? originalScope.$eval(attrs.baTypeaheadSelectOnBlur) : false;

            //binding to a variable that indicates if there were no results after the query is completed
            var isNoResultsSetter = $parse(attrs.baTypeaheadNoResults).assign || angular.noop;
            var isFocusedSetter = $parse(attrs.baTypeaheadIsFocused).assign || angular.noop;

            var inputFormatter = attrs.baTypeaheadInputFormatter ? $parse(attrs.baTypeaheadInputFormatter) : undefined;

            var appendToBody = attrs.baTypeaheadAppendToBody ? originalScope.$eval(attrs.baTypeaheadAppendToBody) : false;

            var appendTo = attrs.baTypeaheadAppendTo ?
                originalScope.$eval(attrs.baTypeaheadAppendTo) : null;

            var focusFirst = originalScope.$eval(attrs.baTypeaheadFocusFirst) !== false;

            //If input matches an item of the list exactly, select it automatically
            var selectOnExact = attrs.baTypeaheadSelectOnExact ? originalScope.$eval(attrs.baTypeaheadSelectOnExact) : false;

            //binding to a variable that indicates if dropdown is open
            var isOpenSetter = $parse(attrs.baTypeaheadIsOpen).assign || angular.noop;

            var showHint = originalScope.$eval(attrs.baTypeaheadShowHint) || false;

            var blurEl = attrs.baTypeaheadBlurElement ? $document.find(attrs.baTypeaheadBlurElement) : $document;

            //INTERNAL VARIABLES

            //model setter executed upon match selection
            var parsedModel = $parse(attrs.ngModel);
            var invokeModelSetter = $parse(attrs.ngModel + '($$$p)');

            var $setModelValue = function (scope, newValue) {
                if (angular.isFunction(parsedModel(originalScope)) &&
                    ngModelOptions && ngModelOptions.$options &&
                    ngModelOptions.$options.getterSetter) {
                    return invokeModelSetter(scope, {
                        $$$p: newValue
                    });
                }

                return parsedModel.assign(scope, newValue);
            };

            //expressions used by typeahead
            var parserResult = typeaheadParser.parse(attrs.baTypeahead);

            var hasFocus;

            //Used to avoid bug in iOS webview where iOS keyboard does not fire
            //mousedown & mouseup events
            //Issue #3699
            var selected;

            //create a child scope for the typeahead directive so we are not polluting original scope
            //with typeahead-specific data (matches, query etc.)
            var scope = originalScope.$new();
            var offDestroy = originalScope.$on('$destroy', function () {
                scope.$destroy();
            });
            scope.$on('$destroy', offDestroy);

            // WAI-ARIA
            var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
            element.attr({
                'aria-autocomplete': 'list',
                'aria-expanded': false,
                'aria-owns': popupId
            });

            var inputsContainer, hintInputElem;
            //add read-only input to show hint
            if (showHint) {
                inputsContainer = angular.element('<div></div>');
                inputsContainer.css('position', 'relative');
                element.after(inputsContainer);
                hintInputElem = element.clone();
                hintInputElem.attr('placeholder', '');
                hintInputElem.val('');
                hintInputElem.css({
                    'position': 'absolute',
                    'top': '0px',
                    'left': '0px',
                    'border-color': 'transparent',
                    'box-shadow': 'none',
                    'opacity': 1,
                    'background': 'none 0% 0% / auto repeat scroll padding-box border-box rgb(255, 255, 255)',
                    'color': '#999'
                });
                element.css({
                    'position': 'relative',
                    'vertical-align': 'top',
                    'background-color': 'transparent'
                });
                inputsContainer.append(hintInputElem);
                hintInputElem.after(element);
            }

            //pop-up element used to display matches
            var popUpEl = angular.element('<div ba-typeahead-popup></div>');
            popUpEl.attr({
                id: popupId,
                matches: 'matches',
                active: 'activeIdx',
                select: 'select(activeIdx)',
                'move-in-progress': 'moveInProgress',
                'has-focus': 'hasFocus',
                query: 'query',
                position: 'position',
                'assign-is-open': 'assignIsOpen(isOpen)',
                'has-no-match-callback': 'hasOnSelectNoMatchCallback',
                debounce: 'debounceUpdate',
                'reject-on': 'rejectOn(query)'
            });
            //custom item template
            if (angular.isDefined(attrs.baTypeaheadTemplateUrl)) {
                popUpEl.attr('template-url', $interpolate(attrs.baTypeaheadTemplateUrl)(scope));
            }

            if (angular.isDefined(attrs.baTypeaheadPopupTemplateUrl)) {
                popUpEl.attr('popup-template-url', $interpolate(attrs.baTypeaheadPopupTemplateUrl)(scope));
            }

            var resetHint = function () {
                if (showHint) {
                    hintInputElem.val('');
                }
            };

            var resetMatches = function (query) {
                scope.query = query || '';

                scope.matches = [];
                //resetMatchesToSource();
                scope.activeIdx = -1;
                element.attr('aria-expanded', false);
                resetHint();
            };

            var getMatchId = function (index) {
                return popupId + '-option-' + index;
            };

            // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
            // This attribute is added or removed automatically when the `activeIdx` changes.
            scope.$watch('activeIdx', function (index) {
                if (index < 0) {
                    element.removeAttr('aria-activedescendant');
                } else {
                    element.attr('aria-activedescendant', getMatchId(index));
                }
            });

            var inputIsExactMatch = function (inputValue, index) {
                if (scope.matches.length > index && inputValue) {
                    return inputValue.toUpperCase() === scope.matches[index].label.toUpperCase();
                }

                return false;
            };

            var getMatchesAsync = function (inputValue) {
                var locals = {
                    $viewValue: inputValue
                };
                isLoadingSetter(originalScope, true);
                isNoResultsSetter(originalScope, false);

                $q.when(parserResult.source(originalScope, locals)).then(
                    function (matches) {
                        //it might happen that several async queries were in progress if a user were typing fast
                        //but we are interested only in responses that correspond to the current view value

                        var onCurrentRequest = inputValue === modelCtrl.$viewValue;

                        if (onCurrentRequest && hasFocus) {
                            if (matches && matches.length > 0) {
                                scope.activeIdx = focusFirst ? 0 : -1;
                                isNoResultsSetter(originalScope, false);
                                scope.matches.length = 0;

                                //transform labels
                                for (var i = 0; i < matches.length; i++) {
                                    locals[parserResult.itemName] = matches[i];
                                    scope.matches.push({
                                        id: getMatchId(i),
                                        label: parserResult.viewMapper(scope, locals),
                                        model: matches[i]
                                    });
                                }

                                scope.query = inputValue;
                                //position pop-up with matches - we need to re-calculate its position each time we are opening a window
                                //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
                                //due to other elements being rendered
                                recalculatePosition();

                                element.attr('aria-expanded', true);

                                //Select the single remaining option if user input matches
                                if (scope.matches.length === 1 && inputIsExactMatch(inputValue, 0)) {
                                    if (selectOnExact) {
                                        if (angular.isNumber(scope.debounceUpdate) || angular.isObject(scope.debounceUpdate)) {
                                            $$debounce(function () {
                                                scope.select(0);
                                            }, angular.isNumber(scope.debounceUpdate) ? scope.debounceUpdate : scope.debounceUpdate['default']);
                                        } else {
                                            scope.select(0);
                                        }
                                    } else {
                                        scope.activeIdx = 0;
                                    }
                                }

                                if (showHint) {
                                    var firstLabel = scope.matches[0].label;
                                    if (inputValue.length > 0 && firstLabel.slice(0, inputValue.length).toUpperCase() === inputValue.toUpperCase()) {
                                        hintInputElem.val(inputValue + firstLabel.slice(inputValue.length));
                                    } else {
                                        hintInputElem.val('');
                                    }
                                }
                            } else {
                                resetMatches(inputValue);
                                isNoResultsSetter(originalScope, true);
                            }
                        }
                        if (onCurrentRequest) {
                            isLoadingSetter(originalScope, false);
                        }
                    },
                    function () {
                        resetMatches();
                        isLoadingSetter(originalScope, false);
                        isNoResultsSetter(originalScope, true);
                    });
            };

            // bind events only if appendToBody params exist - performance feature
            if (appendToBody) {
                angular.element($window).on('resize', fireRecalculating);
                $document.find('body').on('scroll', fireRecalculating);
            }

            // Declare the debounced function outside recalculating for
            // proper debouncing
            var debouncedRecalculate = $$debounce(function () {
                // if popup is visible
                if (scope.matches.length) {
                    recalculatePosition();
                }

                scope.moveInProgress = false;
            }, eventDebounceTime);

            // Default progress type
            scope.moveInProgress = false;

            function fireRecalculating() {
                if (!scope.moveInProgress) {
                    scope.moveInProgress = true;
                    scope.$digest();
                }

                debouncedRecalculate();
            }

            // recalculate actual position and set new values to scope
            // after digest loop is popup in right position
            function recalculatePosition() {
                scope.position = appendToBody ? $position.offset(element) : $position.position(element);
                scope.position.top += element.prop('offsetHeight');
            }

            //we need to propagate user's query so we can higlight matches
            scope.query = undefined;

            //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
            var timeoutPromise;

            var scheduleSearchWithTimeout = function (inputValue) {
                timeoutPromise = $timeout(function () {
                    getMatchesAsync(inputValue);
                }, waitTime);
            };

            var cancelPreviousTimeout = function () {
                if (timeoutPromise) {
                    $timeout.cancel(timeoutPromise);
                }
            };

            resetMatches();

            scope.assignIsOpen = function (isOpen) {
                isOpenSetter(originalScope, isOpen);
            };

            scope.rejectOn = function (query) {
                return rejectOnCallback(originalScope, {
                    query: query
                });
            };

            scope.hasOnSelectNoMatchCallback = hasOnSelectNoMatchCallback;

            scope.select = function (activeIdx) {
                var locals = {};
                var model, item;

                selected = true;
                if (~activeIdx) {
                    locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
                    model = parserResult.modelMapper(originalScope, locals);
                } else if (hasOnSelectNoMatchCallback) {
                    locals[parserResult.itemName] = item = scope.query;
                    model = parserResult.modelMapper(originalScope, locals);
                }

                $setModelValue(originalScope, model);
                modelCtrl.$viewValue = modelCtrl.$modelValue;
                element.val(modelCtrl.$modelValue);
                modelCtrl.$setValidity('editable', true);
                modelCtrl.$setValidity('parse', true);

                if (~activeIdx) {
                    onSelectCallback(originalScope, {
                        $item: item,
                        $model: model,
                        $label: parserResult.viewMapper(originalScope, locals)
                    });
                } else if (hasOnSelectNoMatchCallback) {
                    onSelectNoMatchCallback(originalScope, {
                        $item: item,
                        $model: model
                    });
                }

                resetMatches();

                // return focus to the input element if a match was selected via a mouse click event
                // use timeout to avoid $rootScope:inprog error
                if (scope.$eval(attrs.baTypeaheadFocusOnSelect) !== false) {
                    $timeout(function () {
                        element[0].focus();
                    }, 0, false);
                } else {
                    scope.hasFocus = hasFocus = false;
                }
            };

            /*
             ELEMENT EVENT HANDLERS
             */

            //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
            element.on('keydown', function (evt) {
                //typeahead is open and an "interesting" key was pressed
                if (HOT_KEYS.indexOf(evt.which) === -1) {
                    return;
                }

                // if there's nothing selected (i.e. focusFirst) and enter or tab is hit, clear the results
                if (scope.activeIdx === -1 && (evt.which === 9)) {
                    resetMatches();
                    scope.$digest();
                    return;
                }

                evt.preventDefault();

                switch (evt.which) {
                    case 9:
                    case 13:
                        scope.$apply(function () {
                            if (angular.isNumber(scope.debounceUpdate) || angular.isObject(scope.debounceUpdate)) {
                                $$debounce(function () {
                                    scope.select(scope.activeIdx);
                                }, angular.isNumber(scope.debounceUpdate) ? scope.debounceUpdate : scope.debounceUpdate['default']);
                            } else {
                                scope.select(scope.activeIdx);
                            }
                        });
                        break;
                    case 27:
                        evt.stopPropagation();

                        resetMatches();
                        onCancelCallback(originalScope);
                        scope.$apply();
                        break;
                    case 38:
                        scope.activeIdx = (scope.activeIdx >= 0 ? scope.activeIdx : scope.matches.length) - 1;
                        scope.$digest();
                        popUpEl.children()[~scope.activeIdx ? scope.activeIdx : (popUpEl.children().length - 1)].scrollIntoView(false);
                        break;
                    case 40:
                        scope.activeIdx = scope.activeIdx == (scope.matches.length - 1) ? -1 : scope.activeIdx + 1;
                        scope.$digest();
                        popUpEl.children()[~scope.activeIdx ? scope.activeIdx : (popUpEl.children().length - 1)].scrollIntoView(false);
                        //popUpEl.children()[scope.activeIdx].scrollIntoView(false);
                        break;
                }
            });

            var basePlaceholder = element.attr('placeholder');

            element.bind('focus', function (e) {
                e.stopPropagation();

                if (placeholderOnFocus) {
                    element.attr('placeholder', modelCtrl.$modelValue || basePlaceholder);
                    modelCtrl.$viewValue = '';
                    element.val('');
                }

                bindBlur();
            });

            element.bind('click', function (e) {
                e.stopPropagation();

                if (minLength === 0 && !modelCtrl.$viewValue) {
                    getMatchesAsync(modelCtrl.$viewValue);
                }

                scope.$apply(function () {
                    scope.hasFocus = hasFocus = true;
                    isFocusedSetter(originalScope, true);
                });
            });

            function bindBlur() {
                blurEl.on('click', handleBlur);
            }

            function destroyBlur() {
                blurEl.off('click', handleBlur);
            }

            function handleBlur(e) {
                if (e) {
                    e.stopPropagation();
                }

                if (isSelectOnBlur && scope.matches.length && !selected) {
                    selected = true;
                    scope.$applyAsync(function () {
                        if (angular.isObject(scope.debounceUpdate) &&
                            angular.isNumber(scope.debounceUpdate.blur)) {
                            $$debounce(function () {
                                scope.select(scope.activeIdx);
                            }, scope.debounceUpdate.blur);
                        } else {
                            scope.select(scope.activeIdx);
                        }
                    });
                }

                if (!isEditable && modelCtrl.$error.editable) {
                    modelCtrl.$viewValue = modelCtrl.$modelValue;
                    element.val(modelCtrl.$modelValue);
                }

                selected = false;

                scope.$applyAsync(function () {
                    scope.hasFocus = hasFocus = false;
                    isFocusedSetter(originalScope, false);
                });

                destroyBlur();
            }

            // Replacement blur event

            //element.bind('blur', onblur);

            // Keep reference to click handler to unbind it.
            var dismissClickHandler = function (evt) {
                // Issue #3973
                // Firefox treats right click as a click on document
                if (element[0] !== evt.target && evt.which !== 3 && scope.matches.length !== 0) {
                    resetMatches();
                    if (!$rootScope.$$phase) {
                        scope.$digest();
                    }
                }
            };

            $document.on('click', dismissClickHandler);

            originalScope.$on('$destroy', function () {
                $document.off('click', dismissClickHandler);
                destroyBlur();
                if (appendToBody || appendTo) {
                    $popup.remove();
                }

                if (appendToBody) {
                    angular.element($window).off('resize', fireRecalculating);
                    $document.find('body').off('scroll', fireRecalculating);
                }
                // Prevent jQuery cache memory leak
                popUpEl.remove();

                if (showHint) {
                    inputsContainer.remove();
                }
            });

            var $popup = $compile(popUpEl)(scope);

            if (appendToBody) {
                $document.find('body').append($popup);
            } else if (appendTo) {
                angular.element(appendTo).eq(0).append($popup);
            } else {
                element.after($popup);
            }

            this.init = function (_modelCtrl, _ngModelOptions) {
                modelCtrl = _modelCtrl;
                ngModelOptions = _ngModelOptions;

                scope.debounceUpdate = modelCtrl.$options && $parse(modelCtrl.$options.debounce)(originalScope);

                //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
                //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
                modelCtrl.$parsers.unshift(function (inputValue) {
                    scope.hasFocus = hasFocus = true;

                    if (minLength === 0 || inputValue && inputValue.length >= minLength) {
                        if (waitTime > 0) {
                            cancelPreviousTimeout();
                            scheduleSearchWithTimeout(inputValue);
                        } else {
                            getMatchesAsync(inputValue);
                        }
                    } else {
                        isLoadingSetter(originalScope, false);
                        cancelPreviousTimeout();
                        resetMatches();
                    }

                    if (isEditable) {
                        return inputValue;
                    }

                    if (!inputValue && !placeholderOnFocus) {
                        // Reset in case user had typed something previously.
                        modelCtrl.$setValidity('editable', true);
                        return null;
                    } else if (placeholderOnFocus) {
                        // inputValue || placeholderOnFocus
                        modelCtrl.$setValidity('editable', false);
                        return modelCtrl.$modelValue;
                    } else {
                        modelCtrl.$setValidity('editable', false);
                        return modelCtrl.$modelValue;
                    }
                });

                modelCtrl.$formatters.push(function (modelValue) {
                    var candidateViewValue, emptyViewValue;
                    var locals = {};

                    // The validity may be set to false via $parsers (see above) if
                    // the model is restricted to selected values. If the model
                    // is set manually it is considered to be valid.
                    if (!isEditable) {
                        modelCtrl.$setValidity('editable', true);
                    }

                    if (inputFormatter) {
                        locals.$model = modelValue;
                        return inputFormatter(originalScope, locals);
                    }

                    //it might happen that we don't have enough info to properly render input value
                    //we need to check for this situation and simply return model value if we can't apply custom formatting
                    locals[parserResult.itemName] = modelValue;
                    candidateViewValue = parserResult.viewMapper(originalScope, locals);
                    locals[parserResult.itemName] = undefined;
                    emptyViewValue = parserResult.viewMapper(originalScope, locals);

                    return candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue;
                });
            };
        }
    ])

    .directive('baTypeahead', function () {
        return {
            controller: 'BaTypeaheadController',
            require: ['ngModel', '^?ngModelOptions', 'baTypeahead'],
            link: function (originalScope, element, attrs, ctrls) {
                ctrls[2].init(ctrls[0], ctrls[1]);
            }
        };
    })

    .directive('baTypeaheadPopup', function ($$debounce, SharedPaths) {
        return {
            scope: {
                matches: '=',
                hasFocus: '=',
                query: '=',
                active: '=',
                position: '&',
                moveInProgress: '=',
                select: '&',
                assignIsOpen: '&',
                debounce: '&',
                rejectOn: '&',
                hasNoMatchCallback: '='
            },
            replace: true,
            templateUrl: function (element, attrs) {
                return attrs.popupTemplateUrl || SharedPaths.typeahead.popup;
            },
            link: function (scope, element, attrs) {
                scope.templateUrl = attrs.templateUrl;

                scope.isOpen = function () {
                    var isDropdownOpen = scope.matches.length > 0;
                    scope.assignIsOpen({
                        isOpen: isDropdownOpen
                    });
                    return isDropdownOpen;
                };

                scope.isActive = function (matchIdx) {
                    return scope.active === matchIdx;
                };

                scope.selectActive = function (matchIdx) {
                    scope.active = matchIdx;
                };

                scope.selectMatch = function (activeIdx, $event) {
                    if ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                    }

                    var debounce = scope.debounce();
                    if (angular.isNumber(debounce) || angular.isObject(debounce)) {
                        $$debounce(function () {
                            scope.select(activeIdx);
                        }, angular.isNumber(debounce) ? debounce : debounce['default']);
                    } else {
                        scope.select(activeIdx);
                    }
                };

                scope.hasExactMatch = function (val) {
                    return _.find(scope.matches, {
                        label: val
                    });
                };
            }
        };
    })
    .directive('baTypeaheadMatch', function ($templateRequest, $compile, $parse, SharedPaths) {
        return {
            scope: {
                index: '=',
                match: '=',
                query: '='
            },
            link: function (scope, element, attrs) {
                var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || SharedPaths.typeahead.match;

                $templateRequest(tplUrl).then(
                    function (tplContent) {
                        var tplEl = angular.element(tplContent.trim());
                        element.replaceWith(tplEl);
                        $compile(tplEl)(scope);
                    });
            }
        };
    })
    .filter('typeaheadHighlight', function ($sce, $injector, $log) {
        var isSanitizePresent;
        isSanitizePresent = $injector.has('$sanitize');

        function escapeRegexp(queryToEscape) {
            // Regex: capture the whole query string and replace it with the string that will be used to match
            // the results, for example if the capture is "a" the result will be \a
            return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
        }

        function containsHtml(matchItem) {
            return /<.*>/g.test(matchItem);
        }

        return function (matchItem, query) {
            if (!isSanitizePresent && containsHtml(matchItem)) {
                $log.warn('Unsafe use of typeahead please use ngSanitize'); // Warn the user about the danger
            }
            matchItem = query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem; // Replaces the capture string with a the same string inside of a "strong" tag
            if (!isSanitizePresent) {
                matchItem = $sce.trustAsHtml(matchItem); // If $sanitize is not present we pack the string in a $sce object for the ng-bind-html directive
            }
            return matchItem;
        };
    });