angular
  .module("ba.shared.directives.dropdown", [])
  .service("DropdownInstances", function() {
    this.dropdowns = [];

    this.isEmpty = function() {
      return this.dropdowns.length === 0;
    };

    this.addDropdown = function(ddCtrl) {
      this.dropdowns = this.dropdowns || [];
      this.dropdowns.push(ddCtrl);
    };

    this.removeDropdown = function(ddCtrl) {
      var index = this.dropdowns.indexOf(ddCtrl);

      if (~index) {
        this.dropdowns.splice(index, 1);
      }
    };

    this.closeDropdowns = function() {
      angular.forEach(this.dropdowns, function(dd) {
        dd.close();
      });
    };
  })
  .directive("baDropdown", function($document, $rootScope, DropdownInstances) {
    return {
      restrict: "A",
      scope: true,
      link: function(scope, element, attrs, ctrl) {
        scope.opts = scope.$eval(attrs.baDropdown) || {};

        var handleEsc = function(e) {
          if (e.which == 27) {
            scope.closeMenu();
          }
        };

        scope.openMenu = function() {
          if (scope.opts.exclusive) {
            //only allow 1 dropdown
            $rootScope.$broadcast("ba.$destroy.dropdowns");
          }

          DropdownInstances.closeDropdowns();

          scope.isOpen = true;
          element.addClass("open");
          $document.on("click", scope.closeMenu);
          $document.on("keydown", handleEsc);
          DropdownInstances.addDropdown(ctrl);

          if (scope.opts.multiSelect && scope.ddMenuEl) {
            scope.ddMenuEl.on("click", function(e) {
              e.stopPropagation();
              e.preventDefault();
            });
          }

          if (
            scope.opts &&
            scope.opts.onOpen &&
            angular.isFunction(scope.opts.onOpen)
          ) {
            scope.opts.onOpen();
          }

          scope.$emit("ba.dropdowns.opened");
        };

        scope.closeMenu = function() {
          scope.isOpen = false;
          DropdownInstances.removeDropdown(ctrl);
          element.removeClass("open");
          $document.off("click", scope.closeMenu);
          $document.off("keydown", handleEsc);
          scope.$emit("ba.dropdowns.closed");
        };
      },
      controller: function($scope, $document) {
        $scope.isOpen = false;
        $scope.ddMenuEl = null;

        this.open = function() {
          $scope.openMenu();
        };

        this.close = function() {
          $scope.closeMenu();
        };

        this.addMenu = function(el) {
          $scope.ddMenuEl = el;
        };

        this.toggleMenu = function() {
          if ($scope.isOpen) {
            $scope.closeMenu();
          } else {
            $scope.openMenu();
          }
        };

        $scope.$on("ba.$destroy.dropdowns", function() {
          $scope.closeMenu();
        });
      }
    };
  })
  .directive("baDropdownToggle", function() {
    return {
      restrict: "A",
      require: "^baDropdown",
      link: function(scope, element, attrs, baDropdown) {
        element.on("click", function(e) {
          e.stopPropagation();
          baDropdown.toggleMenu();
        });
      }
    };
  })
  .directive("baDropdownMenu", function() {
    return {
      restrict: "A",
      require: "^baDropdown",
      link: function(scope, element, attrs, baDropdown) {
        baDropdown.addMenu(element);

        element.on("click", function() {
          if (!scope.opts.multiSelect) {
            scope.closeMenu();
          }
        });
      }
    };
  });
