angular.module('KorboEE')
    .controller('KeeNewCtrl', function($scope, $rootScope, $dropdown, $modal, KorboCommunicationService, $q, KorboCommunicationFactory,
                                       korboConf, $timeout, $http, TypesHelper, ItemsExchange, ContextualMenu, $window, Config) {

        $scope.tabs = [];
        $scope.disactiveLanguages = [];
        $scope.disactiveLanguagesPopoverTemplate = 'src/KorboEE/New/KorboEE.languagesPopover.tmpl.html';
        $scope.imageUrl = "";
        $scope.saveClicked = false;
        $scope.activeFilter = false;
        $scope.isSaving = false;
        $scope.originalUrlCheck = true;
        $scope.topArea = {
            'message': 'You are creating a new entity',
            'status': 'info'
        };
        $scope.typeFilter = {'label': ""};

        $window[$scope.conf.globalObjectName].onCancel(function(){
            ContextualMenu.wipeActionsByType('advancedMenu');
        });

        var initTypes = function(){
            $scope.types = [];
        };

        var buildTypesFromConfiguration = function(){
            var tmp = angular.copy($scope.conf.type);
            for (var i in tmp) {
                var indexFind = $scope.types.map(function(e){ return e.URI }).indexOf(tmp[i].URI);
                if(indexFind === -1){
                    var t = {};
                    t.URI = tmp[i].URI;
                    t.label = tmp[i].label;
                    t.checked = tmp[i].state || false;
                    $scope.types.push(t);
                } else {
                    $scope.types[indexFind].checked = true;
                }

            }
        };

        var buildTypesFromArray = function(typesToAdd){
            for(var i=0; i<typesToAdd.length; i++){
                var indexFind = $scope.types.map(function(e){ return e.URI }).indexOf(typesToAdd[i]);
                if(indexFind === -1){
                    var t = {};
                    t.URI = typesToAdd[i];
                    t.label = TypesHelper.getLabel(typesToAdd[i]);
                    t.checked = true;
                    $scope.types.push(t);
                } else {
                    $scope.types[indexFind].checked = true;
                }
            }
        };


        // set default language
        $scope.defaultLan = $scope.conf.languages[0];
        for (var j in $scope.conf.languages){
            if($scope.conf.languages[j].state === true) {
                $scope.defaultLan = $scope.conf.languages[j];
                break;
            } // end if
        } // end for

        var korboComm = new KorboCommunicationFactory();

        if(typeof($scope.idEntityToEdit) !== 'undefined' &&$scope.idEntityToEdit !== null){
            console.log("vuoi modificare l'entità con id ", $scope.idEntityToEdit);
            $scope.topArea = {
                'message': 'Loading entity...',
                'status': 'info'
            };
            var promises = [];
            var p;
            var param = {};
            param.endpoint = $scope.conf.endpoint;
            param.basketID = "null";
            param.language = $scope.defaultLan.value;
            param.provider = 'korbo';
            param.item = {uri: $scope.idEntityToEdit};

            korboComm.getItem(param, false).then(function(res){

                if(res.label !== ''){
                    var title = angular.uppercase(res.language_code);
                    var name = angular.lowercase(res.language_code);
                    var lang = {
                        'title': title,
                        'name' : name,
                        'description': res.abstract,
                        'label': res.label,
                        'mandatory': true,
                        'hasError': false,
                        'tooltipMessageTitle': tooltipMessageTitle + name,
                        'tooltipMessageDescription': tooltipMessageDescription + name,
                        'tooltipMessageError': "message",
                        'tooltipMessageErrorTab': "There are some errors in the "+name+" languages fields"
                    };
                    $scope.tabs.push(lang);
                    pushCurrentLang(lang);
                    buildLanguageTabs();

                    $scope.imageUrl = res.depiction;
                    $scope.originalUrl = res.resource;
                    initTypes();
                    buildTypesFromArray(res.type);
                    buildTypesFromConfiguration();
                }

                if(res.available_languages.length >= 1){
                    for(var i = 0; i < res.available_languages.length; i++){
                        if(res.available_languages[i] !== $scope.defaultLan.value){
                            param.language = res.available_languages[i];
                            p = korboComm.getItem(param, false);
                            promises.push(p);
                        }
                    }

                    $q.all(promises).then(function(r){
                        for(var j=0; j< r.length; j++){
                            (function(index){
                                var title = angular.uppercase(r[index].language_code);
                                var name = angular.lowercase(r[index].language_code);
                                var lang = {
                                    'title': title,
                                    'name' : name,
                                    'description': r[index].abstract,
                                    'label': r[index].label,
                                    'mandatory': true,
                                    'hasError': false,
                                    'tooltipMessageTitle': tooltipMessageTitle + name,
                                    'tooltipMessageDescription': tooltipMessageDescription + name,
                                    'tooltipMessageError': "message",
                                    'tooltipMessageErrorTab': "There are some errors in the "+name+" languages fields"
                                };
                                $scope.tabs.push(lang);
                                pushCurrentLang(lang);
                                buildLanguageTabs();
                            })(j)
                        } // end for
                        $scope.topArea = {
                            'message': 'You are editing the entity...',
                            'status': 'info'
                        };
                    });

                } else {
                    $scope.topArea = {
                        'message': 'You are editing the entity...',
                        'status': 'info'
                    };
                }

            },
            function(error){
                console.log("server error");
                $scope.topArea = {
                    'message': 'Error getting entity info!',
                    'status': 'error'
                };
            });

        };


        var delay;

        // tooltip message for image url
        $scope.imageUrlErrorMessage = "Invalid URL";
        $scope.imageUrlTooltipeMessage = "Depiction URL";
        $scope.imageUrlHasError = false;
        var urlPattern = new RegExp('(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?', 'i');

        // tooltip messages for languages
        var tooltipMessageTitle = "Insert title of the entity in ";
        var tooltipMessageDescription = "Insert description of the entity in ";
        var errorMandatory = "The Title field is mandatory and must be filled";
        var errorLabelTooShort = " The Title must be contain at least " + $scope.conf.labelMinLength +" characters";


        $scope.typesHasError = false;
        $scope.typesErrorMessage = "You must select at least one type";
        $scope.typesTooltipeMessage = "Select at least one type";

        if(!$scope.editMode){
            initTypes();
            buildTypesFromConfiguration();
        }

        var addActionToContextualMenu = function(lang){
            ContextualMenu.addAction({
                name: 'rml'+lang.name,
                type: 'advancedMenu',
                label: 'Remove '+lang.name,
                priority: 1,
                showIf: function(){
                    return true;
                },
                action: function(_lang){
                    return function(){
                        if($scope.tabs.length > 1){
                            $scope.removeLanguage(_lang); 
                        }
                    };
                }(lang)
            });
        };

        var pushCurrentLang = function(lang){
            if($scope.tabs.length == 1){
                addActionToContextualMenu(lang);
                ContextualMenu.modifyHeaderActionByName('rml'+$scope.tabs[0].name, true);
            } else if($scope.tabs.length == 2){
                addActionToContextualMenu(lang);
                ContextualMenu.modifyHeaderActionByName('rml'+$scope.tabs[0].name, false);
            } else if($scope.tabs.length > 2){
                addActionToContextualMenu(lang);
            }
        };

        ContextualMenu.addAction({
            name: 'editURL',
            type: 'advancedMenu',
            label: 'Edit original URL',
            priority: 3,
            showIf: function(){
                return true;
            },
            action: function(resource){
                $scope.originalUrlCheck = false;
                ContextualMenu.modifyHeaderActionByName('editURL', true);
            }
        });

        ContextualMenu.addAction({
            name: 'SearchOriginalURL',
            type: 'advancedMenu',
            label: 'Search original URL',
            priority: 3,
            showIf: function(){
                return $scope.editMode;
            },
            action: function(){
                $scope.korboModalTabs.activeTab = 0;
            }
        });


        ContextualMenu.addDivider({
            priority: 3,
            type: 'advancedMenu'
        });

        //build languages tabs
        var buildLanguageTabs = function(){
            for(var i=0; i< $scope.conf.languages.length; i++){

                var title = angular.uppercase($scope.conf.languages[i].value);
                var name = angular.lowercase($scope.conf.languages[i].name);
                var lang = {
                    'title': title,
                    'name' : $scope.conf.languages[i].name,
                    'description': "",
                    'label': "",
                    'mandatory': true,
                    'hasError': false,
                    'tooltipMessageTitle': tooltipMessageTitle + name,
                    'tooltipMessageDescription': tooltipMessageDescription + name,
                    'tooltipMessageError': "message",
                    'tooltipMessageErrorTab': "There are some errors in the "+name+" languages fields"
                };

                if(!$scope.editMode){ 
                    if($scope.conf.languages[i].state){
                        $scope.tabs.push(lang);
                        pushCurrentLang(lang);
                    } else {
                        $scope.disactiveLanguages.push(lang);
                    }
                } else {
                    var indexFind = $scope.tabs.map(function(e){ return e.title }).indexOf(lang.title);
                    if(indexFind === -1){
                        $scope.disactiveLanguages.push(lang);
                    }
                }
            }
        };
        if(!$scope.editMode){
            buildLanguageTabs();
        }


        // check if language field are all right filled
        var checkLanguages = function(){
            var allLangAreOk = true;
            for(var l=0; l<$scope.tabs.length; l++){

                (function(index) {
                    if(typeof($scope.tabs[index].label) === 'undefined' || $scope.tabs[index].label === ''){
                        $scope.tabs[index].hasError = true;
                        allLangAreOk = false;
                        $scope.tabs[index].tooltipMessageError = errorMandatory;
                    } else if($scope.tabs[index].label.length < $scope.conf.labelMinLength){
                        $scope.tabs[index].hasError = true;
                        allLangAreOk = false;
                        $scope.tabs[index].tooltipMessageError = errorLabelTooShort;
                    } else
                    {
                        $scope.tabs[index].hasError = false;
                    }

                })(l);

            }

            return allLangAreOk;
        };

        $scope.updateTypes = function(){
            var count = 0;
            for (var i in $scope.types) {
                if ($scope.types[i].checked){
                    count++;
                }
            }
            if($scope.saveClicked){
                if(count === 0){
                    $scope.typesHasError = true;
                } else {
                    $scope.typesHasError = false;
                }
            }

            return count;
        };

        // return true if url is valid, false otherwise
        $scope.checkUrl = function(){
            if($scope.imageUrl === '' || urlPattern.test($scope.imageUrl)){
                if($scope.saveClicked){
                    $scope.imageUrlHasError = false;
                }

                return true;
            } else {
                if($scope.saveClicked){
                    $scope.imageUrlHasError = true;
                }

                return false;
            }
        };

       $scope.updateTitleField = function(index){

           if($scope.tabs[index].label === ''){
               $scope.tabs[index].tooltipMessageError = errorMandatory;
           }

           else if($scope.tabs[index].label !== '' && $scope.tabs[index].label.length < $scope.conf.labelMinLength){
               $scope.tabs[index].tooltipMessageError = errorLabelTooShort;
           }

           else if($scope.tabs[index].label !== '' && $scope.tabs[index].label.length >= $scope.conf.labelMinLength){
               $scope.tabs[index].hasError = false;

           }

       };


        $scope.save = function(){
            $scope.saveClicked = true;

            var checkLang = checkLanguages();
            $scope.updateTypes();
            $scope.checkUrl();

            if(!$scope.imageUrlHasError && !$scope.typesHasError && checkLang){

                $scope.isSaving = true;
                $scope.topArea.message = "Saving entity...";
                $scope.topArea.status = "info";

                // get checked types
                var newTypes = [];
                for(var i=0; i<$scope.types.length; i++){
                    if ($scope.types[i].checked){
                        newTypes.push($scope.types[i].URI);
                    }
                }
                var lang = angular.lowercase($scope.tabs[0].title);

                var entityToSave = {
                    "label": $scope.tabs[0].label,
                    "abstract": $scope.tabs[0].description,
                    "depiction": $scope.imageUrl,
                    "type": newTypes
                };

                var promise = korboComm.save(entityToSave, lang, $scope.conf.endpoint, $scope.conf.basketID );
                promise.then(function(res){

                    // get id from location of entity just created// All other label types, take the last part
                    var id = res.substring(res.lastIndexOf('/') + 1);
                    var location = res;

                    // check if there are more than 1 languages
                    if($scope.tabs.length > 1){
                        var allPromises = [];
                        for(var i=1; i<$scope.tabs.length; i++){

                            (function(index) {

                                var lang = angular.lowercase($scope.tabs[index].title);
                                var entityToEdit = {
                                    "id": id,
                                    "label": $scope.tabs[index].label,
                                    "abstract": $scope.tabs[index].description
                                };
                                var langPromise = korboComm.save(entityToEdit, lang, $scope.conf.endpoint, $scope.conf.basketID );
                                allPromises.push(langPromise);
                            })(i);

                        }

                        $q.all(allPromises).then(function(res){
                            $scope.isSaving = false;
                            $scope.directiveScope.location = location;
                            $scope.directiveScope.elemToSearch = $scope.tabs[0].label;
                            $scope.directiveScope.label = $scope.tabs[0].label;
                            $scope.topAreaMessage = "Entity saved!";
                            $scope.topArea.message = "Entity saved!";
                            $scope.topArea.status = "info";
                            $timeout(function(){
                                KorboCommunicationService.closeModal();
                                // set modal as close in configuration
                                korboConf.setIsOpenModal(false);
                            }, 1000);
                        },
                        function(err){
                            $scope.topArea.message = "Entity saving error!";
                            $scope.topArea.status = "error";
                        });

                    } else {
                        // non ho altre lingue da aggiungere, quindi posso chiudere la modale
                        $scope.directiveScope.location = location;
                        $scope.directiveScope.elemToSearch = $scope.tabs[0].label;
                        $scope.directiveScope.label = $scope.tabs[0].label;
                        $scope.isSaving = false;
                        $scope.topArea.message = "Entity saved!";
                        $scope.topArea.status = "info";
                        // close modal
                        $timeout(function(){
                            KorboCommunicationService.closeModal();
                            // set modal as close in configuration
                            korboConf.setIsOpenModal(false);
                        }, 1000);

                    }
                },
                function(err){
                    $scope.topArea.message = "Entity saving error!";
                    $scope.topArea.status = "error";
                });



            } else {

                $scope.topArea.message = "Some errors occurred! Check the fields and try to save again...!";
                $scope.topArea.status = "error";
            }

        };

        $scope.clearForm = function(){
            $scope.saveClicked = false;
            // reset all title and description for each languages
            for(var l=0; l<$scope.tabs.length; l++){
                (function(index) {
                    $scope.tabs[index].label = "";
                    $scope.tabs[index].description = "";
                    $scope.tabs[index].hasError = false;

                })(l);
            } // end for

            initTypes();
            buildTypesFromConfiguration();

            // reset image url
            $scope.imageUrl = "";
            $scope.originalUrl = "";
            KorboCommunicationService.setEntityToCopy(null);
            $scope.topArea.message = "You are creating a new entity";
            $scope.topArea.status = "info";
        };

        $scope.previewImage = "";
        $scope.errorImage = false;
        $scope.loadingImage = false;
        var timer;

        $scope.$watch('imageUrl', function(val){

            if(val !== '' && urlPattern.test(val)){
                $timeout.cancel(timer);
                timer = $timeout(function(){
                    $scope.loadingImage = true;
                    $http({
                        headers: { 'Accept': 'image/jpeg' },
                        method: 'GET',
                        url: val,
                        cache: true
                    }).success(function(){
                        $scope.showImg = true;
                        $scope.previewImage = val;
                        $scope.errorImage = false;
                        $scope.loadingImage = false;
                    }).error(function(){
                        $scope.showImg = false;
                        $scope.errorImage = true;
                        $scope.loadingImage = false;
                    });
                }, 1000);

            // if input type is empty
            } else {
                $scope.showImg = false;
                $scope.errorImage = false;
                $scope.loadingImage = false;
            }
        });

        $scope.addLanguage = function(lang) {
            var langIndex = $scope.disactiveLanguages.indexOf(lang);
            $scope.disactiveLanguages.splice(langIndex, 1);
            $scope.tabs.push(lang);
            addActionToContextualMenu(lang);
            if($scope.tabs.length == 2){
                ContextualMenu.modifyHeaderActionByName('rml'+$scope.tabs[0].name, false);
            }
        };

        $scope.removeLanguage = function(lang) {
            var langIndex = $scope.tabs.indexOf(lang);
            $scope.tabs.splice(langIndex, 1);
            $scope.disactiveLanguages.push(lang);
            ContextualMenu.removeActionByName('rml'+lang.name);
            if($scope.tabs.length < 2){
                ContextualMenu.modifyHeaderActionByName('rml'+$scope.tabs[0].name, true);
            }
        };

        $scope.showDropdown = function($event){
            var resource = {name:'resourceName'};
            ContextualMenu.show($event.pageX, $event.pageY, resource, 'advancedMenu');
            $event.stopPropagation();
        };

        $scope.typesMouseLeave = function(){
            $timeout.cancel(delay);
            delay = $timeout(function(){
                $scope.activeFilter = false;
                $scope.typeFilter.label = '';
            }, 1000);  
        };
        $scope.typesMouseEnter = function(){
            $timeout.cancel(delay);
        };

        //entityToCreate
        $scope.$watch(function(){
            return KorboCommunicationService.getEntityToCopy();
        }, function(entity){
            if(entity !== null){
                var e = ItemsExchange.getItemByUri(entity.uri);

                if($scope.editMode){
                    $scope.originalUrl = e.resource;
                } else{
                    $scope.imageUrl = e.image;
                    $scope.originalUrl = e.resource;
                    initTypes();
                    buildTypesFromArray(e.type);
                    buildTypesFromConfiguration();

                    $scope.tabs[0].label = e.label;
                    $scope.tabs[0].description = e.description;
                }

            }

        });

});

