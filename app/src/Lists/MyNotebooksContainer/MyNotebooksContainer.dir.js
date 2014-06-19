angular.module('Pundit2.MyNotebooksContainer')
    .directive('myNotebooksContainer', function() {
        return {
            restrict: 'E',
            scope: {
                
            },
            templateUrl: "src/Lists/MyNotebooksContainer/MyNotebooksContainer.dir.tmpl.html",
            controller: "MyNotebooksContainerCtrl"
        };
    });