angular.module('Pundit2.Item')
.controller('ItemCtrl', function($scope, ItemsExchange, TypesHelper) {

    $scope.item = ItemsExchange.getItemByUri($scope.uri);
    $scope.itemTypeLabel = TypesHelper.getLabel($scope.item.type[0]);

    $scope.onItemMouseOver = function(){
        Preview.showDashboardPreview($scope.item);
    };

    $scope.onItemMouseLeave = function(){

    };

});