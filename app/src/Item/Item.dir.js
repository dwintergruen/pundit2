angular.module('Pundit2.Item')
.directive('item', function() {
    return {
        restrict: 'E',
        scope: {
            uri: '@',
            menuType: '@',
            isSelected: '@'
        },
        templateUrl: "src/Item/Item.dir.tmpl.html",
        controller: "ItemCtrl"
    };
});