angular
  .module("ba.shared.directives.popdown", ["ba.shared.util.position"])
  .service("PopDown", function(
    $compile,
    $templateCache,
    $q,
    $document,
    $position,
    $log,
    SharedPaths,
    EscapeStack
  ) {
    var PopDown = function(data) {
      data = data || {};
      this.scope = data.scope;
      this.hostEl = data.element;
      this.template = data.template || $templateCache.get(data.templateUrl);
      this.body = $document.find("body");
      this.containerEl = data.containerEl || this.body;
      this.maskEl = angular.element(
        $templateCache.get(SharedPaths.popDown.mask)
      );
      this.offset = data.offset || 2;
      this.openOn = data.openOn || "click";
      this.closeOn = data.closeOn;
      this.activeClass = "pop-down-open";

      this.zIndex = data.zIndex || 30000; // settings view is 10k
      this.priority = angular.extend(
        {
          x: "left",
          y: "bottom"
        },
        data.priority
      );

      if (angular.isFunction(data.getPosition)) {
        this.getPosition = data.getPosition.bind(this);
      }

      this.handleClose = this._handleClose.bind(this);
      this.handleOpen = this._handleOpen.bind(this);
      this.className = data.className || null;

      this.beforeOpen = data.beforeOpen || angular.noop;
      this.beforeClose = data.beforeClose || angular.noop;

      this.afterOpen = data.afterOpen || angular.noop;
      this.afterClose = data.afterClose || angular.noop;

      this.escClose = this.close.bind(this);

      this.locks = {};

      this.init();
    };

    PopDown.prototype = {
      init: function() {
        if (this.hostEl) {
          this.hostEl.on(this.openOn, this.handleOpen);
        }
      },
      destroy: function() {
        this.close();
        if (this.hostEl) {
          this.hostEl.off(this.openOn, this.handleOpen);
        }
      },
      lock: function(lock) {
        if (this.locks[lock]) {
          this.locks[lock]++;
        } else {
          this.locks[lock] = ++this.locks[lock] || 1;
        }
      },
      unlock: function(lock, amount) {
        if (lock) {
          if (amount && this.locks[lock]) {
            return --this.locks[lock]
              ? this.locks[lock]
              : delete this.locks[lock];
          } else if (this.locks[lock]) {
            return delete this.locks[lock];
          }
        } else {
          return (this.locks = {});
        }
      },
      setIndex: function(index) {
        if (this.maskEl) {
          this.maskEl.css({ zIndex: this.zIndex + index });
        }
      },
      getPosition: function() {
        if (this.hostEl) {
          var hostBox = $position.box(this.hostEl),
            popoverBox = $position.box(this.popoverEl),
            containerBox = $position.box(this.containerEl),
            hostCenter = hostBox.left + hostBox.width / 2,
            popoverHalf = popoverBox.width / 2,
            yPosition = {
              top: hostBox.top - popoverBox.height - this.offset,
              bottom: hostBox.bottom + this.offset
            },
            xPosition = {
              center: hostCenter - popoverHalf,
              right: hostBox.right - popoverBox.width,
              left: hostBox.left
            },
            fits = {
              top: yPosition.top > containerBox.top,
              bottom:
                yPosition.bottom + popoverBox.height < containerBox.bottom,
              center:
                xPosition.center > containerBox.left &&
                xPosition.center + popoverBox.width < containerBox.right,
              right: xPosition.right > containerBox.left,
              left: xPosition.left + popoverBox.width < containerBox.right
            },
            position = {};

          if (fits[this.priority.x]) {
            position.x = xPosition[this.priority.x];
          } else {
            if (fits.left) {
              position.x = xPosition.left;
            } else if (fits.center) {
              position.x = xPosition.center;
            } else if (fits.right) {
              position.x = xPosition.right;
            }
          }

          if (fits[this.priority.y]) {
            position.y = yPosition[this.priority.y];
          } else {
            if (fits.bottom) {
              position.y = yPosition.bottom;
            } else if (fits.top) {
              position.y = yPosition.top;
            } else {
              var overflow = {
                bottom:
                  yPosition.bottom + popoverBox.height - containerBox.bottom,
                top: containerBox.top - yPosition.top
              };

              if (overflow.bottom <= overflow.top) {
                position.y = hostBox.bottom;
                this.popoverEl.css({
                  "max-height":
                    Math.abs(position.y - containerBox.bottom) + "px"
                });
              } else {
                position.y = 0;
                this.popoverEl.css({
                  "max-height": Math.abs(position.y - hostBox.top) + "px"
                });
              }
            }
          }

          return position;
        } else {
          $log.error("[PopDown] getPosition requires hostEl");
        }
      },
      _create: function() {
        var defer = $q.defer(),
          self = this;

        this.$scope = this.scope.$new();
        this.popoverEl = angular.element(
          $templateCache.get(SharedPaths.popDown.popover)
        );
        this.popoverEl.append(angular.element(this.template));

        if (this.className) {
          this.popoverEl.addClass(this.className);
        }
        this.maskEl.append(this.popoverEl);
        this.maskEl.on("click", this.handleClose);
        this.popoverEl.on("click", this._killEvent);
        if (this.closeOn) {
          this.popoverEl.on(this.closeOn, this.handleClose);
        }
        this.body.append(this.maskEl);
        $compile(this.popoverEl)(this.$scope);
        this.$scope.$apply();
        this.$scope.$$postDigest(function() {
          defer.resolve();
        });

        return defer.promise;
      },
      _enter: function() {
        var defer = $q.defer(),
          position = this.getPosition();

        TweenMax.fromTo(
          this.popoverEl,
          0.2,
          {
            x: position.x || -20,
            y: position.y - 12,
            opacity: 0
          },
          {
            x: position.x || 20,
            y: position.y,
            opacity: 1,
            onComplete: function() {
              defer.resolve();
            }
          }
        );

        return defer.promise;
      },
      _remove: function() {
        var defer = $q.defer(),
          self = this;

        TweenMax.to(this.popoverEl, 0.2, {
          opacity: 0,
          onComplete: function() {
            self.popoverEl.remove();
            self.maskEl.remove();
            if (self.$scope) {
              self.$scope.$destroy();
            }
            defer.resolve();
          }
        });

        return defer.promise;
      },
      updatePosition: function(position) {
        var pos = position || this.getPosition(),
          defer = $q.defer();

        TweenMax.to(this.popoverEl, 0.2, {
          x: pos.x,
          y: pos.y,
          onComplete: function() {
            defer.resolve();
          }
        });

        return defer.promise;
      },
      open: function() {
        var self = this;

        if (!this.isOpen) {
          self.beforeOpen();

          return this._create().then(function() {
            var containerEl = self.hostEl.closest("[pop-down-anchor]");
            self.afterOpen();
            self.isOpen = true;

            if (containerEl && containerEl.length) {
              containerEl.addClass(self.activeClass);
            } else {
              self.hostEl.addClass(self.activeClass);
            }

            self.setIndex(EscapeStack.add(self.escClose));
            self._enter();
          });
        }
      },
      close: function() {
        var self = this;
        if (this.isOpen) {
          self.beforeClose();
          this._remove().then(function() {
            var containerEl = self.hostEl.closest("[pop-down-anchor]");
            self.afterClose();
            self.isOpen = false;

            if (containerEl && containerEl.length) {
              containerEl.removeClass(self.activeClass);
            } else {
              self.hostEl.removeClass(self.activeClass);
            }
            EscapeStack.remove(self.escClose);
          });
        }
      },
      _handleOpen: function(e) {
        if (_.isEmpty(this.locks)) {
          e.preventDefault();
          e.stopPropagation();

          this.open();
          this.scope.$apply();
        }
      },
      _handleClose: function() {
        if (!this.isDragging()) {
          this.close();
        }
      },
      _killEvent: function(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      },
      isDragging: function(bool) {
        if (angular.isUndefined(bool)) {
          return this._isDragging;
        } else {
          this._isDragging = !!bool;
        }
      }
    };

    return PopDown;
  })
  .directive("popDown", function(PopDown, $interpolate, $parse) {
    return {
      scope: true,
      controller: function($scope, $element) {
        var self = this;
        this.init = function(
          templateUrl,
          xPriority,
          yPriority,
          isMultiSelect,
          beforeOpen,
          afterOpen,
          beforeClose,
          afterClose,
          zIndex
        ) {
          this.popDown = new PopDown({
            scope: $scope,
            element: $element,
            templateUrl: templateUrl,
            priority: {
              x: xPriority,
              y: yPriority
            },
            closeOn: isMultiSelect ? null : "click",
            zIndex: zIndex,
            beforeOpen: function() {
              return beforeOpen($scope, { $element: $element });
            },
            afterOpen: function() {
              return afterOpen($scope, { $element: $element });
            },
            beforeClose: function() {
              return beforeClose($scope, { $element: $element });
            },
            afterClose: function() {
              return afterClose($scope, { $element: $element });
            }
          });

          $scope.$on("$destroy", this.destroy);
        };

        this.destroy = function() {
          self.popDown.destroy();
        };
      },
      link: function(scope, element, attrs, ctrl) {
        ctrl.init(
          $interpolate(attrs.popDown || "")(scope),
          attrs.popDownXPriority,
          attrs.popDownYPriority,
          $interpolate(attrs.popDownMultiSelect || "")(scope),
          $parse(attrs.popDownBeforeOpen),
          $parse(attrs.popDownAfterOpen),
          $parse(attrs.popDownBeforeClose),
          $parse(attrs.popDownAfterClose),
          attrs.popDownZIndex
        );
      }
    };
  });
