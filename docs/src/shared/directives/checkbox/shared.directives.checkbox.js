angular.module('ba.shared.directives.checkbox', [])
    .directive('baCheckbox', function ($parse) {
        return {
            restrict: 'C',
            scope: {
                'baCheckboxOnChange': '&'
            },
            require: '?ngModel',
            link: function (scope, ele, attrs, ngModel) {
                var labelEl = ele.siblings('label');
                function onClick(e) {
                    if (e) {
                        e.stopPropagation();
                    }
                    ngModel.$setViewValue(!ngModel.$modelValue);
                    ngModel.$render();
                    scope.baCheckboxOnChange({
                        $newValue: ngModel.$modelValue,
                        $oldValue: !ngModel.$modelValue
                    });
                    scope.$apply();
                }

                if (ngModel) {
                    ele.on('click', onClick);
                    if (labelEl) {
                        labelEl.on('click', onClick);
                    }

                    scope.$watch(function () {
                        return ngModel.$modelValue;
                    }, function (newVal) {
                        if (newVal) {
                            ele.addClass('ba-checkbox--checked');
                        } else {
                            ele.removeClass('ba-checkbox--checked');
                        }
                    });
                }
            }
        }
    });
