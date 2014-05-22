/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.constant('ANNOTATIONSIDEBARDEFAULTS', {
    isAnnotationSidebarExpanded: false,
    annotationsRefresh: 300, //ms 
    bodyClass: 'pnd-annotation-sidebar-active',
    bodyExpandedClass: 'pnd-annotation-sidebar-expanded',
    bodyCollapsedClass: 'pnd-annotation-sidebar-collapsed',
    sidebarExpandedClass: 'pnd-annotation-sidebar-expanded',
    sidebarCollapsedClass: 'pnd-annotation-sidebar-collapsed',

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDomTemplate: "src/AnnotationSidebar/ClientAnnotationSidebar.tmpl.html",

    debug: false
})
.service('AnnotationSidebar', function($rootScope, $filter, $timeout, BaseComponent, AnnotationsExchange, TypesHelper, ANNOTATIONSIDEBARDEFAULTS) {
    
    var annotationSidebar = new BaseComponent('AnnotationSidebar', ANNOTATIONSIDEBARDEFAULTS);

    var state = {
        isExpanded: annotationSidebar.options.isAnnotationSidebarExpanded,
        allAnnotations: [],
        filteredAnnotations: []
    };

    var elementsList = {
        annotationsDate: [],
        authors: {},
        entities: {},
        predicates: {},
        types: {}
    };

    annotationSidebar.filters = {
        freeText: {
            filterName: 'freeText',
            filterLabel: 'Free text',
            expression: ''
        },
        author: {
            filterName: 'author',
            filterLabel: 'Author',
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
        }
    };

    annotationSidebar.toggle = function(){
        state.isExpanded = !state.isExpanded;
    };
    annotationSidebar.isAnnotationSidebarExpanded = function() {
        return state.isExpanded;
    };

    annotationSidebar.getAllAnnotations = function() {
        return state.allAnnotations;
    };
  
    annotationSidebar.getAllAnnotationsFiltered = function(filters) {
        var currentFilterObjExpression;
        var currentFilterName;
        state.filteredAnnotations = angular.copy(state.allAnnotations);
        angular.forEach(filters, function(filterObj){
            currentFilterName = filterObj.filterName;
            currentFilterObjExpression = filterObj.expression;
            if (typeof(currentFilterObjExpression) === "string" && currentFilterObjExpression !== '') {
                state.filteredAnnotations = $filter(currentFilterName)(state.filteredAnnotations, currentFilterObjExpression);
            } else if (angular.isArray(currentFilterObjExpression) && currentFilterObjExpression.length > 0) {
                state.filteredAnnotations = $filter(currentFilterName)(state.filteredAnnotations, currentFilterObjExpression);
            }
        }); 
        return state.filteredAnnotations;
    };

    var setFilterElements = function(annotations) {
        elementsList.predicates = {};
        elementsList.authors = {};
        elementsList.entities = {};
        elementsList.predicates = {};
        elementsList.types = {};

        angular.forEach(annotations, function(annotation) {

            var uriList = {};

            // Annotation authors
            if (typeof(elementsList.authors[annotation.creator]) === 'undefined'){
                elementsList.authors[annotation.creator] = {uri: annotation.creator, label: annotation.creatorName, count: 1};
            } else {
                elementsList.authors[annotation.creator].count++;
            }

            // Annotation date
            if (elementsList.annotationsDate.indexOf(annotation.created) === -1){
                elementsList.annotationsDate.push(annotation.created);
            }

            // Predicates
            angular.forEach(annotation.predicates, function(predicateUri) {
                if (typeof(uriList[predicateUri]) === 'undefined'){
                    uriList[predicateUri] = {uri: predicateUri};
                    if (typeof(elementsList.predicates[predicateUri]) === 'undefined'){
                        elementsList.predicates[predicateUri] = {uri: predicateUri, label: annotation.items[predicateUri].label, count: 1};
                    } else {
                        elementsList.predicates[predicateUri].count++;
                    }
                }
            });

            // Entities
            angular.forEach(annotation.entities, function(entUri) {
                if (typeof(uriList[entUri]) === 'undefined'){
                    uriList[entUri] = {uri: entUri};
                    if (typeof(elementsList.entities[entUri]) === 'undefined'){
                        elementsList.entities[entUri] = {uri: entUri, label: annotation.items[entUri].label, count: 1};
                    } else {
                        elementsList.entities[entUri].count++;
                    }
                }
            });
            
            // Types
            angular.forEach(annotation.items, function(singleItem) {
                angular.forEach(singleItem.type, function(typeUri) {
                    if (typeof(uriList[typeUri]) === 'undefined'){
                        uriList[typeUri] = {uri: typeUri};
                        if (typeof(elementsList.types[typeUri]) === 'undefined'){
                            elementsList.types[typeUri] = {uri: typeUri, label: TypesHelper.getLabel(typeUri), count: 1};
                        } else {
                            elementsList.types[typeUri].count++;
                        }
                    }
                });
            });
        });
    };

    annotationSidebar.getAuthors = function(){
        return elementsList.authors;
    };
    annotationSidebar.getEntities = function(){
        return elementsList.entities;
    };
    annotationSidebar.getPredicates = function(){
        return elementsList.predicates;
    };
    annotationSidebar.getTypes = function(){
        return elementsList.types;
    };

    annotationSidebar.getMinDate = function(){
        if (elementsList.annotationsDate.length > 0){
            return elementsList.annotationsDate.reduce(
                function(prev,current){ 
                    return prev < current ? prev:current;
                }
            );
        }
    };
    annotationSidebar.getMaxDate = function(){
        if (elementsList.annotationsDate.length > 0){
            return elementsList.annotationsDate.reduce(
                function(prev,current){ 
                    return prev > current ? prev:current;
                }
            );
        }
    };

    annotationSidebar.needToFilter = function() {
        for (var f in annotationSidebar.filters) {
            var current = annotationSidebar.filters[f].expression;
            if (typeof(current) === "string" && current !== '') {
                return true;
            } else if (angular.isArray(current) && current.length > 0) {
                return true;
            }
        }
        return false;
    };

    // TODO: verificare che l'elemento sia presente fra gli elementi prima
    // di impostarlo? es. nessuna annotazione con autore X
    annotationSidebar.setFilter = function(filter, value) {
        var currentIndex;
        var currentFilter = annotationSidebar.filters[filter].expression;
        if (typeof(currentFilter) === 'string'){
            annotationSidebar.filters[filter].expression = value;
        } else if (typeof(currentFilter) === 'object'){
            currentIndex = annotationSidebar.filters[filter].expression.indexOf(value);
            if (currentIndex === -1){
                annotationSidebar.filters[filter].expression.push(value);
            }
        }
    };

    annotationSidebar.removeFilter = function(filter, value) {
        var currentIndex;
        var currentFilter = annotationSidebar.filters[filter].expression;
        if (typeof(currentFilter) === 'string'){
            annotationSidebar.filters[filter].expression = '';
        } else if (typeof(currentFilter) === 'object'){
            currentIndex = annotationSidebar.filters[filter].expression.indexOf(value);
            if (currentIndex !== -1){
                annotationSidebar.filters[filter].expression.splice(currentIndex, 1);
            }
        }
    };

    annotationSidebar.resetFilters = function() {
        angular.forEach(annotationSidebar.filters, function(filter) {
            if (typeof(filter.expression) === 'string'){
                filter.expression = '';
            } else if (typeof(filter.expression) === 'object'){
                filter.expression = [];
            }
        });
    };

    var timeoutPromise;
    $rootScope.$watch(function() {
        return AnnotationsExchange.getAnnotations();
    }, function(annotations) {
        if (timeoutPromise) {
            $timeout.cancel(timeoutPromise);
        }
        timeoutPromise = $timeout(function() {
            state.allAnnotations = annotations;
            setFilterElements(annotations);
        }, annotationSidebar.options.annotationsRefresh);
    }, true);


    annotationSidebar.log('Component running');
    return annotationSidebar;
});