angular.module('Pundit2.NotebookComposer')
    .controller('NotebookComposerCtrl', function($scope, NotebookComposer, Toolbar, $timeout, NotebookExchange, NotebookCommunication) {

        $scope.notebook = {};
        $scope.notebook.visibility = "public";
        $scope.notebook.name = "";
        $scope.notebook.current = false;
        $scope.editMode = false;

        $scope.$watch(function(){
            return NotebookComposer.getNotebookToEdit();
        }, function(nb){
            if(nb !== null){
                $scope.notebookToEdit = nb;
                $scope.notebook.name = nb.label;
                $scope.notebook.visibility = nb.visibility;
                $scope.editMode = true;
                if(NotebookExchange.getCurrentNotebooks().id === nb.id){
                    $scope.isCurrentNotebook = true;
                    $scope.notebook.current = true;
                } else {
                    $scope.isCurrentNotebook = false;
                    $scope.notebook.current = false;
                }
            }

        });

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

        $scope.edit = function(){

          /*if($scope.notebookToEdit.label === $scope.notebook.name){
              console.log("il nome è lo stesso");
          } else {
              NotebookComposer.editNotebook($scope.notebookToEdit.id, $scope.notebook.name).then(function(){
              });
          }*/

            if($scope.notebook.current === true){
                NotebookCommunication.setCurrent($scope.notebookToEdit.id);
            }

            if($scope.notebookToEdit.visibility !== $scope.notebook.visibility){
                if($scope.notebook.visibility === 'public'){
                    NotebookCommunication.setPublic($scope.notebookToEdit.id);
                } else if($scope.notebook.visibility === 'private'){
                    NotebookCommunication.setPrivate($scope.notebookToEdit.id);
                }
            }



        };

        $scope.clear = function(){
            $scope.notebook.name = "";
            $scope.notebook.visibility = "public";
            $scope.notebook.current = "";
            $scope.editMode = false;
        };

    });