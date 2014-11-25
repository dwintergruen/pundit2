angular.module('Pundit2.ResourcePanel')

.controller('ResourcePanelCtrl', function($rootScope, $scope, $timeout, $filter, $window, 
        Client, Config, ItemsExchange, MyItems, MyPundit, PageItemsContainer, Preview, 
        ResourcePanel, SelectorsManager, KorboCommunicationService) {

    var actualContainer;
    var selectors = SelectorsManager.getActiveSelectors();

    $scope.label = '';

    $scope.moduleName = 'Pundit2';
    $scope.subjectIcon = ResourcePanel.options.inputIconSearch;
    $scope.itemSelected = null;
    $scope.isUseActive = false;
    $scope.contentTabs.activeTab = 0;

    // build tabs by reading active selectors inside selectors manager
    if ($scope.type !== 'pr') {
        for (var j = 0; j < selectors.length; j++) {
            $scope.contentTabs.push({
                title: selectors[j].config.label,
                template: 'src/Lists/itemList.tmpl.html',
                itemsContainer: selectors[j].config.container,
                items: [],
                module: 'Pundit2',
                isStarted: false
            });
        }
    }

    // TODO: global window resize management
    var onWindowResize = function() {
        ResourcePanel.hide();
    };
    angular.element($window).resize(onWindowResize);

    // TODO: really useful?
    var removeSpace = function(str) {
        return str.replace(/ /g, '');
    };
    // getter function used inside template to order items
    // return the items property value used to order
    $scope.getOrderProperty = function(item) {
        return removeSpace(item.label);
    };

    $scope.isSelected = function(item) {
        if ($scope.itemSelected !== null && $scope.itemSelected.uri === item.uri) {
            return true;
        } else {
            return false;
        }
    };

    $scope.select = function(item) {
        Preview.setItemDashboardSticky(item);
        $scope.isUseActive = true;
        $scope.itemSelected = item;
    };

    $scope.showUseAndCopyButton = function() {
        var currTab = $scope.contentTabs[$scope.contentTabs.activeTab].title;
        //if(Config.korbo.active && (currTab !== 'KorboBasket' && currTab !== 'Page Items' && currTab !== 'My Items')){
        if (Config.korbo.active && currTab === 'Freebase') {
            return true;
        } else {
            return false;
        }
    };

    $scope.showNewButton = function() {

        if (typeof(Config.korbo) !== 'undefined' && Config.korbo.active && $scope.type !== 'pr') {
            return true;
        } else {
            return false;
        }
    };

    $scope.createNew = function() {
        var name = $window[Config.korbo.confName].globalObjectName;
        $window[name].callOpenNew();
    };

    $scope.useAndCopy = function(elem) {
        var name = $window[Config.korbo.confName].globalObjectName;
        $window[name].callCopyAndUse(elem);
    };

    $scope.showCopyInEditorButton = function() {
        var currTab = $scope.contentTabs[$scope.contentTabs.activeTab].title;
        //if(Config.korbo.active && (currTab !== 'KorboBasket' && currTab !== 'Page Items' && currTab !== 'My Items')){
        if (Config.korbo.active && currTab === 'Freebase') {
            return true;
        } else {
            return false;
        }
    };

    $scope.copyInEditor = function() {
        var obj = {};
        //TODO costruisce l'id di freebase, cambiare metodo nel caso vengano gestiti più provider
        obj.uri = "__m__" + $scope.itemSelected.uri.substring($scope.itemSelected.uri.lastIndexOf('/') + 1);
        obj.providerFrom = 'freebase';

        KorboCommunicationService.setEntityToCopy(obj);

        var name = $window[Config.korbo.confName].globalObjectName;
        $window[name].callOpenNew();
    };

    $scope.$watch(function() {
        return $scope.contentTabs.activeTab;
    }, function(newActive, oldActive) {
        if (newActive !== oldActive) {
            actualContainer = $scope.contentTabs[$scope.contentTabs.activeTab].itemsContainer + $scope.label.split(' ').join('$');
            $scope.showUseAndCopyButton();
        }
    });

    // TODO: replace watch with EventDispatcher 
    $rootScope.$watch(function() {
        return MyPundit.isUserLogged();
    }, function(newStatus) {
        $scope.userLoggedIn = newStatus;
    });

});