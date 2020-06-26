angular
  .module("ba.shared.directives.actionsMenu", ["ba.shared.directives.dropdown"])
  .directive("contextmenuActions", function(
    $compile,
    DropdownInstances,
    $document,
    $templateCache,
    $position,
    SharedPaths
  ) {
    var ddTpl = $templateCache.get(SharedPaths.actionsMenu),
      maskTpl = $templateCache.get(SharedPaths.actionsMask);

    return {
      scope: {
        actionsList: "=",
        actionsItem: "="
      },
      controller: function($scope) {
        this.open = function() {
          $scope.open();
        };

        this.close = function() {
          $scope.destroy();
        };
      },
      link: function(scope, element, attrs, ctrl) {
        var $scope,
          ddEl,
          hostEl = element,
          maskEl,
          container = $document.find("body");

        function destroy(e) {
          DropdownInstances.removeDropdown(ctrl);
          if ($scope) {
            $scope.$destroy();
          }
          if (maskEl) {
            maskEl.off("click", destroy);
            maskEl.off("contextmenu", destroy);
            maskEl.remove();
          }

          element.removeClass("ba-actionmenu-open");
          $document.off("keypress", handleEsc);

          return false;
        }

        function handleEsc(e) {
          if (e.which == 27) {
            destroy();
          }
        }

        function open(e) {
          e.preventDefault();
          e.stopPropagation();
          DropdownInstances.closeDropdowns();

          // only open if actions
          if (scope.actionsList && scope.actionsList.length) {
            $scope = scope.$new();
            maskEl = angular.element(maskTpl);

            ddEl = $compile(ddTpl)($scope);
            $scope.$apply();
            container.after(maskEl);
            maskEl.append(ddEl);
            ddEl.css(getContextPosition(e, ddEl));
            DropdownInstances.addDropdown(ctrl);
            maskEl.on("click", destroy);
            maskEl.on("contextmenu", destroy);
            $document.on("keydown", handleEsc);
            hostEl.addClass("ba-actionmenu-open");
          }

          return false;
        }

        function getContextPosition(event, ddEl) {
          var ddBox = $position.box(ddEl),
            position = {};

          if (event.pageY + ddBox.height > container.height()) {
            position.top = event.pageY - ddBox.height;
          } else {
            position.top = event.pageY;
          }

          if (event.pageX + ddBox.width > container.width()) {
            position.left = event.pageX - ddBox.width;
          } else {
            position.left = event.pageX;
          }

          return position;
        }

        scope.action = function(dropdownItem, actionsItem, e) {
          e.stopPropagation();
          dropdownItem.action(actionsItem, e);
          destroy();
        };

        scope.destroy = destroy;
        scope.open = open;
        scope.close = destroy;

        hostEl.on("contextmenu", open);

        scope.$on("$destroy", function() {
          destroy();
          hostEl.off("contextmenu", open);
        });
      }
    };
  })
  .directive("dropdownActionsContainer", function() {
    return {
      controller: function($scope, $element) {
        this.setActive = function() {
          $element.addClass("ba-actionmenu-open");
        };

        this.setInactive = function() {
          $element.removeClass("ba-actionmenu-open");
        };
      }
    };
  })
  .directive("dropdownActions", function(
    $compile,
    DropdownInstances,
    $document,
    $templateCache,
    $position,
    SharedPaths
  ) {
    var ddTpl = $templateCache.get(SharedPaths.actionsMenu.actionsMenu),
      maskTpl = $templateCache.get(SharedPaths.actionsMenu.actionsMask);
    return {
      require: ["dropdownActions", "?^dropdownActionsContainer"],
      scope: {
        actionsList: "=",
        actionsItem: "="
      },
      controller: function($scope) {
        this.open = function() {
          $scope.open();
        };

        this.close = function() {
          $scope.destroy();
        };
      },
      link: function(scope, element, attrs, ctrls) {
        var $scope,
          ddEl,
          maskEl,
          buttonEl = element,
          container = $document.find("body");
        var ctrl = ctrls[0],
          containerCtrl = ctrls[1];

        function destroy(e) {
          DropdownInstances.removeDropdown(ctrl);
          if ($scope) {
            $scope.$destroy();
          }
          if (maskEl) {
            maskEl.remove();
            maskEl.off("click", destroy);
          }

          if (containerCtrl) {
            containerCtrl.setInactive();
          }

          $document.off("keypress", handleEsc);
        }

        function handleEsc(e) {
          if (e.which == 27) {
            destroy();
          }
        }

        function open(e) {
          e.stopPropagation();
          DropdownInstances.closeDropdowns();
          $scope = scope.$new();
          maskEl = angular.element(maskTpl);

          ddEl = $compile(ddTpl)($scope);
          $scope.$apply();
          container.after(maskEl);
          maskEl.append(ddEl);
          ddEl.css(getDropdownPosition(buttonEl, ddEl));
          DropdownInstances.addDropdown(ctrl);
          $document.on("keydown", handleEsc);
          maskEl.on("click", destroy);

          if (containerCtrl) {
            containerCtrl.setActive();
          }
        }

        function getDropdownPosition(el, ddEl) {
          var hostBox = $position.box(el),
            ddBox = $position.box(ddEl),
            position = {};

          if (hostBox.bottom + ddBox.height > container.height()) {
            position.top = hostBox.top - ddBox.height;
          } else {
            position.top = hostBox.bottom;
          }

          if (hostBox.right + ddBox.width > container.width()) {
            position.left = hostBox.right - ddBox.width;
          } else {
            position.left = hostBox.left;
          }

          return position;
        }

        scope.destroy = destroy;
        scope.open = open;

        buttonEl.on("click", open);

        scope.action = function(dropdownItem, actionsItem, e) {
          e.stopPropagation();
          dropdownItem.action(actionsItem, e);
          destroy();
        };

        scope.$on("$destroy", function() {
          destroy();
          buttonEl.off("click", open);
        });
      }
    };
  });
