angular.module("ba.docs").provider("UsersStates", function(MainStatesProvider) {
  var rootState = MainStatesProvider.get().root;
  rootState += ".users";
//debugger
  var states = {
    root: rootState,
    list: rootState + ".list",
    details: rootState + ".details"
  };

  return {
    get: function() {
      return states;
    },
    $get: function() {
      return states;
    }
  };
});
