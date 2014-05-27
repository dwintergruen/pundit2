angular.module('Pundit2.TripleComposer')
.controller('StatementCtrl', function($scope) {

    $scope.subjectLabel = '';
    $scope.subjectFound = false;
    $scope.subjectSearch = "search subject";
    $scope.subjectIcon = 'pnd-icon-search'; //'pnd-icon-times'

    $scope.predicateLabel = '';
    $scope.predicateFound = false;
    $scope.predicateSearch = "search predicate";
    $scope.predicateIcon = 'pnd-icon-search'; //'pnd-icon-times'

    $scope.objectLabel = '';
    $scope.objectFound = false;
    $scope.objectSearch = "search object";
    $scope.objectIcon = 'pnd-icon-search'; //'pnd-icon-times'

    $scope.click = function(){
        console.log('inputclick');
    };
});