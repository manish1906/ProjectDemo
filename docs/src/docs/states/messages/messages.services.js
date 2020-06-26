angular
  .module("ba.docs")
    .service("MessageService",function()
    {

        var messagelist=[];
        // $scope.messageTitle="";
        // $scope.messageDescription="";
        this.addMessages=function (messageTitle,messageDescription){
           console.log("add")
         //  debugger;
          
     var message=
     {
       messageTitle:messageTitle,
       messageDescription:messageDescription
     
     };
     return messagelist.push(message);
      
      // debugger;  
     
         };
       
         this.get=function ()
         {
           return messagelist;
         };
         //$scope.messagelist=this.get();
       

    })