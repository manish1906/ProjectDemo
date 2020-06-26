angular
  .module("ba.docs")
  .config(function($stateProvider, UsersPathsProvider, UsersStatesProvider) {
    var paths = UsersPathsProvider.get();
    var states = UsersStatesProvider.get();
    
    $stateProvider
      .state(states.root, {
        url: "users/",
        // template:`paths.views.root`,
        template:'<b>hello123</b>',
        controller: "UsersCtrl",
       // abstract: true
      })
      .state(states.list, {
       // url: "?audience&search&page",
       url:"userlist",
        templateUrl: paths.views.list,
        controller: "UsersListCtrl",

      })

      .state(states.details, {
        url: ":userId",
        templateUrl: paths.views.details,
        controller: "UsersDetailsCtrl",
       
      });
  });
