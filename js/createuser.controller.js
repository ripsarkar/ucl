app.controller("createUserController",["$scope","createUserService", "$rootScope","$http","$timeout","$location", function($scope, createUserService, $rootScope, $http, $timeout,$location){


	//on click createuser go to create user
	angular.element("#createusertab").click(function(){
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
	//check box
	$scope.isactive=true;
	$scope.master=true;
	//
	$scope.selectedCompanycr="";
    $scope.industryName="";
    $scope.contractId="";
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

});
	//is active declaraion
	var activestatus;
	$scope.$watch(function () {
	if($scope.isactive==true){
		activestatus="Y";
		angular.element(".checkboxstyle").addClass(" activeStateOn");
		angular.element(".checkboxstyle").removeClass(" activeStateOff");	
		}
	if($scope.isactive==false){
		//$scope.master=false;
		activestatus="N";
		angular.element(".checkboxstyle").addClass(" activeStateOff");
		angular.element(".checkboxstyle").removeClass(" activeStateOn");	
		};
	});
	if($rootScope.isACTIVE=="Y"){
		 $scope.master=true;
		 $scope.isactive=true;
		 activestatus="Y";
		 angular.element(".checkboxstyle").addClass(" activeStateOn");
		 angular.element(".checkboxstyle").removeClass(" activeStateOff");	
	}
	if($rootScope.isACTIVE=="N"){
		
		 activestatus="N";
		 angular.element(".checkboxstyle").addClass(" activeStateOff");
		 angular.element(".checkboxstyle").removeClass(" activeStateOn");		 
	}	
	//passing data for update
	if($rootScope.updateuserName!=""){
	$scope.disableusername=true;
	$scope.usernamemain=$rootScope.updateuserName;
	$scope.firstname=$rootScope.updatefirstName;
	$scope.middlename=$rootScope.updatemiddleName;
	$scope.lastname=$rootScope.updatelastName;
	$scope.contactnum=$rootScope.updatecontactNo;
	$scope.emailadd=$rootScope.updateemail;
	$scope.role=$rootScope.updaterole;
	$scope.password=$rootScope.passWord;
	activestatus=$rootScope.isACTIVE;
	$scope.selectedCompanycr=$rootScope.updatecompanyName;
    $scope.industryName=$rootScope.Industryname;
    $scope.contractId=$rootScope.updatecontractId;
	}
    //page title
	$scope.titleforuser = "Create New User Account";
	if($rootScope.updateuserName!=""){
    	$scope.titleforuser = "Update User Account";
	}
    $scope.sendcreateuser=function() {
    	//form validation
    	//var usernameRegex = /^[a-zA-Z0-9_-@]+$/;
    	var name = /^[A-z ]+$/;
    	var contnumber = /^\+?([0-9]{1,5})\)?[-. ]?([0-9]{2,5})[-. ]?([0-9]{2,5})[-. ]?([0-9]{2,5})$/;  
    	var emailidfield = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    	
    	if($scope.usernamemain == '' /*|| !usernameRegex.test($scope.usernamemain)*/){
    		alert('Please enter a valid User name');
     	    return false;
    	}
    	else if($scope.firstname == '' || !name.test($scope.firstname)){
    		alert('Please enter a valid First Name');
     	    return false;
    	}
    	else if($scope.middlename != '' &&  !name.test($scope.middlename)){
    		alert('Please enter a valid Middle Name');
     	    return false;
    	}
    	else if($scope.lastname == '' || !name.test($scope.lastname)){
    		alert('Please enter a valid Last Name');
     	    return false;
    	}
    	else if($scope.contactnum == '' || !contnumber.test($scope.contactnum)){
    		alert('Please enter a valid contact number');
     	    return false;
    	}
    	else if ($scope.emailadd == '' || !emailidfield.test($scope.emailadd))
    	{
    	    alert('Please enter a valid email address');
    	    return false;
    	}
    	else if ($scope.selectedCompanycr == '')
    	{
    	    alert('Please select a Company');
    	    return false;
    	}
    	else if ($scope.role == '')
    	{
    	    alert('Please select a Role');
    	    return false;
    	}
    	else{
    	var createupdateapi=$rootScope.url+"/createNewUser";
    	if($rootScope.updateuserName!=""){
    		createupdateapi=$rootScope.url+"/updateUser";
        	$scope.titleforuser = "Update User Account";
    	}
    	
    	var params = {
        		username: $scope.usernamemain,
        		password: $scope.password,
        		firstname:$scope.firstname,
        		middlename:$scope.middlename,
        		lastname:$scope.lastname,
        		contactnum:$scope.contactnum,
        		emailadd:$scope.emailadd,
        		companyname:$scope.selectedCompanycr,
        		industry:$scope.industryName,
        		contractid:$scope.contractId,
        		role:$scope.role,
        		isactive:activestatus
        };
    var	 callpost = {
              method : "POST",
              url: createupdateapi,
              headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    		  data: JSON.stringify(params),
    		  //params : params
            };
     $http(callpost).success(function (result){
    	 		if(createupdateapi==($rootScope.url+"/createNewUser")){
    			
    			//--------------clearing the fields---------------//
    			$scope.usernamemain="";
    			$scope.firstname="";
    			$scope.middlename="";
    			$scope.lastname="";
    			$scope.contactnum="";
    			$scope.emailadd="";
    			$scope.role="";
    			$scope.password="";
    			//check box
    			$scope.isactive=false;
    			$scope.master=false;
    			//
    			$scope.selectedCompanycr="";
    		    $scope.industryName="";
    		    $scope.contractId="";
    			//--------------clearing the fields---------------//
    			alert("User account created successfully. User name/password sent to registered email");
    	 		}
    	 		else{
    	 		$rootScope.currentUserTab = 'html/viewuser.html';
                $location.path('/home/uamanagement');

    			//--------------clearing the fields---------------//
    			$scope.usesrnamemain="";
    			$scope.firstname="";
    			$scope.middlename="";
    			$scope.lastname="";
    			$scope.contactnum="";
    			$scope.emailadd="";
    			$scope.role="";
    			$scope.password="";
    			//check box
    			$scope.isactive=false;
    			$scope.master=false;
    			//
    			$scope.selectedCompanycr="";
    		    $scope.industryName="";
    		    $scope.contractId="";
    			//--------------clearing the fields---------------//  
        		alert("User account updated successfully");
    		    }

    			}).error(function(error) {
    		         //error
    				if(error.ErrCode==602){
        				alert("This username already exists. Please select another username");
					}
    				else{
        				alert("There is some problem as reported by the backend. Please contact the administrator");
    				}
    	    	});
	
    }
};

/*    createUserService.getCompanyNamecr(data).success(function(resultnamecr)
			{
				$scope.companyList = resultnamecr.Company;
			});*/

//starting loading animation	
$rootScope.loadinganimation=true;

$timeout(function(){
	 //calling getcompany
	$http.get($rootScope.url+'/getCompany').success(function(resultnamecr) {
		$scope.companyListli = resultnamecr.Company;
		 //starting loading animation	
		 $rootScope.loadinganimation=false;	
	  	}).error(function(error) {
	       //error
	  		alert("There is some problem as reported by the backend. Please contact the administrator");
	  		$rootScope.loadinganimation=false;

	});
},3000);

$scope.getDetailscr=function(){
		for(var i=0;i<$scope.companyListli.length;i++){
			if($scope.companyListli[i].name==$scope.selectedCompanycr){
				idcompanyget=$scope.companyListli[i].id;
			}
		}
		createUserService.getCompDetails(idcompanyget).success(function(resultname)
				{
					$scope.industryName = resultname.industryName;
					$scope.contractId = resultname.contractId;
				});
	};
	
	
	$http.get($rootScope.url+'/getpopulateRoleforLogin').success(function(resultrole) {
		
		$scope.rolelist = resultrole.Roles;
		
      	 }).error(function(error) {
        //error
      		 alert("There is some problem as reported by the backend. Please contact the administrator");
 	  		$rootScope.loadinganimation=false;
    	 });

/*	createUserService.getRoles(data).success(function(resultrole)
		{
			$scope.rolelist = resultrole.Roles;
		}).error(function(error) {
	         //error
    	});*/
//clear everything
	
	$scope.clearadduser=function() {
		$scope.usernamemain="";
		$scope.firstname="";
		$scope.middlename="";
		$scope.lastname="";
		$scope.contactnum="";
		$scope.emailadd="";
		$scope.role="";
		$scope.password="";
		//check box
		$scope.isactive=false;
		$scope.master=false;
		//
		$scope.selectedCompanycr="";
	    $scope.industryName="";
	    $scope.contractId="";
	}
	//red green dot styling
/*	$scope.$watch(function (){
		if($scope.master==false){
			angular.element(".checkboxstyle").addClass(" activeStateOff");
			}
		else{
			angular.element(".checkboxstyle").addClass(" activeStateOn");
			}
	});*/
	//
	
}]);

//wrting the services for viewuser page


app.service('createUserService', ['$http',"$rootScope",
	        function ($http,$rootScope) {
	     
 /*   this.getCompanyNamecr= function (data) {
	         var promisenamecr = $http.get('http://ucsr.mybluemix.net/getCompany').success(function(responsenamecr) {
	         return responsenamecr.data;
	       	}).error(function(error) {
	            //error
	    	 });
	     	return promisenamecr;
	    	};*/
	       	        

       this.getCompDetails= function (data) {
 	         var promisename = $http.get($rootScope.url+'/getCompanyDetails/'+data).success(function(responsename) {
 	         return responsename.data;
 	       	}).error(function(error) {
 	           //error
 	    	 });
 	     	return promisename;
 	    	};
       
       /*this.getRoles= function (data) {
	         var promisename = $http.get('http://ucsr.mybluemix.net/getpopulateRoleforLogin').success(function(responsename) {
	         return responsename.data;
	       	 }).error(function(error) {
	         //error
	     	 });
	     	return promisename;
	    	} ;*/
       
}]);
