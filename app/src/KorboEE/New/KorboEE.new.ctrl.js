angular.module('KorboEE')
    .controller('KeeNewCtrl', function($scope, $modal, KorboCommunicationService) {

        $scope.tabs = [];
        $scope.imageUrl = "";

        var tooltipMessageTitle = "Insert title of the entity in ";
        var tooltipMessageDescription = "Insert description of the entity in ";
        var errorMandatory = "The Title field is mandatory and must be filled";
        var errorLabelTooShort = " The Title must be contain at least " + $scope.conf.labelMinLength +" characters";


        //build languages tabs
        for(var i=0; i< $scope.conf.languages.length; i++){

            if($scope.conf.languages[i].state){
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
                    'tooltipMessageError': "message"
                };

                $scope.tabs.push(lang);
            }
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

    $scope.save = function(){
        /*for(var i=0; $scope.tabs.length; i++){
            console.log($scope.tabs[i]);
        }*/
        var checkLang = checkLanguages();
        console.log("saved ", checkLang);
        checkLanguages();
    };


    });