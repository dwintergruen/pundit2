angular.module('Pundit2.TripleComposer')
.directive('statement', function() {
    return {
        restrict: 'E',
        scope: {
            id: "@",
            duplicated: "="
        },
        templateUrl: "src/Tools/TripleComposer/Statement.dir.tmpl.html",
        controller: "StatementCtrl",
        require: '^tripleComposer',
        link: function(scope, elem, attrs, controllerInstance) {
            scope.tripleComposerCtrl = controllerInstance;
          
            // duplicated object is added if the statement is a copy of another
            scope.$watch('duplicated', function(duplicated) {
                if (typeof(duplicated)!=='undefined') {
                    scope.init();
                }
            });
          
            // add statement scope to the relative element inside triple composer statemenst array
            controllerInstance.addStatementScope(scope.id, scope);          

        }
    };
});