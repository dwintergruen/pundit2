angular.module('Pundit2.NotebookComposer')

.directive('notebookComposer', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: "src/Tools/NotebookComposer/NotebookComposer.dir.tmpl.html",
        controller: "NotebookComposerCtrl"
    };
});