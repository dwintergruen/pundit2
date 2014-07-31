angular.module('Pundit2.SimplifiedClient')
.controller('ItemPopoverCtrl', function($scope, ItemPopover) {

    $scope.annotations = ItemPopover.getAnnotation();

    $scope.hide = function() {
        ItemPopover.hide();
    };

    $scope.onContentClick = function() {
        ItemPopover.fix();
    };

});