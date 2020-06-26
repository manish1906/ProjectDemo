angular
  .module("ba.shared.directives.svg", [])
  .directive("baSvg", function (SharedPaths, $templateCache) {
    return {
      link: function (scope, element, attrs) {
        var icon;

        attrs.$observe("baSvg", function (newVal) {
          if (icon) {
            icon.remove();
          }

          icon = angular.element($templateCache.get(SharedPaths.svg[newVal]));
          element.prepend(icon);
        });
      }
    };
  });