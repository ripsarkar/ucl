app.controller("feedbackController", ["$scope", "$rootScope", "$state", '$http', '$modal', 'feedback_model', '$filter',
    function($scope, $rootScope, $state, $http, $modal, feedback_model, $filter) {

        $scope.cmpyId = localStorage.getItem("cmpyId");
        $scope.usrId = localStorage.getItem("surrrip");
        //$scope.rulesPckg='';

        $scope.currentPage = 0;
        $scope.pageSize = 10;
        //$scope.data = [];
        $scope.pgnation = function() {
            if (typeof $scope.rulesPckg != 'undefined' && $scope.rulesPckg.length > 0) {
                $scope.numberOfPages = function() {
                    return Math.ceil($scope.rulesPckg.length / $scope.pageSize);
                };
            }
        };
        $rootScope.dataUpdated = false;
        $scope.$watch(function() {
            if ($rootScope.dataUpdated) {
                $rootScope.dataUpdated = false;
                $scope.pageLoad();
            }
        });


        $scope.pageLoad = function() {
            $rootScope.loadinganimation = true;

            $http.get($rootScope.url + '/getRulePkgExportData/' + $scope.cmpyId).success(function(data, status, headers, config) {
                if (typeof data.Usecase != 'undefined' && data.Usecase.length > 0) {
                    var fbrule = data.Usecase;
                    var fb_tb = [];
                    for (var i = 0; i < fbrule.length; i++) {
                        for (var j = 0; j < fbrule[i].Rule.length; j++) {
                            var fbruledata = {};
                            if (j == 0) {
                                fbruledata.id_label = fbrule[i].id;
                                fbruledata.name = fbrule[i].name;
                                fbruledata.ucId = fbrule[i].id;
                                fbruledata.ucName = fbrule[i].name;
                                fbruledata.ruleid = fbrule[i].Rule[j].id;
                                fbruledata.ruleid_label = fbrule[i].Rule[j].id_label;
                                fbruledata.rulename = fbrule[i].Rule[j].name;
                                fbruledata.ruleoob_flag = fbrule[i].Rule[j].oob_flag;
                                fbruledata.ruleclient_rule_id = fbrule[i].Rule[j].client_rule_id;
                                fbruledata.ruleclient_rule_name = fbrule[i].Rule[j].client_rule_name;
                                fbruledata.rulerule_impl_percent = fbrule[i].Rule[j].rule_impl_percent;

                                fb_tb.push(fbruledata);
                            } else {
                                fbruledata.id_label = "";
                                fbruledata.name = "";
                                fbruledata.ucId = fbrule[i].id;
                                fbruledata.ucName = fbrule[i].name;
                                fbruledata.ruleid = fbrule[i].Rule[j].id;
                                fbruledata.ruleid_label = fbrule[i].Rule[j].id_label;
                                fbruledata.rulename = fbrule[i].Rule[j].name;
                                fbruledata.ruleoob_flag = fbrule[i].Rule[j].oob_flag;
                                fbruledata.ruleclient_rule_id = fbrule[i].Rule[j].client_rule_id;
                                fbruledata.ruleclient_rule_name = fbrule[i].Rule[j].client_rule_name;
                                fbruledata.rulerule_impl_percent = fbrule[i].Rule[j].rule_impl_percent;
                                fb_tb.push(fbruledata);
                            }
                        }
                    }

                    $scope.rulesPckg = fb_tb;
                    //console.log(JSON.stringify($scope.rulesPckg));
                    $scope.pgnation();
                    $rootScope.loadinganimation = false;

                } else {
                    alert("Sorry data not found");
                    $rootScope.loadinganimation = false;
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert("Technical Error.Please contact administrator for further details");
            });

        };

        $scope.pageLoad();
        $scope.feedbackForm = function(id, fdlabel, fdname, index) {
            var fb_id = {
                fdlabel: fdlabel,
                fdname: fdname,
                id: id,
                index: index
            };
            //console.log(JSON.stringify(fb_id));
            feedback_model.setfbModal_data(fb_id);
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: 'lg'
            });
        };

        $scope.sort = {
            column: '',
            descending: false
        };
        $scope.changeSorting = function(column) {
            var sort = $scope.sort;
            if (sort.column == column) {
                sort.descending = !sort.descending;
            } else {
                sort.column = column;
                sort.descending = false;
            }
        };

        $scope.goTofeedback = function() {
            $state.go("home.feedback");
        }
        $scope.goToviewfeedback = function() {
            $state.go("home.viewfeedback");
        }

    }
]);

app.service('feedback_model', ['$http', '$rootScope',
    function($http, $rootScope) {
        var fbchk = this;
        var fbModal_data = null;

        fbchk.getfbModal_data = function() {
            return fbModal_data;
        };

        fbchk.setfbModal_data = function(data) {
            fbModal_data = data;
        };

    }
]);

app.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', '$rootScope', '$state', '$http', 'feedback_model', '$filter',
    function($scope, $modalInstance, $rootScope, $state, $http, feedback_model, $filter) {

        /*fdlabel :$scope.fdlabel;
          fdname :$scope.fdname;
          id :$scope.ucruleid;*/
        
        $scope.usrId = localStorage.getItem("surrrip");
        var fdmodeldata = feedback_model.getfbModal_data();
        $scope.size = 'lg';
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
            $scope.startTime = $filter('date')(new Date(), 'HH:mm:ss');

        };
        $scope.onchangeStartDate = function() {
            var stDate = $filter('date')($scope.startdt, 'yyyy-MM-dd');
            $scope.startdt = stDate + " " + $scope.startTime;
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[2];
        
        $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();

      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();

        $scope.Upopen = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.Upopened = true;
            $scope.updateTime = $filter('date')(new Date(), 'HH:mm:ss');
        };

        $scope.onchangeUpdtDate = function() {
            var updDate = $filter('date')($scope.updatedt, 'yyyy-MM-dd');
            $scope.updatedt = updDate + " " + $scope.updateTime;

        };

        $scope.feedbackFrm = {
            impstrtdate: "",
            orgruleid: "",
            orgrulename: "",
            impuptdate: "",
            Implper: "",
            fedbckcomments: ""
        };
        $scope.ucruleid = "";

        $scope.feedbackForm = function(id, fdlabel, fdname, index) {
            $rootScope.loadinganimation = true;

            $scope.fdlabel = fdlabel;
            $scope.fdname = fdname;
            $scope.ucruleid = id;
            $scope.index = index;
            //console.log(id);
            if (id != null && typeof id != 'undefined') {
                $http.get($rootScope.url + '/getFeedbackData/' + id).success(function(data, status, headers, config) {
                    $rootScope.loadinganimation = false;
                    //console.log(JSON.stringify(data));
                    if (typeof data.rulesFeedbackData != 'undefined' && data.rulesFeedbackData.length > 0) {
                        $scope.feedbackdetails = data.rulesFeedbackData;
                        var pcklists = $scope.feedbackdetails[0].DownloadedRules;
                        var fbformId = $scope.feedbackdetails[0].usecase_rule_id;
                        if (typeof pcklists != 'undefined' && pcklists.length > 0) {
                            $scope.feedbackFrm.pcklists = pcklists;
                        } else {
                            $scope.pcklists = [];
                        }
                        if (fbformId != "" && fbformId != null && $scope.feedbackdetails[0].client_rule_id != null && typeof fbformId != 'undefined') {

                            var stDt = $scope.feedbackdetails[0].uc_rule_impl_start_dt;
                            $scope.startdt = stDt.split(' ')[0] + " " + stDt.split(' ')[1];

                            var upDt = $scope.feedbackdetails[0].uc_rule_impl_updt_dt;
                            //$scope.updatedt = upDt.split(' ')[0] + " " + upDt.split(' ')[1];

                            $scope.feedbackFrm.orgruleid = $scope.feedbackdetails[0].client_rule_id;
                            $scope.feedbackFrm.orgrulename = $scope.feedbackdetails[0].client_rule_name;

                            //$scope.feedbackFrm.Implper = $scope.feedbackdetails[0].rule_impl_percent.toString();
                            //$scope.feedbackFrm.fedbckcomments = $scope.feedbackdetails[0].client_rule_comment;
                        } else {
                            $scope.feedbackFrm.impstrtdate = "";
                            $scope.feedbackFrm.orgruleid = "";
                            $scope.feedbackFrm.orgrulename = "";
                            $scope.feedbackFrm.impuptdate = "";
                            $scope.feedbackFrm.Implper = "";
                            $scope.feedbackFrm.fedbckcomments = "";
                        }

                    } else {
                        alert("Sorry data not found");
                    }
                }).error(function(data, status, headers, config) {
                    alert("Error loading data.Please contact administrator for further details");
                    $scope.feedbackFrm.impstrtdate = "";
                    $scope.feedbackFrm.orgruleid = "";
                    $scope.feedbackFrm.orgrulename = "";
                    $scope.feedbackFrm.impuptdate = "";
                    $scope.feedbackFrm.Implper = "";
                    $scope.feedbackFrm.fedbckcomments = "";
                });
            } else {
                $scope.feedbackFrm.impstrtdate = "";
                $scope.feedbackFrm.orgruleid = "";
                $scope.feedbackFrm.orgrulename = "";
                $scope.feedbackFrm.impuptdate = "";
                $scope.feedbackFrm.Implper = "";
                $scope.feedbackFrm.fedbckcomments = "";
            }
        };

        $scope.feedbackForm(fdmodeldata.id, fdmodeldata.fdlabel, fdmodeldata.fdname);



        $scope.feedbacksubmit = function(id) {
            $rootScope.loadinganimation = true;
            $scope.validation = false;
            var stdt = true;
            var updt = true;

            /*if ($scope.updatedt == undefined || $scope.updatedt == '') {
                alert('Please enter a valid update date');
                $scope.validation = false;
            } else {
                $scope.validation = true;
                stdt = true;
            }
            if ($scope.startdt == undefined || $scope.startdt == '') {
                alert('Please enter a valid start date');
                $scope.validation = false;
            } else {
                $scope.validation = true;
                updt = true;
                
            }*/

            $scope.feedbackFrm.impstrtdate = $scope.startdt;
            $scope.feedbackFrm.impupdate = $scope.updatedt;

            //console.log("chck1 : "+$scope.validation);
            if (stdt && updt) {
                //console.log("chck : "+$scope.validation);
                stdt = false;
                updt = false;
                if ($scope.feedbackFrm.impupdate < $scope.feedbackFrm.impstrtdate || $scope.feedbackFrm.Implper == undefined || $scope.feedbackFrm.Implper == '' || $scope.updatedt == undefined || $scope.updatedt == '' || $scope.startdt == undefined || $scope.startdt == '') {
                    if($scope.feedbackFrm.impupdate < $scope.feedbackFrm.impstrtdate){
                        alert("Update date time should be greater then start date time");
                    }else if($scope.feedbackFrm.Implper == undefined || $scope.feedbackFrm.Implper == ''){
                        alert("Please provide implementation percentage");
                    }else if($scope.updatedt == undefined || $scope.updatedt == ''){
                        alert('Please provide valid update date');
                    }else if($scope.startdt == undefined || $scope.startdt == ''){
                        alert('Please provide valid start date');
                    }
                    $scope.validation = false;
                    $rootScope.loadinganimation = false;
                } else {
                    $scope.validation = true;
                }
            }

            /*if () {
                alert("Please give implementation percentage");
                $scope.validation = false;
            } else {
                $scope.validation = true;
            }*/
            //console.log("before : "+ $scope.validation);
            
            if ($scope.validation) {
                $scope.validation = false;
                $scope.PostJson_feedback = {
                    ucrulesurrid: $scope.ucruleid,
                    clientucruleid: $scope.feedbackFrm.orgruleid,
                    clientucrulename: $scope.feedbackFrm.orgrulename,
                    clientucruleimplStartDate: $scope.feedbackFrm.impstrtdate,
                    clientucruleimplUpdtDate: $scope.feedbackFrm.impupdate,
                    clientucruleimplpercent: $scope.feedbackFrm.Implper,
                    clientcomments: $scope.feedbackFrm.fedbckcomments,
                    usersurrid: $scope.usrId
                }
                $http.post($rootScope.url + '/saveFeedbackDetails/', $scope.PostJson_feedback).success(function(data, status, headers, config) {
                    $rootScope.loadinganimation = false;
                    $rootScope.dataUpdated = true;
                    $scope.startdt = "";
                    $scope.updatedt = "";
                    $scope.ucruleid = "";
                    $scope.feedbackFrm.orgruleid = "";
                    $scope.feedbackFrm.orgrulename = "";
                    $scope.feedbackFrm.impupdate = "";
                    $scope.feedbackFrm.Implper = " ";
                    $scope.feedbackFrm.fedbckcomments = "";
                    //$("#myModal").modal("hide");
                    $scope.cancel();
                    alert("Package Rule feedback saved successfully");
                    $state.go($state.current, {}, {reload: true});
                }).error(function(data, status, headers, config) {
                    //  alert(data);
                    $scope.startdt = "";
                    $scope.updatedt = "";
                    $scope.ucruleid = "";
                    if ($scope.feedbackFrm != undefined) {
                        $scope.feedbackFrm.orgruleid = "";
                        $scope.feedbackFrm.orgrulename = "";
                        $scope.feedbackFrm.impupdate = "";
                        $scope.feedbackFrm.Implper = "";
                        $scope.feedbackFrm.fedbckcomments = "";
                    }
                    //$("#myModal").modal("hide");
                    $scope.cancel();
                    alert(data.ErrMsg);
                });

            }

        }
        $scope.feedbacksubmitchck = function(id) {
            console.log("entered");

        }
    }
]);



app.controller("viewfeedbackController", ["$scope", "$rootScope", "$state", '$http', '$modal', 'feedback_model', '$filter',
    function($scope, $rootScope, $state, $http, $modal, feedback_model, $filter) {

        $scope.cmpyId = localStorage.getItem("cmpyId");
        $scope.usrId = localStorage.getItem("surrrip");
        //$scope.rulesPckg='';

        //console.log($rootScope.role);
        $scope.currentPage = 0;
        $scope.pageSize = 20;
        //$scope.data = [];
        $scope.pgnation = function() {
        
            if (typeof $scope.vfbPckg != 'undefined' && $scope.vfbPckg.length > 0) {
                $scope.numberOfPages = function() {
                    return Math.ceil($scope.vfbPckg.length / $scope.pageSize);
                };
            }
        };
        $rootScope.dataUpdated = false;
        $scope.$watch(function() {
            if ($rootScope.dataUpdated) {
                $rootScope.dataUpdated = false;
                $scope.pageLoad();
            }
        });


        $scope.vfbPckg = null;
        $scope.vfb_tb = [];
        $scope.vfbdataPckg = [];
        /*   $scope.chkhdata =function(){
       for (var i = 0; i < $scope.vfbPckg.length; i++) {
           $scope.vfbdataPckg.push($scope.vfbPckg[i].cmpyname);
       }
        var names = $scope.vfbdataPckg;
        var uniq = names.reduce(function(a,b){
            if (a.indexOf(b) < 0 ) a.push(b);
            return a;
          },[]);
        //$scope.vfbselPckg.length=0;
        $scope.vfbselPckg = uniq;

   }*/

        
        $scope.cpmysurrid = function() {
            var URLviewpage = $rootScope.url+'/getCompany';
            $http.get(URLviewpage).success(function(data, status, headers, config) {
                if ($rootScope.role == "ADMIN") {
                    var chckall = {
                        "id": 'adm',
                        "name": "All"
                    };
                    data.Company.unshift(chckall);
                    $scope.vfbselPckg = data.Company;
                    $scope.orgName = 'adm';
                }
            }).error(function(data, status, headers, config) {
                alert("Please contact your adminstrator");
            });
        }

        $scope.cpmysurrid();
        $scope.orgName = 'adm';
        var URLviewpage = null;
        var viewPagedata = $rootScope.url+'/viewFeedbackData/';
        if ($rootScope.role == "ADMIN") {
            URLviewpage = viewPagedata + $scope.orgName;
            $scope.all_org = true;
        } else {
            URLviewpage = viewPagedata + $scope.cmpyId;
            $scope.all_org = false;
        }
        $scope.pageLoad = function() {
            $rootScope.loadinganimation = true;
            var vfb = null;
            $http.get(URLviewpage).success(function(data, status, headers, config) {
            	//console.log(JSON.stringify(data));
                if (typeof data.rulesFeedbackData != 'undefined' && data.rulesFeedbackData.length > 0) {
                    vfb = data.rulesFeedbackData;
                    $scope.vfb_tb.length = 0;
                    $scope.vfbPckg = null;
                    for (var i = 0; i < vfb.length; i++) {
                        var vfbdata = {};
                            vfbdata.company_name = vfb[i].company_name;
                            vfbdata.cmpyname = vfb[i].company_name;
                            vfbdata.usecase_id = vfb[i].usecase_id;
                            vfbdata.usecase_name = vfb[i].usecase_name;
                            vfbdata.usecase_rule_id = vfb[i].usecase_rule_id;
                            vfbdata.usecase_rule_name = vfb[i].usecase_rule_name;
                            vfbdata.oob_flag = vfb[i].oob_flag;
                            vfbdata.client_rule_id = vfb[i].client_rule_id;
                            vfbdata.client_rule_name = vfb[i].client_rule_name;
                            vfbdata.rule_impl_percent = vfb[i].rule_impl_percent;
                            vfbdata.rule_impl_date_time = vfb[i].rule_impl_date_time;
                            vfbdata.client_rule_comment = vfb[i].client_rule_comment;
                            vfbdata.username = vfb[i].username;
                            $scope.vfb_tb.push(vfbdata);

                    }

                    $scope.vfbPckg = $scope.vfb_tb;
                    $scope.pgnation();
                    $rootScope.loadinganimation = false;

                } else {
                    alert("Sorry data not found");
                    $rootScope.loadinganimation = false;
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert("Technical Error.Please contact administrator for further details");
            });
        };


        $scope.vfbvdata = [];

        $scope.orgcmpname = function() {
        	 $scope.currentPage = 0;
             $scope.pageSize = 20;
            $scope.cmpyId = $scope.orgName;
            $scope.viewExceldownload  = $rootScope.url+'/downloadViewFeedbackData/';
            if ($rootScope.role == "ADMIN") {
                URLviewpage = viewPagedata + $scope.orgName;
                $scope.viewExceldownload = $scope.viewExceldownload + $scope.orgName;
                $scope.all_org = true;
            } else {
                URLviewpage = viewPagedata + $scope.cmpyId;
                $scope.viewExceldownload = $scope.viewExceldownload + $scope.cmpyId;
                $scope.all_org = false;
            }
            $scope.pageLoad();
        }


        $scope.pageLoad();
        $scope.sort = {
            column: '',
            descending: false
        };
        $scope.changeSorting = function(column) {
            var sort = $scope.sort;
            if (sort.column == column) {
                sort.descending = !sort.descending;
            } else {
                sort.column = column;
                sort.descending = false;
            }
        };


        $scope.goTofeedback = function() {
            $state.go("home.feedback");
        }
        $scope.goToviewfeedback = function() {
            $state.go("home.viewfeedback");
        }

        $scope.viewExceldownload  = $rootScope.url+'/downloadViewFeedbackData/';
        if ($rootScope.role == "ADMIN") {
        $scope.viewExceldownload = $scope.viewExceldownload + $scope.orgName;
        //console.log("admin : "+$scope.viewExceldownload);
        } else {
        $scope.viewExceldownload = $scope.viewExceldownload + $scope.cmpyId;
        //console.log("compId : "+ $scope.viewExceldownload);
        }
        
        $scope.clickOnExport = function() {
            document.getElementById('exporttoexcel').click();
            console.clear();
        };
    
    }]);


app.filter('startFrom', function() {
    return function(input, start) {
        start = +start;
        console.clear();
        if (typeof input != 'undefined') {
            return input.slice(start);
        }
    };
});
