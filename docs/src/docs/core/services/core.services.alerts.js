angular.module("ba.docs.core")
    .service("CoreAlerts", function ($timeout, Growler) {
        var CLEAR_TIMEOUT = 250;
        var GROWLER_DURATION = 5000;
        var ICON_SUCCESS = "check-circle-1";
        var ICON_ERROR = "alert-triangle";

        this.addSuccess = function (txt) {
            txt = txt || "Success";
            Growler.clear();
            // display alert
            $timeout(function () {
                Growler.add({
                    type: 'success',
                    text: txt,
                    icon: ICON_SUCCESS,
                    duration: GROWLER_DURATION,
                    action: function () {
                        Growler.clear();
                    }
                });
            }, CLEAR_TIMEOUT);
        }

        this.addSuccessWithAction = function (txt, action) {
            txt = txt || "Success";
            // display alert
            $timeout(function () {
                Growler.add({
                    type: 'success',
                    text: txt,
                    icon: ICON_SUCCESS,
                    duration: GROWLER_DURATION,
                    action: function (model) {
                        if (action) {
                            action();
                        } else {
                            Growler.clear();
                        }
                    }
                });
            }, CLEAR_TIMEOUT);

        }

        this.addError = function (txt) {
            txt = txt || "Something went wrong. Try again."
            Growler.clear();
            $timeout(function () {
                Growler.add({
                    type: 'danger',
                    text: txt,
                    icon: ICON_ERROR,
                    duration: GROWLER_DURATION,
                    action: function () {
                        Growler.clear();
                    }
                })
            }, CLEAR_TIMEOUT);
        }

        this.add = function (type, txt, icon) {
            if (type && txt && icon) {
                Growler.clear();
                // display alert
                $timeout(function () {
                    Growler.add({
                        type: type,
                        text: txt,
                        icon: icon,
                        duration: GROWLER_DURATION,
                        action: function () {
                            Growler.clear();
                        }
                    });
                }, CLEAR_TIMEOUT);
            }
        }
    })