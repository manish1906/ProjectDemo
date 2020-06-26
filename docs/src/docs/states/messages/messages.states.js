angular
  .module("ba.docs")
  .provider("MessagesStates", function(MainStatesProvider) {
    var rootState = MainStatesProvider.get().app;
    rootState += ".messages";

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
