angular.module('KorboEE')
    .controller('EEDirectiveCtrl', function($scope, APIService, korboConf, $http, KorboCommunicationFactory, $timeout, ItemsExchange, KorboCommunicationService, $modal, $rootScope) {

        $scope.autocompleteListTemplate = 'src/KorboEE/autocompleteList.tmpl.html';
        var api;
        $scope.readyToRender = false;
        $scope.noFound = "no entities found";
        $scope.elemToSearch = '';
        $scope.isSearching = false;
        $scope.serverNotRunning = false;
        var containerPrefix = "kee-";



        $scope.renderElement = function(){
            return $scope.readyToRender;
        };

        // when configuration is set, initialize API callbacks
        $scope.$watch('conf', function(){

            if (!$scope.errorGlobalObjName){
                $scope.init = function(){
                    $scope.readyToRender = $scope.conf.updateTime;
                    $scope.limit = $scope.conf.limitSearchResult;
                    $scope.minLabelLength = $scope.conf.labelMinLength;
                    //KeeModalScope.conf = $scope.conf;

                    // set default language
                    $scope.defaultLan = $scope.conf.languages[0];
                    for (var j in $scope.conf.languages){
                        if($scope.conf.languages[j].state === true) {
                            $scope.defaultLan = $scope.conf.languages[j];
                            break;
                        } // end if
                    } // end for

                    initExposeAPI();
                    // TODO: the template is NOT rendered yet, let's try an evalAsync
                    // to see if it's ready (or reayd!)... for real!
                    $scope.$evalAsync(function(){
                        callOnReayd();
                    });
                }();

            } // if errorGlobalObjName

        }); // watch conf


        /*$scope.$watch(function() {
            return angular.element('.kee-autocomplete-list').outerWidth();
        }, function() {
            angular.element('.kee-autocomplete-list').css({
                width:$scope.inputWidth
            });
        });*/

        var callOnReayd = function(){
            $scope.inputWidth = angular.element('.kee-input-elem-to-search').outerWidth();

            if ($scope.conf.onReady !== null && typeof($scope.conf.onReady) === 'function'){
                $scope.conf.onReady();
            }
        };

        var initExposeAPI = function(){
            api = APIService.get($scope.conf.globalObjectName);
            //TODO vedere vecchio korboee
            // add events and features to APIService
            if (typeof(api) !== "undefined"){

                api.exposeOpenSearch(function(val){
                    //TODO
                    KorboCommunicationService.openModalOnSearch($scope.conf, val, $scope);
                });

                api.exposeOpenNew(function(entity){
                    //TODO
                    KorboCommunicationService.openModalOnNew($scope.conf, entity, $scope);
                });

                api.exposeEdit(function(id){
                    //TODO
                    KorboCommunicationService.openModalOnEdit($scope.conf, id, $scope);
                });

                api.exposeCancel(function(){
                    //TODO
                    KorboCommunicationService.closeModal();
                });

                api.exposeCopyAndUse(function(entity){
                    var korboComm = new KorboCommunicationFactory();

                    if(typeof(entity) !== 'undefined' && entity !== null){
                        var entityToSave = {
                            "label": entity.label,
                            "abstract": entity.description,
                            "depiction": entity.image,
                            "type": entity.type,
                            "resource": entity.uri
                        };

                        var promise = korboComm.save(entityToSave, $scope.defaultLan.value, $scope.conf.endpoint, $scope.conf.basketID);
                        promise.then(function(res){
                            // declare object returned onSave() call
                            var obj = {};
                            obj.value = res;
                            obj.label = entityToSave.label;
                            obj.type = entityToSave.type;
                            obj.image = entityToSave.depiction;
                            obj.description = entityToSave.abstract;
                            obj.language = $scope.defaultLan.value;
                            // fire save callback
                            api.fireOnSave(obj);
                        });

                    }

                });


            }

        };

        // handle ENTER key press
        // if no autocomplete search is set
        // stop event propagation
        // and open the modal
        $scope.keyPressHandle = function($event){
            if($event.keyCode === 13 && $scope.conf.useTafonyCompatibility){
                $event.stopPropagation();
                $event.preventDefault();

            }
        };


        $scope.autoCompleteSearch = function(viewValue) {
            var container = "kee-korbo";
            if(viewValue.length >= $scope.conf.labelMinLength){
                $scope.isSearching = true;

                $scope.results = KorboCommunicationService.autocompleteSearch(viewValue, $scope.conf.endpoint, 'korbo', $scope.conf.limitSearchResult, 0, $scope.defaultLan.value);
                $scope.results.then(function(res){
                    if(typeof(res[0]) !== 'undefined' && res[0].errorServer){
                        $scope.serverNotRunning = true;
                        $scope.isSearching = false;
                    } else {
                        $scope.isSearching = false;
                        $scope.serverNotRunning = false;
                        return $scope.results;
                    }
                });
            }
        };

        $scope.selectEntity = function(entity){
            $scope.location = entity.value.uri;
            $scope.label = entity.value.label;

            var obj = {};
            obj.value = $scope.location;
            obj.label = entity.value.label;
            obj.type = entity.value.type;
            obj.image = entity.value.depiction;
            obj.description = entity.value.abstract;
            obj.language = $scope.defaultLan.value;
            // fire callback onSave()
            api.fireOnSave(obj);
        };

        var updateTimer;
        // timer when input change
        $scope.$watch('elemToSearch', function() {
            //$timeout.cancel(updateTimer);
            //httpHandler();
            $scope.autoCompleteSearch($scope.elemToSearch);
        });

        var httpHandler = function() {
            updateTimer = $timeout(function(){
                $scope.autoCompleteSearch($scope.elemToSearch);
            }, 1000);
        };

        $scope.showSearchButton = function(){
            if($scope.conf.autoCompleteOptions === 'search' || $scope.conf.autoCompleteOptions === 'all' ){
                return true;
            } else {
                return false;
            }
        };

        $scope.showNewButton = function(){
            if($scope.conf.autoCompleteOptions === 'new' || $scope.conf.autoCompleteOptions === 'all' ){
                return true;
            } else {
                return false;
            }
        };

        $scope.isLoading = function(){
            return $scope.isSearching;
        };

        // open info modal
        $scope.openKeeModal = function() {
            var obj = {label: $scope.elemToSearch};
            KorboCommunicationService.openModalOnNew($scope.conf, obj, $scope);
        };

        $scope.searchOnLOD = function() {
            KorboCommunicationService.openModalOnSearch($scope.conf, $scope.elemToSearch, $scope);
        };




    });