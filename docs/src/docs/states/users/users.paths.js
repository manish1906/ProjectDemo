angular.module("ba.docs").provider("UsersPaths", function(MainPathsProvider) {
  var appPath = MainPathsProvider.get().root;
  var base = appPath + "/states/users/views/";
  

  var paths = {
    views: {
      root: base + "users.html",
      list: base + "users.list.html",
      details: base + "users.details.html"
    },
   
      
    
  };

  return {
    get: function() {
      return paths;
    },
    $get: function() {
      return paths;
    }
  };
});
