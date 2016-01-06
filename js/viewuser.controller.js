//wrting the controller for viewuser page
app.controller("viewUserController",["$scope","ViewUserService", "$rootScope", function($scope, ViewUserService, $rootScope){
	
	 $rootScope.loadinganimation=true;	

	
	$scope.industryName = "";
	$scope.contractId = "";
	
	
		ViewUserService.getCompanyName().success(function(resultname)
				{		 
					$rootScope.loadinganimation=false;	
					$scope.companyList = resultname.Company;
				}).error(function (error) {
       	         //error
			  		alert("There is some problem as reported by the backend. Please contact the administrator");
			  		$rootScope.loadinganimation=false;
			  	})

	
	$scope.getDetails=function(){
		ViewUserService.getCompDetails($scope.selectedCompany.id).then(function(resultname)
				{
					$scope.industryName = resultname.industryName;
					$scope.contractId = resultname.contractId;
				});
	}
	
	/*-----------------search function starts-----------------*/
	$scope.userList=[];
	$scope.clickme=function(){
		
		ViewUserService.getUserDetails($scope.selectedCompany.id).then(function(resultname)
				{
					$scope.userList = resultname.Users;					
				});

    }
	/*-----------------/search function ends-----------------*/
	
	//red green dot styling
	$scope.$watch(function (){
		angular.element(".activeprev").each(function() {
		 if(angular.element(this).text()=="N"){
			angular.element(this).addClass(" activeiconred");
			}
		else{
				angular.element(this).addClass(" activeicongreen");
			} 
		});
	});
	//
	
}]);
    	    
//wrting the services for viewuser page


    app.service('ViewUserService', ['$http','$rootScope',
    	        function ($http, $rootScope) {
    	     
    	        
    	        this.getCompanyName= function (data) {
       	         var promisename = $http.get($rootScope.url+'/getCompany') .success(function(responsename) {
       	         return responsename.data;
       	       	}).error(function (error) {
       	         //error
       	     	})
       	     	return promisename;
       	    	}
        	       	        

    	        this.getCompDetails= function (data) {
          	         var promisename = $http.get($rootScope.url+'/getCompanyDetails/'+data) .then(function(responsename) {
          	         return responsename.data;
          	       	}, function (error) {
          	         //error
          	     	})
          	     	return promisename;
          	    	}

    	        
    	        this.getUserDetails= function (data) {
         	         var promisename = $http.get($rootScope.url+'/viewUser/'+data) .then(function(responsename) {
         	         return responsename.data;
         	       	}, function (error) {
         	         //error
         	     	})
         	     	return promisename;
         	    	}

    	     }
    ]);

    
    
