angular.module('Pundit2.TripleComposer')
.directive('statement', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: "src/Tools/TripleComposer/Statement.dir.tmpl.html",
        controller: "StatementCtrl"
    };
});