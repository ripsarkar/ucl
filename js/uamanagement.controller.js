//wrting the controller for uamanage page
app.controller("uamanagement",["$scope","$rootScope","$http", function($scope,$rootScope,$http){
		//base view is view user
	$rootScope.currentUserTab = 'html/viewuser.html';
		//go to create user
	$scope.onuamcreateuser = function(id) {
	    //change to createuser
		$scope.titleforuser = "Create New User Account";
		$scope.usernamemain="";
		$scope.firstname="";
		$scope.middlename="";
		$scope.lastname="";
		$scope.contactnum="";
		$scope.emailadd="";
		$scope.role="";
		$scope.password="";
		$scope.isactive=false;
		$scope.selectedCompanycr="";
	    $scope.industryName="";
	    $scope.contractId="";
		$scope.master=false;
       //go to create user
		$rootScope.updateuserName="";
	    $rootScope.passWord="";
	    $rootScope.updatefirstName="";
	    $rootScope.updatemiddleName="";
	    $rootScope.updatelastName="";
	    $rootScope.updatecontactNo="";
	    $rootScope.updateemail="";
	    $rootScope.updaterole="";
	    $rootScope.isACTIVE="";	
	    $rootScope.updatecompanyName="";
	    $rootScope.Industryname="";
	    $rootScope.updatecontractId="";
	    $rootScope.currentUserTab = 'html/uamcreateuser.html';
	    $scope.disableusername=false;


   }

   $scope.onuamedituser = function(id) {

       //calling the API for user details
	   $http.get($rootScope.url+"/editUser/"+id).success(function(result) {
		   //passing updatation values
	       $rootScope.updateuserName=result.userName;
	       $rootScope.passWord=result.password;
	       $rootScope.updatefirstName=result.firstName;
	       $rootScope.updatemiddleName=result.middleName;
	       $rootScope.updatelastName=result.lastName;
	       $rootScope.updatecontactNo=result.contactNo;
	       $rootScope.updateemail=result.email;
	       $rootScope.updaterole=result.role;
	       $rootScope.isACTIVE=result.isActive;
	       $rootScope.compId=result.companyId;
	       $rootScope.updatecompanyName=result.companyName;
	       $rootScope.Industryname=result.industryName;
	       $rootScope.updatecontractId=result.contractId;
	       //move to edit user page
	       $rootScope.currentUserTab = 'html/uamcreateuser.html';
	  	}).error(function(error) {
	  		alert("Could not connect to server");
		       //error
		});
   };
   $scope.onviewuser = function() {//alert(2);
		//edituser control vacating
		$rootScope.updateuserName="";
	    $rootScope.passWord="";
	    $rootScope.updatefirstName="";
	    $rootScope.updatemiddleName="";
	    $rootScope.updatelastName="";
	    $rootScope.updatecontactNo="";
	    $rootScope.updateemail="";
	    $rootScope.updaterole="";
	    $rootScope.isACTIVE="";
	    $rootScope.updatecompanyName="";
	    $rootScope.Industryname="";
	    $rootScope.updatecontractId="";
	    //go to view user
	    $rootScope.currentUserTab = 'html/viewuser.html';
       
   }


}]);
    	    




    
