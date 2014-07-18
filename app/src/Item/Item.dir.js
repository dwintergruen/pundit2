angular.module('Pundit2.Item')
.directive('item', function() {
    return {
        restrict: 'E',
        scope: {
            uri: '@',
            menuType: '@',
            isSelected: '@',
            hideOptions: '@',
            hideStickyButton: '@',
            useInKorbo: '@'
        },
        templateUrl: "src/Item/Item.dir.tmpl.html",
        controller: "ItemCtrl"
    };
});