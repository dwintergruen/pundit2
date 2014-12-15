angular.module('Pundit2.Item')

.directive('itemNotebook', function() {
    return {
        restrict: 'E',
        scope: {
            nid: '@',
            hideStickyButton: '@',
            forceSticky: '=forceSticky',
            menuType: '@'
        },
        templateUrl: "src/Item/ItemNotebook.dir.tmpl.html",
        controller: "NotebookCtrl"
    };
});