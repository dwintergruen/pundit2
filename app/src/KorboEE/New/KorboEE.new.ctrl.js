angular.module('KorboEE')
    .controller('KeeNewCtrl', function($scope, $modal, KorboCommunicationService) {

        $scope.tabs = [];
        $scope.imageUrl = "";
        $scope.saveClicked = false;
        $scope.activeFilter = false;

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

        // build types
        $scope.types = angular.copy($scope.conf.type);
        $scope.typesHasError = false;
        $scope.typesErrorMessage = "You must select at least one type";
        $scope.typesTooltipeMessage = "Select at least one type";

        // Setting checked defaults copying .state
        for (var i in $scope.types) {
            $scope.types[i].checked = $scope.types[i].state || false;
        }

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
                    'tooltipMessageError': "message",
                    'tooltipMessageErrorTab': "There are some errors in the "+name+" languages fields"
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
     console.log($scope.tabs[index].label, index);

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
        var checkTypes = $scope.updateTypes();
        var checkUrl = $scope.checkUrl();
        console.log("check lang ", checkLang);
        console.log("check types ", checkTypes);
        console.log("check url ", checkUrl);

    };


    });