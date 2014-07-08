angular.module('Pundit2.Item')
.controller('ItemCtrl', function($scope, ItemsExchange, TypesHelper, Preview, ContextualMenu) {

    // get item by uri (passed as directive uri param)
    $scope.item = ItemsExchange.getItemByUri($scope.uri);
    // get item type label (then show it inside template)
    if ($scope.item.type.length > 0) {
        $scope.itemTypeLabel = TypesHelper.getLabel($scope.item.type[0]);
    }    

    $scope.onItemMouseOver = function(){
        Preview.showDashboardPreview($scope.item);
    };

    $scope.onItemMouseLeave = function(){
        Preview.hideDashboardPreview();
    };

    $scope.isSticky = function() {
        return Preview.isStickyItem($scope.item);
    };

    $scope.onClickSticky = function(evt){
        if (Preview.isStickyItem($scope.item)) {
            Preview.clearItemDashboardSticky();
        } else {
            Preview.setItemDashboardSticky($scope.item);
        }
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    };
    
    $scope.onClickMenu = function(evt){
        // show menu on item, the action is added by MyItemsContainer or PageItemsContainer service
        // the type of menu to show is relative to pageItems or myItems
        ContextualMenu.show(evt.pageX, evt.pageY, $scope.item, $scope.menuType);
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    };

    $scope.isItemSelected = function(){
      if($scope.isSelected === false || typeof($scope.isSelected) === 'undefined'){console.log("false");
          return false;
      } else {
          return true;
      }
    };

});