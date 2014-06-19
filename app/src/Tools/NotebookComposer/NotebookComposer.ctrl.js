angular.module('Pundit2.NotebookComposer')
    .controller('NotebookComposerCtrl', function($scope) {

        $scope.notebook = {};

        $scope.save = function(){
            console.log($scope.notebook);
            $scope.clear();
        }

        $scope.clear = function(){
            $scope.notebook.name = "";
            $scope.notebook.visibility = "";
            $scope.notebook.current = "";
        }

    });