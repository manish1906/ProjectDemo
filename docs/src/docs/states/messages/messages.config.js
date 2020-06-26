angular
  .module("ba.docs")
  .config(function(
    $stateProvider,
    MessagesPathsProvider,
    MessagesStatesProvider
  ) {
    var paths = MessagesPathsProvider.get();
    var states = MessagesStatesProvider.get();

    $stateProvider
      .state(states.root, {
      
        url: "message",
      
       templateUrl: paths.views.root,
        controller: "MessagesCtrl",
        
       //template:'<b>hello123</b>',
       abstract: true,
      
      })
      
      .state(states.list, {
        url: "/list",
  templateUrl: paths.views.list,
// template:`<b>hello</b>`,
        controller: "MessagesListCtrl"
       
      })
      .state(states.details, {
        url: "/:message",
        templateUrl: paths.views.details,
       controller: "MessagesDetailsCtrl"
     // template:'<b>details</b>',
        
      });
      
  });
