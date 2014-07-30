angular.module('KorboEE')
    .controller('KeeNewCtrl', function($scope, $rootScope, $dropdown, $modal, KorboCommunicationService, $q, KorboCommunicationFactory,
                                       korboConf, $timeout, $http, TypesHelper, ItemsExchange, ContextualMenu, $window, Config, APIService) {


        var copyCheck = false;
        var korboComm = new KorboCommunicationFactory();
        var delay;
        var api = APIService.get($scope.conf.globalObjectName);
        var basketIDforEdit;
        
        $scope.tabs = [];
        $scope.disactiveLanguages = [];
        $scope.disactiveLanguagesPopoverTemplate = 'src/KorboEE/New/KorboEE.languagesPopover.tmpl.html';
        $scope.imageUrl = "";
        $scope.saveClicked = false;
        $scope.activeFilter = false;
        $scope.isSaving = false;
        $scope.originalUrlCheck = true;
        $scope.loadingStatus = false;
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

        var buildContextualMenu = function(){
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
                name: 'searchOriginalURL',
                type: 'advancedMenu',
                label: 'Search original URL',
                priority: 3,
                showIf: function(){
                    return $scope.editMode;
                },
                action: function(){
                    $scope.korboModalTabs.activeTab = 0;
                    copyCheck = false;
                }
            });

            ContextualMenu.addAction({
                name: 'searchAndCopy',
                type: 'advancedMenu',
                label: 'Search and copy from LOD',
                priority: 3,
                showIf: function(){
                    return $scope.editMode;
                },
                action: function(){
                    $scope.korboModalTabs.activeTab = 0;
                    copyCheck = true;
                }
            });

            ContextualMenu.addDivider({
                priority: 3,
                type: 'advancedMenu'
            });
        };

        buildContextualMenu();

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

        //build languages tabs
        var buildLanguageTabs = function(){
            for(var i=0; i< $scope.conf.languages.length; i++){             

                var title = angular.uppercase($scope.conf.languages[i].value);
                var name = angular.lowercase($scope.conf.languages[i].name);

                var indexFind = $scope.tabs.map(function(e){ return angular.lowercase(e.title) }).indexOf(angular.lowercase(title));
                if(indexFind !== -1){
                    return;
                }

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

                if(typeof($scope.entityToCreate) !== 'undefined' && $scope.entityToCreate !== null){
                    lang.label = $scope.entityToCreate.label;
                }

                if($scope.conf.languages[i].state){
                    $scope.tabs.push(lang);
                    pushCurrentLang(lang);
                } else {
                    $scope.disactiveLanguages.push(lang);
                }

                // if(!$scope.editMode){ 
                //     if($scope.conf.languages[i].state){
                //         $scope.tabs.push(lang);
                //         pushCurrentLang(lang);
                //     } else {
                //         $scope.disactiveLanguages.push(lang);
                //     }
                // } else {
                //     var indexFind = $scope.tabs.map(function(e){ return angular.lowercase(e.title) }).indexOf(angular.lowercase(lang.title));
                //     if(indexFind === -1){
                //         $scope.disactiveLanguages.push(lang);
                //     }
                // }
            }
        };

        var buildLanguagesModel = function(entityUri, provider){

            $scope.topArea = {
                'message': 'Loading entity...',
                'status': 'info'
            };
            $scope.loadingStatus = true;

            var param = {
                item: {uri: entityUri},
                provider: provider,
                endpoint: $scope.conf.endpoint, 
                basketID: null, 
                language: $scope.defaultLan.value
            }
            var langConf = $scope.conf.languages;
            KorboCommunicationService.buildLanguagesObject(param, langConf).then(function(res){
                basketIDforEdit = res.basketId;
                $scope.imageUrl = res.imageUrl;
                $scope.originalUrl = res.originalUrl;
                initTypes();
                buildTypesFromArray(res.types);
                buildTypesFromConfiguration();

                for (var i in res.languages){
                    $scope.tabs.push(res.languages[i]);
                    pushCurrentLang(res.languages[i]);
                }

                buildLanguageTabs();

                $scope.topArea = {
                    'message': 'You are editing the entity...',
                    'status': 'info'
                };
                $scope.loadingStatus = false;

            },
            function(error){
                $scope.topArea = {
                    'message': 'Error getting entity info!',
                    'status': 'error'
                };
            });
        };

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


        // set default language
        $scope.defaultLan = $scope.conf.languages[0];
        for (var j in $scope.conf.languages){
            if($scope.conf.languages[j].state === true) {
                $scope.defaultLan = $scope.conf.languages[j];
                break;
            } // end if
        } // end for


        if(typeof($scope.idEntityToEdit) !== 'undefined' &&$scope.idEntityToEdit !== null){
            buildLanguagesModel($scope.idEntityToEdit, 'korbo');
        };


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
            buildLanguageTabs();
            buildTypesFromConfiguration();
        }

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
                    //"label": $scope.tabs[0].label,
                    //"abstract": $scope.tabs[0].description,
                    "depiction": $scope.imageUrl,
                    "type": newTypes,
                    "resourceUrl": $scope.originalUrl
                };

                // declare object returned onSave() call
                var obj = {};
                obj.label = $scope.tabs[0].label;
                obj.type = newTypes;
                obj.image = $scope.imageUrl;
                obj.description = $scope.tabs[0].label;
                obj.language = $scope.defaultLan.value;

                var basketID;
                if($scope.editMode){
                    entityToSave.id = String($scope.idEntityToEdit);
                    basketID = basketIDforEdit;
                } else {
                    basketID = $scope.conf.basketID;
                }

                var promise = korboComm.save(entityToSave, lang, $scope.conf.endpoint, basketID );
                promise.then(function(res){

                    // get id from location of entity just created// All other label types, take the last part
                    var id;
                        if($scope.editMode){
                            id = String($scope.idEntityToEdit);
                        }else{
                            id = res.substring(res.lastIndexOf('/') + 1);
                        }

                    var location = res;

                    // check if there are more than 1 languages
                    // TODO: rimuovere il controllo?
                    if($scope.tabs.length >= 1){
                        var allPromises = [];
                        for(var i=0; i<$scope.tabs.length; i++){

                            (function(index) {
                                var lang = angular.lowercase($scope.tabs[index].title);

                                var entityToEditWithLabel = {
                                    "id": id,
                                    "label": $scope.tabs[index].label
                                };

                                var entityToEditWithAbstract = {
                                    "id": id,
                                    "abstract": $scope.tabs[index].description
                                };

                                var langLabelPromise = korboComm.save(entityToEditWithLabel, lang, $scope.conf.endpoint, basketID );
                                var langAbstractPromise = korboComm.save(entityToEditWithAbstract, lang, $scope.conf.endpoint, basketID );

                                allPromises.push(langLabelPromise);
                                allPromises.push(langAbstractPromise);
                            })(i);

                        }

                        $q.all(allPromises).then(function(res){
                            $scope.isSaving = false;
                            if($scope.conf.useTafonyCompatibility){
                                $scope.directiveScope.location = location;
                                $scope.directiveScope.elemToSearch = $scope.tabs[0].label;
                                $scope.directiveScope.label = $scope.tabs[0].label;
                            }
                            $scope.topAreaMessage = "Entity saved!";
                            $scope.topArea.message = "Entity saved!";
                            $scope.topArea.status = "info";

                            //TODO fire onSave
                            obj.value = location;
                            // fire save callback
                            api.fireOnSave(obj);


                            $timeout(function(){
                                ContextualMenu.wipeActionsByType('advancedMenu');                                
                                KorboCommunicationService.closeModal();
                                // fire cancel callback
                                api.fireOnCancel();
                                // set modal as close in configuration
                                korboConf.setIsOpenModal(false);
                            }, 1000);
                        },
                        function(err){
                            $scope.topArea.message = "Entity saving error!";
                            $scope.topArea.status = "error";
                        });

                    } else {
                        // udpdate directive fields if widget is set to be used as tafony compatibility
                        if($scope.conf.useTafonyCompatibility){
                            $scope.directiveScope.location = location;
                            $scope.directiveScope.elemToSearch = $scope.tabs[0].label;
                            $scope.directiveScope.label = $scope.tabs[0].label;
                        }
                        $scope.isSaving = false;
                        $scope.topArea.message = "Entity saved!";
                        $scope.topArea.status = "info";

                        //TODO fire onSave
                        obj.value = location;
                        // fire save callback
                        api.fireOnSave(obj);

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
                        headers: {'Accept': 'image/webp,*/*;q=0.8'},
                        method: 'HEAD',
                        url: val,
                        cache: false
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

        $scope.removeImage = function(){
            // reset image url
            $scope.imageUrl = "";
        };

        //entityToCreate
        $scope.$watch(function(){
            return KorboCommunicationService.getEntityToCopy();
        }, function(entity){
            if(entity !== null){

                if(!$scope.editMode || copyCheck){
                    ContextualMenu.wipeActionsByType('advancedMenu');
                    buildContextualMenu();
                    $scope.tabs = [];
                    $scope.disactiveLanguages = [];

                    buildLanguagesModel(entity.uri, entity.providerFrom);

                    copyCheck = false;
                } else{
                    $scope.originalUrl = entity.resource;
                }
            }

        });

});

