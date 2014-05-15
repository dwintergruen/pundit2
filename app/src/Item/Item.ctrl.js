angular.module('Pundit2.Item')
.controller('ItemCtrl', function($scope, ItemsExchange, TypesHelper, Preview) {

    // get item by uri (passed as directive param)
    $scope.item = ItemsExchange.getItemByUri($scope.uri);
    // get item type label
    $scope.itemTypeLabel = TypesHelper.getLabel($scope.item.type[0]);

    $scope.onItemMouseOver = function(){
        Preview.showDashboardPreview($scope.item);
    };

    $scope.onItemMouseLeave = function(){
        Preview.hideDashboardPreview();
    };

});