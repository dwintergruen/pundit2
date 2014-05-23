angular.module('Pundit2.ResourcePanel')
.constant('RESOURCEPANELDEFAULTS', {

})
.service('ResourcePanel', function(BaseComponent, RESOURCEPANELDEFAULTS, $rootScope, $popover, $q, ItemsExchange, MyItems, PageItemsContainer, Client) {

    var resourcePanel = new BaseComponent('ResourcePanel', RESOURCEPANELDEFAULTS);
    var state = {};
    state.popover = null;

    state.selectors = ['freebase', 'dbpedia', 'korbo'];

    // hide and destroy a popover
    resourcePanel.hide = function(){

        if(state.popover === null){
            return;
        }
        state.popover.hide();
        state.popover.destroy();
        state.popover = null;
    };
    /*
    *
    * LITERAL POPOVER METHOD
    *
    */

    // create div literalAnchor where literal append popover
    angular.element("[data-ng-app='Pundit2']")
        .prepend("<div class='pnd-literal-popover-literalAnchor' style='position: absolute; left: -500px; top: -500px;'><div>");
    state.literalAnchor = angular.element('.pnd-literal-popover-literalAnchor');


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
            resourcePanel.hide();
        };

        state.popoverOptions.placement = 'bottom';
        state.popoverOptions.template = 'src/ResourcePanel/popoverLiteralText.tmpl.html';
        state.popover = $popover(state.literalAnchor, state.popoverOptions);
        state.popover.clickTarget = target;
        return state.popover;
    };

    state.resourcePromise = null;

    resourcePanel.showPopoverLiteral = function(x, y, content, target){

        // if click the same popover, toggle it
        if (state.popover !== null && state.popover.clickTarget === target) {
            resourcePanel.hide();
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopoverLiteral(x, y, content, target);
            state.popover.$promise.then(state.popover.show);
        }

        // if no popover is shown, just show it
        else if (state.popover === null) {
            state.popover = initPopoverLiteral(x, y, content, target);
            state.popover.$promise.then(state.popover.show);
         }

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };


    resourcePanel.saveLiteral = function(text){
        state.literal = text;
        resourcePanel.hide();
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
            resourcePanel.hide();
        };

        state.popoverOptions.placement = 'bottom';
        state.popoverOptions.template = 'src/ResourcePanel/popoverCalendar.tmpl.html';
        state.popover = $popover(state.calendarAnchor, state.popoverOptions);
        state.popover.clickTarget = target;
        return state.popover;
    };

    resourcePanel.showPopoverCalendar = function(x, y, date, target){

        // if no popover is shown, just show it
        if (state.popover === null) {
            state.popover = initPopoverCalendar(x, y, date, target);
            state.popover.$promise.then(function() {
                state.popover.show();

            });
        }

        // if click the same popover, toggle it
        else if (state.popover !== null && state.popover.clickTarget === target) {
            state.popover.$promise.then(state.popover.toggle);
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopoverCalendar(x, y, date, target);
            state.popover.$promise.then(state.popover.show);
        }

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };


    resourcePanel.saveDate = function() {
        resourcePanel.hide();
    };

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
            resourcePanel.hide();
            state.resourcePromise.resolve(elem);
        };

        // close popoverLiteral popover without saving
        state.popoverOptions.scope.cancel = function() {
            resourcePanel.hide();
        };

        state.popoverOptions.placement = 'bottom';
        state.popoverOptions.template = 'src/ResourcePanel/popoverResourcePanel.tmpl.html';
        state.popover = $popover(state.resourcePanelAnchor, state.popoverOptions);
        state.popover.clickTarget = target;
        return state.popover;
    };

    var showPopoverResourcePanel = function(x, y, target, pageItems, myItems, properties){

        // if no popover is shown, just show it
        if (state.popover === null) {
            state.popover = initPopoverResourcePanel(x, y, target, pageItems, myItems, properties);
            state.popover.$promise.then(function() {
                state.popover.show();
            });
        }

        // if click the same popover, toggle it
        else if (state.popover !== null && state.popover.clickTarget === target) {
            state.popover.$promise.then(state.popover.toggle);
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopoverResourcePanel(x, y, target, pageItems, myItems, properties);
            state.popover.$promise.then(state.popover.show);
        }

    };
    // triple is an array of URI [subject, predicate, object]
    resourcePanel.showItemsForSubject = function(x, y, triple, target) {
        var myItemsContainer = MyItems.options.container;
        var pageItemsContainer = PageItemsContainer.options.container;
        var myItems, pageItems;

        if(typeof(triple) !== 'undefined'){

            // predicate is the second element of the triple
            var predicate = triple[1];

            // if predicate is not defined
            if( typeof(predicate) === 'undefined' || predicate === "") {
                // all items are good
                myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);

            } else {
                // get item predicate and check his domain
                var itemPredicate = ItemsExchange.getItemByUri(predicate);
                // predicate with empty domain
                if(typeof(itemPredicate.domain) === 'undefined' || itemPredicate.domain.length === 0 || itemPredicate.domain[0] === ""){
                    // all items are good
                    myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                    pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                } else {
                    // predicate with a valid domain
                    var domain = itemPredicate.domain;

                    // get only items matching with predicate domain
                    var filter = function(item) {

                      for(var i=0; i<domain.length; i++){
                          for (var j=0; j<item.type.length; j++){
                              if(domain[i] === item.type[j]) {
                                  return true;
                              }
                          }
                      }
                        return false;
                    };

                    myItems = ItemsExchange.getItemsFromContainerByFilter(myItemsContainer, filter);
                    pageItems = ItemsExchange.getItemsFromContainerByFilter(pageItemsContainer, filter);
                }

            }

        }

        showPopoverResourcePanel(x, y, target, pageItems, myItems, "");

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;

    };

    resourcePanel.showItemsForObject = function(x, y, triple, target) {
        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    // show only properties
    // will be executed for predicates
    resourcePanel.showProperties = function(x, y, triple, target) {
        var propertiesContainer = Client.options.relationsContainer;
        var properties;

        if(typeof(triple) !== 'undefined'){
            // subject is the first element of the triple
            var subject = triple[0];

            // if predicate is not defined
            if( typeof(subject) === 'undefined' || subject === "") {
                // all properties are good
                properties = ItemsExchange.getItemsByContainer(propertiesContainer);
            } else {
                // get item predicate and check his domain
                var itemSubject = ItemsExchange.getItemByUri(subject);
                // predicate with empty domain
                if(typeof(itemSubject.type) === 'undefined' || itemSubject.type.length === 0 || itemSubject.type[0] === ""){
                    // all properties are good
                    properties = ItemsExchange.getItemsByContainer(propertiesContainer);
                } else {
                    // predicate with a valid domain
                    var types = itemSubject.type;

                    // get only items matching with predicate domain
                    var filter = function(item) {

                        for(var i=0; i<types.length; i++){
                            for (var j=0; j<item.domain.length; j++){
                                if(types[i] === item.domain[j]) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                    properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filter);
                }

            }

        }


        showPopoverResourcePanel(x, y, target, "", "", properties);

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    return resourcePanel;
});
