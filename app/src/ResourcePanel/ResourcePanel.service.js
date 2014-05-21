angular.module('Pundit2.ResourcePanel')
.constant('RESOURCEPANELDEFAULTS', {

})
.service('ResourcePanel', function(BaseComponent, RESOURCEPANELDEFAULTS, $rootScope, $popover, $q, ItemsExchange, MyItems, PageItemsContainer, Client) {

    var resourcePanel = new BaseComponent('ResourcePanel', RESOURCEPANELDEFAULTS);
    var state = {};

    state.selectors = ['freebase', 'dbpedia', 'korbo'];
    /*
    *
    * LITERAL POPOVER METHOD
    *
    */

    // create div literalAnchor where literal append popover
    angular.element("[data-ng-app='Pundit2']")
        .prepend("<div class='pnd-literal-popover-literalAnchor' style='position: absolute; left: -500px; top: -500px;'><div>");
    state.literalAnchor = angular.element('.pnd-literal-popover-literalAnchor');

    state.popoverLiteral = null;

    // scope needed to instantiate a new popover using $popover provider
    state.popoverOptions = {scope: $rootScope.$new()};

    // initialize popoverLiteral text popover
    var initPopoverLiteral = function(x, y, content, target){
        // move literalAnchor to correct position
        state.literalAnchor.css({
            left: x,
            top: y
        });

        if(typeof(content) === 'undefined') {
            state.popoverOptions.scope.literalText = '';
        } else {
            state.popoverOptions.scope.literalText = content;
        }

        // handle save a new popoverLiteral
        state.popoverOptions.scope.save = function() {
            resourcePanel.saveLiteral(this.literalText);
            state.resourcePromise.resolve(this.literalText);
        };

        // close popoverLiteral popover without saving
        state.popoverOptions.scope.cancel = function() {
            resourcePanel.hideLiteral();
        };

        state.popoverOptions.placement = 'bottom';
        state.popoverOptions.template = 'src/ResourcePanel/popoverLiteralText.tmpl.html';
        state.popoverLiteral = $popover(state.literalAnchor, state.popoverOptions);
        state.popoverLiteral.clickTarget = target;
        return state.popoverLiteral;
    };

    state.resourcePromise;

    resourcePanel.showPopoverLiteral = function(x, y, content, target){

        // if click the same popover, toggle it
        if (state.popoverLiteral !== null && state.popoverLiteral.clickTarget === target) {
            state.popoverLiteral.$promise.then(state.popoverLiteral.toggle);
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popoverLiteral !== null && state.popoverLiteral.clickTarget !== target) {
            resourcePanel.hideLiteral();
            state.popoverLiteral = initPopoverLiteral(x, y, content, target);
            state.popoverLiteral.$promise.then(state.popoverLiteral.show);
        }

        // if no popover is shown, just show it
        else if (state.popoverLiteral === null) {
            state.popoverLiteral = initPopoverLiteral(x, y, content, target);
            state.popoverLiteral.$promise.then(state.popoverLiteral.show);
         }

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    resourcePanel.hideLiteral = function(){

        if(state.popoverLiteral === null){
            return;
        }
        state.popoverLiteral.hide();
        state.popoverLiteral.destroy();
        state.popoverLiteral = null;
    };

    resourcePanel.saveLiteral = function(text){
        state.literal = text;
        resourcePanel.hideLiteral();
    };

    resourcePanel.getLiteral = function() {
        return state.literal;
    };

    /*
     *
     * CALENDAR POPOVER METHOD
     *
     *
     */

    // create div literalAnchor where literal append popover
    angular.element("[data-ng-app='Pundit2']")
        .prepend("<div class='pnd-calendar-popover-calendarAnchor' style='position: absolute; left: -500px; top: -500px;'><div>");
    state.calendarAnchor = angular.element('.pnd-calendar-popover-calendarAnchor');

    state.popoverCalendar = null;
    // initialize calendar popover
    var initPopoverCalendar = function(x, y, date, target){
        // move literalAnchor to correct position
        state.calendarAnchor.css({
            left: x,
            top: y
        });

        // handle save a new popoverLiteral
        state.popoverOptions.scope.save = function() {
            resourcePanel.saveDate(this.selectedDate);
            state.resourcePromise.resolve(this.selectedDate);
        };

        // close popoverLiteral popover without saving
        state.popoverOptions.scope.cancel = function() {
            resourcePanel.hideCalendar();
        };

        state.popoverOptions.placement = 'bottom';
        state.popoverOptions.template = 'src/ResourcePanel/popoverCalendar.tmpl.html';
        state.popoverCalendar = $popover(state.calendarAnchor, state.popoverOptions);
        state.popoverCalendar.clickTarget = target;
        return state.popoverCalendar;
    };

    resourcePanel.showPopoverCalendar = function(x, y, date, target){

        // if no popover is shown, just show it
        if (state.popoverCalendar === null) {
            state.popoverCalendar = initPopoverCalendar(x, y, date, target);
            state.popoverCalendar.$promise.then(function() {
                state.popoverCalendar.show();

            });
        }

        // if click the same popover, toggle it
        else if (state.popoverCalendar !== null && state.popoverCalendar.clickTarget === target) {
            state.popoverCalendar.$promise.then(state.popoverCalendar.toggle);
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popoverCalendar !== null && state.popoverCalendar.clickTarget !== target) {
            resourcePanel.hideCalendar();
            state.popoverCalendar = initPopoverCalendar(x, y, date, target);
            state.popoverCalendar.$promise.then(state.popoverCalendar.show);
        }

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    resourcePanel.hideCalendar = function(){

        if(state.popoverCalendar === null){
            return;
        }
        state.popoverCalendar.hide();
        state.popoverCalendar.destroy();
        state.popoverCalendar = null;
    };

    resourcePanel.saveDate = function() {
        resourcePanel.hideCalendar();
    }

    /*
     *
     * RESOURCE PANEL POPOVER METHOD
     *
     *
     */

    // create div literalAnchor where literal append popover
    angular.element("[data-ng-app='Pundit2']")
        .prepend("<div class='pnd-reousrce-panel-popover-rpAnchor' style='position: absolute; left: -500px; top: -500px;'><div>");
    state.resourcePanelAnchor = angular.element('.pnd-calendar-popover-calendarAnchor');

    state.popoverResourcePanel = null;

    // initialize calendar popover
    var initPopoverResourcePanel = function(x, y, target, pageItems, myItems, properties){

        // move literalAnchor to correct position
        state.resourcePanelAnchor.css({
            left: x,
            top: y
        });
        state.popoverOptions.scope.pageItems = pageItems;
        state.popoverOptions.scope.myItems = myItems;
        state.popoverOptions.scope.properties = properties;
        // handle save a new popoverLiteral
        state.popoverOptions.scope.save = function(elem) {
            console.log("saved", elem);
            resourcePanel.hideResourcePanel();
            state.resourcePromise.resolve(elem);
        };

        // close popoverLiteral popover without saving
        state.popoverOptions.scope.cancel = function() {
            resourcePanel.hideResourcePanel();
        };

        state.popoverOptions.placement = 'bottom';
        state.popoverOptions.template = 'src/ResourcePanel/popoverResourcePanel.tmpl.html';
        state.popoverResourcePanel = $popover(state.resourcePanelAnchor, state.popoverOptions);
        state.popoverResourcePanel.clickTarget = target;
        return state.popoverResourcePanel;
    };

    var showPopoverResourcePanel = function(x, y, target, pageItems, myItems, properties){

        // if no popover is shown, just show it
        if (state.popoverResourcePanel === null) {
            state.popoverResourcePanel = initPopoverResourcePanel(x, y, target, pageItems, myItems, properties);
            state.popoverResourcePanel.$promise.then(function() {
                state.popoverResourcePanel.show();
            });
        }

        // if click the same popover, toggle it
        else if (state.popoverResourcePanel !== null && state.popoverResourcePanel.clickTarget === target) {
            state.popoverResourcePanel.$promise.then(state.popoverResourcePanel.toggle);
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popoverResourcePanel !== null && state.popoverResourcePanel.clickTarget !== target) {
            resourcePanel.hideResourcePanel();
            state.popoverResourcePanel = initPopoverResourcePanel(x, y, target, pageItems, myItems, properties);
            state.popoverResourcePanel.$promise.then(state.popoverResourcePanel.show);
        }

    };

    resourcePanel.hideResourcePanel = function(){

        if(state.popoverResourcePanel === null){
            return;
        }
        state.popoverResourcePanel.hide();
        state.popoverResourcePanel.destroy();
        state.popoverResourcePanel = null;
    };

    resourcePanel.showEntity = function(x, y, triple, target) {
        var myItemsContainer = MyItems.options.container;
        var myItems = ItemsExchange.getItemsByContainer(myItemsContainer);

        var pageItemsContainer = PageItemsContainer.options.container;
        var pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);

        showPopoverResourcePanel(x, y, target, pageItems, myItems, "");

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;

    };

    resourcePanel.showProperties = function(x, y, triple, target) {
        var propertiesContainer = Client.options.relationsContainer;
        var properties = ItemsExchange.getItemsByContainer(propertiesContainer);
        showPopoverResourcePanel(x, y, target, "", "", properties);

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    return resourcePanel;
});
