angular
  .module("ba.shared.directives.transition-mask", [])
  .directive("transitionMask", function ($timeout, $animate, $state) {
    return {
      link: function (scope, element, attrs) {
        var options = scope.$eval(attrs.transitionMask);
        options = options || {};
        var maskEl = angular.element(
          '<div class="transition-mask a-fade"></div>'
        );
        maskEl.attr("ba-c-fill", options.background || "pure-white");

        element.prepend(maskEl);

        function show() {
          $animate.removeClass(maskEl, "ng-hide", {
            tempClasses: "ng-hide-animate"
          });
        }

        function hide() {
          $timeout(function () {
            $animate.addClass(maskEl, "ng-hide", {
              tempClasses: "ng-hide-animate"
            });
          }, options.delay);
        }

        if (!element.hasClass("contain")) {
          element.addClass("contain");
        }

        if (options.hasOwnProperty("showIf")) {
          scope.$watch(
            function () {
              var options = scope.$eval(attrs.transitionMask);
              return options.showIf;
            },
            function (newVal) {
              if (newVal) {
                show();
              } else {
                hide();
              }
            }
          );
        }

        // TODO: make this fade on condition
        if (options.showOn) {
          scope.$on(options.showOn, show);
        }

        if (options.hideOn) {
          scope.$on(options.hideOn, hide);
        }

        hide();
      }
    };
  });