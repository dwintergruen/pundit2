angular.module('Pundit2.SimplifiedClient')
.controller('ItemPopoverCtrl', function($scope, ItemPopover) {

    $scope.hide = function() {
        ItemPopover.hide();
    };

});