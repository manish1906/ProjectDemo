angular
  .module("ba.docs")
  .controller("GuideCtrl", function (
   
    $scope,
    $state,
    CoreDocumentUtil,
    GuidePaths,
    GuideStates
  ) {
    CoreDocumentUtil.setTitle("Guide"); // sanity
    console.log('hi.. GuideCtrl');
  //  debugger;
    $scope.$state = $state;
    $scope.GuideStates = GuideStates;
    $scope.GuidePaths = GuidePaths;
    $scope.guide ={};
 
    $scope.versionlist = [{
      "versionid": 1,
      "versionname": "1.1.0"
      }, 
      {
      "versionid": 2,
      "versionname": "1.1.1"
      }, 
      {
      "versionid": 3,
      "versionname": "1.1.2"
      },
      {
        "versionid": 4,
        "versionname": "1.1.3"
        }
    ];
 
    $scope.doclist= [
      { docid: 1, docname: "doc1" },
      { docid: 2, docname: "doc2" },
      { docid: 3, docname: "doc3" },
      { docid: 4, docname: "doc4" },
    ];
    $scope.goDoc = function(event) {
    //  debugger;
      var state = $scope.GuideStates;
      var params = params || {};
    //  params.version = $scope.guide.versionname;
      params.doc =event.docname;
      //debugger;
      // $state.goTo(state.details, params);
      $state.go(state.details, params);
 
    };
  })
  .controller("GuideDetail",function($scope,$stateParams,){
  //  debugger
    console.log("guidedetails");
    
      
    
   // debugger
    
    $scope.verdoc=$stateParams.doc;
    $scope.verdoc1=$stateParams.version;
    console.log($scope.verdoc);
    console.log($scope.verdoc1);
    console.log("hi..details");
  });
