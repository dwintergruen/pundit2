angular.module('Pundit2.TripleComposer')
.controller('TripleComposerCtrl', function($scope, TripleComposer, NameSpace, TypesHelper) {

    // statements objects are extend by this.addStatementScope()
    // the function is called in the statement directive link function
    var nextId = 1;
    $scope.statements = [{
        id: nextId
    }];

    this.removeStatement = function(id){
        var index = -1;
        id = parseInt(id, 10);

        TripleComposer.removeStatement(id, $scope.statements);     
    };

    this.addStatementScope = function(id, scope) {
        var index = -1;
        id = parseInt(id, 10);
        
        TripleComposer.addStatementScope(id, scope, $scope.statements);
    };

    this.duplicateStatement = function(id){
        var index = -1;
        id = parseInt(id, 10);
        nextId = nextId + 1;
        
        TripleComposer.duplicateStatement(id, $scope.statements, nextId);
    };

    $scope.onClickAddStatement = function(){
        nextId = nextId + 1;
        $scope.statements.push({id: nextId});
    };

    var buildItems = function(){
        var res = {};
        
        $scope.statements.forEach(function(el, index){
            var triple = el.scope.get();

            if (triple.subject!==null && triple.predicate!==null && triple.object!==null) {

                res[triple.subject.uri] = triple.subject.toRdf();
                res[triple.predicate.uri] = triple.predicate.toRdf();
                res[triple.object.uri] = triple.object.toRdf();
                

                triple.subject.type.forEach(function(e, i){
                    res[triple.subject.type[i]] = {type: TypesHelper.getLabel(e), value: e};
                });
                triple.predicate.type.forEach(function(e, i){
                    res[triple.predicate.type[i]] = {type: TypesHelper.getLabel(e), value: e};
                });
                triple.object.type.forEach(function(e, i){
                    res[triple.object.type[i]] = {type: TypesHelper.getLabel(e), value: e};
                });

            }
            
        });

        return res;
    };

    $scope.saveAnnotation = function(){
        console.log( {
            items: buildItems(),
            metadata: {

            },
            graph: {

            }
        } );
    };

    $scope.fireHttp = function(){

        console.log(NameSpace.get('asNBCurrent'));

        /*$http({
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            url: NameSpace.get('asNBCurrent'),
            withCredentials: true,
            data: {
                // obj to send, need to convert to json string?
            }        
        }).success(function(data) {
            

        }).error(function(msg) {
            
        });*/

    };


});