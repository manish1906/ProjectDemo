angular.module("ba.docs").provider("GuidePaths", function (MainPathsProvider) {
 //debugger
  var appPath = MainPathsProvider.get().root;
  var base = appPath + "/states/guide/views/";
  
  var paths = {
    views: {
      root: base + "guide.html",
      // test: base + "guide.test.html",
       test: base + "guide.lists.details.html",

    },
    partials: {
      docsList: base + "partials/guide.partials.docs-lists.html",
      docsDetails: base + "partials/guide.partials.docs-details.html",
    },
  };
 
  return {
    get: function () {
      return paths;
    },
    $get: function () {
      return paths;
    },
  };
});