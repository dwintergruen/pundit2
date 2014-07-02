angular.module('KorboEE')
    .controller('EEDirectiveCtrl', function($scope, APIService, korboConf, $http, KorboCommunication, $timeout) {

        $scope.autocompleteListTemplate = 'src/KorboEE/autocompleteList.tmpl.html';
        var api;
        $scope.readyToRender = false;
        $scope.noFound = "no entities found";
        $scope.elemToSearch = '';
        var updateTimer;

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

                    initExposeAPI();
                    // TODO: the template is NOT rendered yet, let's try an evalAsync
                    // to see if it's ready (or reayd!)... for real!
                    $scope.$evalAsync(function(){
                        callOnReayd();
                    });
                }();

            } // if errorGlobalObjName

        }); // watch conf

        var callOnReayd = function(){
            if ($scope.conf.onReady !== null && typeof($scope.conf.onReady) === 'function'){
                $scope.conf.onReady();
            }
        };

        var initExposeAPI = function(){
            api = APIService.get($scope.conf.globalObjectName);
            //TODO vedere vecchio korboee

        };

        // handle ENTER key press
        // if no autocomplete search is set
        // stop event propagation
        // and open the modal
        $scope.keyPressHandle = function($event){
            if($event.keyCode === 13 && ($scope.conf.useAutocompleteWithSearch || $scope.conf.useAutocompleteWithNew) === false){
                $event.stopPropagation();
                $event.preventDefault();
                $scope.open();
            } else if($event.keyCode === 13 && ($scope.conf.useAutocompleteWithSearch || $scope.conf.useAutocompleteWithNew)){
                $event.stopPropagation();
                $event.preventDefault();

            }
        };



        $scope.autoCompleteSearch = function(viewValue) {
            if(viewValue.length >= $scope.conf.labelMinLength){
                var res = KorboCommunication.search(viewValue);
                return res;
            }

        };

        $scope.isLoading = function(){
            return KorboCommunication.isAutocompleteLoading();
        }

        $scope.isSelect = function(m){
            console.log("hai selezionato: ",m);
        };

        // timer when input change
        $scope.$watch('elemToSearch', function() {

        });


    });