angular
  .module("ba.shared.util.escape-stack", [])
  .service("EscapeStack", function($document) {
    var self = this;

    this.stack = [];

    this._handleEsc = function(event) {
      if (event && event.keyCode == 27) {
        var fn;
        if ((fn = self.stack[self.stack.length - 1])) {
          event.preventDefault();
          event.stopPropagation();
          fn.call();
        }

        return false;
      }
    };

    this.init = function() {
      $document.on("keydown", this._handleEsc);
    };

    this.destroy = function() {
      $document.off("keydown", this._handleEsc);
    };

    this.add = function(fn) {
      return this.stack.push(fn);
    };

    this.remove = function(fn) {
      var index = this.stack.indexOf(fn);

      if (~index) {
        this.stack.splice(index, 1);
      }

      return index;
    };

    this.addToScope = function(fn, scope) {
      scope.$on("$destroy", function() {
        self.remove(fn);
      });

      self.add(fn);
    };

    this.init();
  });
