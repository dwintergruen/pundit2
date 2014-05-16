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
        authors: [],
        entities: [],
        predicates: []
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

    var setFilterElements = function(annotations){
        angular.forEach(annotations, function (e) {
            if(state.authors.indexOf(e.creatorName) === -1){
                state.authors.push(e.creatorName);
            }
            if(state.predicates.indexOf(e.predicates[0]) === -1){
                state.predicates.push(e.predicates[0]);
            }
            // if(state.entities.indexOf(e.entities[0]) === -1){
            //     state.entities.push(e.entities[0]);
            // }
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