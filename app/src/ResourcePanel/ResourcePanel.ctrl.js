angular.module('Pundit2.ResourcePanel')
    .controller('ResourcePanelCtrl', function($rootScope, $scope, MyItems, PageItemsContainer, ItemsExchange, MyPundit, $filter, Client, SelectorsManager, ResourcePanel, Config, $window) {

        var myItemsContainer = MyItems.options.container;
        var pageItemsContainer = PageItemsContainer.options.container;
        var propertiesContainer = Client.options.relationsContainer;
        $scope.moduleName = 'Pundit2';

        var actualContainer;

        $scope.contentTabs.activeTab = 0;

        // build tabs by reading active selectors inside selectors manager

        var selectors = SelectorsManager.getActiveSelectors();
        if($scope.type !== 'pr'){
            for (var j=0; j<selectors.length; j++) {
                $scope.contentTabs.push({
                    title: selectors[j].config.label,
                    template: 'src/Lists/itemList.tmpl.html',
                    itemsContainer: selectors[j].config.container,
                    items: [],
                    module: 'Pundit2'
                });
            }
        }

        $scope.$watch(function() {
            return $scope.contentTabs.activeTab;
        }, function(newActive, oldActive) {
            if (newActive !== oldActive){
                actualContainer = $scope.contentTabs[$scope.contentTabs.activeTab].itemsContainer + $scope.label.split(' ').join('$');
                $scope.showUseAndCopyButton();
            }
        });

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

        // TODO the items list are not always updated
        // if we open the resource panel during pundit loading
        // is not guaranteed that all items is showed
        var allItemsArrays = [];
        var copyItemsArray = function() {
            for (var j=0; j<$scope.contentTabs.length; j++) {
                var title = $scope.contentTabs[j].title;
                if (title === 'My Items' ||  title === 'Page Items' || title === 'Properties') {
                    allItemsArrays.push(angular.copy($scope.contentTabs[j].items));
                } else {
                    // vocab is not necessary they are never filtered
                    // make a fake copy only to sync arrays index
                    allItemsArrays.push([]);
                }
                
            }
        };
        copyItemsArray();
        
        $scope.$watch('label', function(newLabel, oldLabel) {
            if (newLabel !== oldLabel) {
                for(var i=0; i<$scope.contentTabs.length; i++){
                    
                    if($scope.contentTabs[i].title === 'My Items'){
                        $scope.contentTabs[i].items = $filter('filterByLabel')(allItemsArrays[i], newLabel);
                    }

                    if($scope.contentTabs[i].title === 'Page Items'){
                        $scope.contentTabs[i].items = $filter('filterByLabel')(allItemsArrays[i], newLabel);
                    }

                    if($scope.contentTabs[i].title === 'Properties'){
                        $scope.contentTabs[i].items = $filter('filterByLabel')(allItemsArrays[i], newLabel);
                    }
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
        };

        $scope.showUseAndCopyButton = function(){
            var currTab = $scope.contentTabs[$scope.contentTabs.activeTab].title;
            if(Config.korbo.active && (currTab !== 'KorboBasket' && currTab !== 'Page Items' && currTab !== 'My Items')){
                return true;
            } else {
                return false;
            }
        };

        $scope.showNewButton = function(){
            if(typeof(Config.korbo) !== 'undefined' && Config.korbo.active){
                return true;
            } else {
                return false;
            }
        };

        $scope.createNew = function(){
            var name = $window[Config.korbo.confName].globalObjectName;
            $window[name].callOpenSearch();
        };


    });
