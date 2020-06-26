angular
  .module("ba.shared.directives.switch", [])
  .directive("baSwitch", function($parse) {
    return {
      require: ["baSwitch", "ngModel"],
      controller: function($scope, $element) {
        var self = this;

        this.$scope = $scope;
        this.$element = $element;

        this.init = function(model, ngModel, onChange) {
          this.ngModel = ngModel;
          this.onChange = onChange || angular.noop;

          this.$element.on("click", this.handleClick);

          this.ngModel.$render = function() {
            self.toggleClass("ba-switch--active", self.ngModel.$modelValue);
          };

          this.setModel(model);
        };

        this.handleClick = function(e) {
          self.setModel(!self.ngModel.$modelValue);

          self.onChange($scope, {
            $newValue: self.ngModel.$modelValue,
            $oldValue: !self.ngModel.$modelValue
          });
        };

        this.toggleClass = function(className, bool) {
          this.$element[bool ? "addClass" : "removeClass"](className);
        };

        this.setModel = function(model) {
          this.ngModel.$setViewValue(model);
          this.ngModel.$render();
        };
      },
      link: function(scope, element, attrs, ctrls) {
        var ctrl = ctrls[0],
          ngModel = ctrls[1];

        scope.$watch(
          function() {
            return scope.$eval(attrs.baSwitchPrimaryIf);
          },
          function(newVal) {
            ctrl.toggleClass("ba-switch--primary", newVal);
          }
        );

        scope.$watch(
          function() {
            return scope.$eval(attrs.baSwitchSuccessIf);
          },
          function(newVal) {
            ctrl.toggleClass("ba-switch--success", newVal);
          }
        );

        scope.$watch(
          function() {
            return scope.$eval(attrs.baSwitchWarningIf);
          },
          function(newVal) {
            ctrl.toggleClass("ba-switch--warning", newVal);
          }
        );

        scope.$watch(
          function() {
            return scope.$eval(attrs.baSwitchDangerIf);
          },
          function(newVal) {
            ctrl.toggleClass("ba-switch--danger", newVal);
          }
        );

        ctrl.init(
          scope.$eval(attrs.ngModel),
          ngModel,
          $parse(attrs.baSwitchOnChange)
        );
      }
    };
  });
