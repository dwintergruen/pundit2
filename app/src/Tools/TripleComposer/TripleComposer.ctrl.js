angular.module('Pundit2.TripleComposer')
.controller('TripleComposerCtrl', function($scope, $http, $timeout, Annotation, TripleComposer, NameSpace, TypesHelper, XpointersHelper, MyPundit) {

    // statements objects are extend by this.addStatementScope()
    // the function is called in the statement directive link function
    $scope.statements = TripleComposer.getStatements();

    $scope.saving = false;
    $scope.textMessage = TripleComposer.options.savingMsg;

    var loadShortMsg = "Loading",
        successShortMsg = "Saved",
        warnShortMsg = "Warning!";

    var loadIcon = "pnd-icon-refresh pnd-icon-spin",
        successIcon = "pnd-icon-check-circle",
        warnIcon = "pnd-icon-exclamation-circle";

    var loadMessageClass = "pnd-message",
        successMessageClass = "pnd-message-success",
        warnMessageClass = "pnd-message-warning";

    $scope.shortMessagge = loadShortMsg;
    $scope.savingIcon = loadIcon;
    $scope.shortMessageClass = loadMessageClass;

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

    // update triple composer messagge then after "time" (ms)
    // restore default template content
    var updateMessagge = function(msg, time, err){
        $scope.textMessage = msg;

        if (err) {
            $scope.shortMessagge = warnShortMsg;
            $scope.savingIcon = warnIcon;
            $scope.shortMessageClass = warnMessageClass;
        } else {
            $scope.shortMessagge = successShortMsg;
            $scope.savingIcon = successIcon;
            $scope.shortMessageClass = successMessageClass;
        }
        
        $timeout(function(){
            $scope.saving = false;  
        }, time);
    };

    var savePromise, promiseResolved;
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

                // disable save button
                angular.element('.pnd-triplecomposer-save').addClass('disabled');

                // init save process showing saving message
                $scope.textMessage = TripleComposer.options.savingMsg;
                $scope.shortMessagge = loadShortMsg;
                $scope.savingIcon = loadIcon;
                $scope.shortMessageClass = loadMessageClass;

                promiseResolved = false;
                savePromise = $timeout(function(){ promiseResolved = true; }, TripleComposer.options.savingMsgTime);
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

                    // reset triple composer state
                    $scope.statements = TripleComposer.reset();
                    // if you have gone at least 500ms
                    if (promiseResolved) {
                        updateMessagge(TripleComposer.options.notificationSuccessMsg, TripleComposer.options.notificationMsgTime, false);
                    } else {
                        savePromise.then(function(){
                            updateMessagge(TripleComposer.options.notificationSuccessMsg, TripleComposer.options.notificationMsgTime, false);
                        });
                    }                    

                    // TODO add annnotation to annotationExchange then consolidate all
                    // TODO remove new Annotation (this load annotation from server)
                    new Annotation(data.AnnotationID).then(function(ann){
                        console.log(ann);
                    });
                }).error(function(msg) {
                    // TODO
                    console.log(msg);
                    // if you have gone at least 500ms
                    if (promiseResolved) {
                        updateMessagge(TripleComposer.options.notificationErrorMsg, TripleComposer.options.notificationMsgTime, true);
                    } else {
                        savePromise.then(function(){
                            updateMessagge(TripleComposer.options.notificationErrorMsg, TripleComposer.options.notificationMsgTime, true);
                        });
                    }
                });


            } //end if logged

        }); // end my pundit login       

    }; // end save function

});