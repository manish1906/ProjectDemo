angular.module("ba.shared.util.bus", []).factory("baBus", function() {
  function BusFactory() {
    this.subscriptions = {};
  }

  var proto = {
    init: function() {
      this.isDestroyed = false;
      this.subscriptions = {};
    },
    destroy: function() {
      this.isDestroyed = true;
      this.subscriptions = {};
    },
    subscribe: function(eventName, callback, priority) {
      callback.priority = priority || 0;
      this.subscriptions[eventName] = this.subscriptions[eventName] || [];
      this.subscriptions[eventName].splice(
        _.sortedIndexBy(this.subscriptions[eventName], callback, function(cb) {
          return -cb.priority;
        }),
        0,
        callback
      );
      return callback;
    },
    trigger: function(eventName) {
      var subscribers = this.subscriptions[eventName];

      if (subscribers && subscribers.length) {
        for (var i = 0; i < subscribers.length; i++) {
          var subscriber = subscribers[i];
          subscriber.apply(null, Array.prototype.slice.call(arguments, 1));
        }
      }
    },
    unsubscribe: function(eventName, callback) {
      var subscribers = this.subscriptions[eventName];

      if (subscribers && subscribers.length) {
        var index = subscribers.indexOf(callback);

        if (~index) {
          subscribers.splice(index, 1);
          return true;
        }
      }

      return false;
    }
  };

  BusFactory.prototype = proto;
  return BusFactory;
});
