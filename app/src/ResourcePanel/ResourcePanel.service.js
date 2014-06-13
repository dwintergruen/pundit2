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
    initialCalendarDate: '1900-1-01'
})
.service('ResourcePanel', function(BaseComponent, RESOURCEPANELDEFAULTS,
                                   ItemsExchange, MyItems, PageItemsContainer, Client, NameSpace, SelectorsManager,
                                   $filter, $rootScope, $popover, $q, $timeout, $datepicker) {

    var resourcePanel = new BaseComponent('ResourcePanel', RESOURCEPANELDEFAULTS);
    var state = {};

    state.popover = null;
    state.defaultPlacement = 'bottom';
    state.resourcePromise = null;

    // hide and destroy a popover
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
    var initPopover = function(content, target, placement, type){

        // initialize a calendar popover
        if(type === 'calendar') {

            state.popoverOptions.template = 'src/ResourcePanel/popoverCalendar.tmpl.html';

            if(typeof(content.date) === 'undefined' || content.date === '') {

                if(typeof(resourcePanel.options.initialCalendarDate) === 'undefined' || resourcePanel.options.initialCalendarDate === ''){
                    state.popoverOptions.scope.selectedDate = '';
                } else {
                    state.popoverOptions.scope.selectedDate = resourcePanel.options.initialCalendarDate;
                }

            } else {
                state.popoverOptions.scope.selectedDate = content.date;
            }

            state.popoverOptions.scope.save = function() {
                state.resourcePromise.resolve(this.selectedDate);
                resourcePanel.hide();
            };

            // close popoverLiteral popover without saving
            state.popoverOptions.scope.cancel = function() {
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
                resourcePanel.hide();
            };

            // close popoverLiteral popover without saving
            state.popoverOptions.scope.cancel = function() {
                resourcePanel.hide();
            };

            // initialize a resource panel popover
        } else if(type === 'resourcePanel'){

            state.popoverOptions.template = 'src/ResourcePanel/popoverResourcePanel.tmpl.html';

            state.popoverOptions.scope.originalContent = angular.copy(content);
            state.popoverOptions.scope.type = content.type;
            state.popoverOptions.scope.pageItems = content.pageItems;
            state.popoverOptions.scope.myItems = content.myItems;
            state.popoverOptions.scope.properties = content.properties;
            if(content.label !== '' && typeof(content.label) !== 'undefined'){
                setLabelToSearch(content.label);
            } else {
                state.popoverOptions.scope.label = content.label;
            }

            // handle save a new popoverLiteral
            state.popoverOptions.scope.save = function(elem) {
                resourcePanel.hide();
                state.resourcePromise.resolve(elem);
            };

            // close popoverLiteral popover without saving
            state.popoverOptions.scope.cancel = function() {
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
        //state.popoverOptions.container = "[data-ng-app='Pundit2']";
        state.popover = $popover(angular.element(target), state.popoverOptions);

        // Open the calendar automatically
        if (type === 'calendar') {
            // Since it's a directive inside another directive, there's a couple of $digest()
            // cycles we need to wait for everything to be up and running, promises, templates
            // to get fetched, rendered etc...... using a timeout :|
            $timeout(function() {
                angular.element(state.popover.$element)
                    .find('.pnd-input-calendar')
                    .triggerHandler('focus');
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


    // show popover literal
    // x,y --> coordinate where popover will be shown
    // text --> text to show in textarea
    // target -->  targer element clicked
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

    // show popover calendar
    // x,y --> coordinate where popover will be shown
    // date --> date to show in calendar
    // target -->  targer element clicked
    resourcePanel.showPopoverCalendar = function(date, target){
        var content = {};
        content.date = date;
        // if no popover is shown, just show it
        if (state.popover === null) {
            state.popover = initPopover(content, target, "", 'calendar');
            state.popover.$promise.then(function() {
                state.popover.show();
                $datepicker.show;
                angular.element('input.pnd-input-calendar')[0].focus();
            });
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopover( "", target, "", 'calendar');
            state.popover.$promise.then(function() {
                state.popover.show();
                $datepicker.show;
                angular.element('input.pnd-input-calendar')[0].focus();
            });
        }

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    // show popover resource panel
    // date --> date to show in calendar
    // pageItems -->  page items to show
    // myItems -->  my items to show
    // properties -->  properties to show
    var showPopoverResourcePanel = function(target, pageItems, myItems, properties, label, type){
        var content = {};
        content.type = type;
        if(type === 'sub' || type === 'obj'){
            content.pageItems = pageItems;
            content.myItems = myItems;
            content.properties = null;
        }
        if (type === 'pr') {
            content.properties = properties;
            content.pageItems = null;
            content.myItems = null;
        }

        content.label = label;
        // if no popover is shown, just show it
        if (state.popover === null) {
            state.popover = initPopover(content, target, "", 'resourcePanel');
            state.popover.$promise.then(state.popover.show);
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            resourcePanel.hide();
            state.popover = initPopover(content, target, "", 'resourcePanel');
            state.popover.$promise.then(state.popover.show);
        } // if click a different popover, hide the shown popover and show the clicked one

    };

        var searchTimer;

    // triple is an array of URI [subject, predicate, object]
    // show all items compatibile as subject
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
        if(state.popover !== null && state.popover.clickTarget === target && state.popoverOptions.scope.label !== label){
            state.popoverOptions.scope.vocabSubStatus = 'loading';
            $timeout.cancel(searchTimer);
            setLabelToSearch(label);
            searchTimer = $timeout(function(){
                searchOnVocab(label, selectors);
            }, resourcePanel.options.vocabSearchTimer);

        } else {
            // if open a new popover and label is not empty, get a search on vocab
            if(typeof(label) !== 'undefined' && label !== '' && state.popoverOptions.scope.label !== label){
                state.popoverOptions.scope.vocabSubStatus = 'loading';
                $timeout.cancel(searchTimer);
                searchTimer = $timeout(function(){
                    searchOnVocab(label, selectors);
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

    var searchOnVocab = function(label, selectors) {
        var vocabObjResultEmpty = true,
            vocabSubResultEmpty = true,
            noFound = true;

        if(label === ''){
            if(state.popoverOptions.scope.type === 'sub'){
                state.popoverOptions.scope.vocabSubStatus = 'done';
                state.popoverOptions.scope.vocabSubRes = [];
            }
            if(state.popoverOptions.scope.type === 'obj'){
                state.popoverOptions.scope.vocabObjStatus = 'done';
                state.popoverOptions.scope.vocabObjRes = [];
            }

        } else {
            var res = [];

            SelectorsManager.getItems(label).then(function() {
                angular.forEach(selectors, function(sel){
                    res[sel.config.container] = ItemsExchange.getItemsByContainer(sel.config.container);
                    if(res[sel.config.container].length >0){
                        noFound = false;
                    }
                });
                if(state.popoverOptions.scope.type === 'sub'){
                    state.popoverOptions.scope.vocabSubStatus = 'done';
                    state.popoverOptions.scope.vocabSubRes = res;
                    state.popoverOptions.scope.vocabSubResEmpty = noFound;
                }
                if(state.popoverOptions.scope.type === 'obj'){
                    state.popoverOptions.scope.vocabObjStatus = 'done';
                    state.popoverOptions.scope.vocabObjRes = res;
                    state.popoverOptions.scope.vocabObjResEmpty = noFound;

                }

            });



        }

    }

    // triple is an array of URI [subject, predicate, object]
    // show all items compatibile as object
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

        if(state.popover !== null && state.popover.clickTarget === target && state.popoverOptions.scope.label !== label){
            state.popoverOptions.scope.vocabObjStatus = 'loading';
            $timeout.cancel(searchTimer);
            setLabelToSearch(label);
            searchTimer = $timeout(function(){
                searchOnVocab(label, selectors);
            }, resourcePanel.options.vocabSearchTimer);

        } else {
            $timeout.cancel(searchTimer);

            if(typeof(label) !== 'undefined' && label !== '' && state.popoverOptions.scope.label !== label){
                state.popoverOptions.scope.vocabObjStatus = 'loading';
                $timeout.cancel(searchTimer);
                searchTimer = $timeout(function(){
                   searchOnVocab(label, selectors);
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

    // show only properties
    // will be executed for predicates
    resourcePanel.showProperties = function(triple, target, label) {

        if(typeof(target) === 'undefined'){
            target = state.popover.clickTarget;
        }

        $timeout.cancel(searchTimer);
        state.popoverOptions.scope.vocabStatus = '';
        state.popoverOptions.scope.vocab = [];

        if(state.popover !== null && state.popover.clickTarget === target && state.popoverOptions.scope.label !== label){
            setLabelToSearch(label);

        } else {
            resourcePanel.hide();
            var propertiesContainer = Client.options.relationsContainer;
            var properties;

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
                    var itemSubject = ItemsExchange.getItemByUri(subject);
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
                    var itemObject = ItemsExchange.getItemByUri(object);
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
                    var itemObject = ItemsExchange.getItemByUri(object);
                    var itemSubject = ItemsExchange.getItemByUri(subject);

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

    // get only items matching with predicate domain
    var filterByDomain = function(item) {
        if(typeof(item.domain) !== 'undefined'){
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
