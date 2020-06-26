angular.module('ba.shared.directives.growler', [])
    .animation('.jsa-growl', function () {
        function enter(element, done) {
            var isDanger = element.hasClass('ba-growl--danger');
            var easing = isDanger ? Elastic.easeOut : Power4.easeOut;
            var easingAnimation = isDanger ? .54 : 0.5;
            
            TweenMax.fromTo(element, easingAnimation, {
                opacity: 0,
                y: '-5%'
            }, {
                opacity: 1,
                y: '10%',
                ease: easing,
                onComplete: done
            });
        }

        function leave(element, done) {
            TweenMax.to(element, .25, {
                x: '110%',
                ease: Power3.easeInOut,
                onComplete: function () {
                    collapse(element, done);
                }
            });
        }

        function collapse(element, done) {
            TweenMax.to(element, .2, {
                height: 0,
                margin: 0,
                ease: Power3.easeInOut,
                onComplete: done
            });
        }

        return {
            enter: function (element, done) {
                enter(element, done);
            },
            leave: function (element, done) {
                leave(element, done);
            }
        }
    })
    .provider('Growler', function () {
        var options = {
            pin: 'topright'
        };

        return {
            pin: function (location) {
                options.pin = location;
            },
            $get: function ($timeout, $document, $compile, $rootScope, $templateCache, SharedPaths) {
                var growlerTpl = $templateCache.get(SharedPaths.growler),
                    growlerEl = angular.element(growlerTpl);

                function Growler() {
                    var self = this;

                    this.scope = $rootScope.$new();
                    this.undoMsg = '\nClick to undo.';
                    this.undoneMsg = 'Action undone';

                    $document.find('body').append($compile(growlerEl)(this.scope));
                    growlerEl.addClass(options.pin);

                    this.scope.growls = [];
                    this.scope.remove = function (growl, e) {
                        e.stopPropagation();
                        self.remove(growl);
                    }
                }

                Growler.prototype.add = function (growl) {
                    var newGrowl = new Growl(growl, this);
                    this.scope.growls.push(newGrowl);
                    return newGrowl;
                };

                Growler.prototype.addIfEmpty = function (growl) {
                    if (this.scope.growls && this.scope.growls.length < 1) {
                        this.add(growl);
                    }
                };

                Growler.prototype.remove = function (growl) {
                    var index = this.scope.growls.indexOf(growl);

                    if (~index) {
                        this.scope.growls.splice(index, 1);
                    }

                    return index;
                };

                Growler.prototype.clear = function () {
                    this.scope.growls = [];
                };

                function Growl(data, growler) {
                    var self = this;
                    this.text = data.text || '';
                    this.type = data.type || 'info';
                    this.duration = parseInt(data.duration) || null;
                    this.icon = data.icon || '';
                    this.action = function () {
                        if (angular.isFunction(data.action)) {
                            data.action();
                            growler.remove(self);
                        }
                    };

                    if (this.duration) {
                        $timeout(function () {
                            growler.remove(self);
                        }, this.duration);
                    }
                }

                return new Growler();
            }
        }
    });