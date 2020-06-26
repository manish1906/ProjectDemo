angular
  .module("ba.docs")
  .config(function (
    $locationProvider,
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    $urlMatcherFactoryProvider,
    $intercomProvider,
    INTERCOM_APP_ID,
    MainPathsProvider,
    MainStatesProvider
  ) {
    var paths = MainPathsProvider.get();
    var states = MainStatesProvider.get();

    $intercomProvider.asyncLoading(true);
    $intercomProvider.appID(INTERCOM_APP_ID);

    $httpProvider.useApplyAsync(true);
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false,
    });
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state(states.root, {
       // abstract: true,
        url: "",
        controller: "MainCtrl as app",
        templateUrl: paths.views.root,
      })
      .state(states.app, {
        url: "/:app",
        controller: "MainHomeCtrl",
        templateUrl: paths.views.home
      })
      // .state(states.messages
      // , {
      //   abstract:true,
      //   url: "message",
      //   controller: "MainMessageCtrl",
      //   templateUrl: paths.views.test
      // })
      // .state(states.list, {
      //   url: "/msg/",
      //   controller: "MainMessageDetailsCtrl",
      //   templateUrl: paths.views.test1
      // // template:'<b>fhgfhgfhgftyt<b>'
      // })
  })
  .run(function ($rootScope, $log, CoreTracking) {
    $rootScope.$on("$stateChangeSuccess", function (
      event,
      toState,
      fromState,
      fromParams
    ) {
      CoreTracking.trackEvent("Visited " + toState.name);
    });

    $rootScope.$on("$stateChangeError", function (
      event,
      toState,
      toParams,
      fromState,
      fromParams,
      error
    ) {
      $log.debug("$stateChangeError", event, error, toState, fromState);
    });

    // add for google maps geofence logic
    Number.prototype.toRad = function () {
      return (this * Math.PI) / 180;
    };

    Number.prototype.toDeg = function () {
      return (this * 180) / Math.PI;
    };
  });
