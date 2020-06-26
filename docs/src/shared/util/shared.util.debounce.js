angular.module('ba.shared.util.debounce', [])
    /**
     * A helper, internal service that debounces a function
     */
    .factory('$$debounce', function ($timeout) {
        return function (callback, debounceTime) {
            var timeoutPromise;

            return function () {
                var self = this;
                var args = Array.prototype.slice.call(arguments);
                if (timeoutPromise) {
                    $timeout.cancel(timeoutPromise);
                }

                timeoutPromise = $timeout(function () {
                    callback.apply(self, args);
                }, debounceTime);
            };
        };
    });