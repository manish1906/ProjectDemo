/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */

angular
  .module("ba.shared.util.position", [])
  .factory("$position", function($document, $window) {
    function getStyle(el, cssprop) {
      if (el.currentStyle) {
        //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, "position") || "static") === "static";
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function(element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (
        offsetParent &&
        offsetParent !== docDomEl &&
        isStaticPositioned(offsetParent)
      ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      isVisible: function(element) {
        return (
          element &&
          !!(
            element.offsetWidth ||
            element.offsetHeight ||
            element.getClientRects().length
          )
        );
      },
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function(element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top +=
            offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left +=
            offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop("offsetWidth"),
          height: boundingClientRect.height || element.prop("offsetHeight"),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function(element, container) {
        if (
          element[0] &&
          angular.isFunction(element[0].getBoundingClientRect)
        ) {
          var boundingClientRect = element[0].getBoundingClientRect(),
            containerOffset = {
              left: 0,
              top: 0
            };

          if (container) {
            containerOffset = this.offset(container) || { top: 0, left: 0 };
          }

          return {
            width: boundingClientRect.width || element.prop("offsetWidth"),
            height: boundingClientRect.height || element.prop("offsetHeight"),
            top:
              boundingClientRect.top +
              ($window.pageYOffset || $document[0].documentElement.scrollTop) -
              containerOffset.top,
            left:
              boundingClientRect.left +
              ($window.pageXOffset || $document[0].documentElement.scrollLeft) -
              containerOffset.left
          };
        } else {
          return null;
        }
      },
      box: function(element, container) {
        var offset = this.offset(element),
          containerBox = {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
          };

        if (offset) {
          if (container) {
            containerBox = this.box(container);

            return {
              top: offset.top - containerBox.top,
              left: offset.left - containerBox.left,
              bottom: containerBox.bottom - (offset.top + offset.height),
              right: containerBox.right - (offset.left + offset.width),
              height: offset.height,
              width: offset.width
            };
          } else {
            return {
              top: offset.top,
              left: offset.left,
              bottom: offset.top + offset.height,
              right: offset.left + offset.width,
              height: offset.height,
              width: offset.width
            };
          }
        } else {
          return null;
        }
      },
      isMouseWithin: function(event, element) {
        var box = this.box(element);

        return (
          event.pageX >= box.left &&
          event.pageX <= box.right &&
          event.pageY >= box.top &&
          event.pageY <= box.bottom
        );
      },
      distance: function(event, element) {
        var box = this.box(element);

        return {
          top: event.pageY - box.top,
          left: event.pageX - box.left,
          right: event.pageX - box.right,
          bottom: event.pageY - box.bottom
        };
      },
      percentDistance: function(event, element) {
        var box = this.box(element);

        return {
          top: (event.pageY - box.top) / box.height,
          left: (event.pageX - box.left) / box.width,
          right: (event.pageX - box.right) / box.width,
          bottom: (event.pageY - box.bottom) / box.height
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function(hostEl, targetEl, positionStr, appendToBody) {
        var positionStrParts = positionStr.split("-");
        var pos0 = positionStrParts[0],
          pos1 = positionStrParts[1] || "center";

        var hostElPos, targetElWidth, targetElHeight, targetElPos;

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop("offsetWidth");
        targetElHeight = targetEl.prop("offsetHeight");

        var shiftWidth = {
          center: function() {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function() {
            return hostElPos.left;
          },
          right: function() {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function() {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function() {
            return hostElPos.top;
          },
          bottom: function() {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case "right":
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case "left":
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case "bottom":
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;
      }
    };
  });
