angular.module('Pundit2.TripleComposer')
.controller('TripleComposerCtrl', function($scope) {

    $scope.statements = [{}];

    this.getStatement = function(){
        return $scope.statements;
    };

    $scope.onClickAddStatement = function(){
        $scope.statements.push({});
    };

});