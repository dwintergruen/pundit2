angular.module('KorboEE')
    .controller('EEDirectiveCtrl', function($scope) {
        console.log($scope);

        var api;
        $scope.readyToRender = false;

        $scope.renderElement = function(){
            return $scope.readyToRender;
        };

        // when configuration is set, initialize API callbacks
        $scope.$watch('conf', function(){

            if (!$scope.errorGlobalObjName){
                $scope.init = function(){
                    $scope.readyToRender = $scope.conf.updateTime;

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


    });