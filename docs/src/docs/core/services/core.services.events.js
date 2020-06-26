angular.module("ba.docs.core").provider("CoreEvents", function() {
  var coreEvents = {
    appReset: "core.app.reset"
  };

  return {
    get: function() {
      return coreEvents;
    },
    $get: function() {
      return coreEvents;
    }
  };
});
