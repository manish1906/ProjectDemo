angular
  .module("ba.docs")
  .constant("GUIDES_DEFAULT_PAGE_LIMIT", 10)
  .service("GuideDAL", function(
    GUIDES_DEFAULT_PAGE_LIMIT,
    Environment,
    $http
  ) {
    $scope.guidehelp = [ 
        {
          helpid: 1,
          helpname: 'andriod'
        },
        {
          helpid: 2,
          helpname: 'IOS'
        },
        {
          helpid: 3,
          helpname: 'Window'
        },
        {
          helpid: 4,
          helpname: 'platform'
        }
    ];
    this.getGuideById = function(id) {
       
    var guide = $scope.guidehelp.find(x=>x.helpname ==id);
          return guide;
      };
  });