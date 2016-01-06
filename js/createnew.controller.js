app.service("UsecaseService", function() {
    var instance = this;
    var Usecasecrtdata = '';
    var UpdateUsecase = '';
    var UpdataUsedata = '';
    var indsty = '';
    var Updtindsty = '';

    instance.getUsecasecrtdata = function() {
        return Usecasecrtdata;
    };
    instance.getUpdateUsecase = function() {
        return UpdateUsecase;
    };
    instance.getUpdataUsedata = function() {
        return UpdataUsedata;
    };
    instance.getindsty = function() {
        return indsty;
    };
    instance.getUpdtindsty = function() {
        return Updtindsty;
    };

    instance.setUpdtindsty = function(data) {
        Updtindsty = data;
    };
    instance.setindsty = function(data) {
        indsty = data;
    };
    instance.setUsecasecrtdata = function(data) {
        Usecasecrtdata = data;
    };
    instance.setUpdateUsecase = function(data) {
        UpdateUsecase = data;
    };
    instance.setUpdataUsedata = function(data) {
        UpdataUsedata = data;
    };

});


app.controller("UsecaseCtrlController", ["$scope", "$rootScope", "$state", "$http", 'UsecaseService', function($scope, $rootScope, $state, $http, UsecaseService) {


    $scope.pagemain = {
        main: true,
        usecase: false,
        rule: false
    }

    $scope.pageUsecase = function() {
        $scope.pagemain = {
            main: false,
            usecase: true,
            rule: false
        }
    }
    $scope.pageRule = function() {
        $scope.pagemain = {
            main: false,
            usecase: false,
            rule: true
        }
    }
    $rootScope.loadinganimation = true;
    $http.get($rootScope.url + '/populateCyberFuncDropDown').success(function(data, status, headers, config) {
        if (typeof data.CyberFunc != 'undefined' && data.CyberFunc.length != 0) {
            $rootScope.loadinganimation = false;
            $scope.UsecaseFramework = data.CyberFunc;
        } else {
            $rootScope.loadinganimation = false;
            alert("Sorry no data found");
            $scope.UsecaseFramework = [];
        }
    }).error(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        alert('Sorry Application error in serverside');
    });

    $scope.frameWorkUsecase = function() {
        $rootScope.loadinganimation = true;
        if ($scope.frameWork != '') {
            $http.get($rootScope.url + '/populateUseCaseCatDropdown/' + $scope.frameWork).success(function(data, status, headers, config) {
                if (typeof data.UseCaseCat != 'undefined' && data.UseCaseCat.length != 0) {
                    $scope.UsecaseCatgs = data.UseCaseCat;
                    $scope.useCaseSubcat = [];
                    $rootScope.loadinganimation = false;
                } else {
                    $rootScope.loadinganimation = false;
                    alert("Sorry no data found");
                    $scope.UsecaseCatgs = [];
                    $scope.useCaseSubcat = [];
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');

            });
        }
    }

    $scope.UsecaseCatgChange = function() {
        $rootScope.loadinganimation = true;
        if ($scope.useCaseCat != '') {
            $http.get($rootScope.url + '/populateUcSubCatFrmCatIdDropDown/' + $scope.useCaseCat).success(function(data, status, headers, config) {
                if (typeof data.SubCat != 'undefined' && data.SubCat.length != 0) {
                    $scope.useCaseSubcatdatas = data.SubCat;
                    $rootScope.loadinganimation = false;
                } else {
                    $rootScope.loadinganimation = false;
                    alert("Sorry, No data found");
                    $scope.useCaseSubcatdatas = [];
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');
            });
        }
    }

    $http.get($rootScope.url + '/populateEPIndutry').success(function(data, status, headers, config) {
        if (typeof data.industry != 'undefined' && data.industry.length != 0) {
            $rootScope.loadinganimation = false;
            //$scope.EPdatas = data.EP;
            $scope.industrydatas = data.industry;
        } else {
            $rootScope.loadinganimation = false;
            //$scope.EPdatas = [];
            $scope.industrydatas = [];
            alert('Sorry Application error in serverside');
        }
    }).error(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        alert('Sorry Application error in serverside');
    });


    var Indtsyarray = [];
    $scope.reSet = function() {
        $scope.frameWork = '';
        $scope.useCaseCat = '';
        $scope.useCaseSubcat = '';
        if (typeof $scope.UsecaseIntry != 'undefined' && $scope.UsecaseIntry.length > 0) {
            $scope.UsecaseIntry.length = 0;
            Indtsyarray.length = 0;
        }
    }

    $scope.chckindustry = function() {
        if (typeof $scope.UsecaseIntry != 'undefined' && $scope.UsecaseIntry.length > 0) {
            for (var i = 0; i < $scope.UsecaseIntry.length; i++) {
                var Indtsy = {};
                Indtsy.surrId = $scope.UsecaseIntry[i];
                Indtsyarray.push(Indtsy);
            }
        }
    }

    $scope.goTo = function() {
        if (typeof $scope.usecaseDescrip == 'undefined') {
            $scope.usecaseDescrip = "";
        }
        $scope.useCase = {
            id: $scope.usecaseID,
            name: $scope.usecaseName,
            description: $scope.usecaseDescrip,
            cyberFuncSurrId: $scope.frameWork,
            UCCatSurrId: $scope.useCaseCat,
            UCSubCatSurrId: $scope.useCaseSubcat
        };
        UsecaseService.setindsty(Indtsyarray);
        UsecaseService.setUsecasecrtdata($scope.useCase);

        if (typeof $scope.usecaseID != 'undefined' && typeof $scope.usecaseName != 'undefined' && typeof $scope.frameWork != 'undefined' && typeof $scope.useCaseCat != 'undefined' && typeof $scope.useCaseSubcat != 'undefined' && $scope.frameWork != '' && $scope.useCaseCat != '' && $scope.useCaseSubcat != '' && Indtsyarray.length != 0) {
            $state.go("home.createReg");
        } else {
            alert("Please fill all mandatory fields");
        }
    }
}]);

app.controller("UsecaseRegController", ["$scope", "$rootScope", "$state", '$http', 'UsecaseService', function($scope, $rootScope, $state, $http, UsecaseService) {
    $scope.pagemain = {
        main: true,
        usecase: false,
        rule: false
    }

    $scope.pageUsecase = function() {
        $scope.pagemain = {
            main: false,
            usecase: true,
            rule: false
        }
    }

    $scope.pageRule = function() {
        $scope.pagemain = {
            main: false,
            usecase: false,
            rule: true
        }
    }


    $scope.clickReg = function() {
        $scope.tabsusecaseloader = {
            loading: true,
            loaded: false
        }
        $scope.liregactive = 'active';
        $scope.liCapecactive = 'no-active';
    }
    $scope.clickReg();

    $scope.clickCapec = function() {
        $scope.tabsusecaseloader = {
            loading: false,
            loaded: true
        }
        $scope.liregactive = 'no-active';
        $scope.liCapecactive = 'active';
    }

    $scope.reSet = function() {
        $scope.UsecasecapecCat = '';
        $scope.UsecaseMetaAtt = '';
        $scope.UsecaseStrdAtt = '';
        $scope.UsecaseRegcat = '';
        $scope.UsecaseRegPub = '';
        $scope.UsecaseRegCrtl = '';
    }
    $rootScope.loadinganimation = true;
    $http.get($rootScope.url + '/populateEPIndutry').success(function(data, status, headers, config) {
        if (data.EP.length != 0 && data.industry.length != 0 && typeof data.EP != 'undefined' && typeof data.industry != 'undefined') {
            $rootScope.loadinganimation = false;
            $scope.EPdatas = data.EP;
            $scope.industrydatas = data.industry;
        } else {
            $rootScope.loadinganimation = false;
            $scope.EPdatas = [];
            $scope.industrydatas = [];
        }
    }).error(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        alert('Sorry Application error in serverside');

    });

    $http.get($rootScope.url + '/populateRegCatDropDown').success(function(data, status, headers, config) {
        if (data.RegCat.length != 0 && typeof data.RegCat != 'undefined') {
            $scope.RegcatCrtdatas = data.RegCat;
        } else {
            $scope.RegcatCrtdatas = [];
        }
    }).error(function(data, status, headers, config) {
        alert('Sorry Application error in serverside');
    });
    $scope.globalUseCase_data = {};

    $scope.UsecaseRegcat_extch = function() {
        $rootScope.loadinganimation = true;
        if ($scope.UsecaseRegcat != '') {
            $http.get($rootScope.url + '/populateRegPubDropDown/' + $scope.UsecaseRegcat).success(function(data, status, headers, config) {
                if (typeof data.RegPub != 'undefined' && data.RegPub.length != 0) {
                    $rootScope.loadinganimation = false;
                    $scope.RegpubCrtdatas = data.RegPub;
                } else {
                    $rootScope.loadinganimation = false;
                    $scope.RegpubCrtdatas = [];
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');

            });
        }
    };

    $scope.UsecaseRegPub_extch = function() {
        if ($scope.UsecaseRegPub != '') {
            $rootScope.loadinganimation = true;
            $http.get($rootScope.url + '/populateRegCntlDropDown/' + $scope.UsecaseRegPub).success(function(data, status, headers, config) {
                if (typeof data.RegCntl != 'undefined' && data.RegCntl.length != 0) {
                    $rootScope.loadinganimation = false;
                    $scope.RegCrtlCrtdatas = data.RegCntl;
                } else {
                    $rootScope.loadinganimation = false;
                    $scope.RegCrtlCrtdatas = [];
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');

            });
        }
    }

    $scope.UsecaseRegcat_ch = function() {
        if (typeof $scope.RegcatCrtdatas != 'undefined' && $scope.RegcatCrtdatas != "") {
            if ($scope.RegcatCrtdatas.length != 0) {
                for (var i = 0; i < $scope.RegcatCrtdatas.length; i++) {
                    if ($scope.UsecaseRegcat == $scope.RegcatCrtdatas[i].SurrId) {
                        $scope.regCatName = $scope.RegcatCrtdatas[i].Name;
                    };
                }
            }
        }
    }


    $scope.UsecaseRegPub_ch = function() {
        if (typeof $scope.RegpubCrtdatas != 'undefined' && $scope.RegpubCrtdatas != '' && typeof $scope.UsecaseRegPub != 'undefined') {
            if ($scope.RegpubCrtdatas.length != 0) {
                for (var i = 0; i < $scope.RegpubCrtdatas.length; i++) {
                    if ($scope.UsecaseRegPub == $scope.RegpubCrtdatas[i].SurrId) {
                        $scope.regPubName = $scope.RegpubCrtdatas[i].Name;
                    };
                }
            }
        }
    }

    $scope.UsecaseRegCrtl_ch = function() {
        $scope.regCrtlName = [];
        if (typeof $scope.RegCrtlCrtdatas != 'undefined' && $scope.RegCrtlCrtdatas != '' && typeof $scope.UsecaseRegCrtl != 'undefined') {
            if ($scope.RegCrtlCrtdatas.length != 0) {
                for (var i = 0; i < $scope.RegCrtlCrtdatas.length; i++) {
                    for (var j = 0; j < $scope.UsecaseRegCrtl.length; j++) {
                        if ($scope.UsecaseRegCrtl[j] == $scope.RegCrtlCrtdatas[i].SurrId) {
                            $scope.regCrtlName.push($scope.RegCrtlCrtdatas[i].Name);
                        };
                    }
                }
            }
        }
    }

    $scope.RegCrtltables = [];
    $scope.Regcrt_add = function() {
        if ($scope.RegCrtltables.length > 0) {
            for (var k = 0; k < $scope.UsecaseRegCrtl.length; k++) {
                var Regctrltb = {}
                Regctrltb.RegCrtl = [];
                Regctrltb.Regcat = $scope.regCatName;
                Regctrltb.Regcat_SurrId = $scope.UsecaseRegcat;
                Regctrltb.RegPub = $scope.regPubName;
                Regctrltb.RegPub_SurrId = $scope.UsecaseRegPub;
                Regctrltb.RegCrtl = $scope.regCrtlName[k].toString();
                Regctrltb.RegCrtl_SurrId = $scope.UsecaseRegCrtl[k].toString();
                var arr = Regctrltb;
                var count = 0;
                $scope.RegPush_data = function() {
                    if (count == 1) {
                        alert("Record already selected, Please select another value");
                    } else {
                        $scope.RegCrtltables.push(Regctrltb);
                    }
                }
                if ($scope.RegCrtltables.length > 0) {
                    var looparray = $scope.RegCrtltables.length - 1;
                    count = 0;
                    for (var i = 0; i < $scope.RegCrtltables.length; i++) {
                        if ($scope.RegCrtltables[i].Regcat_SurrId == arr.Regcat_SurrId && $scope.RegCrtltables[i].RegPub_SurrId == arr.RegPub_SurrId && $scope.RegCrtltables[i].RegCrtl_SurrId == arr.RegCrtl_SurrId) {
                            count = 1;
                            if (looparray == i) {
                                $scope.RegPush_data();
                                break;
                            }
                        } else {
                            if (looparray == i) {
                                $scope.RegPush_data();
                                break;
                            }
                        }

                    }
                }
            }
        } else {
            for (var k = 0; k < $scope.UsecaseRegCrtl.length; k++) {
                var Regctrltb = {}
                Regctrltb.RegCrtl = [];
                Regctrltb.Regcat = $scope.regCatName;
                var chkRefobj = 0;
                if (typeof $scope.UsecaseRegcat == 'undefined') {
                    chkRefobj = 1;
                } else {
                    Regctrltb.Regcat_SurrId = $scope.UsecaseRegcat;
                }
                Regctrltb.RegPub = $scope.regPubName;
                if (typeof $scope.UsecaseRegPub == 'undefined') {
                    chkRefobj = 1;
                } else {
                    Regctrltb.RegPub_SurrId = $scope.UsecaseRegPub;
                }

                if (typeof $scope.regCrtlName == 'undefined') {
                    chkRefobj = 1;
                } else {
                    Regctrltb.RegCrtl = $scope.regCrtlName[k].toString();
                }

                if (typeof $scope.UsecaseRegCrtl != 'undefined') {
                    Regctrltb.RegCrtl_SurrId = $scope.UsecaseRegCrtl[k].toString();
                } else {
                    chkRefobj = 1;
                }
                if (chkRefobj == 0) {
                    $scope.RegCrtltables.push(Regctrltb);
                } else {
                    alert("All fields are mandatory*");
                }
            }
        }
    }

    $scope.Regtableremove = function(Regtbdata, index) {
        Regtbdata.splice(index, 1);
    }

    $scope.goTo = function() {
        $state.go("home.createrule");
    }

    $scope.UseCaseformSubmit = function() {

        //var Indtsyarray = [];
        var Essptarray = [];
        var CategoryGr = [];
        var ThdCrt = [];

        if (typeof $scope.UsecaseEsseprt != 'undefined' && $scope.UsecaseEsseprt.length > 0) {
            for (var j = 0; j < $scope.UsecaseEsseprt.length; j++) {
                var Esspt = {};
                Esspt.surrId = $scope.UsecaseEsseprt[j];
                Essptarray.push(Esspt);
            }
        }

        if (typeof $scope.RegCrtltables != 'undefined' && $scope.RegCrtltables.length > 0) {
            for (var k = 0; k < $scope.RegCrtltables.length; k++) {
                var RegCrtldat = {};
                RegCrtldat.RegCatSurrId = $scope.RegCrtltables[k].Regcat_SurrId;
                RegCrtldat.RegPubSurrId = $scope.RegCrtltables[k].RegPub_SurrId;
                RegCrtldat.RegCntlSurrId = $scope.RegCrtltables[k].RegCrtl_SurrId;
                CategoryGr.push(RegCrtldat);
            }
        }

        var UsecasePostJson = {
            useCase: UsecaseService.getUsecasecrtdata(),
            industry: UsecaseService.getindsty(),
            EP: Essptarray,
            CategoryGroup: CategoryGr
        }

        if (CategoryGr.length != 0) {
            if (UsecaseService.getUpdateUsecase().SurrId != '' && UsecaseService.getUpdateUsecase().SurrId != 'undefined') {
                $http.post($rootScope.url + '/saveUseCase', UsecasePostJson).success(function(data, status, headers, config) {
                    alert("Uescase Created Successfully ");
                    $scope.goTo();
                }).error(function(data, status, headers, config) {
                    alert("Sorry Application error in serverside");
                });
            } else {
                alert("Please fill all mandatory fields");
                $state.go('home.updateUsecase');
            }

        } else {
            alert("Please fill all mandatory fields");
        }
    }


}]);

app.controller("CreateRuleController", ["$scope", "$rootScope", "$state", '$http', 'UsecaseService', function($scope, $rootScope, $state, $http, UsecaseService) {

	$scope.formcontrolYN = "No";
   
	$scope.chckfunction = function() {
        console.log($scope.crtRuleTrsn);
    }
    

    $scope.pagemain = {
        main: true,
        usecase: false,
        rule: false
    }

    $scope.pageUsecase = function() {
        $scope.pagemain = {
            main: false,
            usecase: true,
            rule: false
        }
    }
    $scope.pageRule = function() {
        $scope.pagemain = {
            main: false,
            usecase: false,
            rule: true
        }
    }

    $scope.assignruledata = function() {
        if (typeof $scope.Rule_data != 'undefined' && $scope.Rule_data != '') {
            $scope.LogSource = $scope.Rule_data.LogSource;
            $scope.dataeventAttr = $scope.Rule_data.EventAttribute;
            $scope.dataReport = $scope.Rule_data.Output;
            $scope.dataDash = $scope.Rule_data.Input;
        }
    }


    var UsecaseIds_livedata;
    $scope.RuleIDlive_search = function() {
        $scope.RuleIds = [];
        if ($scope.SearchRuleID != '' && typeof $scope.SearchRuleID != 'undefined') {
            var RuleIDpost = $scope.SearchRuleID.toUpperCase();
            $http.get($rootScope.url + '/getUseCaseById/' + RuleIDpost).success(function(data, status, headers, config) {
                UsecaseIds_livedata = null;
                UsecaseIds_livedata = data;
                if (data.UseCase.length != 0 && typeof data.UseCase != 'undefined') {
                    for (var i = 0; i < data.UseCase.length; i++) {
                        $scope.RuleIds.push(data.UseCase[i].Id);
                    }
                }
            }).error(function(data, status, headers, config) {
                alert("Sorry, No data found");
            });
        }
    }

    $scope.RuleNamelive_search = function() {
        $scope.RuleNames = [];
        if ($scope.SearchRuleName != '' && typeof $scope.SearchRuleName != 'undefined') {
            var RuleNamepost = $scope.SearchRuleName.toUpperCase();
            $http.get($rootScope.url + '/getUseCaseByNm/' + RuleNamepost).success(function(data, status, headers, config) {
                UsecaseIds_livedata = null;
                UsecaseIds_livedata = data;
                if (data.UseCase.length != 0 && typeof data.UseCase != 'undefined') {
                    for (var i = 0; i < data.UseCase.length; i++) {
                        $scope.RuleNames.push(data.UseCase[i].Id);
                    }
                }
            }).error(function(data, status, headers, config) {
                alert("Sorry, No data found");
            });
        }
    }




    var UsecaseIds_blur;
    $scope.Search_RuleId = function() {
        if ($scope.SearchRuleID != '' && typeof $scope.SearchRuleID != 'undefined') {
            var RuleIDpostblur = $scope.SearchRuleID;
            $http.get($rootScope.url + '/getUseCaseById/' + RuleIDpostblur).success(function(data, status, headers, config) {
                UsecaseIds_blur = null;
                UsecaseIds_blur = data;
                if (UsecaseIds_blur.UseCase.length != 0 && typeof UsecaseIds_blur.UseCase != 'undefined') {
                    for (var i = 0; i < UsecaseIds_blur.UseCase.length; i++) {
                        if (UsecaseIds_blur.UseCase[i].Id == $scope.SearchRuleID) {
                            $scope.crtUsercaseId = UsecaseIds_blur.UseCase[i].Id;
                            $scope.crtUsercaseName = UsecaseIds_blur.UseCase[i].Name;
                            $scope.crtUsercaseSurrId = UsecaseIds_blur.UseCase[i].SurrId;
                            break;
                        }
                    }
                } else {
                    alert('Sorry, No data found');
                }
            }).error(function(data, status, headers, config) {
                alert('Sorry Application error in serverside');
            });
        }
    }

    $scope.Search_RuleName = function() {
        if ($scope.SearchRuleName != '' && typeof $scope.SearchRuleName != 'undefined') {
            if (UsecaseIds_livedata.UseCase.length != 0 && typeof UsecaseIds_livedata.UseCase != 'undefined') {
                for (var i = 0; i < UsecaseIds_livedata.UseCase.length; i++) {
                    if (UsecaseIds_livedata.UseCase[i].Id == $scope.SearchRuleID) {
                        $scope.crtUsercaseId = UsecaseIds_livedata.UseCase[i].SurrId;
                        $scope.crtUsercaseName = UsecaseIds_livedata.UseCase[i].Id;
                        break;
                    }
                }
            }
        }
    }

    $http.get($rootScope.url + '/populateCapecDropDown').success(function(data, status, headers, config) {
        if (data.Capec.length != 0 && typeof data.Capec != 'undefined') {
            $scope.thdCapdatas = data.Capec;
            $scope.thdStrddatas = [];
            $scope.UsecaseStrdAtt = "";
            $scope.UsecaseMetaAtt = "";
        } else {
            $scope.thdCapdatas = [];
            $scope.UsecaseStrdAtt = "";
            $scope.UsecaseMetaAtt = "";
        }
    }).error(function(data, status, headers, config) {
        alert('Sorry Application error in serverside');
    });


    var metaChck = null;
    var stdChck = null;

    $scope.thdCape_extch = function() {
        $rootScope.loadinganimation = true;
        if ($scope.UsecasecapecCat != '') {
            $http.get($rootScope.url + '/populateMetaDropDown/' + $scope.UsecasecapecCat).success(function(data, status, headers, config) {
                $scope.thdMetadatas = [];
                $rootScope.loadinganimation = false;
                if (data.Meta.length != 0 && typeof data.Meta != 'undefined') {
                    $rootScope.loadinganimation = false;
                    var item = data.Meta;
                    var cnt = 0;
                    for (var i = 0; i < item.length; i++) {
                        function isEmpty(obj) {
                            for (var prop in obj) {
                                if (obj.hasOwnProperty(prop)) {
                                    return false;
                                }
                            }
                            cnt++;
                            return true;
                        }
                        if (typeof item[i].SurrId != 'undefined') {
                            $scope.thdMetadatas.push(item[i]);
                            $scope.thdStrddatas = [];
                            $scope.UsecaseStrdAtt = "";
                            $scope.UsecaseMetaAtt = "";
                        }
                        if (isEmpty(item[i])) {
                            var Metaempty = {
                                SurrId: " ",
                                Name: " ",
                                ID: " "
                            }
                            $scope.thdMetadatas.push(Metaempty);
                            $scope.thdStrddatas = [];
                            $scope.UsecaseStrdAtt = "";
                            $scope.UsecaseMetaAtt = "";
                            if (cnt == item.length) {
                                $scope.UsecaseMetaAtt = $scope.UsecasecapecCat;
                                $scope.thdMeta_extch();
                            }
                        };
                    }
                } else {
                    $rootScope.loadinganimation = false;
                    if (data.Meta.length == 0) {
                        metaChck = 1;
                        $scope.UsecaseMetaAtt = " ";
                        $scope.thdMeta_extch();
                    }
                    $scope.thdMetadatas = [];
                    $scope.thdStrddatas = [];
                    $scope.UsecaseStrdAtt = "";
                    //alert("Sorry no data found");
                }

            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');
            });
        }
    }

    $scope.thdMeta_extch = function() {
        var chckempty = 0;
        if (typeof $scope.UsecaseMetaAtt != 'undefined') {
            if ($scope.UsecaseMetaAtt == " ") {
                $scope.UsecaseMetaAtt = $scope.UsecasecapecCat;
                chckempty = 1;
            }
            $rootScope.loadinganimation = true;
            $http.get($rootScope.url + '/populateStandardDropDown/' + $scope.UsecaseMetaAtt).success(function(data, status, headers, config) {
                $scope.thdStrddatas = [];
                $rootScope.loadinganimation = false;
                if (chckempty == 1) {
                    $scope.UsecaseMetaAtt = " ";
                }
                if (data.Standard.length != 0 && typeof data.Standard != 'undefined') {
                    var item = data.Standard;
                    for (var i = 0; i < item.length; i++) {
                        function isEmpty(obj) {
                            for (var prop in obj) {
                                if (obj.hasOwnProperty(prop)) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        if (typeof item[i].SurrId != 'undefined') {
                            $scope.thdStrddatas.push(item[i]);
                            $scope.UsecaseStrdAtt = "";
                        }
                        if (isEmpty(item[i])) {
                            var Metaempty = {
                                SurrId: " ",
                                Name: " ",
                                ID: " "
                            }
                            $scope.thdStrddatas.push(Metaempty);
                            $scope.UsecaseStrdAtt = "";
                        };

                    }
                } else {
                    $rootScope.loadinganimation = false;
                    if (data.Standard.length == 0) {
                        stdChck = 1;
                        $scope.UsecaseStrdAtt = " ";
                    }
                    $scope.thdStrddatas = [];
                }

            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');
            });
        }
    }

    $scope.thdCape_ch = function() {
        if (typeof $scope.thdCapdatas != 'undefined' && $scope.thdCapdatas != '') {
            if ($scope.thdCapdatas.length != 0) {
                for (var i = 0; i < $scope.thdCapdatas.length; i++) {
                    if ($scope.UsecasecapecCat == $scope.thdCapdatas[i].SurrId) {
                        $scope.thdCapeName = $scope.thdCapdatas[i].Name;
                        $scope.thdCapeID = $scope.thdCapdatas[i].ID;
                    };
                }
            }
        }
    }


    $scope.thdMeta_ch = function() {
        if (typeof $scope.thdMetadatas != 'undefined' && $scope.thdMetadatas != '') {
            if ($scope.thdMetadatas.length != 0) {
                for (var i = 0; i < $scope.thdMetadatas.length; i++) {
                    if ($scope.UsecaseMetaAtt == $scope.thdMetadatas[i].SurrId) {
                        $scope.thdMetaName = $scope.thdMetadatas[i].Name;
                        $scope.thdMetaID = $scope.thdMetadatas[i].ID;
                    };
                }
            }
        }
    }

    $scope.thdStrd_ch = function() {
        if (typeof $scope.thdStrddatas != 'undefined' && $scope.thdStrddatas != '') {
            if ($scope.thdStrddatas.length != 0) {
                for (var i = 0; i < $scope.thdStrddatas.length; i++) {
                    if ($scope.UsecaseStrdAtt == $scope.thdStrddatas[i].SurrId) {
                        $scope.thdStrd = $scope.thdStrddatas[i].Name;
                        $scope.thdStrdID = $scope.thdStrddatas[i].ID;
                    };
                }
            }
        }
    }

    $scope.ThdCrttables = [];
    $scope.thdUsecase_add = function() {
        if ($scope.ThdCrttables.length > 0) {
            var Thdctrltb = {};
            var checkthd = 0;
            if (typeof $scope.UsecasecapecCat != 'undefined' && $scope.UsecasecapecCat != "") {
                Thdctrltb.Thdcat = $scope.thdCapeName + "  " + $scope.thdCapeID;
                Thdctrltb.Thdcat_SurrId = $scope.UsecasecapecCat;
            }
            if (typeof $scope.UsecaseMetaAtt != 'undefined' && $scope.UsecaseMetaAtt != " " && $scope.UsecaseMetaAtt != "" && $scope.UsecaseMetaAtt.length != 0 && typeof $scope.thdMetaName != 'undefined' && typeof $scope.thdMetaID != 'undefined') {
                Thdctrltb.ThdPub = $scope.thdMetaName + "  " + $scope.thdMetaID;
                Thdctrltb.ThdPub_SurrId = $scope.UsecaseMetaAtt;
            } else {
                if ($scope.UsecaseMetaAtt == " ") {
                    Thdctrltb.ThdPub = "  ";
                    Thdctrltb.ThdPub_SurrId = " ";
                } else {
                    checkthd = 1;
                }
            }

            if (typeof $scope.UsecaseStrdAtt != 'undefined' && $scope.UsecaseStrdAtt != " " && $scope.UsecaseStrdAtt != "" && $scope.UsecaseStrdAtt.length != 0) {
                Thdctrltb.ThdCrtl = $scope.thdStrd + "  " + $scope.thdStrdID;
                Thdctrltb.ThdCrtl_SurrId = $scope.UsecaseStrdAtt;
            } else {
                if ($scope.UsecaseStrdAtt == " ") {
                    Thdctrltb.ThdCrtl = "  ";
                    Thdctrltb.ThdCrtl_SurrId = " ";
                } else {
                    checkthd = 1;
                }
            }
            var arr = Thdctrltb;
            var count = 0;
            $scope.ThdPush_data = function() {
                if (count == 1) {
                    alert("Record already selected, Please select another value");
                } else {
                    $scope.ThdCrttables.push(Thdctrltb);
                }
            }

            if (checkthd == 1) {
                alert("Please select the value in Thread Model");
            }

            if (checkthd != 1) {
                if ($scope.ThdCrttables.length > 0) {
                    var looparray = $scope.ThdCrttables.length - 1;
                    count = 0;
                    for (var i = 0; i < $scope.ThdCrttables.length; i++) {
                        if ($scope.ThdCrttables[i].Thdcat_SurrId == arr.Thdcat_SurrId && $scope.ThdCrttables[i].ThdPub_SurrId == arr.ThdPub_SurrId && $scope.ThdCrttables[i].ThdCrtl_SurrId == arr.ThdCrtl_SurrId) {
                            count = 1;
                            if (looparray == i) {
                                $scope.ThdPush_data();
                                break;
                            }
                        } else {
                            if (looparray == i) {
                                $scope.ThdPush_data();
                                break;
                            }
                        }

                    }
                }
            }
        } else {
            var Thdctrltb = {};
            var checkonethd = 0;
            if (typeof $scope.UsecasecapecCat != 'undefined' && $scope.UsecasecapecCat != "" && $scope.UsecasecapecCat.length != 0) {
                Thdctrltb.Thdcat = $scope.thdCapeName + "  " + $scope.thdCapeID;
                Thdctrltb.Thdcat_SurrId = $scope.UsecasecapecCat;
            } else {
                checkonethd = 1;
            }

            if (typeof $scope.thdMetaName != 'undefined' && $scope.thdMetaName != "" && $scope.UsecaseMetaAtt != "" && $scope.UsecaseMetaAtt.length != 0 && $scope.UsecaseMetaAtt != " ") {
                Thdctrltb.ThdPub = $scope.thdMetaName + "  " + $scope.thdMetaID;
                Thdctrltb.ThdPub_SurrId = $scope.UsecaseMetaAtt;
            } else {
                if ($scope.UsecaseMetaAtt == " ") {
                    Thdctrltb.ThdPub = "  ";
                    Thdctrltb.ThdPub_SurrId = " ";
                } else {
                    checkonethd = 1;
                }
            }

            if (typeof $scope.thdStrd != 'undefined' && $scope.thdStrd != "" && $scope.UsecaseStrdAtt != '' && $scope.UsecaseStrdAtt.length != 0 && $scope.UsecaseStrdAtt != " ") {
                Thdctrltb.ThdCrtl = $scope.thdStrd + "  " + $scope.thdStrdID;
                Thdctrltb.ThdCrtl_SurrId = $scope.UsecaseStrdAtt;
            } else {
                if ($scope.UsecaseStrdAtt == " ") {
                    Thdctrltb.ThdCrtl = "  ";
                    Thdctrltb.ThdCrtl_SurrId = " ";
                } else {
                    checkonethd = 1;
                }
            }

            if (checkonethd != 1) {
                $scope.ThdCrttables.push(Thdctrltb);
            } else {
                alert("Please select the value in Thread Model");
            }
        }
    }

    $scope.Thdtableremove = function(Thdtbdata, index) {
        Thdtbdata.splice(index, 1);
    }

    //reset form rule

    $scope.reSet = function() {
        $scope.crtRuleAlert = '';
        $scope.crtRuleDashBoard = '';
        $scope.crtReferSet = '';
        $scope.crtRuleEventName = '';
        UsecaseService.setUsecasecrtdata('');
    }

    // Create Rule post Json
    var statusOOB;
    $scope.$watch(function () {
    	if($scope.formcontrolYN=="Yes"){
    		statusOOB="Y";
    	}
    	else if($scope.formcontrolYN=="No"){
    		statusOOB="N";
    	}
    });
    
    $scope.crtRuleSubmit = function() {
        var evtattri_SurrId = [];
        var logSou_SurrId = [];
        var crtRuleInput_SurrId = [];
        var crtRuleOuput_SurrId = [];



        if (typeof $scope.crtRuleTrsn != 'undefined') {
            for (var k = 0; k < $scope.crtRuleTrsn.length; k++) {
                var crtRuleTrsnId = {};
                crtRuleTrsnId.SurrId = $scope.crtRuleTrsn[k];
                crtRuleInput_SurrId.push(crtRuleTrsnId);
            }
        }

        if (typeof $scope.crtRuleRefr != 'undefined') {
            for (var z = 0; z < $scope.crtRuleRefr.length; z++) {
                var crtRuleRefrId = {};
                crtRuleRefrId.SurrId = $scope.crtRuleRefr[z];
                crtRuleInput_SurrId.push(crtRuleRefrId);
            }
        }

        if (typeof $scope.crtRuleEventName != 'undefined') {
            for(var w=0;w<$scope.crtRuleEventName.length;w++){
                var crtRuleEventNameId = {};
                crtRuleEventNameId.SurrId = $scope.crtRuleEventName[w];
                crtRuleInput_SurrId.push(crtRuleEventNameId);
            }
        }

        if (typeof $scope.crtRuleEventAttribute != 'undefined') {
            for (var i = 0; i < $scope.crtRuleEventAttribute.length; i++) {
                var evtattri = {};
                evtattri.SurrId = $scope.crtRuleEventAttribute[i];
                evtattri_SurrId.push(evtattri);
            }
        }

        if (typeof $scope.crtRuleLogSource != 'undefined') {
            for (var j = 0; j < $scope.crtRuleLogSource.length; j++) {
                var logSouId = {};
                logSouId.SurrId = $scope.crtRuleLogSource[j];
                logSou_SurrId.push(logSouId);
            }
        }


        if (typeof $scope.crtRuleReport != 'undefined') {
            for (var u = 0; u < $scope.crtRuleReport.length; u++) {
                var crtRuleReportId = {};
                crtRuleReportId.SurrId = $scope.crtRuleReport[u];
                crtRuleOuput_SurrId.push(crtRuleReportId);
            }
        }



        var ruleOutput = [{
            SurrId: $scope.crtRuleDashBoard,
        }, {
            SurrId: $scope.crtRuleAlert,
        }, {
            SurrId: $scope.crtReferSet,
        }, {
            SurrId: $scope.crtRuleComments
        }];

        for (var w = 0; w < ruleOutput.length; w++) {
            if (typeof ruleOutput[w].SurrId != 'undefined' && ruleOutput[w].SurrId != '') {
                crtRuleOuput_SurrId.push(ruleOutput[w]);
            }
        }

        if (typeof $scope.crtRuleDsecpt == 'undefined') {
            $scope.crtRuleDsecpt = "";
        }
        if (typeof $scope.crtRulepesducode == 'undefined') {
            $scope.crtRulepesducode = "";
        }
        if (typeof $scope.crtRuletestlogic == 'undefined') {
            $scope.crtRuletestlogic = "";
        }
        if (typeof $scope.crtRuleReportlogic == 'undefined') {
            $scope.crtRuleReportlogic = "";
        }
        if (typeof $scope.crtRuleSaveSrchlogic == 'undefined') {
            $scope.crtRuleSaveSrchlogic = "";
        }
        if (typeof $scope.crtRuleBuildlogic == 'undefined') {
            $scope.crtRuleBuildlogic = "";
        }
        if (typeof $scope.crtRuleRefSetInc == 'undefined') {
            $scope.crtRuleRefSetInc = "";
        }
        if (typeof $scope.crtRuleResponse == 'undefined') {
            $scope.crtRuleResponse = "";
        }
        if (typeof $scope.crtRuleDsecpt == 'undefined') {
            $scope.crtRuleDsecpt = "";
        }
        if (typeof $scope.crtRuleEventName == 'undefined') {
            $scope.crtRuleEventName = "";
        }
        if (typeof $scope.crtReferSet == 'undefined') {
            $scope.crtReferSet = "";
        }

        var ThdCrt = [];
        if (typeof $scope.ThdCrttables != 'undefined' && $scope.ThdCrttables.length > 0) {
            for (var g = 0; g < $scope.ThdCrttables.length; g++) {
                var ThdCrtda = {};
                ThdCrtda.CapecSurrId = $scope.ThdCrttables[g].Thdcat_SurrId;
                ThdCrtda.MetaSurrId = $scope.ThdCrttables[g].ThdPub_SurrId;
                ThdCrtda.StandardId = $scope.ThdCrttables[g].ThdCrtl_SurrId;
                ThdCrt.push(ThdCrtda);
            }
        }


        var crtRule_postJson = {
            "UseCase": {
                "SurrId": $scope.crtUsercaseSurrId
            },
            "Rule": {
                "id": $scope.crtRuleID,
                "name": $scope.crtRuleName,
                "description": $scope.crtRuleDsecpt,
                "pseudo_code": $scope.crtRulepesducode,
                "rule_tst_iogic": $scope.crtRuletestlogic,
                "report_logic": $scope.crtRuleReportlogic,
                "save_search_logic": $scope.crtRuleSaveSrchlogic,
                "building_blocks": $scope.crtRuleBuildlogic,
                "reference_set_ind": $scope.crtRuleRefSet,//crtRuleRefSet, crtReferSet
                "response_text": $scope.crtRuleResponse,
                "event_name": "",
                "rule_description": $scope.crtRuleDsecpt,
                "oob_flag":statusOOB
            },
            "input": crtRuleInput_SurrId,
            "output": crtRuleOuput_SurrId,
            "event_attribute": evtattri_SurrId,
            "log_source": logSou_SurrId,
            "ThreadModelGroup": ThdCrt
        };


        if (typeof $scope.crtUsercaseId != 'undefined' && $scope.crtUsercaseId != '' && typeof $scope.crtUsercaseName != 'undefined' && $scope.crtUsercaseName != '' && typeof $scope.crtRuleID != 'undefined' && $scope.crtRuleID != '' && typeof $scope.crtRuleName != 'undefined' && $scope.crtRuleName != '') {
            //console.log(JSON.stringify(crtRule_postJson, null, 2));
            $http.post($rootScope.url + '/saveRule', crtRule_postJson).success(function(data, status, headers, config) {
                alert('Usecase Rule Created Successfully');
                UsecaseService.setUsecasecrtdata('');

                $scope.reSet();
                ThdCrt.length =0;
                $state.go($state.current, {}, {
                    reload: true
                });
            }).error(function(data, status, headers, config) {

            });
        } else {
            alert('Please fill all mandatory* fields');
        }
    }

    $rootScope.loadinganimation = true;
    $http.get($rootScope.url + '/getRuleTabData').success(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        $scope.Rule_data = data;
        $scope.transdatas = [];
        $scope.Referdatas = [];
        $scope.eventcatdatas = [];
        $scope.Commentsdatas = [];
        $scope.dashboarddatas = [];
        $scope.alertdatas = [];
        $scope.Reportdatas = [];
        $scope.refesetdatas = [];

        for (var i = 0; i < data.Input.length; i++) {
            if (data.Input[i].Name == 'Transactional Data') {
                //console.log(i);
                var transgetdata = {};
                transgetdata.Name = data.Input[i].Value;
                transgetdata.SurrId = data.Input[i].SurrId;
                $scope.transdatas.push(transgetdata);
                //console.log(i);
            } else if (data.Input[i].Name == 'Referential Data') {
                var Refergetdata = {};
                Refergetdata.Name = data.Input[i].Value;
                Refergetdata.SurrId = data.Input[i].SurrId;
                $scope.Referdatas.push(Refergetdata);

            } else if (data.Input[i].Name == 'Event Name/Category') {
                var eventgetdata = {};
                eventgetdata.Name = data.Input[i].Value;
                eventgetdata.SurrId = data.Input[i].SurrId;
                $scope.eventcatdatas.push(eventgetdata);
            }
        }

        for (var j = 0; j < data.Output.length; j++) {
            if (data.Output[j].Name == 'Dashboard') {
                var dashboardData = {};
                dashboardData.Name = data.Output[j].Value;
                dashboardData.SurrId = data.Output[j].SurrId;
                $scope.dashboarddatas.push(dashboardData);
            } else if (data.Output[j].Name == 'Alert') {
                var alertdata = {};
                alertdata.Name = data.Output[j].Value;
                alertdata.SurrId = data.Output[j].SurrId;
                $scope.alertdatas.push(alertdata);
            } else if (data.Output[j].Name == 'Report') {
                var Reportdata = {};
                Reportdata.Name = data.Output[j].Name;
                Reportdata.Value = data.Output[j].Value;
                Reportdata.SurrId = data.Output[j].SurrId;
                $scope.Reportdatas.push(Reportdata);
            } else if (data.Output[j].Name == 'Reference Set') {
                var refesetdata = {};
                refesetdata.Name = data.Output[j].Value;
                refesetdata.SurrId = data.Output[j].SurrId;
                $scope.refesetdatas.push(refesetdata);
            } else if (data.Output[j].Name == 'Comments') {
                var Commentsdata = {};
                Commentsdata.Name = data.Output[j].Value;
                Commentsdata.SurrId = data.Output[j].SurrId;
                $scope.Commentsdatas.push(Commentsdata);
            }
        }


        $scope.assignruledata();
    }).error(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        alert('Sorry Application error in serverside');
    });
    if (typeof UsecaseService.getUsecasecrtdata() != 'undefined' && UsecaseService.getUpdateUsecase().id != '' && UsecaseService.getUpdateUsecase().id != 'undefined') {
        $scope.SearchRuleID = UsecaseService.getUsecasecrtdata().id;
        $scope.Search_RuleId();
    }

    $scope.licreateruledetails = 'active';
    $scope.ruledetails = true;
    $scope.rulesource = false;
    $scope.ruleinput = false;
    $scope.ruleoutput = false;
    $scope.ruleresponse = false;
    $scope.rulethd = false;

    $scope.lidetails = function() {
        $scope.licreateruledetails = 'active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreateruleresponse = 'no-active';
        $scope.licreaterulethd = 'no-active';
        $scope.ruledetails = true;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleinputdata = false;
        $scope.ruleoutput = false;
        $scope.ruleresponse = false;
        $scope.rulethd = false;


    }
    $scope.liinput = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreateruleresponse = 'no-active';
        $scope.licreaterulethd = 'no-active';
        $scope.ruledetails = false;
        $scope.ruleinput = true;
        $scope.rulesource = false;
        $scope.ruleinputdata = false;
        $scope.ruleoutput = false;
        $scope.rulethd = false;
    }

    $scope.lioutput = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'active';
        $scope.licreateruleresponse = 'no-active';
        $scope.licreaterulethd = 'no-active';
        $scope.ruledetails = false;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleoutput = true;
        $scope.ruleresponse = false;
        $scope.rulethd = false;
    }

    $scope.liresponse = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreateruleresponse = 'active';
        $scope.licreaterulethd = 'no-active';
        $scope.ruledetails = false;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleoutput = false;
        $scope.ruleresponse = true;
        $scope.rulethd = false;
    }
    $scope.lithd = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreateruleresponse = 'no-active';
        $scope.licreaterulethd = 'active';
        $scope.ruledetails = false;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleoutput = false;
        $scope.ruleresponse = false;
        $scope.rulethd = true;
    }

}]);



app.controller("UpdateusecaseController", ["$scope", "$rootScope", "$state", "$http", 'UsecaseService', function($scope, $rootScope, $state, $http, UsecaseService) {

    $scope.SamePageReload = function() {
        $state.go($state.current, {}, {
            reload: true
        });
    }


    $scope.updateUsecase = {
        SearchPage: true,
        updatePage: false
    }

    $scope.pagemain = {
        main: true,
        usecase: false,
        rule: false
    }

    $scope.pageUsecase = function() {
        $scope.pagemain = {
            main: false,
            usecase: true,
            rule: false
        }
    }
    $scope.pageRule = function() {
        $scope.pagemain = {
            main: false,
            usecase: false,
            rule: true
        }
    }


    $scope.reSet = function() {
        var r = confirm("Are you sure you want to reset the form?");
        if (r == true) {
            $scope.frameWork = '';
            $scope.useCaseCat = '';
            $scope.useCaseSubcat = '';
            $scope.usecaseDescrip = '';
            $scope.usecaseName = '';
            //$scope.usecaseID = '';
        } else {
            return false;
        }
    }

    $scope.updatedata = {};
    var dataset = null;
    $scope.Search_UpdateUsecase = function() {
        if ($scope.UpdateusecaseID != '' && typeof $scope.UpdateusecaseID != 'undefined') {
            $rootScope.loadinganimation = true;
            $http.get($rootScope.url + '/getUseCase/' + $scope.UpdateusecaseID).success(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                if (typeof data.UseCase != 'undefined' && data.UseCase != '' && data.UseCase.length > 0) {

                    $scope.updatedata = data;
                    dataset = data;
                    UsecaseService.setUpdataUsedata(data);
                    $scope.frameWork = data.UseCase[0].cyberFuncSurrId;
                    $scope.useCaseCat = data.UseCase[0].UCCatSurrId;
                    $scope.useCaseSubcat = data.UseCase[0].UCSubCatSurrId;
                    $scope.usecaseSurrId = data.UseCase[0].SurrId;
                    $scope.usecaseID = data.UseCase[0].Id;
                    $scope.usecaseName = data.UseCase[0].Name;
                    $scope.usecaseDescrip = data.UseCase[0].Name;
                    if ($scope.frameWork != '' && $scope.frameWork != 'undefined') {
                        $scope.tiggerCat();
                    }
                    if ($scope.useCaseCat != '' && $scope.useCaseCat != 'undefined') {
                        $scope.tiggerSubCat();
                    }
                    $scope.updateUsecase = {
                        SearchPage: false,
                        updatePage: true
                    }
                    $scope.UsecaseIntry = [];
                    if (data.Industry.length > 0) {
                        for (var j = 0; j < data.Industry.length; j++) {
                            $scope.UsecaseIntry.push(data.Industry[j].SurrId);
                        }
                    }
                } else {
                    alert("Sorry, No data found");
                }
            }).error(function(data, status, headers, config) {
                alert('Sorry Application error in serverside');
            });
        }
    }

    $rootScope.loadinganimation = true;
    $http.get($rootScope.url + '/populateCyberFuncDropDown').success(function(data, status, headers, config) {
        if (typeof data.CyberFunc != 'undefined' && data.CyberFunc.length != 0) {
            $rootScope.loadinganimation = false;
            $scope.UsecaseFramework = data.CyberFunc;
        } else {
            $rootScope.loadinganimation = false;
            alert("Sorry, No data found");
            $scope.UsecaseFramework = [];
        }
    }).error(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        alert('Sorry Application error in serverside');
    });

    $scope.tiggerCat = function() {
        $rootScope.loadinganimation = true;
        if (typeof $scope.frameWork != 'undefined' && $scope.frameWork != '') {
            $http.get($rootScope.url + '/populateUseCaseCatDropdown/' + $scope.frameWork).success(function(data, status, headers, config) {
                if (typeof data.UseCaseCat != 'undefined' && data.UseCaseCat.length != 0) {
                    $rootScope.loadinganimation = false;
                    $scope.UsecaseCatgs = data.UseCaseCat;
                } else {
                    $rootScope.loadinganimation = false;
                    alert("Sorry, No data found");
                    $scope.UsecaseCatgs = [];
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');
            });
        }
    }

    $scope.tiggerSubCat = function() {
        $rootScope.loadinganimation = true;
        if (typeof $scope.useCaseCat != 'undefined' && $scope.useCaseCat != '') {
            $http.get($rootScope.url + '/populateUcSubCatFrmCatIdDropDown/' + $scope.useCaseCat).success(function(data, status, headers, config) {
                if (typeof data.SubCat != 'undefined' && data.SubCat.length != 0) {
                    $rootScope.loadinganimation = false;
                    $scope.useCaseSubcatdatas = data.SubCat;
                } else {
                    $rootScope.loadinganimation = false;
                    alert("Sorry, No data found");
                    $scope.useCaseSubcatdatas = [];
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');
            });
        }
    }

    $scope.frameWorkUsecase = function() {
        $rootScope.loadinganimation = true;
        if ($scope.frameWork != '') {
            $http.get($rootScope.url + '/populateUseCaseCatDropdown/' + $scope.frameWork).success(function(data, status, headers, config) {
                if (typeof data.UseCaseCat != 'undefined' && data.UseCaseCat.length != 0) {
                    $rootScope.loadinganimation = false;
                    $scope.UsecaseCatgs = data.UseCaseCat;
                } else {
                    $rootScope.loadinganimation = false;
                    alert("Sorry, No data found");
                    $scope.UsecaseCatgs = [];
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');
            });
        }
    }

    $scope.UsecaseCatgChange = function() {
        $rootScope.loadinganimation = true;
        if ($scope.useCaseCat != '') {
            $http.get($rootScope.url + '/populateUcSubCatFrmCatIdDropDown/' + $scope.useCaseCat).success(function(data, status, headers, config) {
                if (typeof data.SubCat != 'undefined' && data.SubCat.length != 0) {
                    $rootScope.loadinganimation = false;
                    $scope.useCaseSubcatdatas = data.SubCat;
                } else {
                    $rootScope.loadinganimation = false;
                    alert("Sorry, No data found");
                    $scope.useCaseSubcatdatas = [];
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');
            });
        }
    }


    $http.get($rootScope.url + '/populateEPIndutry').success(function(data, status, headers, config) {
        if (typeof data.industry != 'undefined' && data.industry.length != 0) {
            $rootScope.loadinganimation = false;
            $scope.industrydatas = data.industry;
        } else {
            $rootScope.loadinganimation = false;
            $scope.industrydatas = [];
            alert('Sorry, No data found');
        }
    }).error(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        alert('Sorry Application error in serverside');
    });

    var Indtsyarray = [];


    $scope.goTo = function() {
        if (typeof $scope.usecaseDescrip == 'undefined') {
            $scope.usecaseDescrip = "";
        }
        if (typeof $scope.UsecaseIntry != 'undefined' && $scope.UsecaseIntry.length > 0) {
            for (var i = 0; i < $scope.UsecaseIntry.length; i++) {
                var Indtsy = {};
                Indtsy.surrId = $scope.UsecaseIntry[i];
                Indtsyarray.push(Indtsy);
            }
        }
        $scope.useCase = {
            SurrId: $scope.usecaseSurrId,
            id: $scope.usecaseID,
            name: $scope.usecaseName,
            description: $scope.usecaseDescrip,
            cyberFuncSurrId: $scope.frameWork,
            UCCatSurrId: $scope.useCaseCat,
            UCSubCatSurrId: $scope.useCaseSubcat
        };

        UsecaseService.setUpdtindsty(Indtsyarray);
        UsecaseService.setUpdateUsecase($scope.useCase);
        if (typeof $scope.usecaseID != 'undefined' && typeof $scope.usecaseName != 'undefined' && typeof $scope.frameWork != 'undefined' && typeof $scope.useCaseCat != 'undefined' && typeof $scope.useCaseSubcat != 'undefined' && $scope.frameWork != '' && $scope.useCaseCat != '' && $scope.useCaseSubcat != '' && Indtsyarray.length != 0) {
            $state.go("home.updateReg");
        } else {
            alert("Please fill all mandatory fields");
        }
    }


}]);

app.controller("updateRegController", ["$scope", "$rootScope", "$state", "$http", 'UsecaseService', function($scope, $rootScope, $state, $http, UsecaseService) {

    $scope.SamePageReload = function() {
        $state.go($state.current, {}, {
            reload: true
        });
    }

    $scope.pagemain = {
        main: true,
        usecase: false,
        rule: false
    }

    $scope.pageUsecase = function() {
        $scope.pagemain = {
            main: false,
            usecase: true,
            rule: false
        }
    }
    $scope.pageRule = function() {
        $scope.pagemain = {
            main: false,
            usecase: false,
            rule: true
        }
    }

    $scope.updateUsecase = {
        SearchPage: true,
        updatePage: false
    }

    $scope.clickReg = function() {
        $scope.tabsusecaseloader = {
            loading: true,
            loaded: false
        }
        $scope.liregactive = 'active';
        $scope.liCapecactive = 'no-active';
    }
    $scope.clickReg();

    $scope.clickCapec = function() {
        $scope.tabsusecaseloader = {
            loading: false,
            loaded: true
        }
        $scope.liregactive = 'no-active';
        $scope.liCapecactive = 'active';
    }

    $scope.reSet = function() {
        var r = confirm("Are you sure do you want rest ?");
        if (r == true) {
            $scope.UsecaseRegcat = '';
            $scope.UsecaseRegPub = '';
            $scope.UsecaseRegCrtl = '';
            $scope.UsecasecapecCat = '';
            $scope.UsecaseMetaAtt = '';
            $scope.UsecaseStrdAtt = '';
            $scope.UsecaseEsseprt = '';
            $scope.UsecaseIntry = '';
        } else {
            return false;
        }
    }

    $rootScope.loadinganimation = true;
    $http.get($rootScope.url + '/populateEPIndutry').success(function(data, status, headers, config) {
        if (data.EP.length != 0 && data.industry.length != 0 && typeof data.EP != 'undefined' && typeof data.industry != 'undefined') {
            $rootScope.loadinganimation = false;
            $scope.EPdatas = data.EP;
        } else {
            $rootScope.loadinganimation = false;
            $scope.EPdatas = [];
            alert("Sorry, No data found");
        }
    }).error(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        alert("Sorry Application error in serverside");
    });

    $rootScope.loadinganimation = true;
    $http.get($rootScope.url + '/populateRegCatDropDown').success(function(data, status, headers, config) {
        if (data.RegCat.length != 0 && typeof data.RegCat != 'undefined') {
            $rootScope.loadinganimation = false;
            $scope.RegcatCrtdatas = data.RegCat;
        } else {
            $rootScope.loadinganimation = false;
            $scope.RegcatCrtdatas = [];
        }
    }).error(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        alert("Sorry Application error in serverside");
    });


    $scope.UsecaseRegcat_extch = function() {
        $rootScope.loadinganimation = true;
        if ($scope.UsecaseRegcat != '') {
            $http.get($rootScope.url + '/populateRegPubDropDown/' + $scope.UsecaseRegcat).success(function(data, status, headers, config) {
                if (typeof data.RegPub != 'undefined' && data.RegPub.length != 0) {
                    $rootScope.loadinganimation = false;
                    $scope.RegpubCrtdatas = data.RegPub;
                } else {
                    $rootScope.loadinganimation = false;
                    $scope.RegpubCrtdatas = [];
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert("Sorry Application error in serverside");

            });
        }
    }


    $scope.UsecaseRegPub_extch = function() {
        $rootScope.loadinganimation = true;
        if ($scope.UsecaseRegPub != '') {
            $http.get($rootScope.url + '/populateRegCntlDropDown/' + $scope.UsecaseRegPub).success(function(data, status, headers, config) {
                if (typeof data.RegCntl != 'undefined' && data.RegCntl.length != 0) {
                    $rootScope.loadinganimation = false;
                    $scope.RegCrtlCrtdatas = data.RegCntl;
                } else {
                    $rootScope.loadinganimation = false;
                    $scope.RegCrtlCrtdatas = [];
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert("Sorry Application error in serverside");
            });
        }
    }

    $scope.UsecaseRegcat_ch = function() {
        if (typeof $scope.RegcatCrtdatas != 'undefined' && $scope.RegcatCrtdatas != '') {
            if ($scope.RegcatCrtdatas.length != 0) {
                for (var i = 0; i < $scope.RegcatCrtdatas.length; i++) {
                    if ($scope.UsecaseRegcat == $scope.RegcatCrtdatas[i].SurrId) {
                        $scope.regCatName = $scope.RegcatCrtdatas[i].Name;
                    };
                }
            }
        }
    }


    $scope.UsecaseRegPub_ch = function() {
        if (typeof $scope.RegpubCrtdatas != 'undefined' && $scope.RegpubCrtdatas != '') {
            if ($scope.RegpubCrtdatas.length != 0) {
                for (var i = 0; i < $scope.RegpubCrtdatas.length; i++) {
                    if ($scope.UsecaseRegPub == $scope.RegpubCrtdatas[i].SurrId) {
                        $scope.regPubName = $scope.RegpubCrtdatas[i].Name;
                    };
                }
            }
        }
    }

    $scope.UsecaseRegCrtl_ch = function() {
        $scope.regCrtlName = [];
        if (typeof $scope.RegCrtlCrtdatas != 'undefined' && $scope.RegCrtlCrtdatas != '' && typeof $scope.UsecaseRegCrtl != 'undefined') {
            if ($scope.RegCrtlCrtdatas.length != 0) {
                for (var i = 0; i < $scope.RegCrtlCrtdatas.length; i++) {
                    for (var j = 0; j < $scope.UsecaseRegCrtl.length; j++) {
                        if ($scope.UsecaseRegCrtl[j] == $scope.RegCrtlCrtdatas[i].SurrId) {
                            $scope.regCrtlName.push($scope.RegCrtlCrtdatas[i].Name);
                        };
                    }
                }
            }
        }
    }

    $scope.RegCrtltables = [];
    $scope.Regcrt_add = function() {
        if ($scope.RegCrtltables.length > 0) {
            if (typeof $scope.UsecaseRegCrtl != 'undefined') {
                for (var k = 0; k < $scope.UsecaseRegCrtl.length; k++) {
                    var Regctrltb = {}
                    Regctrltb.RegCrtl = [];
                    Regctrltb.Regcat = $scope.regCatName;
                    Regctrltb.Regcat_SurrId = $scope.UsecaseRegcat;
                    Regctrltb.RegPub = $scope.regPubName;
                    Regctrltb.RegPub_SurrId = $scope.UsecaseRegPub;
                    Regctrltb.RegCrtl = $scope.regCrtlName[k].toString();
                    Regctrltb.RegCrtl_SurrId = $scope.UsecaseRegCrtl[k].toString();
                    var arr = Regctrltb;
                    var count = 0;
                    $scope.RegPush_data = function() {
                        if (count == 1) {
                            alert("Record already selected, Please select another value");
                        } else {
                            $scope.RegCrtltables.push(Regctrltb);
                        }
                    }

                    if ($scope.RegCrtltables.length > 0) {
                        var looparray = $scope.RegCrtltables.length - 1;
                        count = 0;
                        for (var i = 0; i < $scope.RegCrtltables.length; i++) {
                            if ($scope.RegCrtltables[i].Regcat_SurrId == arr.Regcat_SurrId && $scope.RegCrtltables[i].RegPub_SurrId == arr.RegPub_SurrId && $scope.RegCrtltables[i].RegCrtl_SurrId == arr.RegCrtl_SurrId) {
                                count = 1;
                                if (looparray == i) {
                                    $scope.RegPush_data();
                                    break;
                                }
                            } else {
                                if (looparray == i) {
                                    $scope.RegPush_data();
                                    break;
                                }
                            }

                        }
                    }
                }
            }
        } else {
            if (typeof $scope.UsecaseRegCrtl != 'undefined') {
                for (var k = 0; k < $scope.UsecaseRegCrtl.length; k++) {
                    var Regctrltb = {}
                    Regctrltb.RegCrtl = [];
                    Regctrltb.Regcat = $scope.regCatName;
                    var chkRefobj = 0;
                    if (typeof $scope.UsecaseRegcat == 'undefined') {
                        chkRefobj = 1;
                    } else {
                        Regctrltb.Regcat_SurrId = $scope.UsecaseRegcat;
                    }
                    Regctrltb.RegPub = $scope.regPubName;
                    if (typeof $scope.UsecaseRegPub == 'undefined') {
                        chkRefobj = 1;
                    } else {
                        Regctrltb.RegPub_SurrId = $scope.UsecaseRegPub;
                    }

                    if (typeof $scope.regCrtlName == 'undefined') {
                        chkRefobj = 1;
                    } else {
                        Regctrltb.RegCrtl = $scope.regCrtlName[k].toString();
                    }

                    if (typeof $scope.UsecaseRegCrtl != 'undefined') {
                        Regctrltb.RegCrtl_SurrId = $scope.UsecaseRegCrtl[k].toString();
                    } else {
                        chkRefobj = 1;
                    }
                    if (chkRefobj == 0) {
                        $scope.RegCrtltables.push(Regctrltb);
                    } else {
                        alert("All fields are mandatory*");
                    }
                }
            }
        }
    }

    $scope.Regtableremove = function(Regtbdata, index) {
        Regtbdata.splice(index, 1);
    }

    $scope.goTo = function() {
        $state.go("home.createrule");
    }

    $scope.UpdatedataSet = function() {
        var dataset = UsecaseService.getUpdataUsedata();
        for (var j = 0; j < dataset.RegGroup.length; j++) {
            var regdataupd = dataset.RegGroup[j];
            var Regctrltb = {};
            Regctrltb.Regcat = regdataupd.RegCat.Name;
            Regctrltb.Regcat_SurrId = regdataupd.RegCat.SurrId;
            Regctrltb.RegPub = regdataupd.RegPub.Name;
            Regctrltb.RegPub_SurrId = regdataupd.RegPub.SurrId;
            Regctrltb.RegCrtl = regdataupd.RegCntl.Name;
            Regctrltb.RegCrtl_SurrId = regdataupd.RegCntl.SurrId;
            $scope.RegCrtltables.push(Regctrltb);
        }
        $scope.UsecaseEsseprt = [];
        if (dataset.EP.length > 0) {
            for (var k = 0; k < dataset.EP.length; k++) {
                $scope.UsecaseEsseprt.push(dataset.EP[k].SurrId);
            }
        }
    }

    $scope.UpdatedataSet();
    $scope.UseCaseformSubmit = function() {
        var Indtsyarray = [];
        var Essptarray = [];
        var CategoryGr = [];
        var ThdCrt = [];
        for (var j = 0; j < $scope.UsecaseEsseprt.length; j++) {
            var Esspt = {};
            Esspt.surrId = $scope.UsecaseEsseprt[j];
            Essptarray.push(Esspt);
        }
        for (var k = 0; k < $scope.RegCrtltables.length; k++) {
            var RegCrtldat = {};
            RegCrtldat.RegCatSurrId = $scope.RegCrtltables[k].Regcat_SurrId;
            RegCrtldat.RegPubSurrId = $scope.RegCrtltables[k].RegPub_SurrId;
            RegCrtldat.RegCntlSurrId = $scope.RegCrtltables[k].RegCrtl_SurrId;
            CategoryGr.push(RegCrtldat);
        }

        var UsecasePostJson = {
            useCase: UsecaseService.getUpdateUsecase(),
            industry: UsecaseService.getUpdtindsty(),
            EP: Essptarray,
            CategoryGroup: CategoryGr
        }


        if (CategoryGr.length != 0) {
            if (UsecaseService.getUpdateUsecase().SurrId != '' && UsecaseService.getUpdateUsecase().SurrId != 'undefined') {
                $http.post($rootScope.url + '/updateUseCase', UsecasePostJson).success(function(data, status, headers, config) {
                    alert("Usecase updated Successfully");
                    $scope.goTo();
                }).error(function(data, status, headers, config) {
                    alert("Sorry Application error in serverside");
                });
            } else {
                alert("Please fill all mandatory fields");
                $state.go('home.updateUsecase');
            }
        } else {
            alert("Please fill all mandatory fields");
        }
    }
}]);


app.controller("updateRuleController", ["$scope", "$rootScope", "$state", '$http', 'UsecaseService', function($scope, $rootScope, $state, $http, UsecaseService) {

    $scope.pagemain = {
        main: true,
        usecase: false,
        rule: false
    }

    $scope.pageUsecase = function() {
        $scope.pagemain = {
            main: false,
            usecase: true,
            rule: false
        }
    }
    $scope.pageRule = function() {
        $scope.pagemain = {
            main: false,
            usecase: false,
            rule: true
        }
    }

    $scope.updateUsecase = {
        SearchPage: true,
        updatePage: false
    }

    $scope.reSet = function() {
        $scope.crtRuleAlert = '';
        $scope.crtRuleDashBoard = '';
        $scope.crtReferSet = '';
        $scope.crtRuleEventName = '';
        UsecaseService.setUsecasecrtdata('');
    }
    $rootScope.loadinganimation = true;
    $http.get($rootScope.url + '/getRuleTabData').success(function(data, status, headers, config) {
        //console.log(JSON.stringify(data, null,2));
        $rootScope.loadinganimation = false;
        $scope.Rule_data = data;
        $scope.transdatas = [];
        $scope.Referdatas = [];
        $scope.eventcatdatas = [];
        $scope.Commentsdatas = [];
        $scope.dashboarddatas = [];
        $scope.alertdatas = [];
        $scope.Reportdatas = [];
        $scope.refesetdatas = [];

        $scope.LogSource = $scope.Rule_data.LogSource;
        $scope.dataeventAttr = $scope.Rule_data.EventAttribute;
        for (var i = 0; i < data.Input.length; i++) {
            if (data.Input[i].Name == 'Transactional Data') {
                //console.log(i);
                var transgetdata = {};
                transgetdata.Name = data.Input[i].Value;
                transgetdata.SurrId = data.Input[i].SurrId;
                $scope.transdatas.push(transgetdata);
                //console.log(i);
            } else if (data.Input[i].Name == 'Referential Data') {
                var Refergetdata = {};
                Refergetdata.Name = data.Input[i].Value;
                Refergetdata.SurrId = data.Input[i].SurrId;
                $scope.Referdatas.push(Refergetdata);

            } else if (data.Input[i].Name == 'Event Name/Category') {
                var eventgetdata = {};
                eventgetdata.Name = data.Input[i].Value;
                eventgetdata.SurrId = data.Input[i].SurrId;
                $scope.eventcatdatas.push(eventgetdata);
            }
        }

        for (var j = 0; j < data.Output.length; j++) {
            if (data.Output[j].Name == 'Dashboard') {
                var dashboardData = {};
                dashboardData.Name = data.Output[j].Value;
                dashboardData.SurrId = data.Output[j].SurrId;
                $scope.dashboarddatas.push(dashboardData);
            } else if (data.Output[j].Name == 'Alert') {
                var alertdata = {};
                alertdata.Name = data.Output[j].Value;
                alertdata.SurrId = data.Output[j].SurrId;
                $scope.alertdatas.push(alertdata);
            } else if (data.Output[j].Name == 'Report') {
                var Reportdata = {};
                Reportdata.Name = data.Output[j].Name + ' - ' + data.Output[j].Value;
                Reportdata.SurrId = data.Output[j].SurrId;
                $scope.Reportdatas.push(Reportdata);
            } else if (data.Output[j].Name == 'Reference Set') {
                var refesetdata = {};
                refesetdata.Name = data.Output[j].Value;
                refesetdata.SurrId = data.Output[j].SurrId;
                $scope.refesetdatas.push(refesetdata);
            } else if (data.Output[j].Name == 'Comments') {
                var Commentsdata = {};
                Commentsdata.Name = data.Output[j].Value;
                Commentsdata.SurrId = data.Output[j].SurrId;
                $scope.Commentsdatas.push(Commentsdata);
            }
        }

    }).error(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        alert("Sorry Application error in serverside");
    });
    $scope.Search_RuleUsecase = function() {
        if ($scope.UpdateRuleID != '' && typeof $scope.UpdateRuleID != 'undefined') {
            $rootScope.loadinganimation = true;
            
            var appstatuesoob;
            
            $http.get($rootScope.url + '/getDetailsbyUcRuleID/' + $scope.UpdateRuleID).success(function(data, status, headers, config) {
                console.log(JSON.stringify(data, null,2));
                $rootScope.loadinganimation = false;
              //for oob value
                appstatuesoob = data.Rule[0].UC_RULE_OOB_FLAG;

                	if(appstatuesoob=="Y"){
                		$scope.uformcontrolYN="Yes";
                	}
                	else if(appstatuesoob=="N"){
                		$scope.uformcontrolYN="No";
                	}
                
                if (typeof data != 'undefined' && data.Rule.length > 0 && typeof data.Rule[0].UC_RULE_SURR_ID != 'undefined') {
                    $scope.updateRule_surrId = data.Rule[0].UC_RULE_SURR_ID;
                    $scope.crtRuleID = data.Rule[0].UC_RULE_ID;
                    $scope.crtRuleName = data.Rule[0].UC_RULE_NAME;
                    
                    if (typeof data.Rule[0].UC_RULE_DESC != 'undefined' && data.Rule[0].UC_RULE_DESC != 'undefined') {
                        $scope.crtRuleDsecpt = data.Rule[0].UC_RULE_DESC;
                    } else {
                        $scope.crtRuleDsecpt = "";
                    }

                    if (typeof data.Rule[0].UC_RULE_PSEUDO_CODE_DESC != 'undefined' && data.Rule[0].UC_RULE_PSEUDO_CODE_DESC != 'undefined') {
                        $scope.crtRulepesducode = data.Rule[0].UC_RULE_PSEUDO_CODE_DESC;
                    } else {
                        $scope.crtRulepesducode = "";
                    }

                    if (typeof data.Rule[0].UC_RULE_SAVE_SEARCH_LOGIC_DESC != 'undefined' && data.Rule[0].UC_RULE_SAVE_SEARCH_LOGIC_DESC != 'undefined') {
                        $scope.crtRuleSaveSrchlogic = data.Rule[0].UC_RULE_SAVE_SEARCH_LOGIC_DESC;
                    } else {
                        $scope.crtRuleSaveSrchlogic = "";
                    }

                    if (typeof data.Rule[0].UC_RULE_BUILDING_BLOCKS_DESC != 'undefined' && data.Rule[0].UC_RULE_BUILDING_BLOCKS_DESC != 'undefined') {
                        $scope.crtRuleBuildlogic = data.Rule[0].UC_RULE_BUILDING_BLOCKS_DESC;
                    } else {
                        $scope.crtRuleBuildlogic = "";
                    }

                    if (typeof data.Rule[0].UC_RULE_REFERENCE_SET_IND != 'undefined' && data.Rule[0].UC_RULE_REFERENCE_SET_IND != 'undefined') {
                        $scope.crtRuleRefSet = data.Rule[0].UC_RULE_REFERENCE_SET_IND;
                    } else {
                        $scope.crtRuleRefSet = "";
                    }

                    if (typeof data.Rule[0].UC_RULE_RESPONSE_TEXT != 'undefined' && data.Rule[0].UC_RULE_RESPONSE_TEXT != 'undefined') {
                        $scope.crtRuleResponse = data.Rule[0].UC_RULE_RESPONSE_TEXT;
                    } else {
                        $scope.crtRuleResponse = "";
                    }

                    $scope.crtUsercaseId = data.UseCase[0].USECASE_ID;
                    $scope.crtUsercaseName = data.UseCase[0].USECASE_NAME;
                    $scope.crtUsercaseSurrId = data.Rule[0].USECASE_SURR_ID;

                    $scope.crtRuleTrsn = [];
                    $scope.crtRuleRefr = [];
                    $scope.crtRuleEventName = [];
                    for (var i = 0; i < data.input.length; i++) {
                        if (data.input[i].UCSR_INPUT_NAME == "Transactional Data") {
                            //console.log("Transactional" + data.input[i].UCSR_INPUT_SURR_ID);
                            if (data.input[i].Selected == 'True') {
                                $scope.crtRuleTrsn.push(data.input[i].UCSR_INPUT_SURR_ID);
                            }
                        } else if (data.input[i].UCSR_INPUT_NAME == "Referential Data") {
                            if (data.input[i].Selected == 'True') {
                                $scope.crtRuleRefr.push(data.input[i].UCSR_INPUT_SURR_ID);
                            }
                        } else if (data.input[i].UCSR_INPUT_NAME == "Event Name/Category") {
                            if (data.input[i].Selected == 'True') {
                                $scope.crtRuleEventName.push(data.input[i].UCSR_INPUT_SURR_ID);
                            }
                        }
                    }

                    $scope.crtRuleReport = [];
                    for (var j = 0; j < data.output.length; j++) {
                        if (data.output[j].UCSR_OUTPUT_NAME == "Dashboard") {
                            if (data.output[j].Selected == 'True') {
                                $scope.crtRuleDashBoard = data.output[j].UCSR_OUTPUT_SURR_ID;
                            }
                        } else if (data.output[j].UCSR_OUTPUT_NAME == "Alert") {
                            if (data.output[j].Selected == 'True') {
                                $scope.crtRuleAlert = data.output[j].UCSR_OUTPUT_SURR_ID;
                            }
                        } else if (data.output[j].UCSR_OUTPUT_NAME == "Report") {
                            if (data.output[j].Selected == 'True') {
                                $scope.crtRuleReport.push(data.output[j].UCSR_OUTPUT_SURR_ID);
                            }
                        } else if (data.output[j].UCSR_OUTPUT_NAME == "Reference Set") {
                            if (data.output[j].Selected == 'True') {
                                $scope.crtReferSet = data.output[j].UCSR_OUTPUT_SURR_ID;
                            }
                        } else if (data.output[j].UCSR_OUTPUT_NAME == "Comments") {
                            if (data.output[j].Selected == 'True') {
                                $scope.crtRuleComments = data.output[j].UC_RULE_SURR_ID;
                            }
                        }
                    }
                    $scope.crtRuleEventAttribute = [];
                    for (var i = 0; i < data.event_attribute.length; i++) {
                        if (data.event_attribute[i].Selected == 'True') {
                            $scope.crtRuleEventAttribute.push(data.event_attribute[i].RULE_ATT_SURR_ID);
                        }
                    }
                    $scope.crtRuleLogSource = [];
                    for (var i = 0; i < data.log_source.length; i++) {
                        if (data.log_source[i].Selected == 'True') {
                            $scope.crtRuleLogSource.push(data.log_source[i].LOG_SOURCE_KEYWORD_SURR_ID);
                        }
                    }
                    $scope.ThdCrttables = [];
                    $scope.ThdCrttables.length = 0;
                    for (var i = 0; i < data.ThreadModelGroup.length; i++) {
                        var Thdctrltb = {};
                        var thdata = data.ThreadModelGroup[i];
                        Thdctrltb.Thdcat_SurrId = thdata.capec.SurrId;
                        Thdctrltb.Thdcat = thdata.capec.Name;
                        if (typeof thdata.meta.SurrId != 'undefined') {
                            Thdctrltb.ThdPub_SurrId = thdata.meta.SurrId;
                            Thdctrltb.ThdPub = thdata.meta.Name;
                        } else {
                            Thdctrltb.ThdPub_SurrId = "";
                            Thdctrltb.ThdPub = "";
                        }
                        if (typeof thdata.standard.SurrId != 'undefined') {
                            Thdctrltb.ThdCrtl_SurrId = thdata.standard.SurrId;
                            Thdctrltb.ThdCrtl = thdata.standard.Name;
                        } else {
                            Thdctrltb.ThdCrtl_SurrId = "";
                            Thdctrltb.ThdCrtl = "";
                        }
                        $scope.ThdCrttables.push(Thdctrltb);
                    }
                    $scope.updateUsecase = {
                        SearchPage: false,
                        updatePage: true
                    }
                } else {
                    $rootScope.loadinganimation = false;
                    alert("Sorry, No data found");
                }
            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert(data.ErrMsg);
            });
        } else {
            $rootScope.loadinganimation = false;
            alert("Please enter the RuleID");
        }
    }


    $scope.Search_RuleId = function() {
        if ($scope.SearchRuleID != '' && typeof $scope.SearchRuleID != 'undefined') {
            if (UsecaseIds_livedata.UseCase.length != 0 && typeof UsecaseIds_livedata.UseCase != 'undefined') {
                for (var i = 0; i < UsecaseIds_livedata.UseCase.length; i++) {
                    if (UsecaseIds_livedata.UseCase[i].Id == $scope.SearchRuleID) {
                        $scope.crtUsercaseId = UsecaseIds_livedata.UseCase[i].SurrId;
                        $scope.crtUsercaseName = UsecaseIds_livedata.UseCase[i].Id;
                        break;
                    }
                }
            }
        }
    }

    $scope.Search_RuleName = function() {
        if ($scope.SearchRuleName != '' && typeof $scope.SearchRuleName != 'undefined') {
            if (UsecaseIds_livedata.UseCase.length != 0 && typeof UsecaseIds_livedata.UseCase != 'undefined') {
                for (var i = 0; i < UsecaseIds_livedata.UseCase.length; i++) {
                    if (UsecaseIds_livedata.UseCase[i].Id == $scope.SearchRuleID) {
                        $scope.crtUsercaseId = UsecaseIds_livedata.UseCase[i].SurrId;
                        $scope.crtUsercaseName = UsecaseIds_livedata.UseCase[i].Id;
                        break;
                    }
                }
            }
        }
    }



    $rootScope.loadinganimation = true;
    $http.get($rootScope.url + '/populateCapecDropDown').success(function(data, status, headers, config) {
        if (data.Capec.length != 0 && typeof data.Capec != 'undefined') {
            $scope.thdCapdatas = data.Capec;
            $scope.thdStrddatas = [];
            $scope.UsecaseStrdAtt = "";
            $scope.UsecaseMetaAtt = "";
        } else {
            $scope.thdCapdatas = [];
            $scope.UsecaseStrdAtt = "";
            $scope.UsecaseMetaAtt = "";
        }
    }).error(function(data, status, headers, config) {
        alert('Sorry Application error in serverside');
    });

    var metaChck = null;
    var stdChck = null;

    $scope.thdCape_extch = function() {
        $rootScope.loadinganimation = true;
        if ($scope.UsecasecapecCat != '') {
            $http.get($rootScope.url + '/populateMetaDropDown/' + $scope.UsecasecapecCat).success(function(data, status, headers, config) {
                $scope.thdMetadatas = [];
                $rootScope.loadinganimation = false;
                if (data.Meta.length != 0 && typeof data.Meta != 'undefined') {
                    $rootScope.loadinganimation = false;
                    var item = data.Meta;
                    var cnt = 0;
                    for (var i = 0; i < item.length; i++) {
                        function isEmpty(obj) {
                            for (var prop in obj) {
                                if (obj.hasOwnProperty(prop)) {
                                    return false;
                                }
                            }
                            cnt++;
                            return true;
                        }
                        if (typeof item[i].SurrId != 'undefined') {
                            $scope.thdMetadatas.push(item[i]);
                            $scope.thdStrddatas = [];
                            $scope.UsecaseStrdAtt = "";
                            $scope.UsecaseMetaAtt = "";
                        }
                        if (isEmpty(item[i])) {
                            var Metaempty = {
                                SurrId: " ",
                                Name: " ",
                                ID: " "
                            }
                            $scope.thdMetadatas.push(Metaempty);
                            $scope.thdStrddatas = [];
                            $scope.UsecaseStrdAtt = "";
                            $scope.UsecaseMetaAtt = "";
                            if (cnt == item.length) {
                                $scope.UsecaseMetaAtt = $scope.UsecasecapecCat;
                                $scope.thdMeta_extch();
                            }
                        };
                    }
                } else {
                    $rootScope.loadinganimation = false;
                    if (data.Meta.length == 0) {
                        metaChck = 1;
                        $scope.UsecaseMetaAtt = " ";
                        $scope.thdMeta_extch();
                    }
                    $scope.thdMetadatas = [];
                    $scope.thdStrddatas = [];
                    $scope.UsecaseStrdAtt = "";
                    //alert("Sorry no data found");
                }

            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');
            });
        }
    }

    $scope.thdMeta_extch = function() {
        var chckempty = 0;
        if (typeof $scope.UsecaseMetaAtt != 'undefined') {
            if ($scope.UsecaseMetaAtt == " ") {
                $scope.UsecaseMetaAtt = $scope.UsecasecapecCat;
                chckempty = 1;
            }
            $rootScope.loadinganimation = true;
            $http.get($rootScope.url + '/populateStandardDropDown/' + $scope.UsecaseMetaAtt).success(function(data, status, headers, config) {
                $scope.thdStrddatas = [];
                $rootScope.loadinganimation = false;
                if (chckempty == 1) {
                    $scope.UsecaseMetaAtt = " ";
                }
                if (data.Standard.length != 0 && typeof data.Standard != 'undefined') {
                    var item = data.Standard;
                    for (var i = 0; i < item.length; i++) {
                        function isEmpty(obj) {
                            for (var prop in obj) {
                                if (obj.hasOwnProperty(prop)) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        if (typeof item[i].SurrId != 'undefined') {
                            $scope.thdStrddatas.push(item[i]);
                            $scope.UsecaseStrdAtt = "";
                        }
                        if (isEmpty(item[i])) {
                            var Metaempty = {
                                SurrId: " ",
                                Name: " ",
                                ID: " "
                            }
                            $scope.thdStrddatas.push(Metaempty);
                            $scope.UsecaseStrdAtt = "";
                        };

                    }
                } else {
                    $rootScope.loadinganimation = false;
                    if (data.Standard.length == 0) {
                        stdChck = 1;
                        $scope.UsecaseStrdAtt = " ";
                    }
                    $scope.thdStrddatas = [];
                }

            }).error(function(data, status, headers, config) {
                $rootScope.loadinganimation = false;
                alert('Sorry Application error in serverside');
            });
        }
    }

    $scope.thdCape_ch = function() {
        if (typeof $scope.thdCapdatas != 'undefined' && $scope.thdCapdatas != '') {
            if ($scope.thdCapdatas.length != 0) {
                for (var i = 0; i < $scope.thdCapdatas.length; i++) {
                    if ($scope.UsecasecapecCat == $scope.thdCapdatas[i].SurrId) {
                        $scope.thdCapeName = $scope.thdCapdatas[i].Name;
                        $scope.thdCapeID = $scope.thdCapdatas[i].ID;
                    };
                }
            }
        }
    }


    $scope.thdMeta_ch = function() {
        if (typeof $scope.thdMetadatas != 'undefined' && $scope.thdMetadatas != '') {
            if ($scope.thdMetadatas.length != 0) {
                for (var i = 0; i < $scope.thdMetadatas.length; i++) {
                    if ($scope.UsecaseMetaAtt == $scope.thdMetadatas[i].SurrId) {
                        $scope.thdMetaName = $scope.thdMetadatas[i].Name;
                        $scope.thdMetaID = $scope.thdMetadatas[i].ID;
                    };
                }
            }
        }
    }

    $scope.thdStrd_ch = function() {
        if (typeof $scope.thdStrddatas != 'undefined' && $scope.thdStrddatas != '') {
            if ($scope.thdStrddatas.length != 0) {
                for (var i = 0; i < $scope.thdStrddatas.length; i++) {
                    if ($scope.UsecaseStrdAtt == $scope.thdStrddatas[i].SurrId) {
                        $scope.thdStrd = $scope.thdStrddatas[i].Name;
                        $scope.thdStrdID = $scope.thdStrddatas[i].ID;
                    };
                }
            }
        }
    }

    $scope.ThdCrttables = [];
    $scope.thdUsecase_add = function() {
        if ($scope.ThdCrttables.length > 0) {
            var Thdctrltb = {};
            var checkthd = 0;
            if (typeof $scope.UsecasecapecCat != 'undefined' && $scope.UsecasecapecCat != "") {
                Thdctrltb.Thdcat = $scope.thdCapeName + "  " + $scope.thdCapeID;
                Thdctrltb.Thdcat_SurrId = $scope.UsecasecapecCat;
            }
            if (typeof $scope.UsecaseMetaAtt != 'undefined' && $scope.UsecaseMetaAtt != " " && $scope.UsecaseMetaAtt != "" && $scope.UsecaseMetaAtt.length != 0 && typeof $scope.thdMetaName != 'undefined' && typeof $scope.thdMetaID != 'undefined') {
                Thdctrltb.ThdPub = $scope.thdMetaName + "  " + $scope.thdMetaID;
                Thdctrltb.ThdPub_SurrId = $scope.UsecaseMetaAtt;
            } else {
                if ($scope.UsecaseMetaAtt == " ") {
                    Thdctrltb.ThdPub = "  ";
                    Thdctrltb.ThdPub_SurrId = " ";
                } else {
                    checkthd = 1;
                }
            }

            if (typeof $scope.UsecaseStrdAtt != 'undefined' && $scope.UsecaseStrdAtt != " " && $scope.UsecaseStrdAtt != "" && $scope.UsecaseStrdAtt.length != 0) {
                Thdctrltb.ThdCrtl = $scope.thdStrd + "  " + $scope.thdStrdID;
                Thdctrltb.ThdCrtl_SurrId = $scope.UsecaseStrdAtt;
            } else {
                if ($scope.UsecaseStrdAtt == " ") {
                    Thdctrltb.ThdCrtl = "  ";
                    Thdctrltb.ThdCrtl_SurrId = " ";
                } else {
                    checkthd = 1;
                }
            }
            var arr = Thdctrltb;
            var count = 0;
            $scope.ThdPush_data = function() {
                if (count == 1) {
                    alert("Record already selected, Please select another value ");
                } else {
                    $scope.ThdCrttables.push(Thdctrltb);
                }
            }

            if (checkthd == 1) {
                alert("Please select the value in Thread Model");
            }

            if (checkthd != 1) {
                if ($scope.ThdCrttables.length > 0) {
                    var looparray = $scope.ThdCrttables.length - 1;
                    count = 0;
                    for (var i = 0; i < $scope.ThdCrttables.length; i++) {
                        if ($scope.ThdCrttables[i].Thdcat_SurrId == arr.Thdcat_SurrId && $scope.ThdCrttables[i].ThdPub_SurrId == arr.ThdPub_SurrId && $scope.ThdCrttables[i].ThdCrtl_SurrId == arr.ThdCrtl_SurrId) {
                            count = 1;
                            if (looparray == i) {
                                $scope.ThdPush_data();
                                break;
                            }
                        } else {
                            if (looparray == i) {
                                $scope.ThdPush_data();
                                break;
                            }
                        }

                    }
                }
            }
        } else {
            var Thdctrltb = {};
            var checkonethd = 0;
            if (typeof $scope.UsecasecapecCat != 'undefined' && $scope.UsecasecapecCat != "" && $scope.UsecasecapecCat.length != 0) {
                Thdctrltb.Thdcat = $scope.thdCapeName + "  " + $scope.thdCapeID;
                Thdctrltb.Thdcat_SurrId = $scope.UsecasecapecCat;
            } else {
                checkonethd = 1;
            }

            if (typeof $scope.thdMetaName != 'undefined' && $scope.thdMetaName != "" && $scope.UsecaseMetaAtt != "" && $scope.UsecaseMetaAtt.length != 0 && $scope.UsecaseMetaAtt != " ") {
                Thdctrltb.ThdPub = $scope.thdMetaName + "  " + $scope.thdMetaID;
                Thdctrltb.ThdPub_SurrId = $scope.UsecaseMetaAtt;
            } else {
                if ($scope.UsecaseMetaAtt == " ") {
                    Thdctrltb.ThdPub = "  ";
                    Thdctrltb.ThdPub_SurrId = " ";
                } else {
                    checkonethd = 1;
                }
            }

            if (typeof $scope.thdStrd != 'undefined' && $scope.thdStrd != "" && $scope.UsecaseStrdAtt != '' && $scope.UsecaseStrdAtt.length != 0 && $scope.UsecaseStrdAtt != " ") {
                Thdctrltb.ThdCrtl = $scope.thdStrd + "  " + $scope.thdStrdID;
                Thdctrltb.ThdCrtl_SurrId = $scope.UsecaseStrdAtt;
            } else {
                if ($scope.UsecaseStrdAtt == " ") {
                    Thdctrltb.ThdCrtl = "  ";
                    Thdctrltb.ThdCrtl_SurrId = " ";
                } else {
                    checkonethd = 1;
                }
            }

            if (checkonethd != 1) {
                $scope.ThdCrttables.push(Thdctrltb);
            } else {
                alert("Please select the value in Thread Model");
            }
        }
    }

    $scope.Thdtableremove = function(Thdtbdata, index) {
        Thdtbdata.splice(index, 1);
    }

    $scope.reSetupdate = function() {
        $scope.crtRuleAlert = '';
        $scope.crtRuleDashBoard = '';
        $scope.crtReferSet = '';
        $scope.crtRuleEventName = '';
        UsecaseService.setUsecasecrtdata('');
        $scope.UpdateRuleID = "";
        $scope.updateUsecase = {
            SearchPage: true,
            updatePage: false
        }
    };
    var statusOOBu;
    $scope.$watch(function () {
    	if($scope.uformcontrolYN=="Yes"){
    		statusOOBu="Y";
    	}
    	else if($scope.uformcontrolYN=="No"){
    		statusOOBu="N";
    	}
    });
    
    //OOB update selection
    /*$scope.obbUpdate = function () {
    	if($scope.uformcontrolYN=="Yes"){
    		statusOOBu="Y";
    	}
    	else if($scope.uformcontrolYN=="No"){
    		statusOOBu="N";
    	}
    }*/
    
    
    // Update Rule post Json
    $scope.crtRuleSubmit = function() {
        var evtattri_SurrId = [];
        var logSou_SurrId = [];
        var crtRuleInput_SurrId = [];
        var crtRuleOuput_SurrId = [];

        if (typeof $scope.crtRuleTrsn != 'undefined') {
            for (var k = 0; k < $scope.crtRuleTrsn.length; k++) {
                var crtRuleTrsnId = {};
                crtRuleTrsnId.SurrId = $scope.crtRuleTrsn[k];
                crtRuleInput_SurrId.push(crtRuleTrsnId);
            }
        }

        if (typeof $scope.crtRuleRefr != 'undefined') {
            for (var z = 0; z < $scope.crtRuleRefr.length; z++) {
                var crtRuleRefrId = {};
                crtRuleRefrId.SurrId = $scope.crtRuleRefr[z];
                crtRuleInput_SurrId.push(crtRuleRefrId);
            }
        }

        if (typeof $scope.crtRuleEventName != 'undefined') {
            for (var w = 0; w < $scope.crtRuleEventName.length; w++) {
                var crtRuleEventNameId = {};
                crtRuleEventNameId.SurrId = $scope.crtRuleEventName[w];
                crtRuleInput_SurrId.push(crtRuleEventNameId);
            }
        }

        if (typeof $scope.crtRuleEventAttribute != 'undefined') {
            for (var i = 0; i < $scope.crtRuleEventAttribute.length; i++) {
                var evtattri = {};
                evtattri.SurrId = $scope.crtRuleEventAttribute[i];
                evtattri_SurrId.push(evtattri);
            }
        }

        if (typeof $scope.crtRuleLogSource != 'undefined') {
            for (var j = 0; j < $scope.crtRuleLogSource.length; j++) {
                var logSouId = {};
                logSouId.SurrId = $scope.crtRuleLogSource[j];
                logSou_SurrId.push(logSouId);
            }
        }


        if (typeof $scope.crtRuleReport != 'undefined') {
            for (var u = 0; u < $scope.crtRuleReport.length; u++) {
                var crtRuleReportId = {};
                crtRuleReportId.SurrId = $scope.crtRuleReport[u];
                crtRuleOuput_SurrId.push(crtRuleReportId);
            }
        }



        var ruleOutput = [{
            SurrId: $scope.crtRuleDashBoard,
        }, {
            SurrId: $scope.crtRuleAlert,
        }, {
            SurrId: $scope.crtReferSet,
        }];

        for (var w = 0; w < ruleOutput.length; w++) {
            //crtRuleOuput_SurrId.push(ruleOutput[w]);
            if (typeof ruleOutput[w].SurrId != 'undefined' && ruleOutput[w].SurrId != '') {
                crtRuleOuput_SurrId.push(ruleOutput[w]);
            }
        }
        var ThdCrt = [];
        for (var g = 0; g < $scope.ThdCrttables.length; g++) {
            var ThdCrtda = {};
            ThdCrtda.CapecSurrId = $scope.ThdCrttables[g].Thdcat_SurrId;
            ThdCrtda.MetaSurrId = $scope.ThdCrttables[g].ThdPub_SurrId;
            ThdCrtda.StandardId = $scope.ThdCrttables[g].ThdCrtl_SurrId;
            ThdCrt.push(ThdCrtda);
        }

        if (typeof $scope.crtRuleDsecpt == 'undefined') {
            $scope.crtRuleDsecpt = "";
        }
        if (typeof $scope.crtRulepesducode == 'undefined') {
            $scope.crtRulepesducode = "";
        }
        if (typeof $scope.crtRuletestlogic == 'undefined') {
            $scope.crtRuletestlogic = "";
        }
        if (typeof $scope.crtRuleReportlogic == 'undefined') {
            $scope.crtRuleReportlogic = "";
        }
        if (typeof $scope.crtRuleSaveSrchlogic == 'undefined') {
            $scope.crtRuleSaveSrchlogic = "";
        }
        if (typeof $scope.crtRuleBuildlogic == 'undefined') {
            $scope.crtRuleBuildlogic = "";
        }
        if (typeof $scope.crtRuleRefSetInc == 'undefined') {
            $scope.crtRuleRefSetInc = "";
        }
        if (typeof $scope.crtRuleResponse == 'undefined') {
            $scope.crtRuleResponse = "";
        }
        if (typeof $scope.crtRuleDsecpt == 'undefined') {
            $scope.crtRuleDsecpt = "";
        }
        if (typeof $scope.crtRuleEventName == 'undefined') {
            $scope.crtRuleEventName = "";
        }

       
        var crtRule_postJson = {
            ruleObj: {
                "ruleSurrId": $scope.updateRule_surrId,
                "usecaseSurrId": $scope.crtUsercaseSurrId,
                "id": $scope.crtRuleID,
                "name": $scope.crtRuleName,
                "description": $scope.crtRuleDsecpt,
                "pseudo_code": $scope.crtRulepesducode,
                "rule_tst_iogic": $scope.crtRuletestlogic,
                "report_logic": $scope.crtRuleReportlogic,
                "save_search_logic": $scope.crtRuleSaveSrchlogic,
                "building_blocks": $scope.crtRuleBuildlogic,
                "reference_set_ind": $scope.crtRuleRefSet,
                "event_name": "",
                "response_text": $scope.crtRuleResponse,
                "oob_flag": statusOOBu
            },
            "input": crtRuleInput_SurrId,
            "output": crtRuleOuput_SurrId,
            "event_attribute": evtattri_SurrId,
            "log_source": logSou_SurrId,
            "ThreadModelGroup": ThdCrt
        };
        if (typeof $scope.crtRuleID != 'undefined' && typeof $scope.crtRuleName != 'undefined' && $scope.crtRuleID != '' && typeof $scope.crtRuleName != '') {
            
            $http.post($rootScope.url + '/updateRule', crtRule_postJson).success(function(data, status, headers, config) {
                alert('Update Rule Successfully saved');
                ThdCrt.length = 0;
                $scope.ThdCrttables.length = 0;
                $scope.reSetupdate();
            }).error(function(data, status, headers, config) {
                alert("Sorry Application error in serverside");
            });
        } else {
            alert("Please fill all mandatory fields");
        }
    }

    $rootScope.loadinganimation = true;
    $http.get($rootScope.url + '/getRuleTabData').success(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        $scope.Rule_data = data;
        $scope.transdatas = [];
        $scope.Referdatas = [];
        $scope.eventcatdatas = [];
        $scope.Commentsdatas = [];
        $scope.dashboarddatas = [];
        $scope.alertdatas = [];
        $scope.Reportdatas = [];
        $scope.refesetdatas = [];

        for (var i = 0; i < data.Input.length; i++) {
            if (data.Input[i].Name == 'Transactional Data') {
                var transgetdata = {};
                transgetdata.Name = data.Input[i].Value;
                transgetdata.SurrId = data.Input[i].SurrId;
                $scope.transdatas.push(transgetdata);
            } else if (data.Input[i].Name == 'Referential Data') {
                var Refergetdata = {};
                Refergetdata.Name = data.Input[i].Value;
                Refergetdata.SurrId = data.Input[i].SurrId;
                $scope.Referdatas.push(Refergetdata);
            } else if (data.Input[i].Name == 'Event Name/Category') {
                var eventgetdata = {};
                eventgetdata.Name = data.Input[i].Value;
                eventgetdata.SurrId = data.Input[i].SurrId;
                $scope.eventcatdatas.push(eventgetdata);
            }
        }

        for (var j = 0; j < data.Output.length; j++) {
            if (data.Output[j].Name == 'Dashboard') {
                var dashboardData = {};
                dashboardData.Name = data.Output[j].Value;
                dashboardData.SurrId = data.Output[j].SurrId;
                $scope.dashboarddatas.push(dashboardData);
            } else if (data.Output[j].Name == 'Alert') {
                var alertdata = {};
                alertdata.Name = data.Output[j].Value;
                alertdata.SurrId = data.Output[j].SurrId;
                $scope.alertdatas.push(alertdata);
            } else if (data.Output[j].Name == 'Report') {
                var Reportdata = {};
                Reportdata.Name = data.Output[j].Name + ' - ' + data.Output[j].Value;
                Reportdata.SurrId = data.Output[j].SurrId;
                $scope.Reportdatas.push(Reportdata);
            } else if (data.Output[j].Name == 'Reference Set') {
                var refesetdata = {};
                refesetdata.Name = data.Output[j].Value;
                refesetdata.SurrId = data.Output[j].SurrId;
                $scope.refesetdatas.push(refesetdata);
            } else if (data.Output[j].Name == 'Comments') {
                var Commentsdata = {};
                Commentsdata.Name = data.Output[j].Value;
                Commentsdata.SurrId = data.Output[j].SurrId;
                $scope.Commentsdatas.push(Commentsdata);
            }
        }

    }).error(function(data, status, headers, config) {
        $rootScope.loadinganimation = false;
        alert("Sorry Application error in serverside");
    });


    $scope.licreateruledetails = 'active';
    $scope.ruledetails = true;
    $scope.rulesource = false;
    $scope.ruleinput = false;
    $scope.ruleoutput = false;
    $scope.ruleresponse = false;
    $scope.rulethd = false;

    $scope.lidetails = function() {
        $scope.licreateruledetails = 'active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreateruleresponse = 'no-active';
        $scope.licreaterulethd = 'no-active';
        $scope.ruledetails = true;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleinputdata = false;
        $scope.ruleoutput = false;
        $scope.ruleresponse = false;
        $scope.rulethd = false;


    }
    $scope.liinput = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreateruleresponse = 'no-active';
        $scope.licreaterulethd = 'no-active';
        $scope.ruledetails = false;
        $scope.ruleinput = true;
        $scope.rulesource = false;
        $scope.ruleinputdata = false;
        $scope.ruleoutput = false;
        $scope.rulethd = false;
    }

    $scope.lioutput = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'active';
        $scope.licreateruleresponse = 'no-active';
        $scope.licreaterulethd = 'no-active';
        $scope.ruledetails = false;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleoutput = true;
        $scope.ruleresponse = false;
        $scope.rulethd = false;
    }

    $scope.liresponse = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreateruleresponse = 'active';
        $scope.licreaterulethd = 'no-active';
        $scope.ruledetails = false;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleoutput = false;
        $scope.ruleresponse = true;
        $scope.rulethd = false;
    }
    $scope.lithd = function() {
        $scope.licreateruledetails = 'no-active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreateruleresponse = 'no-active';
        $scope.licreaterulethd = 'active';
        $scope.ruledetails = false;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleoutput = false;
        $scope.ruleresponse = false;
        $scope.rulethd = true;
    }
}]);