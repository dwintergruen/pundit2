angular.module('Pundit2.ResourcePanel')
    .controller('ResourcePanelCtrl', function($rootScope, $scope, MyItems, PageItemsContainer, ItemsExchange, MyPundit, $filter, Client) {

        var myItemsContainer = MyItems.options.container;
        var pageItemsContainer = PageItemsContainer.options.container;
        var propertiesContainer = Client.options.relationsContainer;



        $rootScope.$watch(function() {
            return MyPundit.isUserLogged();
        }, function(newStatus) {
            $scope.userLoggedIn = newStatus;
        });

        var removeSpace = function(str){
            return str.replace(/ /g,'');
        };

        // getter function used inside template to order items
        // return the items property value used to order
        $scope.getOrderProperty = function(item){
            return removeSpace(item.label);
        };

        $scope.$watch('label', function(newLabel) {
            for(var i=0; i<$scope.contentTabs.length; i++){
                //ItemsExchange.getItemsByContainer(myItemsContainer);
                if($scope.contentTabs[i].title === 'My Items'){
                    $scope.contentTabs[i].items = $filter('filterByLabel')(ItemsExchange.getItemsByContainer(myItemsContainer), $scope.label);
                }

                if($scope.contentTabs[i].title === 'Page Items'){
                    $scope.contentTabs[i].items = $filter('filterByLabel')(ItemsExchange.getItemsByContainer(pageItemsContainer), $scope.label);
                }

                if($scope.contentTabs[i].title === 'Properties'){
                    $scope.contentTabs[i].items = $filter('filterByLabel')(ItemsExchange.getItemsByContainer(propertiesContainer), $scope.label);
                }
            }

        });

        $scope.itemSelected = null;
        $scope.isUseActive = false;

        $scope.isSelected = function(item){
            if ($scope.itemSelected !== null && $scope.itemSelected.uri === item.uri){
                return true;
            } else {
                return false;
            }
        };

        $scope.select = function(item){
            $scope.isUseActive = true;
            $scope.itemSelected = item;
        }



    });
