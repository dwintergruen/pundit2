angular.module('Pundit2.TripleComposer')
.directive('statement', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: "src/Tools/TripleComposer/Statement.dir.tmpl.html",
        controller: "StatementCtrl",
        require: '^tripleComposer',
        link: function(scope, elem, attrs, controllerInstance) {
          //the fourth argument is the controller instance you require
          scope.statements = controllerInstance.getStatement();
        }
    };
});