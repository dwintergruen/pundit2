// TODO: this module (service, tmpl and ctrl) needs several refactoring

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
    initialCalendarDate: '',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ResourcePanel.inputIconSearch
     *
     * @description
     * `string`
     *
     * Icon shown in the search input when it's empty
     *
     * Default value:
     * <pre> inputIconSearch: 'pnd-icon-search' </pre>
     */
    inputIconSearch: 'pnd-icon-search',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ResourcePanel.inputIconClear
     *
     * @description
     * `string`
     *
     * Icon shown in the search input when it has some content
     *
     * Default value:
     * <pre> inputIconClear: 'pnd-icon-times' </pre>
     */
    inputIconClear: 'pnd-icon-times'

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
.service('ResourcePanel', function(BaseComponent, EventDispatcher, RESOURCEPANELDEFAULTS,
    ItemsExchange, MyItems, PageItemsContainer, Client, NameSpace, SelectorsManager,
    $filter, $rootScope, $popover, $q, $timeout, Preview, $window, Config, Item, Utils) {

    var resourcePanel = new BaseComponent('ResourcePanel', RESOURCEPANELDEFAULTS);

    // TODO remove obj and sub global var
    var objTypes,
        subTypes;

    var searchTimer;
    var state = {
        popover: null,
        defaultPlacement: 'bottom',
        resourcePromise: null,
        popoverOptions: {
            // scope needed to instantiate a new popover using $popover provider
            scope: $rootScope.$new(),
            trigger: 'manual'
        }
    };

    var show = function() {
        state.popover.show();
        EventDispatcher.sendEvent('ResourcePanel.toggle', true);
    };

    var hide = function() {
        if (state.popover === null) {
            return;
        }

        state.popoverOptions.scope.vocabObjRes = [];
        state.popoverOptions.scope.vocabSubRes = [];
        state.popoverOptions.scope.label = "";
        state.popover.hide();
        state.popover.destroy();
        state.popover = null;

        EventDispatcher.sendEvent('ResourcePanel.toggle', false);
    };

    var setFocus = function(selector) {
        $timeout(function() {
            angular.element(selector)[0].focus();
        });
    };

    // initialize a popover
    var initPopover = function(content, target, placement, type, contentTabs, tripleElemType) {
        var posPopMod = 0,
            valMod = 100;
        state.popoverOptions.scope.arrowLeft = '-11px';

        if (typeof(tripleElemType) !== 'undefined') {
            if (tripleElemType === 'sub') {
                posPopMod = valMod + 27;
                state.popoverOptions.scope.arrowLeft = '-' + valMod - 27 + 'px';
            } else if (tripleElemType === 'obj') {
                state.popoverOptions.scope.arrowLeft = valMod + 'px';
                posPopMod = -valMod;
            }
        }

        // initialize a calendar popover
        if (type === 'calendar') {

            state.popoverOptions.template = 'src/ResourcePanel/popoverCalendar.tmpl.html';

            if (typeof(content.date) === 'undefined' || content.date === '') {

                if (typeof(resourcePanel.options.initialCalendarDate) === 'undefined' || resourcePanel.options.initialCalendarDate === '') {
                    state.popoverOptions.scope.selectedDate = new Date().toString();
                } else {
                    state.popoverOptions.scope.selectedDate = resourcePanel.options.initialCalendarDate;
                }

            } else {
                state.popoverOptions.scope.selectedDate = content.date;
            }

            state.popoverOptions.scope.escapeEvent = function(e) {
                if (e.which === 27) {
                    e.stopPropagation();
                }
            };

            state.popoverOptions.scope.save = function() {

                state.resourcePromise.resolve(new Date(this.selectedDate));
                Preview.hideDashboardPreview();
                hide();
            };

            // close popoverCalendar popover without saving
            state.popoverOptions.scope.cancel = function() {
                Preview.hideDashboardPreview();
                hide();
            };

            // initialize a literal popover
        } else if (type === 'literal') {

            state.popoverOptions.template = 'src/ResourcePanel/popoverLiteralText.tmpl.html';

            if (typeof(content.literalText) === 'undefined') {
                state.popoverOptions.scope.literalText = '';
            } else {
                state.popoverOptions.scope.literalText = content.literalText;
            }

            state.popoverOptions.scope.escapeEvent = function(e) {
                if (e.which === 27) {
                    e.stopPropagation();
                }
            };

            // handle save a new popoverLiteral
            state.popoverOptions.scope.save = function() {
                state.resourcePromise.resolve(this.literalText);
                Preview.hideDashboardPreview();
                hide();
            };

            // close popoverLiteral popover without saving
            state.popoverOptions.scope.cancel = function() {
                Preview.hideDashboardPreview();
                hide();
            };

            // initialize a resource panel popover
        } else if (type === 'resourcePanel') {

            if (typeof(Config.korbo) !== 'undefined' && Config.korbo.active) {
                var name = $window[Config.korbo.confName].globalObjectName;
                $window[name].onSave(
                    function(obj) {
                        var options = {
                            'label': obj.label,
                            'type': obj.type
                        };

                        if (typeof(obj.description) !== 'undefined' && obj.description !== '') {
                            options.description = obj.description;
                        }

                        if (typeof(obj.image) !== 'undefined' && obj.image !== '') {
                            options.image = obj.image;
                        }

                        var item = new Item(obj.value, options);
                        state.resourcePromise.resolve(item);
                        Preview.hideDashboardPreview();
                        hide();
                    }
                );
            }

            state.popoverOptions.template = 'src/ResourcePanel/popoverResourcePanel.tmpl.html';

            state.popoverOptions.scope.originalContent = angular.copy(content);
            state.popoverOptions.scope.type = content.type;
            state.popoverOptions.scope.triple = content.triple;
            state.popoverOptions.scope.pageItems = content.pageItems;
            state.popoverOptions.scope.myItems = content.myItems;
            state.popoverOptions.scope.properties = content.properties;
            state.popoverOptions.scope.contentTabs = contentTabs;
            if (content.label !== '' && typeof(content.label) !== 'undefined') {
                setLabelToSearch(content.label);
            } else {
                state.popoverOptions.scope.label = content.label;
            }

            // T_T
            state.popoverOptions.scope.save = function(elem) {
                hide();
                Preview.hideDashboardPreview();
                state.resourcePromise.resolve(elem);
            };
            state.popoverOptions.scope.cancel = function() {
                Preview.clearItemDashboardSticky();
                Preview.hideDashboardPreview();
                hide();
            };
        }

        // common for all type of popover
        if (typeof(placement) === 'undefined' || placement === '') {
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

        if (typeof(state.anchor) === 'undefined')  {
            // create div anchor (the element bound with angular strap menu reference)
            angular.element("[data-ng-app='Pundit2']")
                .prepend("<div class='pnd-popover-anchor' style='position: absolute; left: -500px; top: -500px;'><div>");

            state.anchor = angular.element('.pnd-popover-anchor');
        }

        state.anchor.css({
            left: left + posPopMod + (w / 2),
            top: top + h
        });

        //state.popover = $popover(angular.element(target), state.popoverOptions);
        state.popover = $popover(state.anchor, state.popoverOptions);
        state.popover.posPopMod = posPopMod;

        // Open the calendar automatically
        if (type === 'calendar') {
            // Since it's a directive inside another directive, there's a couple of $digest()
            // cycles we need to wait for everything to be up and running, promises, templates
            // to get fetched, rendered etc...... using a timeout :|
            $timeout(function() {
                angular.element(state.popover.$element)
                    .find('.pnd-input-calendar')
                    .triggerHandler('click');
            }, 0.3);

        }


        state.popover.clickTarget = target;
        return state.popover;
    };

    var setLabelToSearch = function(val) {
        state.popoverOptions.scope.label = val;
        if (state.popoverOptions.scope.type === 'obj' || state.popoverOptions.scope.type === 'sub') {
            state.popoverOptions.scope.myItems = $filter('filterByLabel')(state.popoverOptions.scope.originalContent.myItems, val);
            state.popoverOptions.scope.pageItems = $filter('filterByLabel')(state.popoverOptions.scope.originalContent.pageItems, val);
        }
        if (state.popoverOptions.scope.type === 'pr') {
            state.popoverOptions.scope.properties = $filter('filterByLabel')(state.popoverOptions.scope.originalContent.properties, val);
        }

    };

    var isTypeIncluded = function(item, list) {
        for (var i in list) {
            if (item.type.indexOf(list[i]) !== -1) {
                return true;
            }
        }
        return false;
    };

    var isItemValid = function(item, property) {
        if (typeof(item) === 'undefined') {
            return false;
        } else if (item === null) {
            return false;
        } else if (typeof(property) !== 'undefined') {
            if (typeof(item[property]) === 'undefined') {
                return false;
            } else if (item[property].length === 0 || item[property][0] === '') {
                // TODO A type can be an empty string?!?!
                return false;
            }
        }
        return true;
    };

    var filterSubjectItems = function(items, predicate) {
        var ret = [];
        if (!isItemValid(predicate, 'domain')) {
            return items;
        }

        for (var i in items) {
            if (isTypeIncluded(items[i], predicate.domain)) {
                ret.push(items[i]);
            }
        }

        return ret;
    };

    var filterObjectItems = function(items, predicate) {
        var ret = [];
        if (!isItemValid(predicate, 'range')) {
            return items;
        }

        for (var i in items) {
            if (isTypeIncluded(items[i], predicate.range)) {
                ret.push(items[i]);
            }
        }

        return ret;
    };

    // show popover resource panel
    // pageItems -->  page items to show
    // myItems -->  my items to show
    // properties -->  properties to show
    var showPopoverResourcePanel = function(target, pageItems, myItems, properties, label, type, triple) {
        var content = {};
        var contentTabs = [];

        content.type = type;
        content.triple = triple;

        if (type === 'sub' || type === 'obj') {
            var pageItemsForTabs = {
                title: 'Page items',
                items: pageItems,
                module: 'Pundit2',
                isStarted: true
            };
            contentTabs.push(pageItemsForTabs);
            content.pageItems = pageItems;

            var myItemsForTabs = {
                title: 'My items',
                items: myItems,
                module: 'Pundit2',
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
            state.popover = initPopover(content, target, "", 'resourcePanel', contentTabs, type);
            state.popover.$promise.then(function() {
                show();
                setFocus('input.pnd-rsp-input');
            });
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            hide();
            state.popover = initPopover(content, target, "", 'resourcePanel', contentTabs, type); // type = element of triple
            state.popover.$promise.then(function() {
                show();
                setFocus('input.pnd-rsp-input');
            });
        } // if click a different popover, hide the shown popover and show the clicked one

    };

    var searchOnVocab = function(label, selectors, triple, caller) {

        var predicate = triple.predicate;

        // if label is an empty string
        // set empty array as results for each vocab
        if (label === '' || typeof(label) === 'undefined') {
            for (var i = 0; i < selectors.length; i++) {
                (function(index) {

                    for (var t = 0; t < state.popoverOptions.scope.contentTabs.length; t++) {
                        if (state.popoverOptions.scope.contentTabs[t].title === selectors[index].config.label) {
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
            for (var j = 0; j < selectors.length; j++) {

                (function(index) {
                    // ... set loading status...
                    for (var t = 0; t < state.popoverOptions.scope.contentTabs.length; t++) {
                        if (state.popoverOptions.scope.contentTabs[t].title === selectors[index].config.label) {
                            state.popoverOptions.scope.contentTabs[t].isLoading = true;
                            state.popoverOptions.scope.contentTabs[t].isStarted = true;
                        }
                    }
                    // ... and search label for each selector
                    selectors[index].getItems(label).then(function() {

                        // where results is done, update content for each selector
                        for (var t = 0; t < state.popoverOptions.scope.contentTabs.length; t++) {
                            if (state.popoverOptions.scope.contentTabs[t].title === selectors[index].config.label) {
                                var container = state.popoverOptions.scope.contentTabs[t].itemsContainer + label.split(' ').join('$');
                                var itemsList = ItemsExchange.getItemsByContainer(container);

                                if (predicate !== null) {
                                    if (caller === 'subject') {
                                        itemsList = filterSubjectItems(itemsList, predicate);
                                    } else if (caller === 'object') {
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

    resourcePanel.updateVocabSearch = function(label, triple, caller) {
        var selectors = SelectorsManager.getActiveSelectors();
        searchOnVocab(label, selectors, triple, caller);
        setLabelToSearch(label);
    };

    resourcePanel.updatePosition = function() {
        if (state.popover === null) {
            return;
        }

        var target = state.popover.clickTarget,
            left = target.getBoundingClientRect().left,
            top = target.getBoundingClientRect().top,
            h = angular.element(target).outerHeight(),
            w = angular.element(target).outerWidth();

        var newLeft = left + state.popover.posPopMod + (w / 2) - 200,
            newTop = top + h;

        state.popover.$element.css({
            'left': newLeft,
            'top': newTop
        });
    };

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
    resourcePanel.hide = function() {
        hide();
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
    resourcePanel.showPopoverLiteral = function(text, target) {

        var content = {};
        content.literalText = text;

        if (state.popover !== null && state.popover.clickTarget !== target) {
            hide();
            state.popover = initPopover(content, target, "", 'literal');
            state.popover.$promise.then(function() {
                show();
                setFocus('textarea.pnd-popover-literal-textarea');
            });
        }

        // if no popover is shown, just show it
        else if (state.popover === null) {
            state.popover = initPopover(content, target, "", 'literal');
            state.popover.$promise.then(function() {
                show();
                setFocus('textarea.pnd-popover-literal-textarea');
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
    resourcePanel.showPopoverCalendar = function(date, target) {
        var content = {};
        content.date = date;
        // if no popover is shown, just show it
        if (state.popover === null) {
            state.popover = initPopover(content, target, "", 'calendar');
            state.popover.$promise.then(function() {
                show();
                //$datepicker.show;
                // angular.element('input.pnd-input-calendar')[0].focus();
            });
        }

        // if click a different popover, hide the shown popover and show the clicked one
        else if (state.popover !== null && state.popover.clickTarget !== target) {
            hide();
            state.popover = initPopover("", target, "", 'calendar');
            state.popover.$promise.then(function() {
                show();
                //$datepicker.show;
                // angular.element('input.pnd-input-calendar')[0].focus();
            });
        }

        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    /**
     * @ngdoc method
     * @name ResourcePanel#showItemsForSubject
     * @module Pundit2.ResourcePanel
     * @function
     *
     * @description
     * Open a popover where subject items are shown grouped according from their provenance ('Page items', 'My items', 'Vocabularies').
     * If predicate is not defined in the triple, all items will be shown.
     * If predicate is defined in the triple, will be shown only items whose types are compatible with predicate domain
     *
     * My items are visible only if user is logged in.
     *
     * It is possible to insert a label to filter shown items and start a searching of new items in the vocabularies.
     *
     * @param {Object} triple object (for details content of this object, see {@link #!/api/Pundit2.ResourcePanel/service/ResourcePanel here})
     * @param {DOMElement} target DOM Element where to append the popover
     * @param {string} label label used to search subject in the vocabularies and filter shown Page Items and My Items
     * @return {Promise} return a promise that will be resolved when a subject is selected
     *
     */
    resourcePanel.showItemsForSubject = function(triple, target, label) {

        if (typeof(target) === 'undefined') {
            target = state.popover.clickTarget;
        }

        var selectors = SelectorsManager.getActiveSelectors();
        state.popoverOptions.scope.selectors = [];

        // initialize selectors list
        angular.forEach(selectors, function(sel) {
            state.popoverOptions.scope.selectors.push(sel.config.container);
        });

        // if showItemsForSubject is call from the same target but with different label, get a search on vocabs and filter myItems and pageItems results
        if (state.popover !== null && state.popover.clickTarget === target /*&& state.popoverOptions.scope.label !== label*/ ) {
            state.popoverOptions.scope.vocabSubStatus = 'loading';
            $timeout.cancel(searchTimer);
            setLabelToSearch(label);
            searchTimer = $timeout(function() {
                searchOnVocab(label, selectors, triple, 'subject');
            }, resourcePanel.options.vocabSearchTimer);

        } else {
            // if open a new popover and label is not empty, get a search on vocab
            if (typeof(label) !== 'undefined' && label !== '' /*&& state.popoverOptions.scope.label !== label*/ ) {
                state.popoverOptions.scope.vocabSubStatus = 'loading';
                $timeout.cancel(searchTimer);
                searchTimer = $timeout(function() {
                    searchOnVocab(label, selectors, triple, 'subject');
                }, resourcePanel.options.vocabSearchTimer);
            }

            var myItemsContainer = MyItems.options.container;
            var pageItemsContainer = PageItemsContainer.options.container;
            var myItems, pageItems;

            if (typeof(triple) !== 'undefined') {

                var predicate = triple.predicate;

                // if predicate is not defined
                if (typeof(predicate) === 'undefined' || predicate === null) {
                    // all items are good

                    myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                    pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                    // if predicate is a valid uri
                } else {
                    // get item predicate and check his domain
                    var itemPredicate = ItemsExchange.getItemByUri(predicate.uri);
                    // predicate with empty domain
                    if (typeof(itemPredicate) === 'undefined' || typeof(itemPredicate.domain) === 'undefined' || itemPredicate.domain.length === 0 || itemPredicate.domain[0] === "") {
                        // all items are good
                        myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                        pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                    } else {
                        // predicate with a valid domain
                        var domain = itemPredicate.domain;

                        // get only items matching with predicate domain
                        var filter = function(item) {

                            for (var i = 0; i < domain.length; i++) {
                                for (var j = 0; j < item.type.length; j++) {
                                    if (domain[i] === item.type[j]) {
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

            showPopoverResourcePanel(target, pageItems, myItems, "", label, 'sub', triple);
        }
        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;

    };

    /**
     * @ngdoc method
     * @name ResourcePanel#showItemsForObject
     * @module Pundit2.ResourcePanel
     * @function
     *
     * @description
     * Open a popover where object items are shown grouped according from their provenance ('Page items', 'My items', 'Vocabularies').
     * If predicate is not defined in the triple, all items will be shown.
     * If predicate is defined in the triple, will be shown only items whose types are compatible with predicate range
     *
     * My items are visible only if user is logged in.
     *
     * It is possible to insert a label to filter shown items and start a searching of new items in the vocabularies.
     *
     * @param {Object} triple object (for details content of this object, see {@link #!/api/Pundit2.ResourcePanel/service/ResourcePanel here})
     * @param {DOMElement} target DOM Element where to append the popover
     * @param {string} label label used to search subject in the vocabularies and filter shown Page Items and My Items
     * @return {Promise} return a promise that will be resolved when a subject is selected
     *
     */
    resourcePanel.showItemsForObject = function(triple, target, label) {

        if (typeof(target) === 'undefined') {
            target = state.popover.clickTarget;
        }

        var selectors = SelectorsManager.getActiveSelectors();
        state.popoverOptions.scope.selectors = [];

        // initialize selectors list
        angular.forEach(selectors, function(sel) {
            state.popoverOptions.scope.selectors.push(sel.config.container);
        });

        if (state.popover !== null && state.popover.clickTarget === target /*&& state.popoverOptions.scope.label !== label*/ ) {
            //state.popoverOptions.scope.vocabObjStatus = 'loading';
            $timeout.cancel(searchTimer);
            setLabelToSearch(label);
            searchTimer = $timeout(function() {
                searchOnVocab(label, selectors, triple, 'object');
            }, resourcePanel.options.vocabSearchTimer);

        } else {
            $timeout.cancel(searchTimer);

            if (typeof(label) !== 'undefined' && label !== '' /*&& state.popoverOptions.scope.label !== label*/ ) {
                //state.popoverOptions.scope.vocabObjStatus = 'loading';
                $timeout.cancel(searchTimer);
                searchTimer = $timeout(function() {
                    searchOnVocab(label, selectors, triple, 'object');
                }, resourcePanel.options.vocabSearchTimer);
            }

            var myItemsContainer = MyItems.options.container;
            var pageItemsContainer = PageItemsContainer.options.container;
            var myItems, pageItems;

            if (typeof(triple) !== 'undefined') {

                var predicate = triple.predicate;

                // if predicate is not defined
                if (typeof(predicate) === 'undefined' || predicate === null) {
                    // all items are good
                    myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                    pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                    showPopoverResourcePanel(target, pageItems, myItems, "", label, 'obj', triple);

                } else {
                    // get item predicate and check his domain
                    var itemPredicate = ItemsExchange.getItemByUri(predicate.uri);
                    // predicate with empty domain
                    if (typeof(itemPredicate) === 'undefined' || typeof(itemPredicate.range) === 'undefined' || itemPredicate.range.length === 0 || itemPredicate.range[0] === "") {
                        // all items are good
                        myItems = ItemsExchange.getItemsByContainer(myItemsContainer);
                        pageItems = ItemsExchange.getItemsByContainer(pageItemsContainer);
                        showPopoverResourcePanel(target, pageItems, myItems, "", label, 'obj', triple);

                        // if predicate is literal, show popover literal
                    } else if (itemPredicate.range.length === 1 && itemPredicate.range[0] === NameSpace.rdfs.literal) {
                        resourcePanel.showPopoverLiteral("", target);

                        // if predicate is dateTime, show popover calendar
                    } else if (itemPredicate.range.length === 1 && itemPredicate.range[0] === NameSpace.dateTime) {
                        resourcePanel.showPopoverCalendar("", target);

                    } else {
                        // predicate with a valid domain
                        var range = itemPredicate.range;

                        // get only items matching with predicate domain
                        var filter = function(item) {

                            for (var i = 0; i < range.length; i++) {
                                for (var j = 0; j < item.type.length; j++) {
                                    if (range[i] === item.type[j]) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };

                        myItems = ItemsExchange.getItemsFromContainerByFilter(myItemsContainer, filter);
                        pageItems = ItemsExchange.getItemsFromContainerByFilter(pageItemsContainer, filter);
                        showPopoverResourcePanel(target, pageItems, myItems, "", label, 'obj', triple);
                    }

                } // end else predicate !== undefined

            } // end if triple !== undefined

        }
        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    /**
     * @ngdoc method
     * @name ResourcePanel#showProperties
     * @module Pundit2.ResourcePanel
     * @function
     *
     * @description
     * Open a popover where predicate items are shown.
     * If subject and object are both not defined in the triple, all predicates will be shown.
     * If only subject is defined in the triple, will be shown only predicates whose domain is compatible with subject types
     * If only object is defined in the triple, will be shown only predicates whose range is compatible with subject types
     *
     * My items are visible only if user is logged in.
     *
     * It is possible to insert a label to filter shown predicates.
     *
     * @param {Object} triple object (for details content of this object, see {@link #!/api/Pundit2.ResourcePanel/service/ResourcePanel here})
     * @param {DOMElement} target DOM Element where to append the popover
     * @param {string} label label used to search subject in the vocabularies and filter shown Page Items and My Items
     * @return {Promise} return a promise that will be resolved when a subject is selected
     *
     */
    resourcePanel.showProperties = function(triple, target, label) {

        if (typeof(target) === 'undefined') {
            target = state.popover.clickTarget;
        }

        $timeout.cancel(searchTimer);
        state.popoverOptions.scope.vocabStatus = '';
        state.popoverOptions.scope.vocab = [];

        if (state.popover !== null && state.popover.clickTarget === target) {
            setLabelToSearch(label);

        } else {
            hide();
            var propertiesContainer = Client.options.relationsContainer;
            var properties;

            // TODO Add some comments
            if (typeof(triple) !== 'undefined') {

                var subject = triple.subject;
                var object = triple.object;

                properties = ItemsExchange.getItemsByContainer(propertiesContainer);

                if (isItemValid(subject, 'type')) {
                    subTypes = subject.type;
                    properties = $filter('filterByTypes')(properties, 'domain', subTypes);
                }

                if (isItemValid(object)) {
                    objTypes = [];

                    // TODO: add full date support
                    if (isItemValid(object, 'type')) {
                        objTypes = object.type;
                    } else if (Utils.isValidDate(object)) {
                        objTypes = [NameSpace.dateTime];
                    } else if (typeof(object) === 'string') {
                        objTypes = [NameSpace.rdfs.literal];
                    }

                    properties = $filter('filterByTypes')(properties, 'range', objTypes);
                }

                if (typeof(properties) !== 'undefined' && properties.length > 0) {
                    showPopoverResourcePanel(target, "", "", properties, label, 'pr', triple);
                } else {
                    // TODO Show error? 
                    showPopoverResourcePanel(target, "", "", [], label, 'pr', triple);
                }

            } // end triple !== undefined
        }
        state.resourcePromise = $q.defer();
        return state.resourcePromise.promise;
    };

    EventDispatcher.addListener('TripleComposer.statementChange', function() {
        hide();
    });

    EventDispatcher.addListener('TripleComposer.reset', function() {
        hide();
    });

    return resourcePanel;
});