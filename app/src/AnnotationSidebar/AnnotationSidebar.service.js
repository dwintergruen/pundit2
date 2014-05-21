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
        filteredAnnotations: [],
        annotationsDate: [],
        authors: {},
        entities: {},
        predicates: {},
        types: {}
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
        state.predicates = {};
        state.authors = {};
        state.entities = {};
        state.predicates = {};
        state.types = {};

        angular.forEach(annotations, function(annotation) {

            var uriList = {};

            // Annotation authors
            if (typeof(state.authors[annotation.creator]) === 'undefined'){
                state.authors[annotation.creator] = {uri: annotation.creator, label: annotation.creatorName, count: 1};
            } else {
                state.authors[annotation.creator].count++;
            }

            // Annotation date
            if (state.annotationsDate.indexOf(annotation.created) === -1){
                state.annotationsDate.push(annotation.created);
            }

            // Predicates
            angular.forEach(annotation.predicates, function(predicateUri) {
                if (typeof(uriList[predicateUri]) === 'undefined'){
                    uriList[predicateUri] = {uri: predicateUri};
                    if (typeof(state.predicates[predicateUri]) === 'undefined'){
                        state.predicates[predicateUri] = {uri: predicateUri, label: annotation.items[predicateUri].label, count: 1};
                    } else {
                        state.predicates[predicateUri].count++;
                    }
                }
            });

            // Entities
            angular.forEach(annotation.entities, function(entUri) {
                if (typeof(uriList[entUri]) === 'undefined'){
                    uriList[entUri] = {uri: entUri};
                    if (typeof(state.entities[entUri]) === 'undefined'){
                        state.entities[entUri] = {uri: entUri, label: annotation.items[entUri].label, count: 1};
                    } else {
                        state.entities[entUri].count++;
                    }
                }
            });
            
            // Types
            angular.forEach(annotation.items, function(singleItem) {
                angular.forEach(singleItem.type, function(typeUri) {
                    if (typeof(uriList[typeUri]) === 'undefined'){
                        uriList[typeUri] = {uri: typeUri};
                        if (typeof(state.types[typeUri]) === 'undefined'){
                            state.types[typeUri] = {uri: typeUri, label: TypesHelper.getLabel(typeUri), count: 1};
                        } else {
                            state.types[typeUri].count++;
                        }
                    }
                });
            });
        });
    };

    annotationSidebar.getAuthors = function(){
        return state.authors;
    };
    annotationSidebar.getEntities = function(){
        return state.entities;
    };
    annotationSidebar.getPredicates = function(){
        return state.predicates;
    };
    annotationSidebar.getTypes = function(){
        return state.types;
    };

    annotationSidebar.getMinDate = function(){
        if (state.annotationsDate.length > 0){
            return state.annotationsDate.reduce(
                function(prev,current){ 
                    return prev < current ? prev:current;
                }
            );
        }
    };
    annotationSidebar.getMaxDate = function(){
        if (state.annotationsDate.length > 0){
            return state.annotationsDate.reduce(
                function(prev,current){ 
                    return prev > current ? prev:current;
                }
            );
        }
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