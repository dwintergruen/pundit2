angular.module('Pundit2.TripleComposer')
.controller('TripleComposerCtrl', function($scope, $http, $timeout, NameSpace,
    MyPundit, Toolbar, TripleComposer, AnnotationsCommunication, TemplatesExchange) {

    // statements objects are extend by this.addStatementScope()
    // the function is called in the statement directive link function
    $scope.statements = TripleComposer.getStatements();

    $scope.saving = false;
    $scope.textMessage = TripleComposer.options.savingMsg;

    $scope.headerMessage = "Create New Annotation";

    $scope.editMode = false;
    $scope.$watch(function() {
        return TripleComposer.isEditMode();
    }, function(editMode) {
        if (editMode) {
            $scope.headerMessage = "Edit and update your Annotation";
        } else {
            $scope.headerMessage = "Create New Annotation";
        }
        $scope.editMode = editMode;
    });

    $scope.templateMode;
    var lastHeader;
    $scope.$watch(function() {
        return Toolbar.isActiveTemplateMode();
    }, function(newVal, oldVal) {
        $scope.templateMode = newVal;
        if (newVal) {
            lastHeader = $scope.headerMessage;
            $scope.headerMessage = "Compleate your Annotation and Save!";
            // TODO load template items
        } else if(newVal !== oldVal) {
            $scope.headerMessage = lastHeader;
            // TODO wipe template items
        }
    });

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

    $scope.cancel = function(){
        if ($scope.editMode) {
            TripleComposer.reset();
            TripleComposer.setEditMode(false);
        }        
    };

    $scope.editAnnotation = function(){
        var annID = TripleComposer.getEditAnnID();

        if (typeof(annID) !== 'undefined') {

            var savePromise = initSavingProcess();
            angular.element('.pnd-triplecomposer-cancel').addClass('disabled');

            AnnotationsCommunication.editAnnotation(
                annID,
                TripleComposer.buildGraph(),
                TripleComposer.buildItems(),
                TripleComposer.buildTargets()
            ).then(function(){
                stopSavingProcess(
                    savePromise,
                    TripleComposer.options.notificationSuccessMsg,
                    TripleComposer.options.notificationMsgTime,
                    false
                );
            }, function(){
                stopSavingProcess(
                    savePromise,
                    TripleComposer.options.notificationErrorMsg,
                    TripleComposer.options.notificationMsgTime,
                    true
                );
            });            
        }
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
            TripleComposer.setEditMode(false);
            angular.element('.pnd-triplecomposer-cancel').removeClass('disabled');
            $scope.saving = false;
        }, time);
    };

    var promiseResolved;
    var initSavingProcess = function() {
        // disable save button
        angular.element('.pnd-triplecomposer-save').addClass('disabled');

        // init save process showing saving message
        $scope.textMessage = TripleComposer.options.savingMsg;
        $scope.shortMessagge = loadShortMsg;
        $scope.savingIcon = loadIcon;
        $scope.shortMessageClass = loadMessageClass;

        promiseResolved = false;
        //savePromise = $timeout(function(){ promiseResolved = true; }, TripleComposer.options.savingMsgTime);
        $scope.saving = true;
        return $timeout(function(){ promiseResolved = true; }, TripleComposer.options.savingMsgTime);
    };

    var stopSavingProcess = function(promise, msg, msgTime, err) {

        // if you have gone at least 500ms
        if (promiseResolved) {
            updateMessagge(msg, msgTime, err);
        } else {
            promise.then(function(){
                updateMessagge(msg, msgTime, err);
            });
        }

        if ($scope.templateMode) {
            TripleComposer.wipeNotFixedItems();
            return;
        }
        if ($scope.editMode) {
            TripleComposer.reset();
            return;
        }
    };

    // TODO check mode (edit or template) then wipe correctly the items
    $scope.saveAnnotation = function(){

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

                var savePromise = initSavingProcess();

                var httpPromise;
                if ($scope.templateMode) {
                    httpPromise = AnnotationsCommunication.saveAnnotation(
                                    TripleComposer.buildGraph(),
                                    TripleComposer.buildItems(),
                                    TripleComposer.buildTargets(),
                                    TemplatesExchange.getCurrent().id);
                } else {
                    httpPromise = AnnotationsCommunication.saveAnnotation(
                                    TripleComposer.buildGraph(),
                                    TripleComposer.buildItems(),
                                    TripleComposer.buildTargets());
                }
                
                httpPromise.then(function(){
                    // resolved
                    stopSavingProcess(
                        savePromise,
                        TripleComposer.options.notificationSuccessMsg,
                        TripleComposer.options.notificationMsgTime,
                        false
                    );
                }, function(){
                    // rejected
                    stopSavingProcess(
                        savePromise,
                        TripleComposer.options.notificationErrorMsg,
                        TripleComposer.options.notificationMsgTime,
                        true
                    );
                });

            } //end if logged
        }); // end my pundit login       

    }; // end save function

});