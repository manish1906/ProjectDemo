angular
  .module("ba.docs")
  .controller("MessageCtrl", function (
    
    $scope,
   
    CoreDocumentUtil,
    MessagePaths,
    MessageStates
  ) {
    CoreDocumentUtil.setTitle("Message"); // sanity
    console.log('Messagecontroller');
  //  debugger;
    
 
 
   
  })
  .controller("MessagesListCtrl",function($scope,$state,$stateParams,MessagesStates,MessageService,MessagesPaths){
   // debugger
    console.log("list");
    $scope.$state = $state;
    $scope.MessagesStates = MessagesStates;
    $scope.MessagesPaths = MessagesPaths;
  //    $scope.messagelist=[];
    // $scope.messagelist = [{
    //   messageId: 1,
    //   messageTitle: "Message 1"
    //   }, 
    //   {
    //     messageId: 2,
    //     messageTitle: "Message 2"
    //   }, 
    //   {
    //     messageId: 3,
    //     messageTitle: "Message 3"
    //   }
    // ];
  
    // $scope.goDoc = function(event) {
       
    //    var state = $scope.MessagesStates;
    //    var params = params || {};
     
    //    params.message =event.messageId;
      
    //    $state.go(state.details, params);
    //    debugger;
    //  };
    
   // debugger
//    var messagelist=[];
   

$scope.messageTitle="";
$scope.messageDescription=""; 
$scope.addMessage=function ()
 {
 
console.log("cn");
  MessageService.addMessages($scope.messageTitle,$scope.messageDescription)
 // debugger;
  console.log("complete");
 }    
 $scope.messagelist=MessageService.get();
 $scope.Delete=function (i)
 {
   $scope.messagelist.splice(i,1);
 }
  })
  .controller("MessagesDetailsCtrl", function ($scope,$stateParams,MessageService) {
    //debugger;
    $scope.messagelist=MessageService.get();
    console.log("hello.. MessagesDetailsCtrl");
    $scope.detailsmessage=$stateParams.message;
   console.log($scope.detailsmessage);
  
  });
  
 
