angular.module("ba.docs.core").provider("CorePaths", function() {
  var mainPath = "/src/docs/core/";
  var viewsPath = mainPath + "views/";

  var paths = {
    views: {},
    partials: {}
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
