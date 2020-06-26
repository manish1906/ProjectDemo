angular
  .module("ba.docs")
  .controller("UsersCtrl", function(
    $scope,
    
    UsersPaths,
    
  ) {
   
    $scope.UsersPaths = UsersPaths;

    
console.log("user")
  
  })
  .controller("UsersListCtrl", function(
    
    CoreDocumentUtil,
   
  ) {
    CoreDocumentUtil.setTitle("Users");
console.log("ulist");
  
  });
