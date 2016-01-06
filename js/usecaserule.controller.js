

app.controller("usecaseruleController",["$scope","ApiServicerule","$rootScope",'$http', function($scope, ApiServicerule, $rootScope, $http){
	
	$scope.nosearch="Please provide Rule Id/Name to Search";
	$scope.showResult=false;
	
	var namefield;
	var idfield;
    $scope.$watch(function () {
    	//alternate empty
    	angular.element( ".namesearchclassrule" ).keypress(function() {
    		angular.element( ".idsearchclassrule" ).val("");
    		$scope.idsearchrule="";
    		});
    	angular.element( ".idsearchclassrule" ).keypress(function() {
    		angular.element( ".namesearchclassrule" ).val("");
    		$scope.namesearchrule="";
    		});
    	
    	
    	namefield = angular.element(".namesearchclassrule").val();
    	idfield = angular.element(".idsearchclassrule").val();
    	
    	var uccaterulefirst=angular.element(".usecaseTablerule td:first-child").text();
    	if(uccaterulefirst==""){
    		angular.element(".usecaseTablerule").hide();
    		$scope.pleaseprovide = true;
    	}else{$scope.pleaseprovide = false;}
    	
    });
	$scope.pleaseprovide = true;
	
	
	  $scope.groupResult = function() {
//	        $scope.licreateruledetails = 'active';
//	        $scope.ruledetails = false;
//	        $scope.rulesource = false;
//	        $scope.ruleinput = false;
//	        $scope.ruleoutput = false;
//	        $scope.rulethd = false;
//	        $scope.ruleresponse = false;
	        $scope.showResult = true;

	        $scope.jsonObj = {
	            "usecase_category": "",
	            "usecase_subcategory": "",
	            "usecase_name": "",
	            "usecase_surr_id": "",
	            "usecase_id":"",
	            "usecase_rule_id":"",
	            "usecase_rule_name": "",
	            "usecase_rule_surr_id": "",
	            "usecase_rule_desc": "",

	        }
	        $scope.tabledata = [];
	        var i = 0;
	        var j = 0;
	        var k = 0;
	        var l = 0;
	        $scope.catObj = null;
	        $scope.subcatObj = null
	        $scope.usecase = null;
	        $scope.rule = null;

	        if ($scope.resultdata != undefined) {
	            for (i = 0; i < $scope.resultdata.cateGory.length; i++) {
	                $scope.datashown = true;

	                if ($scope.catObj != null && $scope.catObj != $scope.resultdata.cateGory[i]) {
	                    $scope.catObj = $scope.resultdata.cateGory[i];
	                    $scope.jsonObj["usecase_category"] = $scope.catObj.name;
	                } else {
	                    if ($scope.catObj == null) {
	                        $scope.catObj = $scope.resultdata.cateGory[i];
	                        $scope.jsonObj["usecase_category"] = $scope.catObj.name;
	                    } else {
	                        $scope.jsonObj["usecase_category"] = "";
	                    }
	                }

	                for (j = 0; j < $scope.catObj.subCategory.length; j++) {
	                    if ($scope.subcatObj != null && $scope.subcatObj != $scope.catObj.subCategory[j]) {
	                        $scope.subcatObj = $scope.catObj.subCategory[j];
	                        $scope.jsonObj["usecase_subcategory"] = $scope.subcatObj.name;
	                    } else {
	                        if ($scope.subcatObj == null) {
	                            $scope.subcatObj = $scope.catObj.subCategory[j];
	                            $scope.jsonObj["usecase_subcategory"] = $scope.subcatObj.name;
	                        } else {
	                            $scope.jsonObj["usecase_subcategory"] = "";
	                        }
	                    }

	                    for (k = 0; k < $scope.subcatObj.UseCase.length; k++) {
	                        if ($scope.usecase != null && $scope.usecase != $scope.subcatObj.UseCase[k]) {
	                            $scope.usecase = $scope.subcatObj.UseCase[k];
	                            $scope.jsonObj["usecase_id"] = $scope.usecase.id_label;
	                            $scope.jsonObj["usecase_name"] = $scope.usecase.name;
	                            $scope.jsonObj["usecase_surr_id"] = $scope.usecase.id;
	                        } else {
	                            if ($scope.usecase == null) {
	                                $scope.usecase = $scope.subcatObj.UseCase[k];
	                                $scope.jsonObj["usecase_id"] = $scope.usecase.id_label;
	                                $scope.jsonObj["usecase_name"] = $scope.usecase.name;
	                                $scope.jsonObj["usecase_surr_id"] = $scope.usecase.id;

	                            } else {
	                                $scope.jsonObj["usecase_id"] = "";
	                                $scope.jsonObj["usecase_name"] = "";
	                                $scope.jsonObj["usecase_surr_id"] = "";
	                            }
	                        }
	                        for (l = 0; l < $scope.usecase.Rule.length; l++) {
	                            $scope.rule = $scope.usecase.Rule[l];
	                            $scope.jsonObj["usecase_rule_name"] = $scope.rule.name;
	                            $scope.jsonObj["usecase_rule_surr_id"] = $scope.rule.id;
	                            $scope.jsonObj["usecase_rule_id"] = $scope.rule.id_label;
	                            $scope.jsonObj["usecase_rule_desc"] = $scope.rule.description;
	                            $scope.jsonObj["oob_flag"] = $scope.rule.oob_flag;
	                            if($scope.rule.package_details !=undefined){
	                            	  $scope.jsonObj["packageSurrId"] = $scope.rule.package_details.UC_RULE_PKG_SURR_ID;
	                            	  $scope.jsonObj["fileName"] = $scope.rule.package_details.UC_RULE_PKG_FILE_NAME;
	                            	  $scope.jsonObj["exportYes"] = true;
	                            }else{
	                            	$scope.jsonObj["packageSurrId"] = "";
	                           	  	$scope.jsonObj["fileName"] = "";
	                           	  	$scope.jsonObj["exportYes"] = false;
	                            }
	                            $scope.tabledata.push($scope.jsonObj);
	                            $scope.jsonObj = {};
	                        }

	                    }

	                }

	            }

	        }
	    }
	
	$scope.clickmerule=function(){
		//hide rule and relation table
		$scope.ruletable=false;
		$scope.rulerelationtable=false;
		
		//hide error element
		$scope.errorrelationsearch=false;
		
	      $scope.licreateruledetails = 'active';
	      $scope.licreateruleinput = 'no-active';
	      $scope.licreateruleinputdata = 'no-active';
	      $scope.licreaterulelog = 'no-active';
	      $scope.licreateruleoutput = 'no-active';
          $scope.licreaterulethd = 'no-active'; 
	      $scope.licreateruleresponse = 'no-active';
		//provide name or id scope
		var namefillrule ;
		var idfillrule;
		
		if(($scope.namesearchrule ==undefined || $scope.namesearchrule =="") && ($scope.idsearchrule ==undefined || $scope.idsearchrule=="")){
			$scope.pleaseprovide = true;
		}else{
			if($scope.namesearchrule ==undefined || $scope.namesearchrule==""){
				namefillrule ="blank";
			}else{
				namefillrule =$scope.namesearchrule;
				//starting loading animation	
				$rootScope.loadinganimation=true;  
			}
			if($scope.idsearchrule ==undefined || $scope.idsearchrule==""){
				idfillrule ="blank";
			}else{
				idfillrule =$scope.idsearchrule;
				//starting loading animation	
				$rootScope.loadinganimation=true;  
			}
			//login sur id assignment
			var userruleloginsurrid=$rootScope.surrId;
			ApiServicerule.getNameOrId(namefillrule,idfillrule,userruleloginsurrid).success(function(resultnamerule)
			    	{	
							//with data
							$scope.pleaseprovide = false;
							$scope.resultdata =resultnamerule;
							$scope.groupResult();
							$rootScope.loadinganimation=false;
							//
			    			//end loading animation	
							$scope.showResult=true;
							if($scope.resultdata.cateGory.length==0){
								$scope.pleaseprovide = false;
								$scope.showResult=false;
								//$scope.nosearch = resultnamerule.useCaseRules[0].error;
								$scope.nosearch ="No Usecase Rule Found";
								
							}
			    	}).error(function (error) {
						//with no data
						$scope.pleaseprovide = true;
			    		//ending loading animation
			    		$rootScope.loadinganimation=false;
			    		//show error element
			    		$scope.errorrelationsearch=true;
			    		//show error messege
			    		//$scope.relationsearchbottom=error.ErrMsg;
			    		$scope.relationsearchbottom="There is some problem as reported by the backend. Please contact the administrator";
		     	});
		}

		
		 $scope.licreateruledetails = 'active';
		    $scope.ruledetails = true;
		    $scope.rulesource = false;
		    $scope.ruleinput = false;
		    $scope.ruleoutput = false;
            $scope.rulethd = false; 
		    $scope.ruleresponse = false;
		    $scope.ruleResultnext =  [];
			$scope.logSourcenext =  [];
			$scope.inputnext =  [];
			$scope.outputnext =  [];
            $scope.thdmodel =  []; 
			$scope.responseTextnext = [];
			$scope.inputDisplay=[];
    };
    
	//hide rule details and  relation table
	$scope.ruletable=false;
	$scope.rulerelationtable=false;
	
	//ruletable event click
	$scope.uscaseruleclick=function(data){
		
		$scope.ruleNo = data.usecase_rule_id;
		$scope.ruleName = data.usecase_rule_name;
		
		var usecaseruleid=	data.usecase_rule_surr_id;
		
				//tab select/deselect
	      $scope.licreateruledetails = 'active';
	      $scope.licreateruleinput = 'no-active';
	      $scope.licreateruleinputdata = 'no-active';
	      $scope.licreaterulelog = 'no-active';
	      $scope.licreateruleoutput = 'no-active';
          $scope.licreaterulethd = 'no-active'; 
	      $scope.licreateruleresponse = 'no-active';
	      //
	      $scope.ruledetails = true;
		    $scope.rulesource = false;
		    $scope.ruleinput = false;
		    $scope.ruleoutput = false;
            $scope.rulethd = false; 
		    $scope.ruleresponse = false;
		//hide relation table 
		$scope.rulerelationtable=false;
		//hide error element
		$scope.errorrelationsearch=false;
		//starting loading animation
		$rootScope.loadinganimation=true;
		$scope.inputDisplay=[];
		ApiServicerule.usecaseRelationships(usecaseruleid).success(function(output)
		    	{					
						//view rule details
						$scope.ruletable=true;					
						//fill data in the rule bottom table
		    			$scope.ruleResultnext = output.RuleDescription;
		    			$scope.logSourcenext = output.LogSource[0].Value;
		    			$scope.inputnext = output.Input;
		    			$scope.outputnext = output.Output;
                        $scope.thdgrp = output.ThreadModelGroup; 
		    			$scope.responseTextnext = output.ResponseText;
		    			   
		                for(var i=0; i<$scope.inputnext.length;i++){
		                	if($scope.inputnext[i].Label=="Event Attributes"){
		                		 var events=$scope.inputnext[i].Value;
		                		 for(var j=0; j<events.length;j++){
		                			 var obj ={};
		                			 if(j==0){
		                				 obj["Label"]= "Event Attributes" ;
		                				 obj["Value"]= events[j].key+" :- "+events[j].value ;
		                			 }else{
		                				 obj["Label"]= "" ;
		                				 obj["Value"]= events[j].key+" :- "+events[j].value ;
		                			 }
		                			$scope.inputDisplay.push(obj) ;
		                		 }
		                	}else{
		                		var obj1 ={};
		                		obj1["Label"]= $scope.inputnext[i].Label ;
		                		obj1["Value"]= $scope.inputnext[i].Value ; 
		                		$scope.inputDisplay.push(obj1) ;
		                	}
		                }
		    			
						//end loading animation	
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
		
		
		   $scope.licreateruledetails = 'active';
		    $scope.ruledetails = true;
		    $scope.rulesource = false;
		    $scope.ruleinput = false;
		    $scope.ruleoutput = false;
            $scope.rulethd = false;
		    $scope.ruleresponse = false;
		
	};
	
	
/*------------------------*/
	//relation table event click output
	$scope.uscaserelationclick=function(usecrule){
		//hide rule details table
		$scope.ruletable=false;
		//starting loading animation
		$rootScope.loadinganimation=true;
		//hide error element
		$scope.errorrelationsearch=false;
		var datasurr = usecrule.usecase_surr_id;
		
		$scope.useCaseNo = usecrule.usecase_id;
		$scope.useCaseName = usecrule.usecase_name;
		
		//$scope.usecaseSummary = "Relationships for Use Case # :  "+usecrule.usecase_id+"  Use Case Name : "+usecrule.usecase_name;


		ApiServicerule.usecaseRuleRelationships(datasurr).success(function(output)
		    	{		//ending loading animation
						$rootScope.loadinganimation=false;
						//view relation table
						$scope.rulerelationtable=true;
				
						//fill data in the relationship table
					
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
									regulatorytree = regulatorytree + "</a>" + "</br>" + "<a data-toggle='tooltip' data-placement='left' title=\'" + tooltip1 +"\' tooltip-placement='left'>" + "<strong>" + "(" + regcatall[i+1].reg_cat_name + ")" + "</strong>" + "-" + regcatall[i+1].reg_pub_name  + "<strong>"+ "::"  + "</strong>"+ regcatall[i+1].reg_cntrl_name;
								}
							}
							
							 var elem = document.getElementById('regcatallin');
							 if(typeof elem !== 'undefined' && elem !== null) {
								  document.getElementById('regcatallin').innerHTML = regulatorytree;
							 }
						}
						
					//	document.getElementById('regcatallin').innerHTML = regulatorytree;
						//
						
						
		    			$scope.threatcategory = output.uc_threat_category;
		    			$scope.essentialpractice = output.essential_practice;
		    			$scope.industry = output.industry;
		    			$scope.uccategory = output.uc_category;
		    			$scope.ucsubcategory = output.uc_subcategory;
		    			$scope.ucrules = output.uc_rules;
						
		    	}).error(function (error) {
		    		//ending loading animation
		    		$rootScope.loadinganimation=false;
		    		//show error element
		    		$scope.errorrelationsearch=true;
		    		//show error messege
		    		//$scope.relationsearchbottom=error.ErrMsg;
		    		$scope.relationsearchbottom="There is some problem as reported by the backend. Please contact the administrator";
	     	});
		
	};	
	
/*------------------------*/
	
	
	
	
	
	/*---------------------------------------*/
	
	
	
    $scope.licreateruledetails = 'active';
    $scope.ruledetails = true;
    $scope.rulesource = false;
    $scope.ruleinput = false;
    $scope.ruleoutput = false;
    $scope.rulethd = false; 
    $scope.ruleresponse = false;
    
    $scope.lidetails = function() {
        $scope.licreateruledetails = 'active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreaterulethd = 'no-active';
        $scope.licreateruleresponse = 'no-active';
        $scope.ruledetails = true;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleoutput = false;
        $scope.rulethd = false;
        $scope.ruleresponse = false;
     

    }
    $scope.liinput = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreaterulethd = 'no-active';
        $scope.licreateruleresponse = 'no-active';
        $scope.ruledetails = false;
        $scope.rulesource = true;
        $scope.ruleinput = false;
        $scope.ruleoutput = false;
        $scope.rulethd = false;
        $scope.ruleresponse = false;
    }
    
    $scope.liinputdata = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreaterulethd = 'no-active'; 
        $scope.licreateruleresponse = 'no-active';
        $scope.ruledetails = false;
        $scope.rulesource = false;
        $scope.ruleinput = true;
        $scope.ruleoutput = false;
        $scope.rulethd = false; 
        $scope.ruleresponse = false;
    }
    
    $scope.lioutput = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'active';
        $scope.licreaterulethd = 'no-active';
        $scope.licreateruleresponse = 'no-active';
        $scope.ruledetails = false;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleoutput = true;
        $scope.rulethd = false;
        $scope.ruleresponse = false;
    }
    
    $scope.lithd = function() {
	$scope.licreateruledetails = 'no-active';
	$scope.licreateruleinput = 'no-active';
	$scope.licreateruleinputdata = 'no-active';
	$scope.licreaterulelog = 'no-active';
	$scope.licreateruleoutput = 'no-active';
	$scope.licreaterulethd = 'active';
	$scope.licreateruleresponse = 'no-active';
	$scope.ruledetails = false;
	$scope.rulesource = false;
	$scope.ruleinput = false;
	$scope.ruleoutput = false;
    $scope.rulethd = true;
	$scope.ruleresponse = false;
      
 }		

    
    $scope.liresponse = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreaterulethd = 'no-active';
        $scope.licreateruleresponse = 'active';
        $scope.ruledetails = false;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleoutput = false;
        $scope.rulethd = true;
        $scope.ruleresponse = true;
    }
	
	
	
	/*---------------------------------------*/
	
	//export Rulefiles code

    
	  var rulefiles = [];
	    $scope.exportpres = function($index, filenameQ, rulesuid, stat){
	  	  var fileObj ={};

	    fileObj["index"] = $index;
	    fileObj["filename"] = filenameQ;
  	fileObj["file_surr_id"] = rulesuid;
  if(stat == true){
	    	rulefiles.push(fileObj);
	    }
 	if(stat == false){// means found so pop it 
 		
	    	for(var i=0;i<rulefiles.length;i++){
	    		var tryind = rulefiles[i].index;
	    		if(tryind == $index){
	    			rulefiles.splice(i, 1);
	    		}
	    	}
	    }
	    console.log(rulefiles);
	    }
  
  var mm;
  $scope.$watch(function () {
  	angular.element(".ruleexport").each(function() {
  		mm = angular.element(this).is(':checked') ? 1 : 0;
  		if(mm == 1){
  	        return false;
  		}
  	});
  });
  
  $scope.exportFilesRulepg = function() {
  	for (var i = 0; i < rulefiles.length; i++) {
  	    delete rulefiles[i].index;
  	}
      $scope.rulepaexpochk = false;
      angular.element(".ruleexport").attr('checked', false);
      
  	var postJson = {
  		    "user_surr_id": $rootScope.surrId,
  		    "company_surrId": $rootScope.compSurrId,
  		    "rulefiles": rulefiles
  		};
		if(mm == 1)
		{
	    	//loading animation
	        $rootScope.loadinganimation = true;
	        //

	    	var resultURL = $rootScope.url+"/downloadzip";
	        
	        $http({
	            url : resultURL,
	            method : 'POST',
	            headers : {
	                'Content-type' : 'application/json',
	            },
	            data:JSON.stringify(postJson),
	            responseType : 'arraybuffer'
	        }).success(function(data, status, headers, config) {
	        	rulefiles = [];
	            var file = new Blob([ data ], {
	                type : 'application/zip'
	            });
	            //trick to download store a file having its URL
	            if (navigator.msSaveBlob) { // IE 10+
	            	navigator.msSaveBlob(file, "Rulefiles.zip");
	            	    } else {
	            var fileURL = URL.createObjectURL(file);
	            var a         = document.createElement('a');
	            a.href        = fileURL; 
	            a.target      = '_blank';
	            a.download    = 'Rulefiles.zip';
	            document.body.appendChild(a);
	            a.click();
	            a.parentNode.removeChild(a);
      	    }
	            $rootScope.loadinganimation = false;
	        }).error(function(data, status, headers, config) {
	        	rulefiles = [];
	            postJson.rulefiles = [];
	            $scope.rulepaexpochk = false;
	            $rootScope.loadinganimation = false;
	            alert("no files found on server for this rule");
	        });
      
  }
      
		else{
			alert("Please select at least one file to export");
			$scope.rulepaexpochk = false;
		}
      
      
    };
    //
	
	
    	    	
}]);
    	    
    app.service('ApiServicerule', ['$http','$rootScope',
    	        function ($http, $rootScope) {
    			//service for rule table
    	        this.getNameOrId=function (namefillrule,idfillrule,userruleloginsurrid) {
    	         var promisename = $http.get($rootScope.url+'/searchUseCasebyUCRuleIdOrName/'+ userruleloginsurrid + '/' + idfillrule + '/' + namefillrule ) .success(function(responsename) {
    	         return responsename.data;
    	       	}).error(function (errordata) {
      	       		return errordata;
      	     	});
    	     	return promisename;
    	    	};
    	        
    	    	//service for rule bottom pan tab
    	        this.usecaseRelationships=function (usecaseruleid) {
       	         var promise2 = $http.get($rootScope.url+'/getRuleSearchResult/' + usecaseruleid) .success(function(response2) {
       	         return response2.data;
       	       	}).error(function (errordata) {
      	       		return errordata;
      	     	});
       	     	return promise2;
       	    	}
    	        
    	    	//service for relationship table
    	        this.usecaseRuleRelationships=function (datasurr) {
          	         var promise3 = $http.get($rootScope.url+'/getUseCaseRelationship/' + datasurr).success(function(response3) {
          	         return response3.data;
          	       	}).error(function (errordata) {
          	       		return errordata;
          	     	});
          	     	return promise3;
          	    	}
    	        
    		}
]);
 
    
    
