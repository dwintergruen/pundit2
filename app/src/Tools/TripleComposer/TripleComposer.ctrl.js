angular.module('Pundit2.TripleComposer')
.controller('TripleComposerCtrl', function($scope, $http, Annotation, TripleComposer, NameSpace, TypesHelper, XpointersHelper, MyPundit) {

    // statements objects are extend by this.addStatementScope()
    // the function is called in the statement directive link function
    $scope.statements = TripleComposer.getStatements();

    $scope.saving = false;
    var savingMsg = "We are saving your annotation",
        successMsg = "Your annotation has been saved successfully",
        errorMsg = "";
    $scope.textMessage = savingMsg;

    this.removeStatement = function(id){
        id = parseInt(id, 10);
        TripleComposer.removeStatement(id);
        if (TripleComposer.isAnnotationComplete()) {
            angular.element('.pnd-triplecomposer-save').removeClass('disabled');
        }    
    };

    this.addStatementScope = function(id, scope) {
        id = parseInt(id, 10);        
        TripleComposer.addStatementScope(id, scope);
    };

    this.duplicateStatement = function(id){
        id = parseInt(id, 10);        
        TripleComposer.duplicateStatement(id);
    };

    this.isAnnotationComplete = function(){
        if (TripleComposer.isAnnotationComplete()) {
            angular.element('.pnd-triplecomposer-save').removeClass('disabled');
        }
    };

    $scope.onClickAddStatement = function(){
        angular.element('.pnd-triplecomposer-save').addClass('disabled');
        TripleComposer.addStatement();
    };

    $scope.saveAnnotation = function(){
        // test with notebook "b81c0aa3"

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

                //$scope.textMessage = savingMsg;
                $scope.saving = true;

                $http({
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    url: NameSpace.get('asNBCurrent'),
                    params: {
                        context: angular.toJson({
                            targets: TripleComposer.buildTargets(),
                            pageContext: XpointersHelper.getSafePageContext()
                        })
                    },
                    withCredentials: true,
                    data: {
                        "graph": TripleComposer.buildGraph(),
                        "items": TripleComposer.buildItems()               
                    }
                }).success(function(data) {

                   $scope.saving = false;
                   $scope.statements = TripleComposer.reset();
                   angular.element('.pnd-triplecomposer-save').addClass('disabled');

                   // TODO add annnotation to annotationExchange then consolidate all
                   // TODO remove new Annotation (this load annotation from server)
                   new Annotation(data.AnnotationID).then(function(ann){
                        console.log(ann);
                   });
                }).error(function(msg) {
                    // TODO
                    $scope.saving = false;
                    console.log(msg);
                });


            } //end if logged

        }); // end my pundit login       

    }; // end save function

});