angular.module('Pundit2.ResourcePanel')
.constant('RESOURCEPANELDEFAULTS', {
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ResourcePanel
     *
     * @description
     * `object`
     *
     * Configuration for Resource Panel module.
     * Resource Panel is that component where are shown subject, predicates or object to add in the triple composer statement.
     * It is possible to select an item shown in the panel, or search an item in the active selectors.
     * In case of date type, will be shown a calendar popover initialized with a specific date. This date is configurable.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ResourcePanel.vocabSearchTimer
     *
     * @description
     * `number`
     *
     * Time delay between insert label to search and selectors start searching that label.
     */
    vocabSearchTimer: 1000,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ResourcePanel.initialCalendarDate
     *
     * @description
     * `number`
     *
     * Initial date showing in calendar popover.
     */
    initialCalendarDate: ''
    
})

/**
 * @ngdoc service
 * @name ResourcePanel
 * @module Pundit2.ResourcePanel
 * @description
 *
 * Handle the resource panel visualization and its content.
 *
 * Given a triple (complete or not), il will be show the list of items from their provenience ('Page Items', 'My Items', 'Vocabularies')
 *
 * A triple is an array of URI, where:
 * * in the first position there is the Subject URI
 * * in the second position there is the Predicate URI
 * * in the third position there is the Object URI
 *
 * A triple is defined as complete when all URI are defined, incomplete otherwise.
 *
 *
 */
.service('ResourcePanel', function(BaseComponent, RESOURCEPANELDEFAULTS,
                                   ItemsExchange, MyItems, PageItemsContainer, Client, NameSpace, SelectorsManager,
                                   $filter, $rootScope, $popover, $q, $timeout, Preview, $window, Config, Item) {

    var resourcePanel = new BaseComponent('ResourcePanel', RESOURCEPANELDEFAULTS);
    var state = {};

    state.popover = null;
    state.defaultPlacement = 'bottom';
    state.resourcePromise = null;

    /**
     * @ngdoc method
     * @name ResourcePanel#hide
     * @module Pundit2.ResourcePanel
     * @function
     *
     * @description
     * Close and destroy the popover
     *
     */
    resourcePanel.hide = function(){

        if(state.popover === null){
            return;
        }

        state.popoverOptions.scope.vocabObjRes = [];
        state.popoverOptions.scope.vocabSubRes = [];
        state.popoverOptions.scope.label = "";
        state.popover.hide();
        state.popover.destroy();
        state.popover = null;
    };

    // scope needed to instantiate a new popover using $popover provider
    state.popoverOptions = {scope: $rootScope.$new()};
    state.popoverOptions.trigger = "manual";

    // initialize a popover
    var initPopover = function(content, target, placement, type, contentTabs){

        // initialize a calendar popover
        if(type === 'calendar') {

            state.popoverOptions.template = 'src/ResourcePanel/popoverCalendar.tmpl.html';

            if(typeof(content.date) === 'undefined' || content.date === '') {

                if(typeof(resourcePanel.options.initialCalendarDate) === 'undefined' || resourcePanel.options.initialCalendarDate === ''){
                    state.popoverOptions.scope.selectedDate = new Date().toString();
                } else {
                    state.popoverOptions.scope.selectedDate = resourcePanel.options.initialCalendarDate;
                }

            } else {
                state.popoverOptions.scope.selectedDate = content.date;
            }

            state.popoverOptions.scope.save = function() {

                state.resourcePromise.resolve(new Date(this.selectedDate));
                Preview.hideDashboardPreview();
                resourcePanel.hide();
            };

            // close popoverLiteral popover without saving
            state.popoverOptions.scope.cancel = function() {
                Preview.hideDashboardPreview();
                resourcePanel.hide();
            };

        // initialize a literal popover
        } else if(type === 'literal'){

            state.popoverOptions.template = 'src/ResourcePanel/popoverLiteralText.tmpl.html';

            if(typeof(content.literalText) === 'undefined') {
                state.popoverOptions.scope.literalText = '';
            } else {
                state.popoverOptions.scope.literalText = content.literalText;
            }

            // handle save a new popoverLiteral
            state.popoverOptions.scope.save = function() {
                state.resourcePromise.resolve(this.literalText);
                Preview.hideDashboardPreview();
                resourcePanel.hide();
            };

            // close popoverLiteral popover without saving
            state.popoverOptions.scope.cancel = function() {
                Preview.hideDashboardPreview();
                resourcePanel.hide();
            };

            // initialize a resource panel popover
        } else if(type === 'resourcePanel'){

            if(typeof(Config.korbo) !== 'undefined' && Config.korbo.active){
                var name = $window[Config.korbo.confName].globalObjectName;
                $window[name].onSave(
                    function(obj){
                        var options = {
                            'label': obj.label,
                            'type': obj.type
                        };

                        if(typeof(obj.description) !== 'undefined' && obj.description !== ''){
                            options.description = obj.description;
                        }

                        if(typeof(obj.image) !== 'undefined' && obj.image !== ''){
                            options.image = obj.image;
                        }

                        var item = new Item(obj.value, options);
                        state.resourcePromise.resolve(item);
                        Preview.hideDashboardPreview();
                        resourcePanel.hide();
                    }
                );
            }

            state.popoverOptions.template = 'src/ResourcePanel/popoverResourcePanel.tmpl.html';

            state.popoverOptions.scope.originalContent = angular.copy(content);
            state.popoverOptions.scope.type = content.type;
            state.popoverOptions.scope.pageItems = content.pageItems;
            state.popoverOptions.scope.myItems = content.myItems;
            state.popoverOptions.scope.properties = content.properties;
            state.popoverOptions.scope.contentTabs = contentTabs;
            if(content.label !== '' && typeof(content.label) !== 'undefined'){
                setLabelToSearch(content.label);
            } else {
                state.popoverOptions.scope.label = content.label;
            }

            // handle save a new popoverLiteral
            state.popoverOptions.scope.save = function(elem) {
                resourcePanel.hide();
                Preview.hideDashboardPreview();
                state.resourcePromise.resolve(elem);
            };

            // close popoverLiteral popover without saving
            state.popoverOptions.scope.cancel = function() {
                Preview.hideDashboardPreview();
                resourcePanel.hide();
            };
        }

        // common for all type of popover
        if(typeof(placement) === 'undefined' || placement === ''){
            state.popoverOptions.placement = state.defaultPlacement;
        } else {
            state.popoverOptions.placement = placement;
        }

        //TODO: è stato aggiunto per visualizzare il popover in modo che rimanga sempre visibile in tutta la pagina (altrimenti una parte è nascosta nella dashboard)
        state.popoverOptions.container = "[data-ng-app='Pundit2']";

        // get target top and left position
        var left = target.getBoundingClientRect().left;
        var top = target.getBoundingClientRect().top;

        // get target width and height, including padding
        var h = angular.element(target).outerHeight();
        var w = angular.element(target).outerWidth();

        // create div anchor (the element bound with angular strap menu reference)
        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-popover-anchor' style='position: absolute; left: -500px; top: -500px;'><div>");

        state.anchor = angular.element('.pnd-popover-anchor');

        state.anchor.css({
            left: left + (w/2),
            top: top + h
        });

        //state.popover = $popover(angular.element(target), state.popoverOptions);
        state.popover = $popover(state.anchor, state.popoverOptions);

        // Open the calendar automatically
        if (type === 'calendar') {
            // Since it's a directive inside another directive, there's a couple of $digest()
            // cycles we need to wait for everything to be up and running, promises, templates
            // to get fetched, rendered etc...... using a timeout :|
            $timeout(function() {
                angular.element(state.popover.$element)
                    .find('.pnd-input-calendar')
                    .triggerHandler('click');
            }, 1);

        }


        state.popover.clickTarget = target;
        return state.popover;
    };

    var setLabelToSearch = function(val) {
        state.popoverOptions.scope.label = val;
        if(state.popoverOptions.scope.type === 'obj' || state.popoverOptions.scope.type === 'sub') {
            state.popoverOptions.scope.myItems = $filter('filterByLabel')(state.popoverOptions.scope.originalContent.myItems, val);
            state.popoverOptions.scope.pageItems = $filter('filterByLabel')(state.popoverOptions.scope.originalContent.pageItems, val);
        }
        if(state.popoverOptions.scope.type === 'pr') {
            state.popoverOptions.scope.properties = $filter('filterByLabel')(state.popoverOptions.scope.originalContent.properties, val);
        }

    };

    /**
     * @ngdoc method
     * @name ResourcePanel#showPopoverLiteral
     * @module Pundit2.ResourcePanel
     * @function
     *
     * @description
     * Open a popover containing a textarea where is possible to insert a literal.
     *
     * Popover has two buttons: `Save` that resolve a promise and `Cancel` that close the popover.
     *
     * @param {string} text Text to visualize into textarea. By default, textarea will be show empty
     * @param {DOMElement} target DOM Element where to append the popover
     * @return {Promise} when Save button is clicked, promise will be resolved with value entered in textarea
     *
     */
    resourcePanel.showPopoverLiteral = function(text, target){

        var content = {};
        content.literalText = text;

        if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopover(content, target, "", 'literal');
            state.popover.$promise.then(function() {
                state.popover.show();
                angular.element('textarea.pnd-popover-literal-textarea')[0].focus();
            });
        }

        // if no popover is shown, just show it
        else if (state.popover === null) {
            state.popover = initPopover(content, target, "", 'literal');
            state.popover.$promise.then(function() {
                state.popover.show();
                angular.element('textarea.pnd-popover-literal-textarea')[0].focus();
            });
         }

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    /**
     * @ngdoc method
     * @name ResourcePanel#showPopoverCalendar
     * @module Pundit2.ResourcePanel
     * @function
     *
     * @description
     * Open a popover containing a calendar.
     *
     * Popover has two buttons: `Save` that resolve a promise and `Cancel` that close the popover.
     *
     * @param {date} date Date selected when calendar is shown. If no date is specified, will be show the date set as default in configuration (See {@link #!/api/punditConfig/object/modules#ResourcePanel.initialCalendarDate here} for details).
     * @param {DOMElement} target DOM Element where to append the popover
     * @return {Promise} when Save button is clicked, promise will be resolved with the selected date
     *
     */
    resourcePanel.showPopoverCalendar = function(date, target){
        var content = {};
        content.date = date;
        // if no popover is shown, just show it
        if (state.popover === null) {
            state.popover = initPopover(content, target, "", 'calendar');
            state.popover.$promise.then(function() {
                state.popover.show();
                //$datepicker.show;
                angular.element('input.pnd-input-calendar')[0].focus();
            });
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopover( "", target, "", 'calendar');
            state.popover.$promise.then(function() {
                state.popover.show();
                //$datepicker.show;
                angular.element('input.pnd-input-calendar')[0].focus();
            });
        }

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    // show popover resource panel
    // pageItems -->  page items to show
    // myItems -->  my items to show
    // properties -->  properties to show
    var showPopoverResourcePanel = function(target, pageItems, myItems, properties, label, type){
        var content = {};
        content.type = type;
        var contentTabs = [];
        if(type === 'sub' || type === 'obj'){
            var pageItemsForTabs = {
              title: 'Page Items',
              items: pageItems,
              isStarted: true
            };
            contentTabs.push(pageItemsForTabs);
            content.pageItems = pageItems;

            var myItemsForTabs = {
                title: 'My Items',
                items: myItems,
                isStarted: true
            };
            contentTabs.push(myItemsForTabs);
            content.myItems = myItems;

            content.properties = null;
        }
        if (type === 'pr') {
            var prop = {
                title: 'Properties',
                items: properties,
                isStarted: true
            };
            contentTabs.push(prop);

            content.properties = properties;
            content.pageItems = null;
            content.myItems = null;
        }

        content.label = label;
        // if no popover is shown, just show it
        if (state.popover === null) {
            state.popover = initPopover(content, target, "", 'resourcePanel', contentTabs);
            state.popover.$promise.then(state.popover.show);
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopover(content, target, "", 'resourcePanel', contentTabs);
            state.popover.$promise.then(state.popover.show);
        } // if click a different popover, hide the shown popover and show the clicked one

    };

        var searchTimer;


    /**
     * @ngdoc method
     * @name ResourcePanel#showItemsForSubject
     * @module Pundit2.ResourcePanel
     * @function
     *
     * @description
     * Open a popover where subject items are shown grouped according from their provenance ('Page items', 'My items', 'Vocabularies').
     * If URI predicate is not defined in the triple, all items will be shown.
     * If URI predicate is defined in the triple, will be shown only items whose types are compatible with predicate domain
     *
     * My items are visible only if user is logged in.
     *
     * It is possible to insert a label to filter shown items and start a searching of new items in the vocabularies.
     *
     * @param {Array} triple Array of URI (for details content of this array, see {@link #!/api/Pundit2.ResourcePanel/service/ResourcePanel here})
     * @param {DOMElement} target DOM Element where to append the popover
     * @param {string} label label used to search subject in the vocabularies and filter shown Page Items and My Items
     * @return {Promise} return a promise that will be resolved when a subject is selected
     *
     */
    resourcePanel.showItemsForSubject = function(triple, target, label) {

        if(typeof(target) === 'undefined'){
            target = state.popover.clickTarget;
        }

        var selectors = SelectorsManager.getActiveSelectors();
        state.popoverOptions.scope.selectors = [];

        // initialize selectors list
        angular.forEach(selectors, function(sel){
            state.popoverOptions.scope.selectors.push(sel.config.container);
        });

        // if showItemsForSubject is call from the same target but with different label, get a search on vocabs and filter myItems and pageItems results
        if(state.popover !== null && state.popover.clickTarget === target /*&& state.popoverOptions.scope.label !== label*/){
            state.popoverOptions.scope.vocabSubStatus = 'loading';
            $timeout.cancel(searchTimer);
            setLabelToSearch(label);
            searchTimer = $timeout(function(){
                searchOnVocab(label, selectors, triple, 'subject');
            }, resourcePanel.options.vocabSearchTimer);

        } else {
            // if open a new popover and label is not empty, get a search on vocab
            if(typeof(label) !== 'undefined' && label !== '' /*&& state.popoverOptions.scope.label !== label*/){
                state.popoverOptions.scope.vocabSubStatus = 'loading';
                $timeout.cancel(searchTimer);
                searchTimer = $timeout(function(){
                    searchOnVocab(label, selectors, triple, 'subject');
                }, resourcePanel.options.vocabSearchTimer);
            }

            var myItemsContainer = MyItems.options.container;
            var pageItemsContainer = PageItemsContainer.options.container;
            var myItems, pageItems;

            if(typeof(triple) !== 'undefined') {

                // predicate is the second element of the triple
                var predicate = triple[1];

                // if predicate is not defined
                if(typeof(predicate) === 'undefined' || predicate === "") {
                    // all items are good

                    myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                    pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                    // if predicate is a valid uri
                } else {
                    // get item predicate and check his domain
                    var itemPredicate = ItemsExchange.getItemByUri(predicate);
                    // predicate with empty domain
                    if(typeof(itemPredicate) === 'undefined' || typeof(itemPredicate.domain) === 'undefined' || itemPredicate.domain.length === 0 || itemPredicate.domain[0] === "") {
                        // all items are good
                        myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                        pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                    } else {
                        // predicate with a valid domain
                        var domain = itemPredicate.domain;

                        // get only items matching with predicate domain
                        var filter = function(item) {

                            for(var i = 0; i < domain.length; i++) {
                                for(var j = 0; j < item.type.length; j++) {
                                    if(domain[i] === item.type[j]) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };

                        myItems = ItemsExchange.getItemsFromContainerByFilter(myItemsContainer, filter);
                        pageItems = ItemsExchange.getItemsFromContainerByFilter(pageItemsContainer, filter);
                    } // end else domain defined

                } // end else predicate valid uri

            } // end if triple undefined

            showPopoverResourcePanel(target, pageItems, myItems, "", label, 'sub');
        }
        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;

    };

    var searchOnVocab = function(label, selectors, triple, caller) {

        var predicate = (triple[1] !== '' ? ItemsExchange.getItemByUri(triple[1]) : undefined);

        // if label is an empty string
        // set empty array as results for each vocab
        if(label === ''){
            for(var i=0; i<selectors.length; i++){
                (function(index) {

                    for(var t=0; t<state.popoverOptions.scope.contentTabs.length; t++){
                        if(state.popoverOptions.scope.contentTabs[t].title === selectors[index].config.label){
                            state.popoverOptions.scope.contentTabs[t].items = [];
                            state.popoverOptions.scope.contentTabs[t].isLoading = false;
                            state.popoverOptions.scope.contentTabs[t].isStarted = false;
                        }
                    }
                })(i);
            }

        // if label is a valid string
        } else {
            // for each selector...
            for(var j=0; j<selectors.length; j++){

                (function(index) {
                    // ... set loading status...
                    for(var t=0; t<state.popoverOptions.scope.contentTabs.length; t++){
                        if(state.popoverOptions.scope.contentTabs[t].title === selectors[index].config.label){
                            state.popoverOptions.scope.contentTabs[t].isLoading = true;
                            state.popoverOptions.scope.contentTabs[t].isStarted = true;
                        }
                    }
                    // ... and search label for each selector
                    selectors[index].getItems(label).then(function(){

                        // where results is done, update content for each selector
                        for(var t=0; t<state.popoverOptions.scope.contentTabs.length; t++){
                            if(state.popoverOptions.scope.contentTabs[t].title === selectors[index].config.label){
                                var container = state.popoverOptions.scope.contentTabs[t].itemsContainer + label.split(' ').join('$');
                                var itemsList = ItemsExchange.getItemsByContainer(container);

                                if (typeof(predicate) !== 'undefined'){
                                    if (caller === 'subject'){
                                        itemsList = filterSubjectItems(itemsList, predicate);
                                    } else if (caller === 'object'){
                                        itemsList = filterObjectItems(itemsList, predicate);
                                    }
                                }

                                state.popoverOptions.scope.contentTabs[t].items = itemsList;
                                // and set loading to false
                                state.popoverOptions.scope.contentTabs[t].isLoading = false;
                            }
                        }

                    });
                })(j);
            }

        }

    };

    /**
     * @ngdoc method
     * @name ResourcePanel#showItemsForObject
     * @module Pundit2.ResourcePanel
     * @function
     *
     * @description
     * Open a popover where object items are shown grouped according from their provenance ('Page items', 'My items', 'Vocabularies').
     * If URI predicate is not defined in the triple, all items will be shown.
     * If URI predicate is defined in the triple, will be shown only items whose types are compatible with predicate range
     *
     * My items are visible only if user is logged in.
     *
     * It is possible to insert a label to filter shown items and start a searching of new items in the vocabularies.
     *
     * @param {Array} triple Array of URI (for details content of this array, see {@link #!/api/Pundit2.ResourcePanel/service/ResourcePanel here})
     * @param {DOMElement} target DOM Element where to append the popover
     * @param {string} label label used to search subject in the vocabularies and filter shown Page Items and My Items
     * @return {Promise} return a promise that will be resolved when a subject is selected
     *
     */
    resourcePanel.showItemsForObject = function(triple, target, label) {

        if(typeof(target) === 'undefined'){
            target = state.popover.clickTarget;
        }

        var selectors = SelectorsManager.getActiveSelectors();
        state.popoverOptions.scope.selectors = [];

        // initialize selectors list
        angular.forEach(selectors, function(sel){
            state.popoverOptions.scope.selectors.push(sel.config.container);
        });

        if(state.popover !== null && state.popover.clickTarget === target /*&& state.popoverOptions.scope.label !== label*/){
            //state.popoverOptions.scope.vocabObjStatus = 'loading';
            $timeout.cancel(searchTimer);
            setLabelToSearch(label);
            searchTimer = $timeout(function(){
                searchOnVocab(label, selectors, triple, 'object');
            }, resourcePanel.options.vocabSearchTimer);

        } else {
            $timeout.cancel(searchTimer);

            if(typeof(label) !== 'undefined' && label !== '' /*&& state.popoverOptions.scope.label !== label*/){
                //state.popoverOptions.scope.vocabObjStatus = 'loading';
                $timeout.cancel(searchTimer);
                searchTimer = $timeout(function(){
                   searchOnVocab(label, selectors, triple, 'object');
                }, resourcePanel.options.vocabSearchTimer);
            }

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
                showPopoverResourcePanel(target, pageItems, myItems, "", label, 'obj');

            } else {
                // get item predicate and check his domain
                var itemPredicate = ItemsExchange.getItemByUri(predicate);
                // predicate with empty domain
                if(typeof(itemPredicate) === 'undefined' || typeof(itemPredicate.range) === 'undefined' || itemPredicate.range.length === 0 || itemPredicate.range[0] === ""){
                    // all items are good
                    myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                    pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                    showPopoverResourcePanel(target, pageItems, myItems, "", label, 'obj');

                // if predicate is literal, show popover literal
                } else if(itemPredicate.range.length === 1 && itemPredicate.range[0] === NameSpace.rdfs.literal){
                    resourcePanel.showPopoverLiteral( "", target);

                // if predicate is dateTime, show popover calendar
                } else if(itemPredicate.range.length === 1 && itemPredicate.range[0] === NameSpace.dateTime){
                    resourcePanel.showPopoverCalendar("", target);

                } else {
                    // predicate with a valid domain
                    var range = itemPredicate.range;

                    // get only items matching with predicate domain
                    var filter = function(item) {

                        for(var i=0; i<range.length; i++){
                            for (var j=0; j<item.type.length; j++){
                                if(range[i] === item.type[j]) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                    myItems = ItemsExchange.getItemsFromContainerByFilter(myItemsContainer, filter);
                    pageItems = ItemsExchange.getItemsFromContainerByFilter(pageItemsContainer, filter);
                    showPopoverResourcePanel(target, pageItems, myItems, "", label, 'obj');
                }

            } // end else predicate !== undefined

        } // end if triple !== undefined

    }
        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;


    };

    var objTypes,
        subTypes;

    /**
     * @ngdoc method
     * @name ResourcePanel#showProperties
     * @module Pundit2.ResourcePanel
     * @function
     *
     * @description
     * Open a popover where predicate items are shown.
     * If URI subject and object are both not defined in the triple, all predicates will be shown.
     * If only URI subject is defined in the triple, will be shown only predicates whose domain is compatible with subject types
     * If only URI object is defined in the triple, will be shown only predicates whose range is compatible with subject types
     *
     * My items are visible only if user is logged in.
     *
     * It is possible to insert a label to filter shown predicates.
     *
     * @param {Array} triple Array of URI (for details content of this array, see {@link #!/api/Pundit2.ResourcePanel/service/ResourcePanel here})
     * @param {DOMElement} target DOM Element where to append the popover
     * @param {string} label label used to search subject in the vocabularies and filter shown Page Items and My Items
     * @return {Promise} return a promise that will be resolved when a subject is selected
     *
     */
    resourcePanel.showProperties = function(triple, target, label) {

        if(typeof(target) === 'undefined'){
            target = state.popover.clickTarget;
        }

        $timeout.cancel(searchTimer);
        state.popoverOptions.scope.vocabStatus = '';
        state.popoverOptions.scope.vocab = [];

        if(state.popover !== null && state.popover.clickTarget === target){
            setLabelToSearch(label);

        } else {
            resourcePanel.hide();
            var propertiesContainer = Client.options.relationsContainer;
            var properties;
            var itemSubject;
            var itemObject;

            if(typeof(triple) !== 'undefined') {

                // subject is the first element of the triple
                var subject = triple[0];
                // object is the third element of the triple
                var object = triple[2];

                // if subject and object are both not defined
                if((typeof(subject) === 'undefined' || subject === "") && (typeof(object) === 'undefined' || object === "")) {
                    // all properties are good
                    properties = ItemsExchange.getItemsByContainer(propertiesContainer);
                    showPopoverResourcePanel(target, "", "", properties, label, 'pr');

                    // if only subject is defined
                } else if((typeof(subject) !== 'undefined' && subject !== "") && (typeof(object) === 'undefined' || object === "")) {

                    // get subject item
                    itemSubject = ItemsExchange.getItemByUri(subject);
                    // if subject item has no type
                    if(typeof(itemSubject) === 'undefined' || typeof(itemSubject.type) === 'undefined' || itemSubject.type.length === 0 || itemSubject.type[0] === "") {
                        // all properties are good
                        properties = ItemsExchange.getItemsByContainer(propertiesContainer);
                        showPopoverResourcePanel(target, "", "", properties, label, 'pr');
                    } else {
                        // predicate with a valid domain
                        subTypes = itemSubject.type;
                        properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filterByDomain);
                        showPopoverResourcePanel(target, "", "", properties, label, 'pr');
                    }

                    // if only object is defined
                } else if((typeof(object) !== 'undefined' && object !== "") && (typeof(subject) === 'undefined' || subject === "")) {
                    // get object item
                    itemObject = ItemsExchange.getItemByUri(object);
                    // if oject has no type
                    if(typeof(itemObject) === 'undefined' || typeof(itemObject.type) === 'undefined' || itemObject.type.length === 0 || itemObject.type[0] === "") {
                        // all properties are good
                        properties = ItemsExchange.getItemsByContainer(propertiesContainer);
                        showPopoverResourcePanel(target, "", "", properties, label, 'pr');
                    } else {
                        objTypes = itemObject.type;
                        properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filterByRange);
                        showPopoverResourcePanel(target, "", "", properties, label, 'pr');
                    }

                    // subject and object are both defined
                } else if((typeof(object) !== 'undefined' && object !== "") && (typeof(subject) !== 'undefined' && subject !== "")) {
                    itemObject = ItemsExchange.getItemByUri(object);
                    itemSubject = ItemsExchange.getItemByUri(subject);

                    // both subject and object have empty types
                    if((typeof(itemSubject.type) === 'undefined' || itemSubject.type.length === 0 || itemSubject.type[0] === "") && (typeof(itemObject.type) === 'undefined' || itemObject.type.length === 0 || itemObject.type[0] === "")) {
                        // all items are good
                        properties = ItemsExchange.getItemsByContainer(propertiesContainer);
                        showPopoverResourcePanel(target, "", "", properties, label, 'pr');
                    }

                    // subjecy has no type, object has valid types --> filterByRange
                    else if((typeof(itemSubject.type) === 'undefined' || itemSubject.type.length === 0 || itemSubject.type[0] === "") && (typeof(itemObject.type) !== 'undefined' && itemObject.type[0] !== "")) {
                        objTypes = itemObject.type;
                        properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filterByRange);
                        showPopoverResourcePanel(target, "", "", properties, label, 'pr');
                    }

                    // object has no type, subject has valid types --> filterByDomain
                    else if((typeof(itemSubject.type) !== 'undefined' && itemSubject.type[0] !== "") && (typeof(itemObject.type) === 'undefined' || itemObject.type.length === 0 || itemObject.type[0] === "")) {
                        subTypes = itemSubject.type;
                        properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filterByDomain);
                        showPopoverResourcePanel(target, "", "", properties, label, 'pr');
                    }

                    // both object and subject have valid types --> filterByDomainAndRange
                    else if((typeof(itemSubject.type) !== 'undefined' && itemSubject.type[0] !== "") && (typeof(itemObject.type) !== 'undefined' && itemObject.type[0] !== "")) {
                        subTypes = itemSubject.type;
                        objTypes = itemObject.type;
                        properties = ItemsExchange.getItemsFromContainerByFilter(propertiesContainer, filterByRangeAndDomain);
                        showPopoverResourcePanel(target, "", "", properties, label, 'pr');
                    }

                } // end else both subject and object are defined

            } // end triple !== undefined
        }
        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    var isTypeIncluded = function(item, list){
        for (var i in list){
            if (item.type.indexOf(list[i]) !== -1){
                return true;
            }
        }
        return false;
    };

    var filterSubjectItems = function(items, predicate) {
        var ret = [];
        if (typeof(predicate.domain) === 'undefined' || predicate.domain.length === 0){
            return items;
        }

        for (var i in items){
            if (isTypeIncluded(items[i], predicate.domain)){
                ret.push(items[i]);
            }    
        }

        return ret;
    };

    var filterObjectItems = function(items, predicate) {
        var ret = [];
        if (typeof(predicate.range) === 'undefined' || predicate.range.length === 0){
            return items;
        }

        for (var i in items){
            if (isTypeIncluded(items[i], predicate.range)){
                ret.push(items[i]);
            }    
        }

        return ret;
    };

    // get only items matching with predicate domain
    var filterByDomain = function(item) {
        if(typeof(item.domain) !== 'undefined'){

            if (item.domain.length === 0) {
                return true;
            }

            for(var i=0; i<subTypes.length; i++){
                for (var j=0; j<item.domain.length; j++){
                    if(subTypes[i] === item.domain[j]) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return false;
        }
    };

    // get only items matching with predicate domain
    var filterByRange = function(item) {
        if(typeof(item.range) !== 'undefined'){

            if (item.range.length === 0) {
                return true;
            }

            for(var i=0; i<objTypes.length; i++){
                for (var j=0; j<item.range.length; j++){
                    if(objTypes[i] === item.range[j]) {
                        return true;
                    }
                }
            }
            return false;
        } else {
            return false;
        }
    };

    // get only items matching with predicate domain and range
    var filterByRangeAndDomain = function(item) {
        var ret = filterByRange(item) && filterByDomain(item);
        return ret;
    };

    return resourcePanel;
})
    .filter('filterByLabel', function() {
        return function(input, search) {
            var results = [];
            if(typeof(search) !== 'undefined' && search !== ''){
                angular.forEach(input, function (item) {
                    var label = item.label;
                    var str = search.toLowerCase().replace(/\s+/g, ' '),
                        strParts = str.split(' '),
                        reg = new RegExp(strParts.join('.*'));

                    if (label.toLowerCase().match(reg) !== null) {
                        results.push(item);
                        return;
                    }

                });
            } else {
                results = input;
            }

            return results;

        };
    });
