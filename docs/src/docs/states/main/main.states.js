angular.module("ba.docs").provider("MainStates", function () {
  var states = {
    root: "main",
    app: "main.app", // new
    home: "main.home", // grid view
    guide: "main.guide", // details of grid itm where left is list and top left is version # dropdown
    list: "main.app.messages.list",
    messages:"main.app.messages",
    details:"main.app.details"
  };

  return {
    get: function () {
      return states;
    },
    $get: function () {
      return states;
    },
  };
});
