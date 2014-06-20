angular.module('Pundit2.NotebookComposer')
    .controller('NotebookComposerCtrl', function($scope, NotebookComposer, Toolbar, $timeout) {

        $scope.notebook = {};
        $scope.notebook.visibility = "public";
        $scope.notebook.name = "";
        $scope.notebook.current = false;

        $scope.saving = false;
        $scope.textMessage = NotebookComposer.options.savingMsg;

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
                Toolbar.setLoading(false);
            }, time);

        };

        var timeoutPromise, timeoutIsDone;

        $scope.save = function(){

            Toolbar.setLoading(true);

            // init save process showing saving message
            $scope.textMessage = NotebookComposer.options.savingMsg;
            $scope.shortMessagge = loadShortMsg;
            $scope.savingIcon = loadIcon;
            $scope.shortMessageClass = loadMessageClass;

            timeoutIsDone = false;
            timeoutPromise = $timeout(function(){ timeoutIsDone = true; }, NotebookComposer.options.savingMsgTime);
            $scope.saving = true;

            NotebookComposer.createNotebook($scope.notebook).then(function(v){
                // if you have gone at least 500ms
                if (timeoutIsDone) {
                    updateMessagge(NotebookComposer.options.notificationSuccessMsg, NotebookComposer.options.notificationMsgTime, false);
                } else {
                    timeoutPromise.then(function(){
                        updateMessagge(NotebookComposer.options.notificationSuccessMsg, NotebookComposer.options.notificationMsgTime, false);
                    });
                }
                $scope.clear();

            },
            function(){
                // if you have gone at least 500ms
                if (timeoutIsDone) {
                    updateMessagge(NotebookComposer.options.notificationErrorMsg, NotebookComposer.options.notificationMsgTime, true);
                } else {
                    timeoutPromise.then(function(){
                        updateMessagge(NotebookComposer.options.notificationErrorMsg, NotebookComposer.options.notificationMsgTime, true);
                    });
                }

            });
        };

        $scope.clear = function(){
            $scope.notebook.name = "";
            $scope.notebook.visibility = "public";
            $scope.notebook.current = "";
        };

    });