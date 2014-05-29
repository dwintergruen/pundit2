angular.module('Pundit2.TripleComposer')
.controller('TripleComposerCtrl', function($scope, $http, Annotation, TripleComposer, NameSpace, TypesHelper, XpointersHelper) {

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
        
        $scope.statements.forEach(function(el){
            // get triple
            var triple = el.scope.get();

            // only comple triples can be saved
            if (triple.subject!==null && triple.predicate!==null && triple.object!==null) {

                // rdf properties
                res[triple.subject.uri] = triple.subject.toRdf();

                res[triple.predicate.uri] = triple.predicate.toRdf();

                res[triple.object.uri] = triple.object.toRdf();                

                // types inside typeUri
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

                triple.object.type.forEach(function(e, i){
                    var type = triple.object.type[i];
                    res[type] = { };
                    res[type][NameSpace.rdfs.label] = [{type: 'literal', value: TypesHelper.getLabel(e)}];
                });

            }
            
        });

        return res;
    };

    var buildObject = function(item){
        return {type: 'uri', value: item.uri}
    };
    var buildPredicate = function(item){

    };

    var buildGraph = function(){
        var res = {};

        $scope.statements.forEach(function(el){
            var triple = el.scope.get();
            
            if (typeof(res[triple.subject.uri]) === 'undefined' ) {
                // subject uri not exist
                res[triple.subject.uri] = {};
                // predicate uri not exist
                res[triple.subject.uri][triple.predicate.uri] = [buildObject(triple.object)];
            } else {
                
            }

        });


        return res;
    };

    $scope.saveAnnotation = function(){
        console.log({
            items: buildItems(),
            graph: buildGraph()
        });
    };

    $scope.fireHttp = function(){

        // test with notebook "b81c0aa3"
        // need to use NameSpace.get('asNBCurrent')

        $http({
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            url: NameSpace.get('asNB')+"/b81c0aa3",
            params: {
                context: angular.toJson({
                    targets: ["http://t1.com", "http://t1.com", "http://t1.com"],
                    pageContext: XpointersHelper.getSafePageContext()
                })
            },
            withCredentials: true,
            cache: false,
            data: {
                "graph": buildGraph(),
                "items": buildItems()               
            }
        }).success(function(data) {
           console.log(data);
           new Annotation(data.AnnotationID).then(function(ann){
                console.log(ann);
           });
        }).error(function(msg) {
            console.log(msg);
        });

    };


    /* tested with susanna at 'http://172.20.0.47:8081/annotationserver/'

        $http({
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            url: NameSpace.get('asNBCurrent'),
            params: {
                context: angular.toJson({
                    targets: ["http://t1.com", "http://t1.com", "http://t1.com"],
                    pageContext: "http://mypagecontex.com"
                })
            },
            withCredentials: true,
            data: angular.toJson({
                // obj to send, need to convert to json string?
                "graph": {
                    "http://it.wikipedia.org/wiki/Roma": {
                        "http://www.holygoat.co.uk/owl/redwood/0.1/tags/hasTag": [
                        {
                            "value": "Capital City",
                            "type": "literal"
                        },
                        {
                            "value": "Italy",
                            "type": "literal"
                        },
                        ],
                        "http://www.w3.org/2000/01/rdf-schema#comment": [
                        {
                            "value": "Wikipedia's page dedicate to Rome, the capital city of Italy.",
                            "type": "literal"
                        }
                        ]
                    }
                },
                "items": {
                    "http://example.org/items1": {
                        "http://www.w3.org/2000/01/rdf-schema#label": [
                        {
                            "value": "Test Label Items 1",
                            "type": "literal"
                        }
                        ]
                    },
                    "http://example.org/items2": {
                        "http://www.w3.org/2000/01/rdf-schema#label": [
                        {
                            "value": "Test Label Items 2",
                            "type": "literal"
                        }
                        ]
                    }
                }
                
            })       
        }).success(function(data) {
            

        }).error(function(msg) {
            
        });

        */


});