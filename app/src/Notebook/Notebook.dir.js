// TODO: remove this directive and use Item

angular.module('Pundit2.Notebook')
.directive('notebook', function() {
    return {
        restrict: 'E',
        scope: {
            nid: '@',
            hideStickyButton: '@',
            forceSticky: '=forceSticky',
            menuType: '@'
        },
        templateUrl: "src/Notebook/Notebook.dir.tmpl.html",
        controller: "NotebookCtrl"
    };
});