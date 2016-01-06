
    	    
    	app.service('SearchResultService', ['$http','$rootScope',
    	                                     function ($http, $rootScope) {
    		//alert("ffffffffff"+$rootScope.url)
    	    	 
    	        this.getRuleSearchResult=function (data) {
    	        var promise = $http.get($rootScope.url+'/getRuleSearchResult/'+data) .then(function(response) {
    	      	 //var promise = $http.get('data/result.json') .then(function(response) {
    	        		
    	         return response.data;
    	       	}, function (error) {
    	         //error
    	     	})
    	     	return promise;
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