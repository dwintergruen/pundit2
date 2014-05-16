angular.module('Pundit2.Item')
.controller('ItemCtrl', function($scope, ItemsExchange, TypesHelper, Preview, ContextualMenu) {

    // get item by uri (passed as directive uri param)
    $scope.item = ItemsExchange.getItemByUri($scope.uri);
    // get item type label (then show it inside template)
    $scope.itemTypeLabel = TypesHelper.getLabel($scope.item.type[0]);
    // true when the item is set stcky (used in template to add css class)
    $scope.isStickyItem = false;

    $scope.onItemMouseOver = function(){
        Preview.showDashboardPreview($scope.item);
    };

    $scope.onItemMouseLeave = function(){
        Preview.hideDashboardPreview();
    };

    $scope.onClickSticky = function(){
        if (!$scope.isStickyItem) {
            
            $scope.isStickyItem = true;
            Preview.setItemDashboardSticky($scope.item);

            var unbindWatch = $scope.$watch( function(){
                return Preview.isStickyItem($scope.item);
            }, function(newIsStcky, oldIsStcky){
                if (!newIsStcky && newIsStcky!==oldIsStcky) {
                    $scope.isStickyItem = false;
                    unbindWatch();
                }
            });            
        }
    };

    var menuActions = [
        {
            name: 'action1',
            type: ['ExampleType'],
            label: "Find Item",
            priority: 0,
            showIf: function(){
                return true;
            },
            action: function(resource){
                
            }
        },
        {
            name: 'action2',
            type: ['ExampleType'],
            label: "Delete Item",
            priority: 0,
            showIf: function(){
                return true;
            },
            action: function(resource){
                
            }
        }
    ];
    
    $scope.onClickMenu = function($event){
        ContextualMenu.addAction(menuActions[0]);
        ContextualMenu.addAction(menuActions[1]);
        ContextualMenu.show($event.clientX, $event.clientY, {}, 'ExampleType');
    };

});