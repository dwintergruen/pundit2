angular.module('Pundit2.Notebook')
.directive('notebook', function() {
    return {
        restrict: 'E',
        scope: {
            nid: '@',
            menuType: '@'
        },
        templateUrl: "src/Notebook/Notebook.dir.tmpl.html",
        controller: "NotebookCtrl"
    };
});