angular.module('Pundit2.Preview')

.directive('notebookPreview', function() {
    return {
        restrict: 'E',
        scope: {
            id: '@'
        },
        templateUrl: "src/Preview/NotebookPreview.dir.tmpl.html",
        controller: 'NotebookPreviewCtrl'
    };
});