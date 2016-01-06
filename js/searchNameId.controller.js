//wrting the controller for usecase page
app.controller("searchNameIdController",["$scope","ApiService", "$rootScope", function($scope, ApiService, $rootScope){
	
	$scope.nosearch="Please provide Use Case Id/Name to Search";

	var namefield;
	var idfield;
	
	$scope.showResult=false;
	
	/*-----------------watch function starts-----------------*/

    $scope.$watch(function () {
    	//removing last comma

    	//alternate empty
    	angular.element( ".namesearchclass" ).keypress(function() {
    		angular.element( ".idsearchclass" ).val("");
    		$scope.idsearch="";
    		
    		});
    	angular.element( ".idsearchclass" ).keypress(function() {
    		angular.element( ".namesearchclass" ).val("");
    		$scope.namesearch="";
    		});

    	namefield = angular.element(".namesearchclass").val();
    	idfield = angular.element(".idsearchclass").val();
    	var uccaterulefirst=angular.element(".usecaseTable td:first-child").text();
    	if(uccaterulefirst==""){
    		angular.element(".usecaseTablerule").hide();
    		$scope.pleaseprovide = true;
    	}else{$scope.pleaseprovide = false;}
    	
    	//click table item
    	angular.element('.usecaseTable').on('click', function() {
    	    angular.element('.usecaseTable').removeClass('usecaseTableclick');
    	    angular.element(this).addClass('usecaseTableclick');
    	});

    });
	/*-----------------/watch function ends-----------------*/
	$scope.pleaseprovide = true;
	
	
	/*-----------------search function starts-----------------*/
	$scope.clickme=function(){
		//hiding relatable
		$scope.rulerelationtable = false;
		//
	      $scope.licreateruledetails = 'active';
	      $scope.licreateruleinput = 'no-active';
	      $scope.licreateruleinputdata = 'no-active';
	      $scope.licreaterulelog = 'no-active';
	      $scope.licreateruleoutput = 'no-active';
          $scope.licreaterulethd = 'no-active'; 
	      $scope.licreateruleresponse = 'no-active';	
			//hide error element
			$scope.errorrelationsearch=false;
	//provide name or id scope
	$scope.pleaseprovide = false;
	
	//declaring arrays for relationship table
	$scope.regulatorycatagory = [];
	$scope.threatcategory = [];
	$scope.essentialpractice =[];
	$scope.industry = [];
	$scope.uccategory = [];
	$scope.ucsubcategory = [];
	$scope.ucrules = [];
	
	//variable declared for checking fields are blank or not
	var namefill ;
	var idfill;
	
	//checking fields are blank or not
	if(($scope.namesearch ==undefined || $scope.namesearch =="") && ($scope.idsearch ==undefined || $scope.idsearch=="")){
		$scope.pleaseprovide = true;
	}else{
	
	if($scope.namesearch ==undefined || $scope.namesearch==""){
		 namefill ="blank";
		 
	}else{
		 namefill =$scope.namesearch;
		 //starting loading animation	
		 $rootScope.loadinganimation=true;			 
	}
	if($scope.idsearch ==undefined || $scope.idsearch==""){
		idfill ="blank";
	}else{
		idfill =$scope.idsearch;
		//starting loading animation	
		$rootScope.loadinganimation=true;
	}
	//login sur id assignment
	var userloginsurrid=$rootScope.surrId;
	
	ApiService.getNameOrId(namefill,idfill,userloginsurrid).success(function(resultname)
			{
					$scope.usercaseall = resultname.useCases;
					$rootScope.loadinganimation=false;
					$scope.showResult=true;
					if(resultname.useCases[0].error==" No Usecase Found"){
						$scope.pleaseprovide = false;
						$scope.showResult=false;
						//$scope.nosearch = resultname.useCases[0].error;
						$scope.nosearch = "No Usecase Found";
						
					}
			}).error(function (error) {
	    		//ending loading animation
	    		$rootScope.loadinganimation=false;
	    		//show error element
	    		$scope.errorrelationsearch=true;
	    		//show error messege
	    		//$scope.relationsearchbottom=error.ErrMsg;
	    		$scope.relationsearchbottom = "There is some problem as reported by the backend. Please contact the administrator";
  	     	});
	
	
	}

    }
	/*-----------------/search function ends-----------------*/
	
	/*-----------------calling relationship table-----------------*/
    	

	
	$scope.uscaseclick=function(usecrule){

    	//starting loading animation
		$rootScope.loadinganimation=true;
		//hide error element
		$scope.errorrelationsearch=false;
		var datasurr = usecrule.usecase_surr_id;
		$scope.useCaseNo = usecrule.usecase_id;
		$scope.useCaseName =usecrule.usecase_name;
	//	$scope.usecaseSummary = "Relationships for Use Case # :  "+usecrule.usecase_id+"  Use Case Name : "+usecrule.usecase_name;

		ApiService.usecaseRelationships(datasurr).success(function(output)
		    	{		
						//show relationship table
						$scope.rulerelationtable = true;
						//
		    			//regcat list
						var regcatall = output.regulatory_cat;
						var tooltip1 = regcatall[0].reg_cat_desc;

						if(regcatall.length>0){
							var regulatorytree = "<a data-toggle='tooltip' data-placement='left' title=\'" + tooltip1 +"\' tooltip-placement='left'>" + "<strong>" + "(" + regcatall[0].reg_cat_name + ")" + "</strong>" + "-" + regcatall[0].reg_pub_name  + "<strong>"+ "::"  + "</strong>"+ regcatall[0].reg_cntrl_name;
							for(var i=0;i<regcatall.length-1;i++){
								tooltip1 = regcatall[i+1].reg_cat_desc;
								if(regcatall[i].reg_pub_name == regcatall[i+1].reg_pub_name && regcatall[i].reg_cat_name == regcatall[i+1].reg_cat_name){
								//alert(regcatall[i].reg_pub_name);
								regulatorytree = regulatorytree  + ","	+ regcatall[i+1].reg_cntrl_name;
								}else if(regcatall[i].reg_pub_name != regcatall[i+1].reg_pub_name && regcatall[i].reg_cat_name == regcatall[i+1].reg_cat_name){
									regulatorytree = regulatorytree + "--" + regcatall[i+1].reg_pub_name + "<strong>" + "::"  + "</strong>"+ regcatall[i+1].reg_cntrl_name;
								}
								else if(regcatall[i].reg_pub_name != regcatall[i+1].reg_pub_name && regcatall[i].reg_cat_name != regcatall[i+1].reg_cat_name){
									regulatorytree = regulatorytree + "</a>"+ "</br>" + "<a data-toggle='tooltip' data-placement='left' title=\'" + tooltip1 +"\' tooltip-placement='left'>" + "<strong>" + "(" + regcatall[i+1].reg_cat_name + ")" + "</strong>" + "-" + regcatall[i+1].reg_pub_name  + "<strong>"+ "::"  + "</strong>"+ regcatall[i+1].reg_cntrl_name;
								}
							}
							
							 var elem = document.getElementById('regcatallinuc');
							 if(typeof elem !== 'undefined' && elem !== null) {
								  document.getElementById('regcatallinuc').innerHTML = regulatorytree;
							 }
						}
				
					//	document.getElementById('regcatallinuc').innerHTML = regulatorytree;
						//
		    			
		    			
		    			$scope.threatcategory = output.uc_threat_category;
		    			$scope.essentialpractice = output.essential_practice;
		    			$scope.industry = output.industry;
		    			$scope.uccategory = output.uc_category;
		    			$scope.ucsubcategory = output.uc_subcategory;
		    			$scope.ucrules = output.uc_rules;
		    			//ending loading animation
						$rootScope.loadinganimation=false;
		    	}).error(function (error) {
		    		//ending loading animation
		    		$rootScope.loadinganimation=false;
		    		//show error element
		    		$scope.errorrelationsearch=true;
		    		//show error messege
		    		//$scope.relationsearchbottom=error.ErrMsg;
		    		$scope.relationsearchbottom="There is some problem as reported by the backend. Please contact the administrator";
		    		});
		
		
		
	}
	/*-----------------/end relationship table-----------------*/
	
}]);
    	    
//wrting the services for usecase page


    app.service('ApiService', ['$http','$rootScope',
    	        function ($http, $rootScope) {
    	//service for nameid
    	        this.getNameOrId=function (namefill,idfill,userloginsurrid) {
    	         var promisename = $http.get($rootScope.url+'/searchUseCasebyIdorName/' + userloginsurrid + '/' + idfill+'/' + namefill) .success(function(responsename) {
    	         return responsename.data;
    	       	}).error(function (errordata) {
      	       		return errordata;
      	     	});
    	     	return promisename;
    	    	}

    	//service for relationship table
    	        this.usecaseRelationships=function (datasurr) {
       	         var promise2 = $http.get($rootScope.url+'/getUseCaseRelationship/' + datasurr) .success(function(response2) {
       	         return response2.data;
       	       	}).error(function (errordata) {
      	       		return errordata;
      	     	});
       	     	return promise2;
       	    	}
    		}
    ]);

    
    
