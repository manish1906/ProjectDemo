angular
  .module("ba.docs.core")
  .service("CoreDocumentUtil", function($document) {
    var document = $document[0];

    this.setTitle = function(title) {
      document.title = title;
    };

    this.setMetaDescription = function(description) {
      var metas = document.getElementsByTagName("meta");

      if (metas && metas.length) {
        for (var i = 0; i < metas.length; i++) {
          if (metas[i].name.toLowerCase() == "description") {
            metas[i].content = description;
            break;
          }
        }
      }
    };
  });
