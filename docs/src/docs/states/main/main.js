if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function() {};

angular.module("ba.docs", [
  "ngStorage",
  "cfp.hotkeys",
  "ngIntercom",
  "ngAnimate",
  "ui.router",

  "ba.shared",
  "ba.docs.environments",
  "ba.docs.core"
]);
