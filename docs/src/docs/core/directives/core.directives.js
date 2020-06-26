angular
  .module("ba.docs.core")
  .directive("autoSelect", function($parse, $timeout) {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, element, attrs, ngModel) {
        var initialized = false;
        scope.$watch(ngModel.$modelValue, function(value) {
          if (!initialized) {
            $timeout(function() {
              element[0].select();
              initialized = true;
            });
          }
        });
      }
    };
  })
  .directive("focusIf", function() {
    return {
      link: function(scope, element, attrs) {
        scope.$watch(
          function() {
            return scope.$eval(attrs.focusIf);
          },
          function(newVal, oldVal) {
            if (!!newVal && !oldVal) {
              element.focus();
            }
          }
        );
      }
    };
  })
  .directive("focusIfModel", function($timeout) {
    return {
      link: function(scope, element, attrs) {
        var accessor = attrs.focusIfAccessor;
        var model = scope.$eval(attrs.focusIfModel);

        scope.$watch(function() {
          if (model[accessor]) {
            $timeout(function() {
              element.focus();
            }, 100);
          }
        });
      }
    };
  })
  .directive("matchModel", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(data) {
          data = data || "";

          if (data == scope.$eval(attrs.matchModel)) {
            ngModel.$setValidity("matchModel", true);
            return data;
          } else {
            ngModel.$setValidity("matchModel", false);
            return "";
          }
        });
      }
    };
  });
