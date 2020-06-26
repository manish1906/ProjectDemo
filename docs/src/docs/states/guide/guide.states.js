angular
  .module("ba.docs")
  .provider("GuideStates", function(MainStatesProvider) {
    var rootState = MainStatesProvider.get().app;
    rootState += ".guide";
    //debugger
    var states = {
      guideroot: rootState,
      // list: rootState + ".list", bcz this
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
