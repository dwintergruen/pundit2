angular.module('Pundit2.TripleComposer')
.service('TripleComposer', function(BaseComponent) {

    var tripleComposer = new BaseComponent('TripleComposer');

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

    return tripleComposer;

});