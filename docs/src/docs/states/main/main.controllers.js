angular
  .module("ba.docs")
  .controller("MainCtrl", function ($scope, $state, MainPaths) {
  // debugger
    $scope.MainPaths = MainPaths;
    $scope.$state = $state;
    console.log("hello.. MainCtrl");
  })
  .controller("MainHomeCtrl", function ($scope,$state) {
    console.log("hello.. MainHomeCtrl");
    //$state.transitionTo('main.app.messages.list');
    $scope.guideshelp = [ 
      {
        helpid: 1,
        helpname: 'andriod'
      },
      {
        helpid: 2,
        helpname: 'ios'
      },
      {
        helpid: 3,
        helpname: 'Window'
      },
      {
        helpid: 4,
        helpname: 'platform'
      }
  ];
  })
  
  .controller("MainMessageCtrl", function ($scope,$state,MainPaths,MainStates) {
    console.log("hello.. MainMessageCtrl");
    $scope.$state = $state;
    $scope.MainStates = MainStates;
    $scope.MainPaths = MainPaths;
   
  $scope.messagelist = [{
    messageId: 1,
    messageTitle: "Message 1"
    }, 
    {
      messageId: 2,
      messageTitle: "Message 2"
    }, 
    {
      messageId: 3,
      messageTitle: "Message 3"
    }
  ];
  $scope.goDoc = function(event) {
   // debugger;
    var state = $scope.MainStates;
    var params = params || {};
  
    params.message =event.messageTitle;
   
    $state.go(state.details, params);

  };
  })
  .controller("MainMessageDetailsCtrl", function ($scope,$stateParams) {
    //debugger;
    console.log("hello.. MainMessageDetailsCtrl");
    $scope.detailsmessage=$stateParams.message;
   console.log($scope.detailsmessage);
  
  });