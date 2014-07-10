angular.module('Pundit2.Item')
.directive('item', function() {
    return {
        restrict: 'E',
        scope: {
            uri: '@',
            menuType: '@',
            isSelected: '@',
            hideOptions: '@'
        },
        templateUrl: "src/Item/Item.dir.tmpl.html",
        controller: "ItemCtrl"
    };
});