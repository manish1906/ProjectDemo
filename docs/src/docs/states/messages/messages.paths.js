angular.module("ba.docs").provider("MessagesPaths", function(MainPathsProvider) {
  var appPath = MainPathsProvider.get().root;
  var base = appPath + "/states/messages/views/";

  var paths = {
    views: {
      root: base + "messages.html",
      list: base + "messages.list.html",
      details: base + "messages.details.html"
    }
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
