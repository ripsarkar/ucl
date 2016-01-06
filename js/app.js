(function () {
    'use strict';
    
    angular
        .module('app', ['ngCookies','ui.router','ui.bootstrap'])
        .config(function($stateProvider, $urlRouterProvider) {
    	  // For any unmatched url, redirect to /login
    	  $urlRouterProvider.otherwise("/home");
    	  // Now set up the states
    	  $stateProvider
    	    .state('home', {
    	      url: "/home",
    	      templateUrl: "html/home.html",
            //  controller: 'HomeController',
             autoActivateChild: 'home.search'
    	    })
    	     .state("home.search", {
    	      url:"/search",
              controller: 'searchController',
              templateUrl: "html/search.html",
    	    })
    	    .state('login', {
    	      url: "/login",
    	      templateUrl: "login.html",
    	      controller: 'LoginController'
            //  controllerAs: 'vm'
    	    })
    	    .state('register', {
    	      url: "/register",
    	      templateUrl: "html/reg.html",
    	      controller:'RegisterController',
    	    })
          .state('home.createusecase',{
                url:"/createusecase",
                templateUrl:"html/createusecase.html"
            })
            .state('home.createReg',{
                url:"/createReg",
                templateUrl:"html/createReg.html"
            })
            .state('home.createrule',{
                url:"/createrule",
                templateUrl:"html/createrule.html"
            })
            .state("home.uamanagement", {
    	      url:"/uamanagement",
              templateUrl: "html/uamanagement.html",
              controller:'uamanagement'
    	    })
            .state("home.updateUsecase", {
    	      url:"/updateUsecase",
              templateUrl: "html/updateUsecase.html"
    	    })
            .state("home.updateReg", {
    	      url:"/updateReg",
              templateUrl: "html/updateReg.html"
    	    })
            .state("home.updateRule", {
    	      url:"/updateRule",
              templateUrl: "html/updateRule.html"
    	    })
            .state("home.feedback", {
    	      url:"/feedback",
              //controller:'feedbackController',
              templateUrl: "html/feedback.html"
    	    })
    	    .state("home.viewfeedback", {
    	      url:"/viewfeedback",
              //controller:'viewfeedbackController',
              templateUrl: "html/viewfeedback.html"
    	    });
    	    })
        .run(run);


    
    
    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
    	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    	    if(toState && toState.params && toState.params.autoActivateChild){
    	        $state.go(toState.params.autoActivateChild);
    	    }
    	});
    	
        // keep user logged in after page refresh
//        $rootScope.globals = $cookieStore.get('globals') || {};
//        if ($rootScope.globals.currentUser) {
//            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
//        }

//        $rootScope.$on('$locationChangeStart', function (event, next, current) {
//            // redirect to login page if not logged in and trying to access a restricted page
//            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
//            var loggedIn = $rootScope.globals.currentUser;
//            if (restrictedPage && !loggedIn) {
//                $location.path('/login');
//            }
//        });
    	
    	
      
        /**
         * change the value of $rootscope.url for 
         * pointing to different db
         */
       
        // test db url
       //  $rootScope.url = 'http://ucsrinternaltest.mybluemix.net';
        
        // main db url
         //$rootScope.url = 'http://ucsr.mybluemix.net';
        
        //dev url
       // $rootScope.url = 'http://uclapimain.mybluemix.net';
        
        
        // UAT test url       
        // $rootScope.url = 'http://uclapireleasetwo.mybluemix.net';
        
        // UAT test url       
        $rootScope.url = 'https://uclapistage.mybluemix.net';
         
  //    $location.path('/login');
  	//  initController();
  	 
        

   	 
  	
    }

})();
