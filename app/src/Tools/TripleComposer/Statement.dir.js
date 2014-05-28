angular.module('Pundit2.TripleComposer')
.directive('statement', function() {
    return {
        restrict: 'E',
        scope: {
            id: "@"
        },
        templateUrl: "src/Tools/TripleComposer/Statement.dir.tmpl.html",
        controller: "StatementCtrl",
        require: '^tripleComposer',
        link: function(scope, elem, attrs, controllerInstance) {
          scope.tripleComposerCtrl = controllerInstance;
          controllerInstance.addStatementScope(scope.id, scope);
        }
    };
});