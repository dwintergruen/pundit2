angular.module('Pundit2.AnnotationSidebar')

.constant('ANNOTATIONSIDEBARDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar
     *
     * @description
     * `object`
     *
     * Configuration object for AnnotationSidebar module. By default,
     * AnnotationSidebar directive is collapsed and can be expanded. It
     * also contains filters that can be used to show or hide annotations.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.isAnnotationSidebarExpanded
     *
     * @description
     * `boolean`
     *
     * Initial state of the sidebar, expanded or collapsed
     *
     * Default value:
     * <pre> isAnnotationSidebarExpanded: 'false' </pre>
     */
    isAnnotationSidebarExpanded: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.isFiltersShowed
     *
     * @description
     * `boolean`
     *
     * Initial state of the list of the filers, shown or hidden
     *
     * Default value:
     * <pre> isFiltersShowed: 'false' </pre>
     */
    isFiltersShowed: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.annotationsRefresh
     *
     * @description
     * `number`
     *
     * Delay in ms for the refresh of the annotations
     *
     * Default value:
     * <pre> annotationsRefresh: 300 </pre>
     */
    annotationsRefresh: 300,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.bodyClass
     *
     * @description
     * `string`
     *
     * Class added to the body when there is the sidebar in the page
     *
     * Default value:
     * <pre> bodyClass: 'pnd-annotation-sidebar-active' </pre>
     */
    bodyClass: 'pnd-annotation-sidebar-active',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.bodyExpandedClass
     *
     * @description
     * `string`
     *
     * Class added to the body when the sidebar is expanded
     *
     * Default value:
     * <pre> bodyExpandedClass: 'pnd-annotation-sidebar-expanded' </pre>
     */
    bodyExpandedClass: 'pnd-annotation-sidebar-expanded',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.bodyCollapsedClass
     *
     * @description
     * `string`
     *
     * Class added to the body when the sidebar is collpsed
     *
     * Default value:
     * <pre> bodyCollapsedClass: 'pnd-annotation-sidebar-collapsed' </pre>
     */
    bodyCollapsedClass: 'pnd-annotation-sidebar-collapsed',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.sidebarExpandedClass
     *
     * @description
     * `string`
     *
     * Class added to the sidebar when it is expanded
     *
     * Default value:
     * <pre> sidebarExpandedClass: pnd-annotation-sidebar-expanded' </pre>
     */
    sidebarExpandedClass: 'pnd-annotation-sidebar-expanded',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.sidebarCollapsedClass
     *
     * @description
     * `string`
     *
     * Class added to the sidebar when it is collapsed
     *
     * Default value:
     * <pre> sidebarCollapsedClass: 'pnd-annotation-sidebar-collapsed' </pre>
     */
    sidebarCollapsedClass: 'pnd-annotation-sidebar-collapsed',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.inputIconSearch
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
     * @name modules#AnnotationSidebar.inputIconFilter
     *
     * @description
     * `string`
     *
     * Icon shown in the filter input when it's empty
     *
     * Default value:
     * <pre> inputIconFilter: 'pnd-icon-filter' </pre>
     */
    inputIconFilter: 'pnd-icon-filter',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.inputIconClear
     *
     * @description
     * `string`
     *
     * Icon shown in the search input when it has some content
     *
     * Default value:
     * <pre> inputIconClear: 'pnd-icon-times' </pre>
     */
    inputIconClear: 'pnd-icon-times',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.annotationsPanelActive
     *
     * @description
     * `boolean`
     *
     * Panel active by default when opening the sidebar
     *
     * Default value:
     * <pre> annotationsPanelActive: 'true' </pre>
     */
    annotationsPanelActive: true,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.suggestionsPanelActive
     *
     * @description
     * `boolean`
     *
     * Panel active by default when opening the sidebar
     *
     * Default value:
     * <pre> suggestionsPanelActive: 'false' </pre>
     */
    suggestionsPanelActive: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.annotationHeigth
     *
     * @description
     * `number`
     *
     * The height of the annotations in the sidebar for positioning
     *
     * Default value:
     * <pre> annotationHeigth: 25 </pre>
     */
    annotationHeigth: 25,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.startTop
     *
     * @description
     * `number`
     *
     * First top position of annotations in the sidebar
     *
     * Default value:
     * <pre> startTop: 55 </pre>
     */
    startTop: 55,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.clientDomTemplate
     *
     * @description
     * `string`
     *
     * The Client will append the content of this template to the DOM to bootstrap this component
     *
     * Default value:
     * <pre> clientDomTemplate: 'src/AnnotationSidebar/ClientAnnotationSidebar.tmpl.html' </pre>
     */
    clientDomTemplate: 'src/AnnotationSidebar/ClientAnnotationSidebar.tmpl.html',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationSidebar.debug
     *
     * @description
     * `boolean`
     *
     * Active debug log
     *
     * Default value:
     * <pre> debug: false </pre>
     */
    debug: false
})

.service('AnnotationSidebar', function(ANNOTATIONSIDEBARDEFAULTS, $rootScope, $filter, $timeout,
    BaseComponent, EventDispatcher, AnnotationsExchange, Annomatic, Consolidation, Dashboard,
    ItemsExchange, NotebookExchange, TypesHelper, TextFragmentAnnotator, XpointersHelper, Analytics) {

    var annotationSidebar = new BaseComponent('AnnotationSidebar', ANNOTATIONSIDEBARDEFAULTS);

    var state = {
        isSidebarExpanded: annotationSidebar.options.isAnnotationSidebarExpanded,
        isFiltersExpanded: annotationSidebar.options.isFiltersShowed,
        isLoading: false,
        allAnnotations: [],
        filteredAnnotations: [],
        isAnnotationsPanelActive: annotationSidebar.options.annotationsPanelActive,
        isSuggestionsPanelActive: annotationSidebar.options.suggestionsPanelActive
    };

    // Contains the list of elements relating to the annotations on the page
    var elementsList = {
        annotationsDate: [],
        authors: {},
        notebooks: {},
        entities: {},
        predicates: {},
        types: {}
    };

    // TODO: take startPosition from element in sidebar
    // TODO: take toolbar height from service
    var startPosition = annotationSidebar.options.startTop;
    var toolbarHeight = 30;
    var annotationPosition = [];

    // var timeoutPromise;

    annotationSidebar.minHeightRequired = startPosition;

    // Contains the values ​​of active filters
    annotationSidebar.filters = {
        freeText: {
            filterName: 'freeText',
            filterLabel: 'Free text',
            expression: ''
        },
        authors: {
            filterName: 'authors',
            filterLabel: 'Author',
            expression: []
        },
        notebooks: {
            filterName: 'notebooks',
            filterLabel: 'Notebooks',
            expression: []
        },
        fromDate: {
            filterName: 'fromDate',
            filterLabel: 'From date',
            expression: ''
        },
        toDate: {
            filterName: 'toDate',
            filterLabel: 'To date',
            expression: ''
        },
        predicates: {
            filterName: 'predicates',
            filterLabel: 'Predicates',
            expression: []
        },
        entities: {
            filterName: 'entities',
            filterLabel: 'Entities',
            expression: []
        },
        types: {
            filterName: 'types',
            filterLabel: 'Types',
            expression: []
        },
        broken: {
            filterName: 'broken',
            filterLabel: 'Broken',
            expression: ''
        }

    };

    annotationSidebar.filtersCount = {};
    annotationSidebar.annotationPositionReal = {};

    var filterCountIncrement = function(uri) {
        if (typeof(annotationSidebar.filtersCount[uri]) === 'undefined') {
            annotationSidebar.filtersCount[uri] = 1;
        } else {
            annotationSidebar.filtersCount[uri] ++;
        }
        return annotationSidebar.filtersCount[uri];
    };

    var filtersCount = function(annotations) {

        annotationSidebar.filtersCount = {};

        angular.forEach(elementsList, function(element) {
            for (var key in element) {
                if (typeof(element[key]) !== 'undefined') {
                    element[key].count = 0;
                    element[key].partial = 0;
                }
            }
        });

        angular.forEach(annotations, function(annotation) {

            var uriList = {};
            var tempCount;

            // Annotation authors
            tempCount = filterCountIncrement(annotation.creator);
            elementsList.authors[annotation.creator].count = tempCount;
            elementsList.authors[annotation.creator].partial = tempCount;

            // Notebooks
            tempCount = filterCountIncrement(annotation.isIncludedIn);
            elementsList.notebooks[annotation.isIncludedInUri].count = tempCount;
            elementsList.notebooks[annotation.isIncludedInUri].partial = tempCount;

            // Predicates
            angular.forEach(annotation.predicates, function(predicateUri) {
                if (typeof(uriList[predicateUri]) === 'undefined') {
                    uriList[predicateUri] = {
                        uri: predicateUri
                    };
                    tempCount = filterCountIncrement(predicateUri);
                    elementsList.predicates[predicateUri].count = tempCount;
                    elementsList.predicates[predicateUri].partial = tempCount;
                }
            });

            // Entities
            angular.forEach(annotation.entities, function(entUri) {
                if (typeof(uriList[entUri]) === 'undefined') {
                    uriList[entUri] = {
                        uri: entUri
                    };
                    tempCount = filterCountIncrement(entUri);
                    elementsList.entities[entUri].count = tempCount;
                    elementsList.entities[entUri].partial = tempCount;
                }
            });

            // Types
            angular.forEach(annotation.items, function(singleItem) {
                angular.forEach(singleItem.type, function(typeUri) {
                    if (typeof(uriList[typeUri]) === 'undefined') {
                        uriList[typeUri] = {
                            uri: typeUri
                        };
                        tempCount = filterCountIncrement(typeUri);
                        elementsList.types[typeUri].count = tempCount;
                        elementsList.types[typeUri].partial = tempCount;
                    }
                });
            });
        });
    };

    var filtersCountPartial = function(annotations, elementName, overwrite) {
        annotationSidebar.filtersCount = {};

        if (overwrite) {
            for (var key in elementsList[elementName]) {
                if (typeof(elementsList[elementName][key]) !== 'undefined') {
                    elementsList[elementName][key].partial = 0;
                }
            }
        } else {
            for (var name in elementsList) {
                if (name !== elementName) {
                    for (var key2 in elementsList[name]) {
                        if (typeof(elementsList[name][key2]) !== 'undefined') {
                            elementsList[name][key2].partial = 0;
                        }
                    }
                }
            }
        }

        angular.forEach(annotations, function(annotation) {

            var uriList = {};

            // Annotation authors
            if ((elementName !== 'authors' && !overwrite) || (elementName === 'authors' && overwrite)) {
                elementsList.authors[annotation.creator].partial = filterCountIncrement(annotation.creator);
            }

            // Notebooks
            if ((elementName !== 'notebooks' && !overwrite) || (elementName === 'notebooks' && overwrite)) {
                elementsList.notebooks[annotation.isIncludedInUri].partial = filterCountIncrement(annotation.isIncludedIn);
            }

            // Predicates
            if ((elementName !== 'predicates' && !overwrite) || (elementName === 'predicates' && overwrite)) {
                angular.forEach(annotation.predicates, function(predicateUri) {
                    if (typeof(uriList[predicateUri]) === 'undefined') {
                        uriList[predicateUri] = {
                            uri: predicateUri
                        };
                        elementsList.predicates[predicateUri].partial = filterCountIncrement(predicateUri);
                    }
                });
            }

            // Entities
            if ((elementName !== 'entities' && !overwrite) || (elementName === 'entities' && overwrite)) {
                angular.forEach(annotation.entities, function(entUri) {
                    if (typeof(uriList[entUri]) === 'undefined') {
                        uriList[entUri] = {
                            uri: entUri
                        };
                        elementsList.entities[entUri].partial = filterCountIncrement(entUri);
                    }
                });
            }

            // Types
            if ((elementName !== 'types' && !overwrite) || (elementName === 'types' && overwrite)) {
                angular.forEach(annotation.items, function(singleItem) {
                    angular.forEach(singleItem.type, function(typeUri) {
                        if (typeof(uriList[typeUri]) === 'undefined') {
                            uriList[typeUri] = {
                                uri: typeUri
                            };
                            elementsList.types[typeUri].partial = filterCountIncrement(typeUri);
                        }
                    });
                });
            }
        });
    };

    var orderAndSetPos = function(optId, optHeight) {
        var pos;
        var currentTop,
            currentIndex;

        startPosition = annotationSidebar.options.startTop;
        annotationSidebar.annotationPositionReal = {};

        if (typeof(optId) !== 'undefined' && typeof(optHeight) === 'number') {
            currentIndex = annotationPosition.map(function(e) {
                return e.id;
            }).indexOf(optId);
            if (currentIndex !== -1) {
                annotationPosition[currentIndex].height = optHeight;
            }
        } else {
            annotationPosition.sort(function(a, b) {
                return a.top - b.top;
            });
        }



        pos = annotationPosition;
        for (var ann in pos) {
            annotationSidebar.annotationPositionReal[pos[ann].id] = {
                id: pos[ann].id,
                top: pos[ann].top,
                height: pos[ann].height,
                broken: pos[ann].broken
            };

            currentTop = pos[ann].top;

            if (currentTop > startPosition) {
                annotationSidebar.annotationPositionReal[pos[ann].id].top = currentTop;
                startPosition = currentTop + pos[ann].height;
            } else {
                annotationSidebar.annotationPositionReal[pos[ann].id].top = startPosition;
                startPosition += pos[ann].height;
            }
        }

        annotationSidebar.minHeightRequired = startPosition + annotationSidebar.options.annotationHeigth;
    };

    var findFirstConsolidateItem = function(currentAnnotation) {
        var graph = currentAnnotation.graph;
        var list;
        var currentItem;
        var objectValue;
        var objectType;

        for (var subject in graph) {
            currentItem = ItemsExchange.getItemByUri(subject);
            if (currentItem.isTextFragment() || currentItem.isImageFragment() || currentItem.isImage() || currentItem.isWebPage()) {
                if (Consolidation.isConsolidated(currentItem)) {
                    return subject;
                }
            }

            for (var predicate in graph[subject]) {

                list = graph[subject][predicate];
                for (var object in list) {
                    objectValue = list[object].value;
                    objectType = list[object].type;

                    if (objectType === 'uri') {
                        currentItem = ItemsExchange.getItemByUri(objectValue);
                        if (currentItem.isTextFragment() || currentItem.isImageFragment() || currentItem.isImage() || currentItem.isWebPage()) {
                            if (Consolidation.isConsolidated(currentItem)) {
                                return objectValue;
                            }
                        }
                    }
                }
            }
        }
    };

    var setAnnotationsPosition = function(optId, optHeight) {

        var annotations = (annotationSidebar.needToFilter() ? state.filteredAnnotations : state.allAnnotations);
        var optCheck = false;
        var annotationHeigth = 0;
        var dashboardHeight;

        if (Dashboard.isDashboardVisible()) {
            dashboardHeight = Dashboard.getContainerHeight();
        } else {
            dashboardHeight = 0;
        }

        if (annotations.length > 0) {
            startPosition = annotationSidebar.options.startTop;
            annotationPosition = [];

            if (typeof(optId) !== 'undefined' && typeof(optHeight) === 'number') {
                optCheck = true;
            }

            angular.forEach(annotations, function(annotation) {
                // var graph = annotation.graph;
                var firstValidUri;
                var currentItem;
                // var currentId;

                var currentFragment;

                firstValidUri = findFirstConsolidateItem(annotation);

                if (typeof(firstValidUri) === 'undefined') {
                    annotationHeigth = annotationSidebar.options.annotationHeigth;
                    if (optCheck && optId === annotation.id) {
                        annotationHeigth = optHeight;
                    }

                    annotationPosition.push({
                        id: annotation.id,
                        top: -3,
                        height: annotationHeigth,
                        broken: true
                    });
                } else {
                    var top, imgRef, fragRef, xpathTemp;
                    currentItem = ItemsExchange.getItemByUri(firstValidUri);

                    if (currentItem.isTextFragment()) {
                        top = -1;
                        currentFragment = TextFragmentAnnotator.getFragmentIdByUri(firstValidUri);
                        fragRef = angular.element('.' + currentFragment);

                        if (typeof(currentFragment) !== 'undefined' && typeof(fragRef.offset()) !== 'undefined') {
                            top = fragRef.offset().top - toolbarHeight - dashboardHeight;
                            // annotationSidebar.log("curr fr "+currentFragment + " alt "+ angular.element('.'+currentFragment).offset().top );
                        } else {
                            annotationSidebar.log("Something wrong with the fragments of this annotation: ", annotation);
                        }
                    } else if (currentItem.isImage()) {
                        // TODO: add icon during the consolidation and get the top of the specific image
                        // console.log("img ? ", currentItem);
                        top = -1;
                        xpathTemp = XpointersHelper.xPointerToXPath(currentItem.uri);
                        imgRef = angular.element(xpathTemp.startNode.firstElementChild);

                        if (typeof(imgRef.offset()) !== 'undefined') {
                            top = imgRef.offset().top - toolbarHeight - dashboardHeight;
                        }
                    } else if (currentItem.isImageFragment()) {
                        top = -1;
                        xpathTemp = XpointersHelper.xPointerToXPath(currentItem.parentItemXP);
                        imgRef = angular.element(xpathTemp.startNode.firstElementChild);

                        if (typeof(imgRef.offset()) !== 'undefined') {
                            top = imgRef.offset().top - toolbarHeight - dashboardHeight;
                        }
                    } else if (currentItem.isWebPage()) {
                        top = -2;
                    }

                    annotationHeigth = annotationSidebar.options.annotationHeigth;
                    if (optCheck && optId === annotation.id) {
                        annotationHeigth = optHeight;
                    }
                    annotationPosition.push({
                        id: annotation.id,
                        top: top,
                        height: annotationHeigth,
                        broken: false
                    });
                }
            });
            orderAndSetPos();
        }
    };

    var setBrokenInfo = function() {
        for (var i in state.allAnnotations) {
            state.allAnnotations[i].broken = state.allAnnotations[i].isBroken();
        }
    };

    var setAnnotationInPage = function(annotations) {
        var currentItem;
        TextFragmentAnnotator.hideAll();
        angular.forEach(annotations, function(annotation) {
            for (var itemUri in annotation.items) {
                if (annotation.predicates.indexOf(itemUri) === -1) {
                    currentItem = ItemsExchange.getItemByUri(itemUri);
                    if (Consolidation.isConsolidated(currentItem)) {
                        TextFragmentAnnotator.showByUri(currentItem.uri);
                    }
                }
            }
        });
    };

    // Updates the list of filters when new annotations comes
    var setFilterElements = function(annotations) {
        annotationSidebar.filtersCount = {};

        angular.forEach(annotations, function(annotation) {

            var uriList = {};

            // Annotation authors
            if (typeof(elementsList.authors[annotation.creator]) === 'undefined') {
                elementsList.authors[annotation.creator] = {
                    uri: annotation.creator,
                    label: annotation.creatorName,
                    active: false,
                    count: 0
                };
            }

            // Annotation date
            if (elementsList.annotationsDate.indexOf(annotation.created) === -1) {
                elementsList.annotationsDate.push(annotation.created);
            }

            // Annotation notebook
            var notebookId = annotation.isIncludedIn;
            var notebookUri = annotation.isIncludedInUri;
            if (typeof(elementsList.notebooks[notebookUri]) === 'undefined') {
                var notebookName = "Downloading in progress";
                var cancelWatchNotebookName = $rootScope.$watch(function() {
                    return NotebookExchange.getNotebookById(notebookId);
                }, function(nb) {
                    if (typeof(nb) !== 'undefined') {
                        notebookName = nb.label;
                        elementsList.notebooks[notebookUri].label = notebookName;
                        cancelWatchNotebookName();
                    }
                });

                elementsList.notebooks[notebookUri] = {
                    uri: notebookUri,
                    label: notebookName,
                    notebookId: notebookId,
                    active: false,
                    count: 0
                };
            }


            // Predicates
            angular.forEach(annotation.predicates, function(predicateUri) {
                if (typeof(uriList[predicateUri]) === 'undefined') {
                    uriList[predicateUri] = {
                        uri: predicateUri
                    };
                    if (typeof(elementsList.predicates[predicateUri]) === 'undefined') {
                        elementsList.predicates[predicateUri] = {
                            uri: predicateUri,
                            label: annotation.items[predicateUri].label,
                            active: false,
                            count: 0
                        };
                    }
                }
            });

            // Entities
            angular.forEach(annotation.entities, function(entUri) {
                if (typeof(uriList[entUri]) === 'undefined') {
                    uriList[entUri] = {
                        uri: entUri
                    };
                    if (typeof(elementsList.entities[entUri]) === 'undefined') {
                        elementsList.entities[entUri] = {
                            uri: entUri,
                            label: annotation.items[entUri].label,
                            active: false,
                            count: 0
                        };
                    }
                }
            });

            // Types
            angular.forEach(annotation.items, function(singleItem) {
                angular.forEach(singleItem.type, function(typeUri) {
                    if (typeof(uriList[typeUri]) === 'undefined') {
                        uriList[typeUri] = {
                            uri: typeUri
                        };
                        if (typeof(elementsList.types[typeUri]) === 'undefined') {
                            elementsList.types[typeUri] = {
                                uri: typeUri,
                                label: TypesHelper.getLabel(typeUri),
                                active: false,
                                count: 0
                            };
                        }
                    }
                });
            });
        });
        filtersCount(annotations);
    };

    // Expands or collapses the sidebar
    annotationSidebar.toggle = function() {
        state.isSidebarExpanded = !state.isSidebarExpanded;
        EventDispatcher.sendEvent('AnnotationSidebar.toggle', state.isSidebarExpanded);
    };

    annotationSidebar.toggleLoading = function() {
        state.isLoading = !state.isLoading;
        EventDispatcher.sendEvent('AnnotationSidebar.toggleLoading', state.isLoading);
    };

    // Show / hide the list of the filters in the sidebar
    annotationSidebar.toggleFiltersContent = function() {
        state.isFiltersExpanded = !state.isFiltersExpanded;
        EventDispatcher.sendEvent('AnnotationSidebar.toggleFiltersContent', state.isFiltersExpanded);
        Analytics.track('buttons', 'click', 'sidebar--' + (state.isFiltersExpanded ? 'showFilters' : 'filters--hide'));
    };
    // Check if the sidebar is expanded
    annotationSidebar.isAnnotationSidebarExpanded = function() {
        return state.isSidebarExpanded;
    };
    // Check if the list of the filters is visible
    annotationSidebar.isFiltersExpanded = function() {
        return state.isFiltersExpanded;
    };

    annotationSidebar.isAnnotationsPanelActive = function() {
        return state.isAnnotationsPanelActive;
    };
    annotationSidebar.activateAnnotationsPanel = function() {
        if (state.isFiltersExpanded) {
            annotationSidebar.toggleFiltersContent();
        }

        if (state.isSuggestionsPanelActive) {
            Annomatic.stop();
            EventDispatcher.sendEvent('AnnotationSidebar.activateAnnotationsPanel');
            Consolidation.wipe();
            Consolidation.consolidateAll();
        }

        state.isAnnotationsPanelActive = true;
        state.isSuggestionsPanelActive = false;
    };

    annotationSidebar.isSuggestionsPanelActive = function() {
        return state.isSuggestionsPanelActive;
    };
    annotationSidebar.activateSuggestionsPanel = function() {
        if (state.isAnnotationsPanelActive) {
            if (state.isFiltersExpanded) {
                state.isFiltersExpanded = false;
            }
            Consolidation.wipe();
            Annomatic.run();
        }

        state.isSuggestionsPanelActive = true;
        state.isAnnotationsPanelActive = false;
    };

    annotationSidebar.getAllAnnotations = function() {
        return state.allAnnotations;
    };



    // Get the array just of the filtered annotations
    annotationSidebar.getAllAnnotationsFiltered = function(filters) {
        var filteredAnnotationsObj = {};
        // var removedFilters = [];
        var currentFilterObjExpression;
        var currentFilterName;
        state.filteredAnnotations = angular.copy(state.allAnnotations);
        angular.forEach(filters, function(filterObj) {
            currentFilterName = filterObj.filterName;
            currentFilterObjExpression = filterObj.expression;
            if ((typeof(currentFilterObjExpression) === 'string' && currentFilterObjExpression !== '') || (angular.isArray(currentFilterObjExpression) && currentFilterObjExpression.length > 0)) {
                state.filteredAnnotations = $filter(currentFilterName)(state.filteredAnnotations, currentFilterObjExpression);
                filteredAnnotationsObj[currentFilterName] = $filter(currentFilterName)(state.allAnnotations, currentFilterObjExpression);
            }
        });

        var getMatch = function(a, b) {
            var matches = [];
            for (var i in a) {
                for (var j in b) {
                    if (angular.equals(a[i], b[j])) {
                        matches.push(a[i]);
                    }
                }
            }
            return matches;
        };

        var sum = function(obj, exlude, start) {
            var results = start;
            for (var kk in obj) {
                if (kk !== exlude) {
                    results = getMatch(results, obj[kk]);
                }
            }
            return results;
        };

        filtersCountPartial(state.filteredAnnotations, 'none', false);

        var filteredAnnotationsObjPartial = {};
        for (var filterName in filteredAnnotationsObj) {
            filteredAnnotationsObjPartial[filterName] = sum(filteredAnnotationsObj, filterName, angular.copy(state.allAnnotations));
            filtersCountPartial(filteredAnnotationsObjPartial[filterName], filterName, true);
        }

        setAnnotationInPage(state.filteredAnnotations);
        setAnnotationsPosition();
        // filtersCount(state.filteredAnnotations, 'partial'); 

        return state.filteredAnnotations;
    };

    annotationSidebar.getFilters = function() {
        return elementsList;
    };

    annotationSidebar.getMinDate = function() {
        if (elementsList.annotationsDate.length > 0) {
            return elementsList.annotationsDate.reduce(
                function(prev, current) {
                    return prev < current ? prev : current;
                }
            );
        }
    };

    annotationSidebar.getMaxDate = function() {
        if (elementsList.annotationsDate.length > 0) {
            return elementsList.annotationsDate.reduce(
                function(prev, current) {
                    return prev > current ? prev : current;
                }
            );
        }
    };

    annotationSidebar.getLoadingStatus = function() {
        return state.isLoading;
    };

    annotationSidebar.setAllPosition = function(id, height) {
        orderAndSetPos(id, height);
    };

    annotationSidebar.setAnnotationPosition = function(optId, optHeight) {
        var currentIndex;
        if (typeof(optId) !== 'undefined' && typeof(optHeight) === 'number') {
            currentIndex = annotationPosition.map(function(e) {
                return e.id;
            }).indexOf(optId);
            if (currentIndex !== -1) {
                annotationPosition[currentIndex].height = optHeight;
            }
        }
    };

    annotationSidebar.setAnnotationsPosition = function() {
        setAnnotationsPosition();
    };

    // Check if some filters are active
    annotationSidebar.needToFilter = function() {
        for (var f in annotationSidebar.filters) {
            var current = annotationSidebar.filters[f].expression;
            if (typeof(current) === 'string' && current !== '') {
                return true;
            } else if (angular.isArray(current) && current.length > 0) {
                return true;
            }
        }
        return false;
    };

    // Activate / Disable a specific filter
    annotationSidebar.toggleActiveFilter = function(list, uri) {
        elementsList[list][uri].active = !elementsList[list][uri].active;
        Analytics.track('buttons', 'click', 'sidebar--filters--filtersPanel--' + list + '--' + (elementsList[list][uri].active ? 'active' : 'inactive'));
    };

    // TODO: verificare che l'elemento sia presente fra gli elementi prima
    // di impostarlo? es. nessuna annotazione con autore X
    annotationSidebar.setFilter = function(filterKey, uriValue) {
        var currentIndex;
        var currentElementInList;
        var currentFilter = annotationSidebar.filters[filterKey].expression;
        if (typeof(currentFilter) === 'string') {
            annotationSidebar.filters[filterKey].expression = uriValue;
        } else if (typeof(currentFilter) === 'object') {
            currentIndex = annotationSidebar.filters[filterKey].expression.indexOf(uriValue);
            currentElementInList = elementsList[filterKey][uriValue];
            if (currentIndex === -1 && typeof(currentElementInList) !== 'undefined') {
                currentElementInList.active = true;
                annotationSidebar.filters[filterKey].expression.push(uriValue);
            }
        }
    };

    // Disable a specific filter 
    annotationSidebar.removeFilter = function(filterKey, uriValue) {
        var currentIndex;
        var currentFilter = annotationSidebar.filters[filterKey].expression;
        if (typeof(currentFilter) === 'string') {
            annotationSidebar.filters[filterKey].expression = '';
        } else if (typeof(currentFilter) === 'object') {
            currentIndex = annotationSidebar.filters[filterKey].expression.indexOf(uriValue);
            if (currentIndex !== -1) {
                elementsList[filterKey][uriValue].active = false;
                annotationSidebar.filters[filterKey].expression.splice(currentIndex, 1);
            }
        }
    };

    // Clear all active filters
    annotationSidebar.resetFilters = function() {
        angular.forEach(annotationSidebar.filters, function(filter) {
            if (typeof(filter.expression) === 'string') {
                filter.expression = '';
            } else if (typeof(filter.expression) === 'object') {
                for (var f in elementsList[filter.filterName]) {
                    elementsList[filter.filterName][f].active = false;
                }
                filter.expression = [];
            }
        });

        Analytics.track('buttons', 'click', 'annotationSidebar--removeAllFilters');
    };

    EventDispatcher.addListener('Consolidation.consolidateAll', function() {
        annotationSidebar.log('Update annotations in sidebar');

        var annotations = AnnotationsExchange.getAnnotations();
        state.allAnnotations = angular.copy(annotations);
        setBrokenInfo();
        setFilterElements(state.allAnnotations);
        setAnnotationsPosition();
    });

    annotationSidebar.log('Component running');
    return annotationSidebar;
});