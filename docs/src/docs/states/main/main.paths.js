angular.module("ba.docs").provider("MainPaths", function() {
  var rootPath = "/src/docs";
  var base = rootPath + "/states/main/views/";

  var paths = {
    root: rootPath,
    views: {
      root: base + "main.html",
      home: base + "main.home.html",
      test: base + "test.html",
      test1: base + "test1.html"
    },
  
    partials: {
      nav: base + "partials/main.partials.nav.html",
      footer: base + "partials/main.partials.footer.html"
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
