angular.module('Pundit2.Items')
.directive('items', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: "src/Items/Items.dir.tmpl.html",
        controller: "ItemsCtrl"
    };
});