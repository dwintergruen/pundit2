angular.module('Pundit2.TripleComposer')
.constant('TRIPLECOMPOSERDEFAULTS', {

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDashboardTemplate: "src/Tools/TripleComposer/ClientTripleComposer.tmpl.html",
    clientDashboardPanel: "tools",
    clientDashboardTabTitle: "Statements Composer",

    debug: false
})
.service('TripleComposer', function(BaseComponent, TRIPLECOMPOSERDEFAULTS) {

    var tripleComposer = new BaseComponent('TripleComposer', TRIPLECOMPOSERDEFAULTS);

    tripleComposer.removeStatement = function(id, arr){
        // at least one statetement must be present
        if (arr.length === 1) {
            arr[0].scope.wipe();
            return;
        }
        
        arr.some(function(s, i){
            if (s.id === id) {
                index = i;
                return true;
            }
        });        
        if (index > -1) {
            arr.splice(index, 1);
        }
    };

    // extend arr object with scope property
    tripleComposer.addStatementScope = function(id, scope, arr){
        arr.some(function(s, i){
            if (s.id === id) {
                index = i;
                return true;
            }
        });
        
        if (index > -1) {
            arr[index].scope = scope;
        }
    };

    tripleComposer.duplicateStatement = function(id, arr, newId){
        arr.some(function(s, i){
            if (s.id === id) {
                index = i;
                return true;
            }
        });
        
        if (index > -1) {
            arr.push({
                id: newId,
                scope: {
                    duplicated: arr[index].scope.copy()
                }
            });
        }
        console.log(arr[index].scope.copy());
    };

    return tripleComposer;

});