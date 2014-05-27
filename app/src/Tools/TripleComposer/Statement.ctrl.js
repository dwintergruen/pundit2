angular.module('Pundit2.TripleComposer')
.controller('StatementCtrl', function($scope, $element, TypesHelper, ResourcePanel) {

    $scope.subjectLabel = '';
    $scope.subjectTypeLabel = '';
    $scope.subjectFound = false;
    $scope.subjectSearch = "search subject";
    $scope.subjectIcon = 'pnd-icon-search'; //'pnd-icon-times'

    $scope.predicateLabel = '';
    $scope.predicateFound = false;
    $scope.predicateSearch = "search predicate";
    $scope.predicateIcon = 'pnd-icon-search'; //'pnd-icon-times'

    $scope.objectLabel = '';
    $scope.objectTypeLabel = '';
    $scope.objectFound = false;
    $scope.objectSearch = "search object";
    $scope.objectIcon = 'pnd-icon-search'; //'pnd-icon-times'

    $scope.wipeStatement = function(){

        if ($scope.statements.length > 1) {
            angular.element($element[0]).remove();
            // TODO destroy scope
            // TODO remove element from parent scope
        }        

        $scope.subjectLabel = '';
        $scope.subjectTypeLabel = '';
        $scope.subjectFound = false;
        $scope.subjectSearch = "search subject";
        $scope.subjectIcon = 'pnd-icon-search'; 

        $scope.predicateLabel = '';
        $scope.predicateFound = false;
        $scope.predicateSearch = "search predicate";
        $scope.predicateIcon = 'pnd-icon-search'; 

        $scope.objectLabel = '';
        $scope.objectTypeLabel = '';
        $scope.objectFound = false;
        $scope.objectSearch = "search object";
        $scope.objectIcon = 'pnd-icon-search'; 
    };

    $scope.onClickSubject = function($event){
        ResourcePanel.showItemsForSubject($event.pageX, $event.pageY, [], $event.target).then(function(item){
            $scope.subjectFound = true;
            $scope.subjectLabel = item.label;
            $scope.subjectTypeLabel = TypesHelper.getLabel(item.type[0]);
        });
    };

    $scope.onClickPredicate = function($event){
        ResourcePanel.showProperties($event.pageX, $event.pageY, [], $event.target).then(function(item){
            $scope.predicateFound = true;
            $scope.predicateLabel = item.label;
        });
    };

    $scope.onClickObject = function($event){
        ResourcePanel.showItemsForObject($event.pageX, $event.pageY, [], $event.target).then(function(item){
            $scope.objectFound = true;
            $scope.objectLabel = item.label;
            $scope.objectTypeLabel = TypesHelper.getLabel(item.type[0]);
        });
    };

    $scope.onClickObjectCalendar = function($event){
        ResourcePanel.showPopoverCalendar($event.pageX, $event.pageY, undefined, $event.target).then(function(date){

        });
    };

    $scope.onClickObjectLiteral = function($event){
        ResourcePanel.showPopoverLiteral($event.pageX, $event.pageY, '', $event.target).then(function(text){
            $scope.objectFound = true;
            $scope.objectLabel = text;
            $scope.objectTypeLabel = 'literal';
        });
    };


});