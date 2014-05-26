angular.module('Pundit2.Item')
.controller('ItemCtrl', function($scope, ItemsExchange, TypesHelper, Preview, ContextualMenu) {

    // get item by uri (passed as directive uri param)
    $scope.item = ItemsExchange.getItemByUri($scope.uri);
    // get item type label (then show it inside template)
    $scope.itemTypeLabel = TypesHelper.getLabel($scope.item.type[0]);

    $scope.onItemMouseOver = function(){
        Preview.showDashboardPreview($scope.item);
    };

    $scope.onItemMouseLeave = function(){
        Preview.hideDashboardPreview();
    };

    $scope.isSticky = function() {
        return Preview.isStickyItem($scope.item);
    };

    $scope.onClickSticky = function(){
        if (Preview.isStickyItem($scope.item)) {
            Preview.clearItemDashboardSticky();
        } else {
            Preview.setItemDashboardSticky($scope.item);
        }
    };
    
    $scope.onClickMenu = function($event){
        // show menu on item, the action is added by MyItemsContainer or PageItemsContainer service
        // the type of menu to show is relative to pageItems or myItems
        ContextualMenu.show($event.pageX, $event.pageY, $scope.item, $scope.menuType);
    };

});