angular
  .module("ba.docs")
  .config(function ($stateProvider, GuideStatesProvider, GuidePathsProvider) {
    var paths = GuidePathsProvider.get();
    var states = GuideStatesProvider.get();
 
    // use guide 'key' to get details of a guide (e.g. Android)
    // this model should have a collection of versions.
    // look at the url to see if version exists in url, if it does try to get from collection, if not then default to newest version (AND update URL)
 
    $stateProvider
    .state(states.guideroot, {
    //  abstract:true,
      url: ":guide", // e.g. 'Android' 'iOS'
      cache:false,
      templateUrl: paths.views.root,
     //template:'<b>hello</b>',
      controller: "GuideCtrl",
      // abstract: true,
    
    //   resolve: {
        
    //     ActiveGuide: function ($q, $stateParams) {
    //     // debugger
    //       var guideKey = $stateParams.guide || "";
    //       // var objec = GuideDAL.getGuideById(guideKey);
    //       var guideshelp = [
    //         {
    //           helpid: 1,
    //           helpname: "andriod",
    //           versions: ["1.1.02323", "1.1.1", "1.1.2", "1.1.3"],
    //         },
    //         {
    //           helpid: 2,
    //           helpname: "IOS",
    //           versions: ["1.1.0", "1.1.1", "1.1.2", "1.1.3"],
    //         },
    //         {
    //           helpid: 3,
    //           helpname: "Window",
    //           versions: ["1.1.0", "1.1.1", "1.1.2", "1.1.3"],
    //         },
    //         {
    //           helpid: 4,
    //           helpname: "platform",
    //           versions: ["1.1.0", "1.1.1", "1.1.2", "1.1.3"],
    //         },
    //       ];
    //       var guide = guideshelp.find((x) => x.helpname == guideKey);
 
    //       // $state.go(states.list,{guide:guideKey});
 
    //       // if good yay
    //       //   $timeout(function() {
    //       //     $state.go('main.home.guides.list')
    //       //  },0);
    //       //  return $q.reject();
 
    //       // if not valid version then
    //       // -> $q.reject()
 
    //       /// details of a guide with collection of all possible versions
    //       // by default select newest version
    //       // return GuidesDAL.getGuide(guideKey);
    //       return $q.when(guide);
    //     },
    //   },
     })
    .state(states.details, {
      //  url: "/details?version&doc",
      url: "/details/:doc",
       templateUrl: paths.views.test,
      controller: "GuideDetail",

    //   resolve: {
      
    //     _version: function($stateParams, $http, $q) {
    //   //debugger;
    //       // set default header (sanity check)
    //       // $http.defaults.headers.common["ba-app-id"] = $stateParams.appId;
    //       var audienceId = $stateParams.version
    //         ? +$stateParams.version
    //         : null; // cast to int
    //       return $q.when(50);
    //     },
      
    //     _doc: function($stateParams, $q) {
    //       var page = $stateParams.doc ? +$stateParams.doc : 1;
    //       return $q.when(10);
    //     }
      
    //   }
      });
  });