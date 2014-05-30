angular.module('Pundit2.TripleComposer')
.controller('TripleComposerCtrl', function($scope, $http, Annotation, TripleComposer, NameSpace, TypesHelper, XpointersHelper, MyPundit) {

    // statements objects are extend by this.addStatementScope()
    // the function is called in the statement directive link function
    var nextId = 1;
    $scope.statements = [{
        id: nextId
    }];

    //TODO to fix
    TripleComposer.init($scope.statements);

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
        
        $scope.statements.forEach(function(el){
            var triple = el.scope.get();

            // only comple triples can be saved
            if (triple.subject!==null && triple.predicate!==null && triple.object!==null) {

                // add item and its rdf properties
                res[triple.subject.uri] = triple.subject.toRdf();

                res[triple.predicate.uri] = triple.predicate.toRdf();

                // discard literals
                if (typeof(triple.object.uri) !== 'undefined') {
                    res[triple.object.uri] = triple.object.toRdf();

                    triple.object.type.forEach(function(e, i){
                        var type = triple.object.type[i];
                        res[type] = { };
                        res[type][NameSpace.rdfs.label] = [{type: 'literal', value: TypesHelper.getLabel(e)}];
                    });
                }                                

                // add types and its label
                triple.subject.type.forEach(function(e, i){
                    var type = triple.subject.type[i];
                    res[type] = { };
                    res[type][NameSpace.rdfs.label] = [{type: 'literal', value: TypesHelper.getLabel(e)}];
                });

                triple.predicate.type.forEach(function(e, i){
                    var type = triple.predicate.type[i];
                    res[type] = { };
                    res[type][NameSpace.rdfs.label] = [{type: 'literal', value: TypesHelper.getLabel(e)}];
                });                

            }
            
        });

        return res;
    };

    var buildObject = function(item){
        if (typeof(item.uri) !== 'undefined') {
            return {type: 'uri', value: item.uri};
        } else {
            return {type: 'literal', value: item};
        }
        // TODO check date
    };

    var buildTargets = function(){
        var res = [];

        $scope.statements.forEach(function(el){
            var triple = el.scope.get();

            if (triple.subject.isTextFragment() || triple.subject.isImage() || triple.subject.isImageFragment() ){
                res.push(triple.subject.uri);
            }
            if (triple.predicate.isTextFragment() || triple.predicate.isImage() || triple.predicate.isImageFragment() ){
                res.push(triple.predicate.uri);
            }

            if (typeof(triple.object) !== 'string') {
                if (triple.object.isTextFragment() || triple.object.isImage() || triple.object.isImageFragment() ){
                    res.push(triple.object.uri);
                }
            }
        });

        return res;
    };

    var buildGraph = function(){
        var res = {};

        $scope.statements.forEach(function(el){
            var triple = el.scope.get();
            
            if (typeof(res[triple.subject.uri]) === 'undefined' ) {
                // subject uri not exist (happy it's easy)
                res[triple.subject.uri] = {};
                // predicate uri not exist
                res[triple.subject.uri][triple.predicate.uri] = [buildObject(triple.object)];
            } else {
                // subject uri already exists

                if (typeof(res[triple.subject.uri][triple.predicate.uri]) === 'undefined') {
                    // predicate uri not exist (happy it's easy)
                    res[triple.subject.uri][triple.predicate.uri] = [buildObject(triple.object)];
                } else {

                    // predicate uri already exists
                    var u = triple.object.uri,
                        arr = res[triple.subject.uri][triple.predicate.uri];
                    // search object
                    var found = arr.some(function(o){
                        return angular.equals(o.value, u);
                    });
                    // object not eqaul (happy it's easy)
                    if (!found) {
                        arr.push(buildObject(triple.object));
                    }

                }
                
            }

        });

        return res;
    };

    $scope.saveAnnotation = function(){
        // test with notebook "b81c0aa3"
        // need to use NameSpace.get('asNBCurrent')

        MyPundit.login().then(function(logged) {
            
            if (logged) {
                var abort = $scope.statements.some(function(el){
                    var t = el.scope.get();
                    // only comple triples can be saved
                    if (t.subject===null || t.predicate===null || t.object===null) {
                        return true;
                    }
                });

                if (abort) {
                    console.log('Try to save incomplete statement');
                    return;
                }

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    url: NameSpace.get('asNBCurrent'),
                    params: {
                        context: angular.toJson({
                            targets: buildTargets(),
                            pageContext: XpointersHelper.getSafePageContext()
                        })
                    },
                    withCredentials: true,
                    data: {
                        "graph": buildGraph(),
                        "items": buildItems()               
                    }
                }).success(function(data) {
                   // TODO add annnotation to annotationExchange then consolidate all

                   // TODO how do the interface?

                   // TODO remove new Annotation (this load annotation from server)
                   new Annotation(data.AnnotationID).then(function(ann){
                        console.log(ann);
                   });
                }).error(function(msg) {
                    // TODO
                    console.log(msg);
                });

            } //end if logged

        }); // end my pundit login       

    }; // end save function

});