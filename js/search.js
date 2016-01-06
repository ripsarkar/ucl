app.directive('readMore', function() {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<p></p>',
    scope: {
      moreText: '@',
      lessText: '@',
      words: '@',
      ellipsis: '@',
      char: '@',
      limit: '@',
      content: '@'
    },
    link: function(scope, elem, attr, ctrl, transclude) {
      var moreText = angular.isUndefined(scope.moreText) ? ' <a class="read-more"> ...More</a>' : ' <a class="read-more">' + scope.moreText + '</a>',
        lessText = angular.isUndefined(scope.lessText) ? ' <a class="read-less"> ...Less</a>' : ' <a class="read-less">' + scope.lessText + '</a>',
        ellipsis = angular.isUndefined(scope.ellipsis) ? '' : scope.ellipsis,
        limit = angular.isUndefined(scope.limit) ? 35 : scope.limit;

      attr.$observe('content', function(str) {
        readmore(str);
      });

      transclude(scope.$parent, function(clone, scope) {
        readmore(clone.text().trim());
      });

      function readmore(text) {

        var text = text,
          orig = text,
          regex = /\s+/gi,
          charCount = text.length,
          wordCount = text.trim().replace(regex, ' ').split(' ').length,
          countBy = 'char',
          count = charCount,
          foundWords = [],
          markup = text,
          more = '';

        if (!angular.isUndefined(attr.words)) {
          countBy = 'words';
          count = wordCount;
        }

        if (countBy === 'words') { // Count words

          foundWords = text.split(/\s+/);

          if (foundWords.length > limit) {
            text = foundWords.slice(0, limit).join(' ') + ellipsis;
            more = foundWords.slice(limit, count).join(' ');
            markup = text + moreText + '<span class="more-text">' + more + lessText + '</span>';
          }

        } else { // Count characters

          if (count > limit) {
            text = orig.slice(0, limit) + ellipsis;
            more = orig.slice(limit, count);
            markup = text + moreText + '<span class="more-text">' + more + lessText + '</span>';
          }

        }

        elem.append(markup);
        elem.find('.read-more').on('click', function() {
          $(this).hide();
          elem.find('.more-text').addClass('show').slideDown();
        });
        elem.find('.read-less').on('click', function() {
          elem.find('.read-more').show();
          elem.find('.more-text').hide().removeClass('show');
        });

      }
    }
  };
});


app.directive('nodeTree', function() {
    return {
        template: '<node ng-repeat="node in tree"></node>',
        replace: true,
        transclude: true,
        restrict: 'E',
        scope: {
            tree: '=ngModel'
        }
    };
});
//
app.directive('node', function($compile) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'thetree.html',
        link: function(scope, elm, attrs) {
            $(elm).find('span.leaf').on('click', function(e) {
                if ($(this).hasClass('treeselecteall')) {
                    scope.clearfun();
                } else {
                    var toggleIncrementDisplay = function(index, children) {
                        if (!children || index >= children.length) {
                            return;
                        }
                        var isVisible = $(children[index]).is(":visible");
                        $(children[index]).toggle(100, function() {
                            toggleIncrementDisplay(index + 1, children);
                        });
                    }
                    var isVisible = $(elm).find('> ul >li').is(":visible");
                    var icon = $(elm).find('> span.leaf i');
                    if ($(icon).text() != 'Clear' && $(icon).hasClass('glyphicon-plus') || $(icon).hasClass('glyphicon-minus')) {
                        if (icon) {
                            $(icon).toggleClass('glyphicon-plus', isVisible);
                            $(icon).toggleClass('glyphicon-minus', !isVisible);
                        }
                        toggleIncrementDisplay(0, $(elm).find('>ul >li'));
                    }
                }
                e.stopPropagation();
            });

            angular.element('span.firstli').on('click', function(e) {
                angular.element('li').find('.parent_li ul li').hide();
                angular.element('li').find('.glyphicon-minus').removeClass('glyphicon-minus').addClass('glyphicon-plus');
                e.stopPropagation();
            });
            
            

            scope.nodeClicked = function(node) {
                node.checked = !node.checked;
                function checkChildren(c) {
                    angular.forEach(c.children, function(c) {
                        if(c.disabled== true){
                            c.checked = true;
                        }else{
                            c.checked = node.checked;
                        }
                        checkChildren(c);
                    });
                }
                checkChildren(node);
            };

            var txt = angular.element("span.leaf i");
            var txt1 = angular.element(txt[0]).removeAttr('class');
            for (var i = 0; i < txt1.length; i++) {
                if (i == 0) {
                    angular.element(txt1).parent('span').addClass('treeselecteall');
                    angular.element(txt1).addClass('treeicon pull-right selectallfilter').empty().append('Clear');
                    var chckcollapse = angular.element('.treeselecteall').parent();
                    $(chckcollapse).children('.collapse_all').addClass('firstli').empty().append('<i class="glyphicon glyphicon-resize-small"></i>');
                }
            };
            

            scope.filterclearall = function(node) {
            	//hiding relationshiptable
            	scope.dimensionrelationtable=false;
            	//
                var clearall = node.Type;
                if (clearall == 'Selectall') {
                    if (node.checked == true) {
                        scope.nodeClicked(node);
                    } else {
                        scope.nodeClicked(node);
                        scope.nodeClicked(node);
                    }
                }
            }


            scope.switcher = function(booleanExpr, trueValue, falseValue) {
                return booleanExpr ? trueValue : falseValue;
            };

            scope.isLeaf = function(_data) {
                if (_data.children.length == 0) {
                    return true;
                }
                return false;
            };

            if (scope.node.children.length > 0) {
                var childNode = $compile('<ul ><node-tree ng-model="node.children"></node-tree></ul>')(scope)
                elm.append(childNode);
            }
            //angular.element('.parent_li ul li').addClass('displaynone');
            //angular.element('.parent_li ul li ul li').hide();
        }
    };
});



app.factory('Items', ['$http','$rootScope', function($http, $rootScope) {
        var valcouutet = null;
        return {
            getJson: function(url) {
                var ItemsJson = $http.get(url).then(function(response) {
                    var treedata = response.data;
                    var obj = [{
                        "Type": "Selectall",
                        "SurrId": 1,
                        "Name": "Select all",
                        "children": treedata.Tree
                    }];
                    var Isdisable = false;
                    var Ischecked = false;
                    var industryCount =0;
                    function chckId(threadNode) {
                        threadNode.name = threadNode.name + "(" + threadNode.ID + ")";
                        if (typeof threadNode.children != 'undefined') {
                            if (threadNode.children.length > 0) {
                                var threadinnerchld = threadNode.children
                                for (var x = 0; x < threadinnerchld.length; x++) {
                                    chckId(threadinnerchld[x]);
                                }
                            }
                        }
                        return threadNode;
                    }
                    var CatgeType = [];
                    var cageObj = {};
                    var catgearray = [];
                    var catge = obj[0].children;
                    var Cbyobj = [];
                    var Regobj = [];
                    var Induobj = [];
                    var epobj = [];
                    var threObj = [];
                    var logObj = [];
                    var cbyusec = [];
                    var CbyJsonobj = {};
                    var RegJsonobj = {};

                    function processNode(rnode) {
                        for (var i = 0; i < rnode.length; i++) {
                            rnode[i].show = true;
                            rnode[i].checked = false;
                            rnode[i].name = rnode[i].Name;
                            if (rnode[i].children == 'undefined') {
                                rnode[i].children = [];
                            }
                            delete rnode[i].Name;
                            var rnode1 = rnode[i];
                            if (rnode1.children.length > 0) {
                                var rnode2 = rnode1.children;
                                processNode(rnode2);
                            }
                        }
                        return rnode;
                    }

                    var dtata = processNode(obj);
                    var catypo = dtata[0].children;
                    for (var j = 0; j < catypo.length; j++) {
                        if (catypo[j].Type == "CyberSecFunc") {
                            if (catypo[j].children.length > 0) {
                                var usrchld = catypo[j].children;
                                if (usrchld.length > 0) {
                                    for (var k = 0; k < usrchld.length; k++) {
                                        usrchld[k].ThreadModelType = "C";
                                        var usSubcase = usrchld[k].children;
                                        if (usSubcase.length > 0) {
                                            for (var x = 0; x < usSubcase.length; x++) {
                                                usSubcase[x].ThreadModelType = "SC";
                                            }
                                            var UseCaObjt = [{
                                                Type: "UseCaseSubCat",
                                                name: "Usecase SubCategory",
                                                show: true,
                                                checked: false,
                                                disabled: false,
                                                children: usSubcase
                                            }];
                                            usrchld[k].children = UseCaObjt;
                                        }
                                    }
                                }
                                var UseCaObjt = [{
                                    Type: "UseCaseCat",
                                    name: "Usecase Category",
                                    show: true,
                                    checked: false,
                                    disabled: false,
                                    children: catypo[j].children
                                }];
                                catypo[j].children = UseCaObjt;
                            }
                            Cbyobj.push(catypo[j]);
                        } else if (catypo[j].Type == "RegCat") {
                            if (catypo[j].children.length > 0) {
                                var Regusrchld = catypo[j].children;
                                if (Regusrchld.length > 0) {
                                    for (var k = 0; k < Regusrchld.length; k++) {
                                        Regusrchld[k].ThreadModelType = "P";
                                        var RegusSubcase = Regusrchld[k].children;
                                        if (RegusSubcase.length > 0) {
                                            for (var x = 0; x < RegusSubcase.length; x++) {
                                                RegusSubcase[x].ThreadModelType = "CN";
                                            }
                                            var RegUseCaObjt = [{
                                                Type: "RegCntl",
                                                name: "Regulatory Control",
                                                show: true,
                                                checked: false,
                                                disabled: false,
                                                children: RegusSubcase
                                            }];
                                            Regusrchld[k].children = RegUseCaObjt;
                                        }
                                    }
                                }
                                var RegUseCaObjt = [{
                                    Type: "RegPub",
                                    name: "Regulatory Publication",
                                    show: true,
                                    checked: false,
                                    disabled: false,
                                    children: catypo[j].children
                                }];
                            }
                            catypo[j].children = RegUseCaObjt;
                            Regobj.push(catypo[j]);
                        } else if (catypo[j].Type == "Industry") {
                            industryCount++;
                            catypo[j].checked =Ischecked;
                            catypo[j].disabled =Isdisable;
                            Induobj.push(catypo[j]);
                        } else if (catypo[j].Type == "EP") {
                            catypo[j].checked =Ischecked;
                            catypo[j].disabled =Isdisable;
                            epobj.push(catypo[j]);
                        } else if (catypo[j].Type == "ThreadModel") {
                            catypo[j].checked =Ischecked;
                            catypo[j].disabled =Isdisable;
                            var theardID = catypo[j];
                            threObj.push(chckId(theardID));
                        } else if (catypo[j].Type == "LogSource") {
                            catypo[j].checked =Ischecked;
                            catypo[j].disabled =Isdisable;
                            logObj.push(catypo[j]);
                        }
                    }
                    if(Induobj.length <=1){
                        Induobj[0].checked = true;
                        Induobj[0].disabled = true;
                        Isdisable = true;
                        Ischecked = true;
                    };
                    CatgeType = [{
                        Type: 'CyberSecFunc',
                        name: 'Cyber Security',
                        show: true,
                        checked: false,
                        disabled: false,
                        children: Cbyobj
                    }, {
                        Type: 'RegCat',
                        name: 'Regulatory Category',
                        show: true,
                        checked: false,
                        disabled: false,
                        children: Regobj
                    }, {
                        Type: 'Industry',
                        name: 'Industry',
                        show: true,
                        checked: Ischecked,
                        disabled: Isdisable,
                        children: Induobj
                    }, {
                        Type: 'EP',
                        name: 'EP',
                        show: true,
                        checked: false,
                        disabled: false,
                        children: epobj
                    }, {
                        Type: 'ThreadModel',
                        name: 'Threat Model',
                        show: true,
                        checked: false,
                        disabled: false,
                        children: threObj
                    }, {
                        Type: 'LogSource',
                        name: 'LogSource',
                        show: true,
                        checked: false,
                        disabled: false,
                        children: logObj
                    }];

                    var cageObj = [{
                        Type: "Selectall",
                        SurrId: 1,
                        name: "Select all",
                        show: true,
                        checked: false,
                        disabled: false,
                        children: CatgeType
                    }];
                    return cageObj;
                });
                return ItemsJson;
            }
        }
    }
]);


app.controller("searchController",["$scope","SearchResultService","$rootScope", 'Items', '$http', function($scope, SearchResultService, $rootScope, Items, $http){
	 $scope.showModal = false;
	
	/////////////////////////////////////////////////////////
	 var postjsonresult = {
				"RegCat": [],
				"CyberSecFunc": [],
				"Industry": [],
				"EP": [],
				"ThreatModel": [],
				"LogSource": [],
				"oobParam": "", 
				"useCaseRuleIdName": ""
			};
	var obj  = {};
	var threatModelObj;
	var CyberSecFunc = [];
	var RegCat = [];
	var Industry=[];
	var EP=[];
	var LogSource=[];
	var ThreatModel=[];
	
	$scope.items = [];
	var cybertoname="";
	var cybertoname2="";
	var RegCatoname="";
	var threatname="";
	var threatname2="";

	$rootScope.loadinganimation=true;
	
	
	 $http.get($rootScope.url+"/getAllApiNew/9052").success(function(result){
                //clearing console
                    clearconsole();
		 $rootScope.loadinganimation=false;
		 $scope.regulacat = result.RegCat;
		 $scope.cybersec = result.CyberSecFunc;
		 $scope.industry = result.Industry;
		 $scope.eepp = result.EP;
		 $scope.logsour = result.LogSource;
		 $scope.thrtmodl = result.ThreatModel;
		 
		 
		 //////////////////////////////////////////////////////////////
			obj = result;
			
			threatModelObj=result.ThreatModel;
			obj.RegCat = result.RegCat;
			obj.CyberSecFunc = result.CyberSecFunc;
			obj.ThreatModel = result.ThreatModel;
			ThreatModel = result.ThreatModel;
			obj.Industry = result.Industry;
			obj.EP = result.EP;
			obj.LogSource = result.LogSource;
			//code cyber sec
			
			var UseCaseCatX={};
			UseCaseCatX["UseCaseCat"]=[];
			UseCaseCatX["id"]=[];
			
			var UseCaseSubCatX={};
			UseCaseSubCatX["UseCaseSubCat"]=[];
			UseCaseSubCatX["id"]=[];		
			
			var UseCaseSubSubCatX={};
			UseCaseSubSubCatX["id"]=[];		
			

			
			for(i=0;i<obj.CyberSecFunc.length;i++){
				
				UseCaseCatX={}
				UseCaseCatX["UseCaseCat"]=[];
				UseCaseCatX["id"]=obj.CyberSecFunc[i].SurrId;
				
				if(i==0){
					cybertoname = cybertoname + obj.CyberSecFunc[i].Name+"-";
					}
					else{
					cybertoname = cybertoname +"/"+  obj.CyberSecFunc[i].Name+"-";
					}
				
			    for(j=0;j<obj.CyberSecFunc[i].UseCaseCat.length;j++){
			    	UseCaseSubCatX={};
			    	UseCaseSubCatX["UseCaseSubCat"]=[];
					UseCaseSubCatX["id"]=obj.CyberSecFunc[i].UseCaseCat[j].SurrId;
					
					if(j==0){
						cybertoname = cybertoname +"-" + obj.CyberSecFunc[i].UseCaseCat[j].Name+"-";
						}
						else{
						cybertoname = cybertoname +"-"+  obj.CyberSecFunc[i].UseCaseCat[j].Name+"-";
						}
					
					
					for(k=0;k<obj.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat.length;k++){
				    	UseCaseSubSubCatX={};
				    	UseCaseSubSubCatX["id"]=obj.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat[k].SurrId;
				    	UseCaseSubCatX["UseCaseSubCat"].push(UseCaseSubSubCatX);
				    	
						if(k==0){
							cybertoname = cybertoname + obj.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat[k].Name;
							}
							else{
							cybertoname = cybertoname +","+  obj.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat[k].Name;
							}
		
					
				    }
			    	UseCaseCatX["UseCaseCat"].push(UseCaseSubCatX);
			    }
		    	CyberSecFunc.push(UseCaseCatX);
			}
			console.log("cyber");
			console.log(cybertoname);

			//regcat
			var RegPubtX={};
			RegPubtX["RegPub"]=[];
			RegPubtX["id"]=[];
			
			var RegCntlX={};
			RegCntlX["RegCntl"]=[];
			RegCntlX["id"]=[];
			
			var RegCntlCntlX={};
			RegCntlCntlX["id"]=[];	
			for(i=0;i<obj.RegCat.length;i++){
				
				RegPubtX={}
				RegPubtX["RegPub"]=[];
				RegPubtX["id"]=obj.RegCat[i].SurrId;
				
				if(i==0){
					RegCatoname = RegCatoname + obj.RegCat[i].Name+"-";
					}
					else{
					RegCatoname = RegCatoname +"/"+  obj.RegCat[i].Name+"-";
					}

			    for(j=0;j<obj.RegCat[i].RegPub.length;j++){
			    	RegCntlX={};
			    	RegCntlX["RegCntl"]=[];
			    	RegCntlX["id"]=obj.RegCat[i].RegPub[j].SurrId;
			    	
					if(j==0){
						RegCatoname = RegCatoname +"-" + obj.RegCat[i].RegPub[j].Name+"-";
						}
						else{
						RegCatoname = RegCatoname +"-"+  obj.RegCat[i].RegPub[j].Name+"-";
						}
			    	
			    	
			    for(k=0;k<obj.RegCat[i].RegPub[j].RegCntl.length;k++){
			    	RegCntlCntlX={};
			    	RegCntlCntlX["id"]=obj.RegCat[i].RegPub[j].RegCntl[k].SurrId;
			    	RegCntlX["RegCntl"].push(RegCntlCntlX);
			    	
					if(k==0){
						RegCatoname = RegCatoname + obj.RegCat[i].RegPub[j].RegCntl[k].Name;
						}
						else{
						RegCatoname = RegCatoname +","+  obj.RegCat[i].RegPub[j].RegCntl[k].Name;
						}
			    }
			    RegPubtX["RegPub"].push(RegCntlX);
			}
			RegCat.push(RegPubtX);
			}
			
			console.log("RegCat");

			console.log(RegCat);
			
			
			//Threat model
			var thrt = {};
			var threatarry=[];

			for(i=0;i<obj.ThreatModel.length;i++){
				
				
				if(i==0){
					threatname = threatname + obj.ThreatModel[i].Name+"(" +obj.ThreatModel[i].SurrId+")-";
					}
					else{
					threatname = threatname +"/"+  obj.ThreatModel[i].Name+"(" +obj.ThreatModel[i].SurrId+")-";
					}

				thrt = {}
			    thrt["id"] = obj.ThreatModel[i].SurrId;
				threatarry.push(thrt);
			    for(j=0;j<obj.ThreatModel[i].children.length;j++){
					if(j==0){
						threatname = threatname +"-" + obj.ThreatModel[i].children[j].Name+"(" +obj.ThreatModel[i].children[j].SurrId+")-";
						}
						else{
						threatname = threatname +"-"+  obj.ThreatModel[i].children[j].Name+"(" +obj.ThreatModel[i].children[j].SurrId+")-";
						}


			    thrt = {}
			    thrt["id"] = obj.ThreatModel[i].children[j].SurrId;
			    threatarry.push(thrt);
				    for(k=0;k<obj.ThreatModel[i].children[j].children.length;k++){
						if(k==0){
							threatname = threatname +"-" + obj.ThreatModel[i].children[j].children[k].Name+"(" +obj.ThreatModel[i].children[j].children[k].SurrId+")-";
							}
							else{
							threatname = threatname +"-"+  obj.ThreatModel[i].children[j].children[k].Name+"(" +obj.ThreatModel[i].children[j].children[k].SurrId+")-";
							}
				    thrt = {}
				    thrt["id"] = obj.ThreatModel[i].children[j].children[k].SurrId;
				    threatarry.push(thrt);
				    }
			    }
			}

			obj.ThreatModel=[];
			for(i=0;i<threatarry.length;i++){
			obj.ThreatModel.push(threatarry[i]);
			}
			
			//industry
			var indus={};
			 indus["id"]=[];
			for(i=0;i<obj.Industry.length;i++){
				indus={};
			     indus["id"]= obj.Industry[i].SurrId;
			     Industry.push(indus);

			}
			//EP
			var ep={};
			 ep["id"]=[];
			for(i=0;i<obj.EP.length;i++){
				ep={};
				ep["id"]= obj.EP[i].SurrId;
			    EP.push(ep);

			}
			//LogSource
			var logSource={};
			 logSource["id"]=[];
			for(i=0;i<obj.LogSource.length;i++){
				logSource={};
				logSource["id"]= obj.LogSource[i].SurrId;
				LogSource.push(logSource);

			}
			
			
			
			
		 //////////////////////////////////////////////////////////////
		 
		 
		 
		 
	 }).error(function(data, status, headers, config) {
         $rootScope.loadinganimation = false;
                //clearing console
                    clearconsole();
     });
	 
	 
	 angular.element(function () {
			angular.element('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
			angular.element('.tree li.parent_li > span').on('click', function (e) {
				
				angular.element(this).next("ul").css('display','inline');

		        var children = angular.element(this).parent('li.parent_li').find(' > ul > li');
		        if (children.is(":visible")) {
		            children.hide('fast');
		            angular.element(this).attr('title', 'Expand this branch').find(' > i').text("+");
		            angular.element(".parenttreenone").css({
			            'overflow-y': 'hidden',
			            'height': '300px'
			            });

		        } else {
		            children.show('fast');
		            angular.element(this).attr('title', 'Collapse this branch').find(' > i').text("-");
		            angular.element(".parenttreenone").css({
			            'overflow-y': 'scroll',
			            'height': '300px'
			            });
		        }
		        e.stopPropagation();
		    });
	});
	 
	var mm=true;
	angular.element('.tree li.parent_li > span').on('click',function () {
		if(mm){
		angular.element('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
		angular.element('.tree li.parent_li > span').on('click', function (e) {
	        var children = angular.element(this).parent('li.parent_li').find(' > ul > li');
	        if (children.is(":visible")) {
	            children.hide('fast');
	            angular.element(this).attr('title', 'Expand this branch').find(' > i').text("+");
	        } else {
	            children.show('fast');
	            angular.element(this).attr('title', 'Collapse this branch').find(' > i').text("-");
	        }
	        e.stopPropagation();
	    });
		mm=false;
		}
		else{
			e.stopPropagation();
		}
	});

	angular.element('.collapall').on('click',function () {
		//alert(2);
		angular.element(".start").next("ul").css('display','none');
        angular.element(".parenttreenone").css({
            'overflow-y': 'hidden',
            'height': '300px'
            });
        angular.element(".headPlus").text("+");
	});
	 
	$scope.$watch(function () {

		//ruleID length
		$rootScope.ruleLength = angular.element(".searchtabBody").children('tr').length;
		//
		angular.element("input[type='checkbox']").change(function () {
			angular.element(this).siblings('ul')
		           .find("input[type='checkbox']")
		           .prop('checked', this.checked);
		  });
		/*if(angular.element(".findchild").children().length==0){
			angular.element(".findchild").parent('li').remove();
		}*/
	});

	 
	 
	 $scope.clear = function() {
        $scope.items=[];
		 $scope.currentTab = 'html/search-result.html';
	        $scope.dimensionrule=false;
	        $scope.dimensionrelationtable=false;
	        $scope.tabledata =[];
	       $scope.showResult = false;
	       $scope.userMsg = "Please select search criteria from left";
	 }
	angular.element('.alltreeclear').on('click',function () {     
		angular.element("input[type='checkbox']").siblings('ul')
        .find("input[type='checkbox']")
        .prop('checked', false);
		angular.element(this).siblings("input[type='checkbox']")
        .prop('checked', false);
		postjsonresult = {
				"RegCat": [],
				"CyberSecFunc": [],
				"Industry": [],
				"EP": [],
				"ThreatModel": [],
				"LogSource": []
			};
	});
	
	
//////////////////CODE FOR CYBERSEC//////////////////////

	var matchfound = false;
	var semimatchfound = false;
	var subcatlast ={};
	var UseCSubCat={};
	var usecase ={};
	var i,j,k;

	
	$scope.tableReset = function(){
		angular.element('#rateplanmapping-scroll tbody').scrollTop(0);
		$scope.resultdata={
              cateGory:[]
          };
          $scope.chckresult();
          $scope.showResult = false;
          $scope.dimensionrule=false;
          $scope.dimensionrelationtable=false;
	}
	
	$scope.entervalueSubcat = function($event,ndval,nameval){
		 $scope.tableReset();
		
		subcatlast ={};
		UseCSubCat={};
		usecase ={};
		//get last id
		subcatlast["id"] = parseInt(ndval);
		//get 2ndid
		var ucCatSuID=angular.element($event.currentTarget).parent().parent().parent().parent().parent().children('input').val();
		var ucCatSuName=angular.element($event.currentTarget).parent().parent().parent().parent().parent().children('div').text();
		//get 1stid
		var ucSubCatSuID=angular.element($event.currentTarget).parent().parent().parent().parent().parent().parent().parent().parent().parent().children('input').val();
		var ucSubCatSuName=angular.element($event.currentTarget).parent().parent().parent().parent().parent().parent().parent().parent().parent().children('div').text();
		
		var totalname = ucSubCatSuName +"-"+ ucCatSuName +"-"+ nameval;
		//inserting element in post json
		if(angular.element($event.currentTarget).is(':checked') == true){
			
			//search criteria

				$scope.items.push({names:totalname, ids:ndval,idname:"CyberSecFunc",idsubname:ucSubCatSuName,idsubsubname:ucCatSuName});
			
			//search criteria ends

			for(i=0;i<postjsonresult.CyberSecFunc.length;i++){
				if(postjsonresult.CyberSecFunc[i].id == ucSubCatSuID){
					for(j=0;j<postjsonresult.CyberSecFunc[i].UseCaseCat.length;j++){
						if(postjsonresult.CyberSecFunc[i].UseCaseCat[j].id == ucCatSuID){
							for(k=0;k<postjsonresult.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat.length;k++){
								if(postjsonresult.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat[k].id == subcatlast["id"]){
									totalmatchfound = true;
									break;
								}
							}
							//alert("semimatchfound");
							semimatchfound = true;
							break;
							}
						}
					//alert("matchfound");
					matchfound = true;
					break;
				}
			}
			if(matchfound == false){
				UseCSubCat["UseCaseSubCat"] = [];
				usecase["UseCaseCat"] = [];
				UseCSubCat["UseCaseSubCat"].push(subcatlast);
				UseCSubCat["id"] = parseInt(ucCatSuID);
				usecase["UseCaseCat"].push(UseCSubCat);
				usecase["id"] = parseInt(ucSubCatSuID);
			    postjsonresult.CyberSecFunc.push(usecase);
			    console.log(postjsonresult);
			}
			if(semimatchfound == true){
				postjsonresult.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat.push(subcatlast);
			    console.log(postjsonresult);
			}

		}
		//removing element from post json
		else{
			//pop search criteria
			
			for(i=0;i<$scope.items.length;i++){
				
				if($scope.items[i].ids == ndval){
					$scope.items.splice(i,1);
					break;
				}
			}
			
			//code for poping element
			
			for(i=0;i<postjsonresult.CyberSecFunc.length;i++){
				if(postjsonresult.CyberSecFunc[i].id == ucSubCatSuID){
					for(j=0;j<postjsonresult.CyberSecFunc[i].UseCaseCat.length;j++){
						if(postjsonresult.CyberSecFunc[i].UseCaseCat[j].id == ucCatSuID){
							for(k=0;k<postjsonresult.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat.length;k++){
								if(postjsonresult.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat[k].id == subcatlast["id"]){
									if(postjsonresult.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat.length==1){
										
										postjsonresult.CyberSecFunc.splice(i, 1);
									    console.log(postjsonresult);

										break;
									}
									else{
										postjsonresult.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat.splice(k, 1);
										break;
										
									}
								}
							}
							break;
							}
						}
					break;
				}
			}
			
		}
	}
	$scope.UsecaseSubCategory = function($event){
		
		$scope.tableReset();

		var upmatchfound = false;
		subcatlast ={};
		UseCSubCat={};
		usecase ={};
		UseCSubCat["UseCaseSubCat"] = [];
		usecase["UseCaseCat"] = [];

		var nameval="";
		for(i=0;i<angular.element($event.currentTarget).parent('li').children('ul').children('li').length;i++){
		if(i==0){
		nameval =  nameval + angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(i).text();
		}
		else{
			nameval =  nameval + ","+angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(i).text();
		}
		}
		var ndval = angular.element($event.currentTarget).parent().parent().parent().children('input').val();
		
		// = parseInt(ndvalusesub);
		//get 2ndid
		var ucCatSuID=angular.element($event.currentTarget).parent().parent().parent().children('input').val();
		var ucCatSuName=angular.element($event.currentTarget).parent().parent().parent().children('div').text();
		//get 1stid	
		var ucSubCatSuID=angular.element($event.currentTarget).parent().parent().parent().parent().parent().parent().parent().children('input').val();
		var ucSubCatSuName=angular.element($event.currentTarget).parent().parent().parent().parent().parent().parent().parent().children('div').text();
		//
		subcatlast["id"] = [];
		angular.element($event.currentTarget).parent().children('ul').children('li').each(function(){
			subcatlast ={};
			subcatlast["id"] = parseInt(angular.element(this).children('input').val());
			UseCSubCat["UseCaseSubCat"].push(subcatlast);
		})
		

		//
		var totalname = ucSubCatSuName +"-"+ ucCatSuName +"-"+ nameval;
		//inserting element in post json
		if(angular.element($event.currentTarget).is(':checked') == true){
			//search criteria
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idsubsubname == ucCatSuName){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			$scope.items.push({names:totalname, ids:ndval,idname:"CyberSecFunc",idsubname:ucSubCatSuName,idsubsubname:ucCatSuName});
			//search criteria ends
			
			for(i=0;i<postjsonresult.CyberSecFunc.length;i++){
				if(postjsonresult.CyberSecFunc[i].id == ucSubCatSuID){
					for(j=0;j<postjsonresult.CyberSecFunc[i].UseCaseCat.length;j++){
						if(postjsonresult.CyberSecFunc[i].UseCaseCat[j].id == ucCatSuID){
							postjsonresult.CyberSecFunc[i].UseCaseCat.splice(j, 1);
							upmatchfound = false;
							break;
							}
						}
					upmatchfound = true;
					break;
				}
			}
			
			if(upmatchfound == false){
				UseCSubCat["id"] = parseInt(ucCatSuID);
				usecase["UseCaseCat"].push(UseCSubCat);
				usecase["id"] = parseInt(ucSubCatSuID);
			    postjsonresult.CyberSecFunc.push(usecase);
			    console.log(postjsonresult);
			}

		}
		//removing element from post json
		else{
			
			//pop search criteria
			
			for(i=0;i<$scope.items.length;i++){
				
				if($scope.items[i].ids == ndval){
					$scope.items.splice(i,1);
					break;
				}
			}
			
			//
			
			for(i=0;i<postjsonresult.CyberSecFunc.length;i++){
				if(postjsonresult.CyberSecFunc[i].id == ucSubCatSuID){
					for(j=0;j<postjsonresult.CyberSecFunc[i].UseCaseCat.length;j++){
						if(postjsonresult.CyberSecFunc[i].UseCaseCat[j].id == ucCatSuID){

									if(postjsonresult.CyberSecFunc[i].UseCaseCat.length==1){
										
										postjsonresult.CyberSecFunc.splice(i, 1);
									    console.log(postjsonresult);

										break;
									}
									else{
										postjsonresult.CyberSecFunc[i].UseCaseCat.splice(j, 1);
										break;
										
									}
							break;
							}
						}
					break;
				}
			}
		//root for loop ends
		}
	}
	$scope.entervalue = function($event,ndvalusesub,nameval){
		$scope.tableReset();
		
		var upmatchfound = false;
		subcatlast ={};
		UseCSubCat={};
		usecase ={};
		UseCSubCat["UseCaseSubCat"] = [];
		usecase["UseCaseCat"] = [];
		
		//
		var nameval2="";
		for(i=0;i<angular.element($event.currentTarget).parent('li').children('ul').children('li').children('ul').children('li').length;i++){

		if(i==0){
			nameval2 =  nameval2  + angular.element($event.currentTarget).parent('li').children('ul').children('li').children('ul').children('li').children('div').eq(i).text();
			
		}else{
			
			nameval2 =  nameval2 + "," + angular.element($event.currentTarget).parent('li').children('ul').children('li').children('ul').children('li').children('div').eq(i).text();
			
		}
		}
		var ndval = ndvalusesub;
		
		
		
		
		//get 2ndid
		var ucCatSuID=parseInt(ndvalusesub);
		var ucCatSuName=nameval;
		//get 1stid	
		var ucSubCatSuID=angular.element($event.currentTarget).parent().parent().parent().parent().parent().children('input').val();
		var ucSubCatSuName=angular.element($event.currentTarget).parent().parent().parent().parent().parent().children('div').text();

		subcatlast["id"] = [];
		angular.element($event.currentTarget).parent().children('ul').children('li').children('ul').children('li').each(function(){
			subcatlast ={};
			subcatlast["id"] = parseInt(angular.element(this).children('input').val());
			UseCSubCat["UseCaseSubCat"].push(subcatlast);
		})
		
		
		//
		var totalname = ucSubCatSuName +"-"+ nameval +"-"+ nameval2;
		
		//inserting element in post json
		if(angular.element($event.currentTarget).is(':checked') == true){
			
			//search criteria
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idsubsubname == ucCatSuName){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			$scope.items.push({names:totalname, ids:ndval,idname:"CyberSecFunc",idsubname:ucSubCatSuName,idsubsubname:ucCatSuName});
			//search criteria ends
			
			for(i=0;i<postjsonresult.CyberSecFunc.length;i++){
				if(postjsonresult.CyberSecFunc[i].id == ucSubCatSuID){
					for(j=0;j<postjsonresult.CyberSecFunc[i].UseCaseCat.length;j++){
						if(postjsonresult.CyberSecFunc[i].UseCaseCat[j].id == ucCatSuID){
							postjsonresult.CyberSecFunc[i].UseCaseCat.splice(j, 1);
							upmatchfound = false;
							break;
							}
						}
					upmatchfound = true;
					break;
				}
			}
			
			if(upmatchfound == false){
				UseCSubCat["id"] = parseInt(ucCatSuID);
				usecase["UseCaseCat"].push(UseCSubCat);
				usecase["id"] = parseInt(ucSubCatSuID);
			    postjsonresult.CyberSecFunc.push(usecase);
			    console.log(postjsonresult);
			}

		}
		//removing element from post json
		else{
			
			//pop search criteria
			
			for(i=0;i<$scope.items.length;i++){
				
				if($scope.items[i].ids == ndval){
					$scope.items.splice(i,1);
					break;
				}
			}
			
			//
			
			
			
			for(i=0;i<postjsonresult.CyberSecFunc.length;i++){
				if(postjsonresult.CyberSecFunc[i].id == ucSubCatSuID){
					for(j=0;j<postjsonresult.CyberSecFunc[i].UseCaseCat.length;j++){
						if(postjsonresult.CyberSecFunc[i].UseCaseCat[j].id == ucCatSuID){

									if(postjsonresult.CyberSecFunc[i].UseCaseCat.length==1){
										
										postjsonresult.CyberSecFunc.splice(i, 1);
									    console.log(postjsonresult);

										break;
									}
									else{
										postjsonresult.CyberSecFunc[i].UseCaseCat.splice(j, 1);
										break;
										
									}
							break;
							}
						}
					break;
				}
			}
		//root for loop ends
		}
		
	}

//////////////////END OF CODE FOR CYBERSEC///////////////	
////////////////////CODE FOR REGCAT/////////////////////
	var matchfound2 = false;
	var semimatchfound2 = false;
	var subcatlast2 ={};
	var UseCSubCat2={};
	var usecase2 ={};
	
	$scope.entervalueSubcat2 = function($event,ndval,nameval){
		
		$scope.tableReset();
		subcatlast2 ={};
		UseCSubCat2={};
		usecase2 ={};
		//get last id
		subcatlast2["id"] = parseInt(ndval);
		//get 2ndid
		var ucCatSuID2=angular.element($event.currentTarget).parent().parent().parent().parent().parent().children('input').val();
		var ucCatSuName=angular.element($event.currentTarget).parent().parent().parent().parent().parent().children('div').text();
		//get 1stid
		var ucSubCatSuID2=angular.element($event.currentTarget).parent().parent().parent().parent().parent().parent().parent().parent().parent().children('input').val();
		var ucSubCatSuName=angular.element($event.currentTarget).parent().parent().parent().parent().parent().parent().parent().parent().parent().children('div').text();
		
		//pushing name in result addition
		var totalname = ucSubCatSuName +"-"+ ucCatSuName +"-"+ nameval;
		
		//inserting element in post json
		if(angular.element($event.currentTarget).is(':checked') == true){
			
			//search criteria
			$scope.items.push({names:totalname, ids:ndval,idname:"RegCat",idsubname:ucSubCatSuName,idsubsubname:ucCatSuName});
			//search criteria ends

			for(var i=0;i<postjsonresult.RegCat.length;i++){
				if(postjsonresult.RegCat[i].id == ucSubCatSuID2){
					for(var j=0;j<postjsonresult.RegCat[i].RegPub.length;j++){
						if(postjsonresult.RegCat[i].RegPub[j].id == ucCatSuID2){
							for(var k=0;k<postjsonresult.RegCat[i].RegPub[j].RegCntl.length;k++){
								if(postjsonresult.RegCat[i].RegPub[j].RegCntl[k].id == subcatlast2["id"]){
									totalmatchfound2 = true;
									break;
								}
							}
							//alert("semimatchfound2");
							semimatchfound2 = true;
							break;
							}
						}
					//alert("matchfound2");
					matchfound2 = true;
					break;
				}
			}
			if(matchfound2 == false){
				UseCSubCat2["RegCntl"] = [];
				usecase2["RegPub"] = [];
				UseCSubCat2["RegCntl"].push(subcatlast2);
				UseCSubCat2["id"] = parseInt(ucCatSuID2);
				usecase2["RegPub"].push(UseCSubCat2);
				usecase2["id"] = parseInt(ucSubCatSuID2);
			    postjsonresult.RegCat.push(usecase2);
			    console.log(postjsonresult);
			}
			if(semimatchfound2 == true){
				postjsonresult.RegCat[i].RegPub[j].RegCntl.push(subcatlast2);
			    console.log(postjsonresult);
			}

		}
		//removing element from post json
		else{
			
			
			//pop search criteria
			
			for(i=0;i<$scope.items.length;i++){
				
				if($scope.items[i].ids == ndval){
					$scope.items.splice(i,1);
					break;
				}
			}
			
			
			//poping data from json
			for(var i=0;i<postjsonresult.RegCat.length;i++){
				if(postjsonresult.RegCat[i].id == ucSubCatSuID2){
					for(var j=0;j<postjsonresult.RegCat[i].RegPub.length;j++){
						if(postjsonresult.RegCat[i].RegPub[j].id == ucCatSuID2){
							for(var k=0;k<postjsonresult.RegCat[i].RegPub[j].RegCntl.length;k++){
								if(postjsonresult.RegCat[i].RegPub[j].RegCntl[k].id == subcatlast2["id"]){
									if(postjsonresult.RegCat[i].RegPub[j].RegCntl.length==1){
										
										postjsonresult.RegCat.splice(i, 1);
									    console.log(postjsonresult);

										break;
									}
									else{
										postjsonresult.RegCat[i].RegPub[j].RegCntl.splice(k, 1);
										break;
										
									}
								}
							}
							break;
							}
						}
					break;
				}
			}
			
		}

		
	}
	var upmatchfound2 = false;
	$scope.entervalue2 = function($event,ndvalusesub,nameval){
		$scope.tableReset();
		
	var subcatlast ={};
	var UseCSubCat={};
	var usecase ={};
	UseCSubCat["RegCntl"] = [];
	usecase["RegPub"] = [];
	

	
	
	//
	var nameval2="";
	for(i=0;i<angular.element($event.currentTarget).parent('li').children('ul').children('li').children('ul').children('li').length;i++){

	if(i==0){
		nameval2 =  nameval2  + angular.element($event.currentTarget).parent('li').children('ul').children('li').children('ul').children('li').children('div').eq(i).text();
	}else{
		
		nameval2 =  nameval2 + "," + angular.element($event.currentTarget).parent('li').children('ul').children('li').children('ul').children('li').children('div').eq(i).text();
		
	}
	}
	var ndval = ndvalusesub;
	

	//get 2ndid
	var ucCatSuID=parseInt(ndvalusesub);
	var ucCatSuName=nameval;
	//get 1stid	
	var ucSubCatSuID=angular.element($event.currentTarget).parent().parent().parent().parent().parent().children('input').val();
	var ucSubCatSuName=angular.element($event.currentTarget).parent().parent().parent().parent().parent().children('div').text();

	subcatlast["id"] = [];
	angular.element($event.currentTarget).parent().children('ul').children('li').children('ul').children('li').each(function(){
		subcatlast ={};
		subcatlast["id"] = parseInt(angular.element(this).children('input').val());
		UseCSubCat["RegCntl"].push(subcatlast);
	});
	
	//
	var totalname = ucSubCatSuName +"-"+ nameval +"-"+ nameval2;		
	
	//inserting element in post json
	if(angular.element($event.currentTarget).is(':checked') == true){

		//search criteria
		for(i=$scope.items.length;i>0;i--){
			if($scope.items[i-1].idsubsubname == ucCatSuName){
				$scope.items.splice(i-1,1);
				i=$scope.items.length+1;
			}
		}
		$scope.items.push({names:totalname, ids:ndval,idname:"RegCat",idsubname:ucSubCatSuName,idsubsubname:ucCatSuName});
		//search criteria ends
		
		
		for(i=0;i<postjsonresult.RegCat.length;i++){
			if(postjsonresult.RegCat[i].id == ucSubCatSuID){
				for(j=0;j<postjsonresult.RegCat[i].RegPub.length;j++){
					if(postjsonresult.RegCat[i].RegPub[j].id == ucCatSuID){
						postjsonresult.RegCat[i].RegPub.splice(j, 1);
						upmatchfound2 = false;
						break;
						}
					}
				upmatchfound2 = true;
				break;
			}
		}
		
		if(upmatchfound2 == false){
			UseCSubCat["id"] = parseInt(ucCatSuID);
			usecase["RegPub"].push(UseCSubCat);
			usecase["id"] = parseInt(ucSubCatSuID);
		    postjsonresult.RegCat.push(usecase);
		    console.log(postjsonresult);
		}

	}
	//removing element from post json
	else{
		
		//pop search criteria
		
		for(i=0;i<$scope.items.length;i++){
			
			if($scope.items[i].ids == ndval){
				$scope.items.splice(i,1);
				break;
			}
		}
		
		//

		for(i=0;i<postjsonresult.RegCat.length;i++){
			if(postjsonresult.RegCat[i].id == ucSubCatSuID){
				for(j=0;j<postjsonresult.RegCat[i].RegPub.length;j++){
					if(postjsonresult.RegCat[i].RegPub[j].id == ucCatSuID){

								if(postjsonresult.RegCat[i].RegPub.length==1){
									
									postjsonresult.RegCat.splice(i, 1);
								    console.log(postjsonresult);

									break;
								}
								else{
									postjsonresult.RegCat[i].RegPub.splice(j, 1);
									break;
									
								}
						break;
						}
					}
				break;
			}
		}
	//root for loop ends
	}
	
}

	$scope.RegCatSubCategory = function($event){
		$scope.tableReset();
		
		var upmatchfound = false;
		subcatlast ={};
		UseCSubCat={};
		usecase ={};
		UseCSubCat["RegCntl"] = [];
		usecase["RegPub"] = [];
		
		var nameval="";
		for(i=0;i<angular.element($event.currentTarget).parent('li').children('ul').children('li').length;i++){
		if(i==0){
		nameval =  nameval + angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(i).text();
		}
		else{
		nameval =  nameval + ","+angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(i).text();
		}
		}
		var ndval = angular.element($event.currentTarget).parent().parent().parent().children('input').val();
		
		//get 2ndid
		var ucCatSuID=angular.element($event.currentTarget).parent().parent().parent().children('input').val();
		var ucCatSuName=angular.element($event.currentTarget).parent().parent().parent().children('div').text();
		//get 1stid	
		var ucSubCatSuID=angular.element($event.currentTarget).parent().parent().parent().parent().parent().parent().parent().children('input').val();
		var ucSubCatSuName=angular.element($event.currentTarget).parent().parent().parent().parent().parent().parent().parent().children('div').text();
		//

		subcatlast["id"] = [];
		angular.element($event.currentTarget).parent().children('ul').children('li').each(function(){
			subcatlast ={};
			subcatlast["id"] = parseInt(angular.element(this).children('input').val());
			UseCSubCat["RegCntl"].push(subcatlast);
		})
		//inserting element in post json
		
		//
		var totalname = ucSubCatSuName +"-"+ ucCatSuName +"-"+ nameval;
		//
		if(angular.element($event.currentTarget).is(':checked') == true){
			//search criteria
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idsubsubname == ucCatSuName){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			$scope.items.push({names:totalname, ids:ndval,idname:"RegCat",idsubname:ucSubCatSuName,idsubsubname:ucCatSuName});
			//search criteria ends
			
			for(i=0;i<postjsonresult.RegCat.length;i++){
				if(postjsonresult.RegCat[i].id == ucSubCatSuID){
					for(j=0;j<postjsonresult.RegCat[i].RegPub.length;j++){
						if(postjsonresult.RegCat[i].RegPub[j].id == ucCatSuID){
							postjsonresult.RegCat[i].RegPub.splice(j, 1);
							upmatchfound = false;
							break;
							}
						}
					upmatchfound = true;
					break;
				}
			}
			
			if(upmatchfound == false){
				UseCSubCat["id"] = parseInt(ucCatSuID);
				usecase["RegPub"].push(UseCSubCat);
				usecase["id"] = parseInt(ucSubCatSuID);
			    postjsonresult.RegCat.push(usecase);
			    console.log(postjsonresult);
			}

		}
		//removing element from post json
		else{
			//pop search criteria
			
			for(i=0;i<$scope.items.length;i++){
				
				if($scope.items[i].ids == ndval){
					$scope.items.splice(i,1);
					break;
				}
			}
			
			//
			for(i=0;i<postjsonresult.RegCat.length;i++){
				if(postjsonresult.RegCat[i].id == ucSubCatSuID){
					for(j=0;j<postjsonresult.RegCat[i].RegPub.length;j++){
						if(postjsonresult.RegCat[i].RegPub[j].id == ucCatSuID){

									if(postjsonresult.RegCat[i].RegPub.length==1){
										
										postjsonresult.RegCat.splice(i, 1);
									    console.log(postjsonresult);

										break;
									}
									else{
										postjsonresult.RegCat[i].RegPub.splice(j, 1);
										break;
										
									}
							break;
							}
						}
					break;
				}
			}
		//root for loop ends
		}
	}
	////////////////// END CODE FOR REGCAT///////////////////
	
	//////////////////CODE FOR INDUSTRY//////////////////////
	$scope.entervalueSubcatIndustry = function($event,ndval,nameval){
		$scope.tableReset();
		
		var totalmatchfound2 = false;
		var subcatlast2 ={};

			//get last id
			subcatlast2["id"] = parseInt(ndval);

			var totalname = "Industry" +" : "+ nameval;
			
			//inserting element in post json
			if(angular.element($event.currentTarget).is(':checked') == true){
				
				//search criteria
				$scope.items.push({names:totalname, ids:ndval, idname:"Industry"});
				console.log($scope.items);
				//pushing data in postjson
					postjsonresult.Industry.push(subcatlast2);

			}
			//removing element from post json
			else{
				
				//pop search criteria
				
				for(i=0;i<$scope.items.length;i++){
					
					if($scope.items[i].ids == ndval){
						$scope.items.splice(i,1);
						break;
					}
				}
				
				//code for poping element

								for(var k=0;k<postjsonresult.Industry.length;k++){
									if(postjsonresult.Industry[k].id == subcatlast2["id"]){

											postjsonresult.Industry.splice(k, 1);
											break;
									}
								}


			}

			console.log(postjsonresult);
		}
	$scope.entervalueSubcatIndustryTop = function($event){
		
		$scope.tableReset();
	
		var usecase={};
		usecase["id"]=[];
		var totalname="Industry" +" : ";

		for(i=0;i<angular.element($event.currentTarget).parent('li').children('ul').children('li').length;i++){
			if(i==0){
			totalname = totalname + angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(i).text();
			}
			else{
			totalname = totalname +","+ angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(i).text();
			}
		}
		


		if(angular.element($event.currentTarget).is(':checked') == true){
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idname == "Industry"){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			//search criteria
			$scope.items.push({names:totalname, ids:"Industry", idname:"Industry"});
			console.log($scope.items);
			//
			angular.element($event.currentTarget).parent().children('ul').children('li').each(function(){

			//pushing data in postjson

			usecase={};
			usecase["id"]=parseInt(angular.element(this).children('input').val());

			    postjsonresult.Industry.push(usecase);
			    console.log(postjsonresult);

			});
			}
			//removing element from post json
			else{
				
				//pop search criteria
				for(i=0;i<$scope.items.length;i++){
					
					if($scope.items[i].idname == "Industry"){
						$scope.items.splice(i,1);
					}
				}
				
				//code for poping element		
				
				postjsonresult.Industry = [];
				console.log(postjsonresult);
			}
	}
	//////////////////END OF CODE FOR INDUSTRY///////////////
	//////////////////CODE FOR EP//////////////////////
	$scope.entervalueSubcatEP = function($event,ndval,nameval){
		$scope.tableReset();
		
		var totalmatchfound2 = false;
		var subcatlast2 ={};

		var totalname = "IBM 10 Essential Practices" +" : "+ nameval;
			//get last id
			subcatlast2["id"] = parseInt(ndval);

			//inserting element in post json
			if(angular.element($event.currentTarget).is(':checked') == true){

				//search criteria

				$scope.items.push({names:totalname, ids:ndval, idname:"EP"});
				//
					postjsonresult.EP.push(subcatlast2);

			}
			//removing element from post json
			else{
				//pop search criteria
				
				for(i=0;i<$scope.items.length;i++){
					
					if($scope.items[i].ids == ndval){
						$scope.items.splice(i,1);
						break;
					}
				}
				
				//code for poping element

								for(var k=0;k<postjsonresult.EP.length;k++){
									if(postjsonresult.EP[k].id == subcatlast2["id"]){

											postjsonresult.EP.splice(k, 1);
											break;
									}
								}


			}

			console.log(postjsonresult);
		}
	$scope.entervalueSubcatEPTop = function($event){
		
		$scope.tableReset();
              
		var usecase={};
		usecase["id"]=[];
		
		
		var totalname="IBM 10 Essential Practices" +" : ";

		for(i=0;i<angular.element($event.currentTarget).parent('li').children('ul').children('li').length;i++){
			if(i==0){
			totalname = totalname + angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(i).text();
			}
			else{
			totalname = totalname +","+ angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(i).text();
			}
		}
		
		
		
		
		if(angular.element($event.currentTarget).is(':checked') == true){
			//search criteria clearing
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idname == "EP"){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			//search criteria
			$scope.items.push({names:totalname, ids:"EP", idname:"EP"});

		angular.element($event.currentTarget).parent().children('ul').children('li').each(function(){
			usecase={};
			usecase["id"]=parseInt(angular.element(this).children('input').val());

			    postjsonresult.EP.push(usecase);
			    console.log(postjsonresult);

		});
				}
			//removing element from post json
			else{
				
				//pop search criteria
				for(i=0;i<$scope.items.length;i++){
					
					if($scope.items[i].idname == "EP"){
						$scope.items.splice(i,1);
					}
				}
				
				postjsonresult.EP = [];
				console.log(postjsonresult);
			}
	}
	//////////////////END OF CODE FOR EP///////////////
	//////////////////CODE FOR LogSource///////////////
	$scope.entervalueSubcatLogSource = function($event,ndval,nameval){
		$scope.tableReset();
		
		var totalmatchfound2 = false;
		var subcatlast2 ={};

			//get last id
			subcatlast2["id"] = parseInt(ndval);
			
			
			var totalname = "LogSource" +" : "+ nameval;
			
			//inserting element in post json
			if(angular.element($event.currentTarget).is(':checked') == true){
				
				//search criteria
				$scope.items.push({names:totalname, ids:ndval, idname:"LogSource"});

					postjsonresult.LogSource.push(subcatlast2);

			}
			//removing element from post json
			else{
				//pop search criteria
				
				for(i=0;i<$scope.items.length;i++){
					
					if($scope.items[i].ids == ndval){
						$scope.items.splice(i,1);
						break;
					}
				}
				
				//code for poping element

								for(var k=0;k<postjsonresult.LogSource.length;k++){
									if(postjsonresult.LogSource[k].id == subcatlast2["id"]){

											postjsonresult.LogSource.splice(k, 1);
											break;
									}
								}


			}

			console.log(postjsonresult);
		}
	$scope.entervalueSubcatLogSourceTop = function($event){
		$scope.tableReset();
              
		var usecase={};
		usecase["id"]=[];
		
		var totalname="LogSource" +" : ";

		for(i=0;i<angular.element($event.currentTarget).parent('li').children('ul').children('li').length;i++){
			if(i==0){
			totalname = totalname + angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(i).text();
			}
			else{
			totalname = totalname +","+ angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(i).text();
			}
		}
		
		if(angular.element($event.currentTarget).is(':checked') == true){
			
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idname == "LogSource"){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			//search criteria
			$scope.items.push({names:totalname, ids:"LogSource", idname:"LogSource"});
			
			
			
		angular.element($event.currentTarget).parent().children('ul').children('li').each(function(){
			usecase={};
			usecase["id"]=parseInt(angular.element(this).children('input').val());

			    postjsonresult.LogSource.push(usecase);
			    console.log(postjsonresult);

		});
				}
			//removing element from post json
			else{
				//pop search criteria
				for(i=0;i<$scope.items.length;i++){
					
					if($scope.items[i].idname == "LogSource"){
						$scope.items.splice(i,1);
					}
				}
				postjsonresult.LogSource = [];
				console.log(postjsonresult);
			}
	}
	//////////////////END OF CODE FOR LogSource///////////////
	//////////////////CODE FOR Threat model///////////////

	$scope.cliThreMod = function($event,ndval,nameval){
		
		$scope.tableReset();
              
		var parentparaname = angular.element($event.currentTarget).parent().parent().parent().children("div").text();
		var childparaname = "";
		for (var k=0;k<angular.element($event.currentTarget).parent('li').children('ul').children('li').length;k++){

				if(k==0){
					childparaname = childparaname + angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(k).text();
				}
				else{
					childparaname = childparaname +","+ angular.element($event.currentTarget).parent('li').children('ul').children('li').children('div').eq(k).text();
				}
					
		}
		
		var totalname="ThreatModel" +" : "+ parentparaname+"-" + nameval+"("+ndval+")"+"-" + childparaname;
		
		var subcatlast2 ={};

		//get last id
		subcatlast2["id"] = parseInt(ndval);

		//inserting element in post json
		if(angular.element($event.currentTarget).is(':checked') == true){
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idsubsubname == nameval){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			//search criteria
			$scope.items.push({names:totalname, ids:ndval, idname:"ThreatModel", idsubname:parentparaname, idsubsubname:nameval});
			
			
				postjsonresult.ThreatModel.push(subcatlast2);
				for (k=0;k<angular.element($event.currentTarget).parent('li').children('ul').children('li').length;k++){
					var obj={
						id:parseInt(angular.element($event.currentTarget).parent('li').children('ul').children('li').children('input').eq(k).val())
					};
					postjsonresult.ThreatModel.push(obj);
					obj={};
				};

		}
		//removing element from post json
		else{
			
			//pop search criteria
			for(i=0;i<$scope.items.length;i++){
				
				if($scope.items[i].ids == ndval){
					$scope.items.splice(i,1);
				}
			}
			

							for(var k=0;k<postjsonresult.ThreatModel.length;k++){
								if(postjsonresult.ThreatModel[k].id == subcatlast2["id"]){

										postjsonresult.ThreatModel.splice(k, 1);
										break;
								}
							}
							for (var k=0;k<angular.element($event.currentTarget).parent('li').children('ul').children('li').length;k++){
								var obj={
									id:parseInt(angular.element($event.currentTarget).parent('li').children('ul').children('li').children('input').eq(k).val())
								};
								postjsonresult.ThreatModel.pop(obj);
								obj={};
							};


		}

		console.log(postjsonresult);
	}
	
	
	$scope.cliThreModInner = function($event,ndval,nameval){
		$scope.tableReset();
		
		var parentparaname = angular.element($event.currentTarget).parent().parent().parent().children("div").text();
		var grandparentname = angular.element($event.currentTarget).parent().parent().parent().parent().parent().children("div").text();
		var totalname="ThreatModel" +" : "+ grandparentname+"-"+parentparaname+"-" + nameval+"("+ndval+")";
		
		var subcatlast2 ={};

		//get last id
		subcatlast2["id"] = parseInt(ndval);

		//inserting element in post json
		if(angular.element($event.currentTarget).is(':checked') == true){

			//search criteria
			$scope.items.push({names:totalname, ids:ndval, idname:"ThreatModel", idsubname:grandparentname, idsubsubname:parentparaname});
			
			
				postjsonresult.ThreatModel.push(subcatlast2);

		}
		//removing element from post json
		else{
			
			//pop search criteria
			for(i=0;i<$scope.items.length;i++){
				
				if($scope.items[i].ids == ndval){
					$scope.items.splice(i,1);
				}
			}
			

							for(var k=0;k<postjsonresult.ThreatModel.length;k++){
								if(postjsonresult.ThreatModel[k].id == subcatlast2["id"]){

										postjsonresult.ThreatModel.splice(k, 1);
										break;
								}
							}


		}

		console.log(postjsonresult);
	}
	
	//////////////////CODE FOR Threat model///////////////

	///////////selecting threat model root////////////////////
	$scope.cliThreModTop = function($event){
		
		$scope.tableReset();
		
		var totalname="ThreatModel" +" : "+threatname ;
		
		
		//Threat model
		postjsonresult.ThreatModel = [];
		if(angular.element($event.currentTarget).is(':checked') == true){
			
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idname == "ThreatModel"){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			
			//search criteria
			$scope.items.push({names:totalname, ids:"ThreatModel", idname:"ThreatModel"});
			
			
			for(i=0;i<obj.ThreatModel.length;i++){
				postjsonresult.ThreatModel.push(obj.ThreatModel[i]);
				}
			}
			//removing element from post json
			else{
				//pop search criteria
				for(i=0;i<$scope.items.length;i++){
					
					if($scope.items[i].idname == "ThreatModel"){
						$scope.items.splice(i,1);
					}
				}
				
				postjsonresult.ThreatModel = [];
			}
		console.log(postjsonresult);
	}
	///////////selecting Cyber Security root////////////////////
	$scope.entervalueSubcatCyberSecFuncTop = function($event){
		$scope.tableReset();
           
		
		//Threat model
		var totalname=" Cyber Security " +" : "+ cybertoname;
		
		postjsonresult.CyberSecFunc = [];
		if(angular.element($event.currentTarget).is(':checked') == true){
			

			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idname == "CyberSecFunc"){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			//search criteria
			$scope.items.push({names:totalname, ids:"CyberSecFunc", idname:"CyberSecFunc"});
			
			//pushing value 
			for(i=0;i<CyberSecFunc.length;i++){
				postjsonresult.CyberSecFunc.push(CyberSecFunc[i]);
				}
			}
			//removing element from post json
			else{
				

				//pop search criteria
				for(i=0;i<$scope.items.length;i++){
					
					if($scope.items[i].idname == "CyberSecFunc"){
						$scope.items.splice(i,1);
					}
				}
				//pop result
				postjsonresult.CyberSecFunc = [];
				console.log(postjsonresult);
			}
	}
	///////////selecting RegCat root////////////////////
	$scope.entervalueSubcatRegCatTop = function($event){
		$scope.tableReset();
		
		
		//Threat model
		
		var totalname="RegCat" +" : "+RegCatoname;
		
		postjsonresult.RegCat = [];
		if(angular.element($event.currentTarget).is(':checked') == true){
			
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idname == "RegCat"){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			//search criteria
			$scope.items.push({names:totalname, ids:"RegCat", idname:"RegCat"});
			
			
			for(i=0;i<RegCat.length;i++){
				postjsonresult.RegCat.push(RegCat[i]);
				}
			}
			//removing element from post json
			else{
				
				//pop search criteria
				for(i=0;i<$scope.items.length;i++){
					
					if($scope.items[i].idname == "RegCat"){
						$scope.items.splice(i,1);
					}
				}
				
				
				postjsonresult.RegCat = [];
				console.log(postjsonresult);
			}
	}
	

	
	////////////////////////selecting main root/////////////////////////
	$scope.caAll = function(){
		
		$scope.tableReset();
		
		if(angular.element(".allclass").is(':checked') == true){
		postjsonresult = {
				"RegCat": [],
				"CyberSecFunc": [],
				"Industry": [],
				"EP": [],
				"ThreatModel": [],
				"LogSource": []
			};
		for(i=0;i<CyberSecFunc.length;i++){

				postjsonresult.CyberSecFunc.push(CyberSecFunc[i]);

		}
		for(i=0;i<obj.ThreatModel.length;i++){
			postjsonresult.ThreatModel.push(obj.ThreatModel[i]);
			}
		for(i=0;i<RegCat.length;i++){
			postjsonresult.RegCat.push(RegCat[i]);
			
		}
		for(i=0;i<EP.length;i++){
			postjsonresult.EP.push(EP[i]);
			
		}
		for(i=0;i<LogSource.length;i++){
			postjsonresult.LogSource.push(LogSource[i]);
			
		}
		for(i=0;i<Industry.length;i++){
			postjsonresult.Industry.push(Industry[i]);
			
		}
		console.log(postjsonresult);
		}

	//removing element from post json
	else{
		
		postjsonresult = {
				"RegCat": [],
				"CyberSecFunc": [],
				"Industry": [],
				"EP": [],
				"ThreatModel": [],
				"LogSource": []
			};
	
	}
	}
	//////////////////cyber security second root///////////////
	$scope.entervalueSubcatCyberSecFunc = function($event,ndvl,nameval){
		$scope.tableReset();
		
		//search criteria code
		for(i=0;i<CyberSecFunc.length;i++){
			if(CyberSecFunc[i].id == ndvl){
			    for(j=0;j<obj.CyberSecFunc[i].UseCaseCat.length;j++){
					
					if(j==0){
						cybertoname2 = cybertoname2 +"-" + obj.CyberSecFunc[i].UseCaseCat[j].Name+"-";
						}
						else{
						cybertoname2 = cybertoname2 +"-"+  obj.CyberSecFunc[i].UseCaseCat[j].Name+"-";
						}
					
					
					for(k=0;k<obj.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat.length;k++){
		    	
						if(k==0){
							cybertoname2 = cybertoname2 + obj.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat[k].Name;
							}
							else{
							cybertoname2 = cybertoname2 +","+  obj.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat[k].Name;
							}
				    }
			    }
				
			}
		}
		var totalname=" Cyber Security " +" : "+nameval+"-"+cybertoname2;
		cybertoname2 = "";
		//End search criteria code
	if(angular.element($event.currentTarget).is(':checked') == true){
		
		for(i=$scope.items.length;i>0;i--){
			if($scope.items[i-1].idsubname == nameval){
				$scope.items.splice(i-1,1);
				i=$scope.items.length+1;
			}
		}
		//search criteria
		$scope.items.push({names:totalname, ids:ndvl, idname:"CyberSecFunc", idsubname:nameval});
		

		for(i=0;i<CyberSecFunc.length;i++){
			if(CyberSecFunc[i].id == ndvl)
				{
				postjsonresult.CyberSecFunc.push(CyberSecFunc[i]);
				break;
				}
		}
	}
	//removing element from post json
	else{
		
		//pop search criteria
		for(i=0;i<$scope.items.length;i++){
			
			if($scope.items[i].ids == ndvl){
				$scope.items.splice(i,1);
			}
		}
		
		for(i=0;i<postjsonresult.CyberSecFunc.length;i++){
			if(postjsonresult.CyberSecFunc[i].id == ndvl)
				{
				postjsonresult.CyberSecFunc.splice(i,1);
				break;
				}
		}
	
	}
	}
	

	$scope.UsecaseCategory = function($event){
		$scope.tableReset();

		var ndvl = angular.element($event.currentTarget).parent().parent().parent().children('input').val();
		var nameval=angular.element($event.currentTarget).parent().parent().parent().children('div').text();
		
			var cybertoname2="";
		//search criteria code
		for(i=0;i<CyberSecFunc.length;i++){
			if(CyberSecFunc[i].id == ndvl){
			    for(j=0;j<obj.CyberSecFunc[i].UseCaseCat.length;j++){
					
					if(j==0){
						cybertoname2 = cybertoname2 +"-" + obj.CyberSecFunc[i].UseCaseCat[j].Name+"-";
						}
						else{
						cybertoname2 = cybertoname2 +"-"+  obj.CyberSecFunc[i].UseCaseCat[j].Name+"-";
						}
					
					
					for(k=0;k<obj.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat.length;k++){
		    	
						if(k==0){
							cybertoname2 = cybertoname2 + obj.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat[k].Name;
							}
							else{
							cybertoname2 = cybertoname2 +","+  obj.CyberSecFunc[i].UseCaseCat[j].UseCaseSubCat[k].Name;
							}
				    }
			    }
				
			}
		}
		var totalname=" Cyber Security " +" : "+nameval+"-"+cybertoname2;
		cybertoname2 = "";
		//End search criteria code
		
		
		
		
		if(angular.element($event.currentTarget).is(':checked') == true){
			
			
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idsubname == nameval){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			//search criteria
			$scope.items.push({names:totalname, ids:ndvl, idname:"CyberSecFunc", idsubname:nameval});
			

			for(i=0;i<CyberSecFunc.length;i++){
				if(CyberSecFunc[i].id == ndvl)
					{
					postjsonresult.CyberSecFunc.push(CyberSecFunc[i]);
					break;
					}
			}
		}
		//removing element from post json
		else{
			//pop search criteria
			for(i=0;i<$scope.items.length;i++){
				if($scope.items[i].ids == ndvl){
					$scope.items.splice(i,1);
				}
			}
			
			for(i=0;i<postjsonresult.CyberSecFunc.length;i++){
				if(postjsonresult.CyberSecFunc[i].id == ndvl)
					{
					postjsonresult.CyberSecFunc.splice(i,1);
					break;
					}
			}
		
		}
		}	
	///////////////////////////////////threat subroot///////////////


$scope.cliThreModMid = function($event,ndvlqe,nameval){
	
	$scope.tableReset();
	//search criteria code
	for(i=0;i<ThreatModel.length;i++){
		if(ThreatModel[i].SurrId == ndvlqe){
		    for(j=0;j<ThreatModel[i].children.length;j++){
				
				if(j==0){
					threatname2 = threatname2 +"-" +ThreatModel[i].children[j].Name+"("+ThreatModel[i].children[j].SurrId+")-";
					}
					else{
					threatname2 = threatname2 +"-"+  ThreatModel[i].children[j].Name+"("+ThreatModel[i].children[j].SurrId+")-";
					}
				
				for(k=0;k<ThreatModel[i].children[j].children.length;k++){

					if(k==0){
						threatname2 = threatname2 +"-" +ThreatModel[i].children[j].children[k].Name+"("+ThreatModel[i].children[j].SurrId+")-";
						}
						else{
						threatname2 = threatname2 +"-"+ ThreatModel[i].children[j].children[k].Name+"("+ThreatModel[i].children[j].SurrId+")-";
						}
			    }
		    }
			
		}
	}

	var totalname="ThreatModel" +" : "+ nameval+"("+ndvlqe+")"+"-" + threatname2;
	threatname2="";
	//
		//Threat model
	console.log(threatModelObj);
		//postjsonresult.ThreatModel = [];		
		var thrtObj=null;
			for(i=0;i<threatModelObj.length;i++){	
				console.log("Threat model obj"+JSON.stringify(threatModelObj[i]));
				if(threatModelObj[i].SurrId==ndvlqe){					
					thrtObj=threatModelObj[i];
					break;
				}
				for (j=0;j<threatModelObj[i].children.length;j++){
					
					if(threatModelObj[i].children[j].SurrId==ndvlqe){
						thrtObj=threatModelObj[i].children[j];
						break;
					}
					for (k=0;k<threatModelObj[i].children[j].children.length;k++){
						
						if(threatModelObj[i].children[j].children[k].SurrId==ndvlqe){
							thrtObj=threatModelObj[i].children[j].children[k];
							break;
						}
						
					}

				}
			}
			
			
			if(angular.element($event.currentTarget).is(':checked') == true){
				
				for(i=$scope.items.length;i>0;i--){
					if($scope.items[i-1].idsubname == nameval){
						$scope.items.splice(i-1,1);
						i=$scope.items.length+1;
					}
				}
				//search criteria
				$scope.items.push({names:totalname, ids:ndvlqe, idname:"ThreatModel", idsubname:nameval});
				
				
				var obj={
					id:thrtObj.SurrId
				};
				postjsonresult.ThreatModel.push(obj);
				if ((thrtObj.ThreadModelType=='C' || thrtObj.ThreadModelType=='M') && thrtObj.children.length>0){
					for (j=0;j<thrtObj.children.length;j++){
						var obj={
							id:thrtObj.children[j].SurrId
						};
						postjsonresult.ThreatModel.push(obj);
						for (k=0;k<thrtObj.children[j].children.length;k++){
							var obj={
								id:thrtObj.children[j].children[k].SurrId
							};
							postjsonresult.ThreatModel.push(obj);					
						};
					};
					
			   };
			}else{
				
				//pop search criteria
				for(i=0;i<$scope.items.length;i++){
					
					if($scope.items[i].ids == ndvlqe){
						$scope.items.splice(i,1);
					}
				}
				
				//
				var obj={
					id:thrtObj.SurrId
				};
				postjsonresult.ThreatModel.pop(obj);
				if ((thrtObj.ThreadModelType=='C' || thrtObj.ThreadModelType=='M') && thrtObj.children.length>0){
					var obj={
							id:thrtObj.SurrId
						};
					for (j=0;j<thrtObj.children.length;j++){
						postjsonresult.ThreatModel.pop(obj);
						for (k=0;k<thrtObj.children[j].children.length;k++){
							var obj={
								id:thrtObj.children[j].children[k].SurrId
							};
							postjsonresult.ThreatModel.pop(obj);					
						};
					};	
			   };	
				
			};			
			console.log("The last selected value is"+JSON.stringify(postjsonresult));		
	
	
	};
	//////////////////Reg cat second root///////////////
	$scope.entervalueSubcatRegCat = function($event,ndvlq,nameval){
		
		$scope.tableReset();
		//search criteria code
		var regcatoname2=""
		for(i=0;i<RegCat.length;i++){
			if(RegCat[i].id == ndvlq){
			    for(j=0;j<obj.RegCat[i].RegPub.length;j++){
					
					if(j==0){
						regcatoname2 = regcatoname2 +"-" + obj.RegCat[i].RegPub[j].Name+"-";
						}
						else{
						regcatoname2 = regcatoname2 +"-"+  obj.RegCat[i].RegPub[j].Name+"-";
						}
					
					
					for(k=0;k<obj.RegCat[i].RegPub[j].RegCntl.length;k++){
		    	
						if(k==0){
							regcatoname2 = regcatoname2 + obj.RegCat[i].RegPub[j].RegCntl[k].Name;
							}
							else{
							regcatoname2 = regcatoname2 +","+  obj.RegCat[i].RegPub[j].RegCntl[k].Name;
							}
				    }
			    }
				
			}
		}
		var totalname="RegCat" +" : "+nameval+"-"+regcatoname2;
		regcatoname2 = "";
		//End search criteria code
		
	if(angular.element($event.currentTarget).is(':checked') == true){
		//search criteria
		for(i=$scope.items.length;i>0;i--){
			if($scope.items[i-1].idsubname == nameval){
				$scope.items.splice(i-1,1);
				i=$scope.items.length+1;
			}
		}
		
		$scope.items.push({names:totalname, ids:ndvlq, idname:"RegCat", idsubname:nameval});
		//End search criteria
		
		
		for(i=0;i<RegCat.length;i++){
			if(RegCat[i].id == ndvlq)
				{
				postjsonresult.RegCat.push(RegCat[i]);
				break;
				}
		}
	}
	//removing element from post json
	else{
		
		//pop search criteria
		for(i=0;i<$scope.items.length;i++){
			
			if($scope.items[i].ids == ndvlq){
				$scope.items.splice(i,1);
			}
		}
		//
		
		
		for(i=0;i<postjsonresult.RegCat.length;i++){
			if(postjsonresult.RegCat[i].id == ndvlq)
				{
				postjsonresult.RegCat.splice(i,1);
				break;
				}
		}
	
	}
	}
	

	$scope.RegCategor = function($event){
		$scope.tableReset();
		
		var ndvl = angular.element($event.currentTarget).parent().parent().parent().children('input').val();
		var nameval=angular.element($event.currentTarget).parent().parent().parent().children('div').text();

		//search criteria code
		var regcatoname2="";
		for(i=0;i<RegCat.length;i++){
			if(RegCat[i].id == ndvl){
			    for(j=0;j<obj.RegCat[i].RegPub.length;j++){
					
					if(j==0){
						regcatoname2 = regcatoname2 +"-" + obj.RegCat[i].RegPub[j].Name+"-";
						}
						else{
						regcatoname2 = regcatoname2 +"-"+  obj.RegCat[i].RegPub[j].Name+"-";
						}
					
					
					for(k=0;k<obj.RegCat[i].RegPub[j].RegCntl.length;k++){
		    	
						if(k==0){
							regcatoname2 = regcatoname2 + obj.RegCat[i].RegPub[j].RegCntl[k].Name;
							}
							else{
							regcatoname2 = regcatoname2 +","+  obj.RegCat[i].RegPub[j].RegCntl[k].Name;
							}
				    }
			    }
				
			}
		}
		var totalname="RegCat" +"-"+nameval+"-"+regcatoname2;
		cybertoname2 = "";
		//End search criteria code
		
		if(angular.element($event.currentTarget).is(':checked') == true){
			
			for(i=$scope.items.length;i>0;i--){
				if($scope.items[i-1].idsubname == nameval){
					$scope.items.splice(i-1,1);
					i=$scope.items.length+1;
				}
			}
			//search criteria
			$scope.items.push({names:totalname, ids:ndvl, idname:"RegCat", idsubname:nameval});
			
			
			for(i=0;i<RegCat.length;i++){
				if(RegCat[i].id == ndvl)
					{
					postjsonresult.RegCat.push(RegCat[i]);
					break;
					}
			}
		}
		//removing element from post json
		else{
			//pop search criteria
			for(i=0;i<$scope.items.length;i++){
				if($scope.items[i].ids == ndvl){
					$scope.items.splice(i,1);
				}
			}
			
			for(i=0;i<postjsonresult.RegCat.length;i++){
				if(postjsonresult.RegCat[i].id == ndvl)
					{
					postjsonresult.RegCat.splice(i,1);
					break;
					}
			}
		
		}
		}		
	
	$scope.oobvaluegoes = function($event){
		$scope.tableReset();
		
		var oobthis = angular.element($event.currentTarget).is(':checked');
		var oobnext = angular.element($event.currentTarget).next().next().is(':checked');
		var oobprev = angular.element($event.currentTarget).prev().prev().is(':checked');
		
		var value = angular.element($event.currentTarget).val();
		if(angular.element($event.currentTarget).is(':checked') == true){
			if((oobthis==true && oobnext==true)||(oobthis==true && oobprev==true)){
				postjsonresult.oobParam = "";
				console.log(postjsonresult.oobParam);
			}
			else{
			postjsonresult.oobParam = value;
			console.log(postjsonresult.oobParam);
			}
		}
		else{

			if(oobnext==true){
				postjsonresult.oobParam = "No";
				console.log(postjsonresult.oobParam);
			}
			else if(oobprev==true){
				postjsonresult.oobParam = "Yes";
				console.log(postjsonresult.oobParam);
			}
			else{
				postjsonresult.oobParam = "";
				console.log(postjsonresult.oobParam);
			}

		}
		
	}
	////////////////////////////////////////////////////////
	/////////////////////////////////////////// END OF NEW TREE///////////////////////////////////////////////// 
	
	

	

	
	if($rootScope.userIndustryName =="ALL"){
		$scope.showAllmode=true;
	}
	//sliding
	angular.element(".accord1").slideDown();

	//link visited
    $scope.$watch(function () {
    	//toggle class for heading
    	angular.element(".accord1Heading").click(function(e){
    		
    		angular.element(".accord1").slideToggle();
    		angular.element(this).toggleClass( "accord2Heading" );
    		
    		e.stopImmediatePropagation();
    		
    	});

    	//
    	//checking if oob value is N then ommit
    	angular.element( ".oobvalue" ).each(function(){
    		if(angular.element(this ).html() == "N"){
    			angular.element(this ).html("");
    		}
    	});
    	//link visited color change
    	angular.element( ".dimensionTableBasic" ).click(function() {
    		angular.element(".dimensionTableBasic").removeClass("dimensionTableVisited");
    		angular.element(".usecaseTable").removeClass("usecaseTableclick");
    		angular.element(".usecaseTablerule").removeClass("usecaseTableclick");
    		angular.element(this).addClass("dimensionTableVisited");
    		angular.element(this).parents(".usecaseTable").addClass("usecaseTableclick");
    		angular.element(this).parents(".usecaseTablerule").addClass("usecaseTableclick");
    	});
    });


	//code for relationship table
	$scope.dimensionRelationship=function(usecrule){
		//rule-relation table display shuffle
		$scope.dimensionrule=false;
    	//starting loading animation
		$rootScope.loadinganimation=true;
		//hide error element
		//$scope.errorrelationsearch=false;
		var datasurr = usecrule.UseCaseSurr;
		
		$scope.useCaseNo = usecrule.IdLabel
		$scope.useCaseName = usecrule.UseCase;

		SearchResultService.usecaseRelationships(datasurr).success(function(output)
		    	{		
						//show relationship table
						$scope.dimensionrelationtable=true;
					
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
									regulatorytree = regulatorytree + "</a>" + "</br>" + "<a data-toggle='tooltip' data-placement='left' title=\'" + tooltip1 +"\' tooltip-placement='left'>" + "<strong>" + "(" + regcatall[i+1].reg_cat_name + ")" + "</strong>" + "-" + regcatall[i+1].reg_pub_name  + "<strong>"+ "::"  + "</strong>"+ regcatall[i+1].reg_cntrl_name;
								}
							}
							 var elem = document.getElementById('regcatallinucresult');
							 if(typeof elem !== 'undefined' && elem !== null) {
								  document.getElementById('regcatallinucresult').innerHTML = regulatorytree;
							 }
							
						}
					
						//
		    		
						//
		    		//	$scope.dimensionregulatorycatagory = output.regulatory_cat;
		    			$scope.dimensionthreatcategory = output.uc_threat_category;
		    			$scope.dimensionessentialpractice = output.essential_practice;
		    			$scope.dimensionindustry = output.industry;
		    			$scope.dimensionuccategory = output.uc_category;
		    			$scope.dimensionucsubcategory = output.uc_subcategory;
		    			$scope.dimensionucrules = output.uc_rules;
		    			//ending loading animation
						$rootScope.loadinganimation=false;
		    	}).error(function (error) {
		    		//ending loading animation
		    		$rootScope.loadinganimation=false;
		    		//show error element
		    		//$scope.errorrelationsearch=true;
		    		//show error messege
		    		$scope.relationsearchbottom=error.ErrMsg;
		    		});
		
		
		
	}

	//for twindle arrow
	angular.element(".accordListrotate").click(function(){
	    angular.element(".accordListrotate").removeClass('accordList');
	    angular.element(this).addClass('accordList');

	}); 
	
    //code for user role specific access

	$scope.$watch(function () {
	    if ($rootScope.role == "ADMIN") {
	        $scope.useCaseMaintain = true;
	        $scope.userAccountManagement = true;
	        $scope.ucrlPackage = true;
	        $scope.alertMenu = true;
	        $scope.searchMenu = true;
	        $rootScope.searchOOBCri=true;
	    }
	    if ($rootScope.role == "SALES_PERSON") {
	        $scope.searchMenu = true;
	        $rootScope.searchOOBCri=true;
	    }
	    if ($rootScope.role == "USER_VIEW") {
	        $scope.searchMenu = true;
	        $rootScope.exported = true;
	        $scope.feedback = true;
	        $scope.userAccountManagement = false;
	        $scope.showAllmode=true;
	        $rootScope.searchOOBCri=true;
	        
	    }
	    if ($rootScope.role == "USER_EXPORT") {
	        $scope.searchMenu = true;
	        $rootScope.searchOOBCri=true;
	    }
	});
    
    $scope.userMsg = "Please select search criteria from left";
    $scope.showResult = false;

    $scope.currentTab = 'html/search-result.html';

    $scope.onClickTab = function() {
        $scope.currentTab = 'html/search-name-id.html';
				angular.element("input[type='checkbox']").siblings('ul')
        .find("input[type='checkbox']")
        .prop('checked', false);
		angular.element(".allclass").prop('checked', false);
		
		postjsonresult = {
				"RegCat": [],
				"CyberSecFunc": [],
				"Industry": [],
				"EP": [],
				"ThreatModel": [],
				"LogSource": []
			};
			$scope.items = [];
    }
    $scope.onClickTabRule = function() {
        $scope.currentTab = 'html/usecaserule.html';

    }
    $scope.onClickTree = function() {
        $scope.currentTab = 'html/search-result.html';
        $scope.dimensionrule=false;
        $scope.dimensionrelationtable=false;
        $scope.dimensionrule=false;
        $scope.dimensionrelationtable=false;
        $scope.resultdata={
                cateGory:[]
            };
        $scope.chckresult();
        $scope.tabledata =[];
       $scope.showResult = false;
       $scope.userMsg = "Please select search criteria from left";
    }
    $scope.onShowlibrary = function() {
        $scope.currentTab = 'html/search-result.html';
		
		angular.element("input[type='checkbox']").siblings('ul')
        .find("input[type='checkbox']")
        .prop('checked', false);
		angular.element(".allclass").prop('checked', false);
		
		postjsonresult = {
				"RegCat": [],
				"CyberSecFunc": [],
				"Industry": [],
				"EP": [],
				"ThreatModel": [],
				"LogSource": []
			};
			$scope.items = [];
		
        $scope.dimensionrule=false;
        $scope.dimensionrelationtable=false;
        $scope.resultdata={
                cateGory:[]
            };
        $scope.chckresult();
        $scope.tabledata =[];
       $scope.showResult = false;
       $scope.userMsg = "Please select search criteria from left";

        
    }


    angular.element('.panel-heading a').on('click', function(e) {
        if (angular.element(this).parents('.panel').children('.panel-collapse').hasClass('in')) {
            e.stopPropagation();
        }
    });
    
    $scope.name = $rootScope.username;
    /*-------/code for search pages------*/
    $scope.getResult = function(data) {
    	var id = data.RuleId;
    	$scope.ruleNo = data.RuleIdValue;
		$scope.ruleName = data.Rule;
    	
    	//rule-relation table display shuffle
		$scope.dimensionrelationtable=false;
		$scope.dimensionrule=true;
		
        //starting loading animation	
        $rootScope.loadinganimation = true;

        $scope.ruleResult = [];
        $scope.logSource = [];
        $scope.input = [];
        $scope.output = [];
        $scope.thdgrp = [];
        $scope.responseText = [];
        $scope.inputDisplay = [];

        SearchResultService.getRuleSearchResult(id).then(function(result) {
            //console.log(JSON.stringify(result, null,2));
            $scope.ruleResult = result.RuleDescription;
            $scope.logSource = result.LogSource[0].Value;
            $scope.input = result.Input;
            $scope.output = result.Output;
            $scope.thdgrp = result.ThreadModelGroup;
            $scope.responseText = result.ResponseText;
            $scope.Transactionaldata = [];
            $scope.ReferentialData = [];
            $scope.EventNameCategory = [];
            for (var i = 0; i < $scope.input.length; i++) {
                if ($scope.input[i].Label == "Event Attributes") {
                    var events = $scope.input[i].Value;
                    for (var j = 0; j < events.length; j++) {
                        var obj = {};
                        if (j == 0) {
                            obj["Label"] = "Event Attributes";
                            obj["Value"] = events[j].key + " :- " + events[j].value;
                        } else {
                            obj["Label"] = "";
                            obj["Value"] = events[j].key + " :- " + events[j].value;
                        }
                        $scope.inputDisplay.push(obj);
                    }
                }else if($scope.input[i].Label == "Transactional Data"){
                    $scope.Transactionaldata.push($scope.input[i]);
                } else if($scope.input[i].Label == "Referential Data"){
                    $scope.ReferentialData.push($scope.input[i]);
                } else if($scope.input[i].Label == "Event Name/Category"){
                    $scope.EventNameCategory.push($scope.input[i]);
                }              
                else {
                    var obj1 = {};
                    obj1["Label"] = $scope.input[i].Label;
                    obj1["Value"] = $scope.input[i].Value;
                    $scope.inputDisplay.push(obj1);
                }
            }
            
            if($scope.Transactionaldata.length >0){
                //console.log('Transactionaldata');
                var trsndata = $scope.Transactionaldata;
                for (var j = 0; j < trsndata.length; j++) {
                    var objt = {};
                    if (j == 0) {
                        objt["Label"] = "Transactional Data";
                        objt["Value"] = trsndata[j].Value;
                    } else {
                        objt["Label"] = "";
                        objt["Value"] = trsndata[j].Value;
                    }
                    $scope.inputDisplay.push(objt);
                }
            }
            
            
            if($scope.ReferentialData.length >0){
                 //console.log('ReferentialData');
                var refedata = $scope.ReferentialData;
                for (var j = 0; j < refedata.length; j++) {
                    var objr = {};
                    if (j == 0) {
                        objr["Label"] = "Referential Data";
                        objr["Value"] = refedata[j].Value;
                    } else {
                        objr["Label"] = "";
                        objr["Value"] = refedata[j].Value;
                    }
                    $scope.inputDisplay.push(objr);
                }
            }
            
            if($scope.EventNameCategory.length >0){
                //console.log('EventNameCategory');
                var evetdata = $scope.EventNameCategory;
                for (var j = 0; j < evetdata.length; j++) {
                    var obje = {};
                    if (j == 0) {
                        obje["Label"] = "Event Name/Category";
                        obje["Value"] = evetdata[j].Value;
                    } else {
                        obje["Label"] = "";
                        obje["Value"] = evetdata[j].Value;
                    }
                    $scope.inputDisplay.push(obje);
                }
            }
            
            $scope.inputDisplaydata = $scope.inputDisplay;
            console.log(JSON.stringify($scope.inputDisplaydata, null, 2));
            $rootScope.loadinganimation = false;

        });

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


    };
    
    buildEmptyTree();
    $scope.selectedNode = "";
    function buildEmptyTree() {
        var entdata = null;
        var dataURL = "data/dataRajesh.json";
        Items.getJson(dataURL).then(function(result) {
            $scope.displayTree = result;
        }, function(result) {
            //alert("Error: No data returned", result);
        }); 
    }


    $scope.tabsusecaseloader = {
        loading: true,
        loaded: false,
    };
    $scope.liregactive = 'active';
    $scope.clickReg = function() {
        $scope.tabsusecaseloader.loaded = false,
            $scope.tabsusecaseloader.loading = true,
            $scope.liregactive = 'active';
        $scope.liCapecactive = 'no-active';
    }
    $scope.clickCapec = function() {
        $scope.tabsusecaseloader.loaded = true,
            $scope.tabsusecaseloader.loading = false,
            $scope.liregactive = 'no-active';
        $scope.liCapecactive = 'active';
    }

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
        $scope.rulethd = false;
        $scope.ruleresponse = true;
    }
    
    $scope.ClikedResult = function(node) {
    	//item populate
    	/*var rules3d=[];
    	rules3d = $scope.items;
    	$scope.takeitem = rules3d;*/
    	angular.element('#rateplanmapping-scroll tbody').scrollTop(0);
    	//angular.element("#rateplanmapping-scroll tbody")[0].scrollTop=0; 
    	$scope.selection =[];
    	$scope.ruleLength =0;
    	
		//text field value
    	postjsonresult.useCaseRuleIdName = $scope.seaValForEvery;
		console.log(postjsonresult);
		
    	  $scope.dimensionrule=false;
	        $scope.dimensionrelationtable=false;

        $scope.licreateruledetails = 'active';
        $scope.licreateruleinput = 'no-active';
        $scope.licreateruleinputdata = 'no-active';
        $scope.licreaterulelog = 'no-active';
        $scope.licreateruleoutput = 'no-active';
        $scope.licreateruleresponse = 'no-active';
        $scope.ruleResult = [];
        $scope.logSource = [];
        $scope.input = [];
        $scope.output = [];
        $scope.responseText = [];
        $scope.inputDisplay = [];

 
        var trsv = $scope.displayTree;
        var datsv = JSON.stringify(trsv);
        var input_obj = JSON.parse(datsv);
        var selectedvalarry = [];

        var output_array = [];

        function processNode(node, path) {
            for (var i = 0; i < node.length; i++) {
                var node1 = node[i];
                if (node1.checked == true) {
                    if (path == '') {
                        output_array.push(path + i);
                        node1.__id__ = path + i;
                        processNode(node1.children, path + i);
                    } else {
                        output_array.push(path + ' ' + i);
                        node1.__id__ = path + ' ' + i;
                        processNode(node1.children, path + ' ' + i);
                    }
                } else {
                    if (node1.children.length > 0) {
                        var node2 = node1.children;
                        if (path == '') {
                            node1.__id__ = path + i;
                            processNode(node2, path + i)
                        } else {
                            node1.__id__ = path + ' ' + i;
                            processNode(node2, path + ' ' + i)
                        }
                    }
                }
            }
        }
        processNode(input_obj, '');

        var output_array1 = [];
        
        //starting with character check
        /*var loadcharstart;
        function startingwithchar(loadcharstart){
        	var result;
        	var pos = str.indexOf(loadcharstart);
        	if(pos == 0){
        		result=true;
        	}
        	return result;
        }*/
        //
        
        for (var i = 0; i < output_array.length; i++) {
            var found = false;
            for (var j = i + 1; j < output_array.length; j++) {
            	var mm = output_array[j].indexOf(output_array[i]);
            	//alert(mm);
            	if (mm == 0) {
                    found = true;
                }
                /*if (output_array[j].startsWith(output_array[i])) {
                    found = true;
                }*/
            }
            if (!found) {
                output_array1.push(output_array[i]);
            }
        }


        function processFinalNode(node) {
            for (var i = 0; i < node.length; i++) {
                var node1 = node[i];
                if (!ifAnyArrayStartsWith(node1.__id__)) {
                    delete node[i];
                } else {
                    delete node1.__id__;
                    if (node1.children.length > 0) {
                        processFinalNode(node1.children);
                    }
                }
            }
        }
        processFinalNode(input_obj);

        function ifAnyArrayStartsWith(id) {
            for (var i = 0; i < output_array1.length; i++) {
            	var nnnn = output_array1[i].indexOf(id);
                if (nnnn == 0) {
                    return true;
                }
                /*if (output_array1[i].startsWith(id)) {
                    return true;
                }*/
            }
            return false;
        }


        function removeNull(arrayWithNullEntries) {
            for (var i = 0; i < arrayWithNullEntries.length; i++) {
                if (arrayWithNullEntries[i] === null || arrayWithNullEntries[i] === undefined) {
                    arrayWithNullEntries.splice(i, 1);
                    i--;
                }
                if (!(arrayWithNullEntries[i] === undefined || arrayWithNullEntries[i] === null)) {
                    removeNull(arrayWithNullEntries[i].children);
                }
            }
        }
        removeNull(input_obj);

        function restucutre_post(obj) {
            for (var i = 0; i < obj.length; i++) {
                var obj1 = obj[i];
                delete obj1.checked;
                delete obj1.show;
                delete obj1.$$hashKey;
                delete obj1.name;
                delete obj1.ThreadModelType;
                if (obj1.children.length > 0) {
                    var obj2 = obj1.children;
                    restucutre_post(obj2);
                }
            }
            return obj;
        }

        var restctdata = restucutre_post(input_obj);
        //console.log(typeof restctdata[0]);
        
        if(typeof restctdata[0] == 'undefined'){
            var repostjson = restctdata.length=0;
        }else{
            var repostjson = restctdata[0].children;
        }
        function chck(node) {
            for (var i = 0; i < node.length; i++) {
                if (node[i].SurrId == undefined) {
                    var catge = node[i].Type;
                    var nodeObj = node[i].children;
                    delete node[i].children;
                    delete node[i].Type;
                    delete node[i].disabled;
                    node[i][catge] = nodeObj;
                    if (!(node[i][catge] === undefined)) {
                        chck(node[i][catge]);
                    }
                } else {
                    if (node[i].Type == 'ThreatModel') {
                        delete node[i].Type;
                        delete node[i].disabled;
                        node[i].id = node[i].SurrId;
                        delete node[i].SurrId;
                        if (!(node[i].children === undefined)) {
                            chck(node[i].children);
                        }
                    } else {
                        delete node[i].Type;
                        node[i].id = node[i].SurrId;
                        delete node[i].SurrId;
                        delete node[i].disabled;
                        if (!(node[i].children === undefined)) {
                            if (node[i].children.length == 0) {
                                delete node[i].children;
                            } else {
                                chck(node[i].children);
                            }
                        }
                    }
                }
            }
            return node;
        }
        chck(repostjson);
        var postJson = chck(repostjson);

     

        //alert("input1"+JSON.stringify(postJson[0])); 

        $scope.parsejson = function() {
            $scope.logsourceArr = [];
            $scope.outputJson = {
                "RegCat": [],
                "CyberSecFunc": [],
                "Industry": [],
                "EP": [],
                "ThreatModel": [],
                "LogSource": []
            };

            for (var z = 0; z < postJson.length; z++) {
                if (postJson[z].CyberSecFunc != undefined) {
                    var cybersecfuncArr = postJson[z].CyberSecFunc;
                    for (var i = 0; i < cybersecfuncArr.length; i++) {
                        var cyberSecObj = {
                            "UseCaseCat": []
                        };
                        cyberSecObj["id"] = cybersecfuncArr[i].id;
                        var cybersecChildrenArr = cybersecfuncArr[i].children
                        if (cybersecChildrenArr != undefined) {
                            var usecaseCatArr = cybersecChildrenArr[0].UseCaseCat;
                            for (var j = 0; j < usecaseCatArr.length; j++) {
                                var usecasecatobj = {
                                    "UseCaseSubCat": []
                                }
                                usecasecatobj["id"] = usecaseCatArr[j].id;
                                var UseCaseCatChildrenArr = usecaseCatArr[j].children;
                                if (UseCaseCatChildrenArr != undefined) {
                                    var UseCaseSubCatArr = UseCaseCatChildrenArr[0].UseCaseSubCat;
                                    if (UseCaseSubCatArr != undefined) {
                                        for (var k = 0; k < UseCaseSubCatArr.length; k++) {
                                            var UseCaseSubCatObj = {};
                                            UseCaseSubCatObj["id"] = UseCaseSubCatArr[k].id;
                                            usecasecatobj.UseCaseSubCat.push(UseCaseSubCatObj);
                                        }
                                    }
                                }
                                cyberSecObj.UseCaseCat.push(usecasecatobj);
                            }
                        }
                        $scope.outputJson.CyberSecFunc.push(cyberSecObj);
                    }
                } else if (postJson[z].LogSource != undefined) {
                    $scope.outputJson.LogSource = postJson[z].LogSource;
                } else if (postJson[z].Industry != undefined) {
                    $scope.outputJson.Industry = postJson[z].Industry;
                } else if (postJson[z].EP != undefined) {
                    $scope.outputJson.EP = postJson[z].EP;
                } else if (postJson[z].ThreadModel != undefined) {
                    var threatArr = postJson[z].ThreadModel;
                    var thratOutputArr = [];

                    for (var i = 0; i < threatArr.length; i++) {
                        if (threatArr[i].children == undefined) {
                            thratOutputArr.push({
                                "id": threatArr[i].id
                            });
                        } else {
                            var firstChildArr = threatArr[i].children
                            for (var j = 0; j < firstChildArr.length; j++) {
                                if (firstChildArr[j].children == undefined) {
                                    thratOutputArr.push({
                                        "id": firstChildArr[j].id
                                    });
                                } else {
                                    var secondChildArr = firstChildArr[j].children;
                                    for (var k = 0; k < secondChildArr.length; k++) {
                                        thratOutputArr.push({
                                            "id": secondChildArr[k].id
                                        });
                                    }
                                }
                            }
                        }

                    }
                    $scope.outputJson.ThreatModel = thratOutputArr;
                } else if (postJson[z].RegCat != undefined) {
                    var regCatcArr = postJson[z].RegCat;
                    for (var i = 0; i < regCatcArr.length; i++) {
                        var regCatObj = {
                            "RegPub": []
                        };
                        regCatObj["id"] = regCatcArr[i].id;
                        var regCatChildrenArr = regCatcArr[i].children;
                        if (regCatChildrenArr != undefined) {
                            var regPubArr = regCatChildrenArr[0].RegPub;
                            for (var j = 0; j < regPubArr.length; j++) {
                                var regPubObj = {
                                    "RegCntl": []
                                }
                                regPubObj["id"] = regPubArr[j].id;
                                var regPubArrChildrenArr = regPubArr[j].children;
                                if (regPubArrChildrenArr != undefined) {
                                    var regCntlArr = regPubArrChildrenArr[0].RegCntl;
                                    if (regCntlArr != undefined) {
                                        for (var k = 0; k < regCntlArr.length; k++) {
                                            var regCntlObj = {};
                                            regCntlObj["id"] = regCntlArr[k].id;
                                            regPubObj.RegCntl.push(regCntlObj);
                                        }
                                    }
                                }
                                regCatObj.RegPub.push(regPubObj);
                            }
                        }
                        $scope.outputJson.RegCat.push(regCatObj);
                    }
                }
            }
        }
        
        $scope.callService = function() {
            //starting loading animation
            $rootScope.loadinganimation = true;
            $scope.datashown = false;
            $scope.showResult = true;
       	 $scope.showModal = false;
       	 var resultURL = $rootScope.url+'/getSearchByDimensionResult';
            $scope.parsejson();
            //console.log(JSON.stringify($scope.outputJson));
            //clear console log

       //    if($scope.outputJson.RegCat.length !=0 || $scope.outputJson.CyberSecFunc.length !=0 || $scope.outputJson.Industry.length !=0 || $scope.outputJson.EP.length !=0 | $scope.outputJson.ThreatModel.length !=0 | $scope.outputJson.LogSource.length !=0){
            if(postjsonresult.RegCat.length !=0 || postjsonresult.CyberSecFunc.length !=0 || postjsonresult.Industry.length !=0 || postjsonresult.EP.length !=0 || postjsonresult.ThreatModel.length !=0 || postjsonresult.LogSource.length !=0 || postjsonresult.oobParam =="" || postjsonresult.useCaseRuleIdName ==""|| postjsonresult.oobParam =="Yes" || postjsonresult.oobParam =="No"){

            $http.post(resultURL, postjsonresult).success(function(data, status, headers, config) {
                
            	//clearing console
                    clearconsole();
            	//
                $rootScope.loadinganimation = false; 
                if (data.cateGory.length == 0) {
                    $scope.resultdata={
                        cateGory:[]
                    };
                    $scope.chckresult();
                    $scope.showResult = false;
                    $scope.dimensionrule=false;
                    $scope.dimensionrelationtable=false;
                    $scope.userMsg = "No result found";
                } else {
                    $scope.resultdata = data;
                    $scope.tabledata = [];
                    $scope.chckresult();
                }
                //end loading animation	
                $rootScope.loadinganimation = false;
            }).error(function(data, status, headers, config) {
                //clearing console
                    clearconsole();
                //end loading animation	
                $rootScope.loadinganimation = false;
                if (data.ErrCode != undefined) {
                    $scope.resultdata={
                        cateGory:[]
                    };
                    $scope.chckresult();
                    $scope.showResult = false;
                    $scope.dimensionrule=false;
                    $scope.dimensionrelationtable=false;
                    $scope.userMsg = data.ErrMsg;
                }

            });
           }else{
                
                $rootScope.loadinganimation = false;
                $scope.showResult = false;
                $scope.dimensionrule=false;
                $scope.dimensionrelationtable=false;
             //   alert('Please select search criteria from dimensions');
    //  
          	$scope.chckresult();
          	$scope.tabledata =[];
              $scope.showResult = false;
              $scope.userMsg = "Please select search criteria from left";


                return false;
           }
     }
       
      $scope.modalMsg="";
      $scope.showPopup = function() {
        if(postjsonresult.RegCat.length ==0 && postjsonresult.CyberSecFunc.length ==0 && postjsonresult.Industry.length ==0 && postjsonresult.EP.length ==0 && postjsonresult.ThreatModel.length ==0 && postjsonresult.LogSource.length ==0 && (postjsonresult.useCaseRuleIdName == undefined || postjsonresult.useCaseRuleIdName == "")){ 
      		  $scope.showModal = true; 
      		  if(postjsonresult.oobParam==""){
      			$scope.modalMsg ="Are you sure , you want to fetch full list of Use Case library ?"
      		  }else if(postjsonresult.oobParam=="Yes"){
      			$scope.modalMsg ="Are you sure you want to fetch all Out of Box Use Case Rules ?"
      		  }else if(postjsonresult.oobParam=="No"){
      			$scope.modalMsg ="Are you sure you want to fetch all Custom Use Case Rules ?" 
      		  }
      		  
       		  $("#myModal").modal();
       	  }else{
       		  $scope.callService();
       	  }
        }
      
        $scope.userMsg = "Please select search criteria from left";
        
        $scope.showPopup();


        $scope.clearfun = function() {
            var postJson = [];
            var resultURL = $rootScope.url+'/getSearchByDimensionResult';
            $http.post(resultURL, postJson).success(function(data, status, headers, config) {
                    //clearing console
                    clearconsole();
                if (data.cateGory.length == 0) {
                	 $scope.resultdata={
                             cateGory:[]
                         };
                	$scope.chckresult();
                	$scope.tabledata =[];
                    $scope.showResult = false;
                    $scope.userMsg = "Please select search criteria from left";
                    $scope.licreateruledetails = 'active';
                    $scope.licreateruleinput = 'no-active';
                    $scope.licreateruleinputdata = 'no-active';
                    $scope.licreaterulelog = 'no-active';
                    $scope.licreateruleoutput = 'no-active';
                    $scope.licreateruleresponse = 'no-active';
                    $scope.ruledetails = true;
                    $scope.rulesource = false;
                    $scope.ruleinput = false;
                    $scope.ruleoutput = false;
                    $scope.ruleresponse = false;
                    $scope.ruleResult = [];
                    $scope.logSource = [];
                    $scope.input = [];
                    $scope.output = [];
                    $scope.responseText = [];
                    $scope.inputDisplay = [];
                    $scope.dimensionrule=false;
                    $scope.dimensionrelationtable=false;
                } else {
                    $scope.resultdata.cateGory.length=0;
                    $scope.tabledata = [];
                    $scope.chckresult();
                    $scope.showResult = false;
                    $scope.dimensionrule=false;
                    $scope.dimensionrelationtable=false;
                }
                $rootScope.loadinganimation = false;
            }).error(function(data, status, headers, config) {
                //clearing console
                    clearconsole();
                //end loading animation	
                $rootScope.loadinganimation = false;
                if (data.ErrCode != undefined) {
                    $scope.resultdata.cateGory.length=0;
                    $scope.tabledata = [];
                    $scope.chckresult();
                    $scope.showResult = false;
                    $scope.dimensionrule=false;
                    $scope.dimensionrelationtable=false;
                    $scope.userMsg = data.ErrMsg;
                }
            });
        }
    	//rule count
    }
    
    
    $scope.toggleSelection = function toggleSelection(result) {
        var idx = $scope.selection.indexOf(result);
        // is currently selected
        if (idx > -1) {
          $scope.selection.splice(idx, 1);
        }
        // is newly selected
        else {
          $scope.selection.push(result);
        }
      };
      
      var nn;
      $scope.$watch(function () {
      	angular.element(".ruleexportDi").each(function() {
      		nn = angular.element(this).is(':checked') ? 1 : 0;
      		if(nn == 1){
      	        return false;
      		}
      	});
      }); 
      
    $scope.exportFiles = function() { 
		if($scope.selection.length > 0)
		{  
    	//loading animation
        $rootScope.loadinganimation = true;
        //
    	var postJson = {
    		    "user_surr_id": $rootScope.surrId,
    		    "company_surrId": $rootScope.compSurrId,
    		    "rulefiles": []
    		};
    	for (var int = 0; int < $scope.selection.length; int++) {
    		var fileObj ={};
    		fileObj["filename"] = $scope.selection[int].fileName;
    		fileObj["file_surr_id"] = $scope.selection[int].packageSurrId;
    		postJson.rulefiles.push(fileObj);
		}

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
                //clearing console
                    clearconsole();
        	$scope.selection =[];
        	$scope.chckresult();
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
            	    
            }
            $rootScope.loadinganimation = false;
    		postJson.rulefiles.length = 0;
        }).error(function(data, status, headers, config) {
                //clearing console
                    clearconsole();
            $rootScope.loadinganimation = false;
            alert("no files found on server for this rule")
        });
		}
		else{
			alert("Please select at least one file to export");
		}
      };
        
        
      
      
    $scope.chckresult = function() {
        $scope.licreateruledetails = 'active';
        $scope.ruledetails = false;
        $scope.rulesource = false;
        $scope.ruleinput = false;
        $scope.ruleoutput = false;
        $scope.rulethd = false;
        $scope.ruleresponse = false;
        $scope.showResult = true;

        $scope.jsonObj = {
            "Category": "",
            "SubCategory": "",
            "IdLabel": "",
            "UseCase": "",
            "RuleIdValue":"",
            "Rule": "",
            "RuleId": "",
            "RuleDescription": "",

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
                    $scope.jsonObj["Category"] = $scope.catObj.name;
                } else {
                    if ($scope.catObj == null) {
                        $scope.catObj = $scope.resultdata.cateGory[i];
                        $scope.jsonObj["Category"] = $scope.catObj.name;
                    } else {
                        $scope.jsonObj["Category"] = "";
                    }
                }

                for (j = 0; j < $scope.catObj.subCategory.length; j++) {
                    if ($scope.subcatObj != null && $scope.subcatObj != $scope.catObj.subCategory[j]) {
                        $scope.subcatObj = $scope.catObj.subCategory[j];
                        $scope.jsonObj["SubCategory"] = $scope.subcatObj.name;
                    } else {
                        if ($scope.subcatObj == null) {
                            $scope.subcatObj = $scope.catObj.subCategory[j];
                            $scope.jsonObj["SubCategory"] = $scope.subcatObj.name;
                        } else {
                            $scope.jsonObj["SubCategory"] = "";
                        }
                    }

                    for (k = 0; k < $scope.subcatObj.UseCase.length; k++) {
                        if ($scope.usecase != null && $scope.usecase != $scope.subcatObj.UseCase[k]) {
                            $scope.usecase = $scope.subcatObj.UseCase[k];
                            $scope.jsonObj["IdLabel"] = $scope.usecase.id_label;
                            $scope.jsonObj["UseCase"] = $scope.usecase.name;
                            $scope.jsonObj["UseCaseSurr"] = $scope.usecase.id;
                        } else {
                            if ($scope.usecase == null) {
                                $scope.usecase = $scope.subcatObj.UseCase[k];
                                $scope.jsonObj["IdLabel"] = $scope.usecase.id_label;
                                $scope.jsonObj["UseCase"] = $scope.usecase.name;
                                $scope.jsonObj["UseCaseSurr"] = $scope.usecase.id;

                            } else {
                                $scope.jsonObj["IdLabel"] = "";
                                $scope.jsonObj["UseCase"] = "";
                                $scope.jsonObj["UseCaseSurr"] = "";
                            }
                        }
                        for (l = 0; l < $scope.usecase.Rule.length; l++) {
                            $scope.rule = $scope.usecase.Rule[l];
                            $scope.jsonObj["Rule"] = $scope.rule.name;
                            $scope.jsonObj["RuleId"] = $scope.rule.id;
                            $scope.jsonObj["RuleIdValue"] = $scope.rule.id_label;
                            $scope.jsonObj["RuleDescription"] = $scope.rule.description;
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
        
        $scope.ruleLength =  $scope.tabledata.length;
    }

}]);
            function clearconsole() { 

               console.clear();
            }
