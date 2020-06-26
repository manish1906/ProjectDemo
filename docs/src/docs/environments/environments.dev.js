"use strict";

angular
  .module("ba.docs.environments", [])
  // zsu0ei5c -> TEST
  .constant('INTERCOM_APP_ID', 'a744mcfy')
  .run(function ($localStorage) {
    //$localStorage.$reset();
  })
  .config(function ($logProvider, $httpProvider, $compileProvider) {
    $logProvider.debugEnabled(true);
    $compileProvider.debugInfoEnabled(false);
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
  })
  .factory("Environment", function () {
    var clientUrl = "https://dev-api.boardactive.com/web/v1";

    return {
      name: "local",
      clientUrl: clientUrl,
      assetsUrl: "",
      path: clientUrl,
      api: {
        web: "",
        mobile: "/mobile"
      },
      config: {
        withCredentials: true
      },
      keys: {
        intercom: "zsu0ei5c"
      }
    };
  });