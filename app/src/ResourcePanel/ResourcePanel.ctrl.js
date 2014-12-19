angular.module('Pundit2.ResourcePanel')

.controller('ResourcePanelCtrl', function($rootScope, $scope, $timeout, $filter, $window,
    Client, Config, ItemsExchange, MyItems, MyPundit, PageItemsContainer, Preview,
    ResourcePanel, SelectorsManager, KorboCommunicationService, EventDispatcher) {

    var actualContainer;
    var selectors = SelectorsManager.getActiveSelectors();
    var searchTimer;

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
        ResourcePanel.updatePosition();
    };
    angular.element($window).resize(onWindowResize);

    // TODO: really useful?
    var removeSpace = function(str) {
        return str.replace(/ /g, '');
    };

    var resetSelection = function() {
        $scope.isUseActive = false;
        $scope.itemSelected = null;
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
        EventDispatcher.sendEvent('Pundit.changeSelection');
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

    $scope.updateSearch = function(term) {
        var caller = '';
        if (typeof(term) !== 'undefined' && term.length > 2) {
            switch ($scope.type) {
                case 'sub':
                    caller = 'subject';
                    break;
                case 'pr':
                    caller = 'predicate';
                    break;
                case 'obj':
                    caller = 'object';
                    break;
            }
            if (caller !== 'pr' && caller !== '') {
                $timeout.cancel(searchTimer);
                searchTimer = $timeout(function() {
                    ResourcePanel.updateVocabSearch(term, $scope.triple, caller);
                }, ResourcePanel.options.vocabSearchTimer);
            }
        } else {
            $timeout.cancel(searchTimer);
            // TODO: add specific method in ResourcePanel to reset search
            ResourcePanel.updateVocabSearch('', $scope.triple, caller);
        }
    };

    $scope.escapeEvent = function(e) {
        if (e.which === 27) {
            e.stopPropagation();
        }
    };

    // TODO: why?!
    $scope.$watch(function() {
        return $scope.contentTabs.activeTab;
    }, function(newActive, oldActive) {
        if (newActive !== oldActive) {
            var labTemp = $scope.label ? $scope.label : '';
            actualContainer = $scope.contentTabs[$scope.contentTabs.activeTab].itemsContainer + labTemp.split(' ').join('$');
            $scope.showUseAndCopyButton();
        }
    });

    // TODO: replace watch with EventDispatcher 
    $rootScope.$watch(function() {
        return MyPundit.isUserLogged();
    }, function(newStatus) {
        $scope.userLoggedIn = newStatus;
    });

    EventDispatcher.addListener('Pundit.changeSelection', function() {
        resetSelection();
    });

});