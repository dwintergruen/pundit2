/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, $filter, $window, AnnotationSidebar, Dashboard, TypesHelper) {
    var bodyClasses = AnnotationSidebar.options.bodyExpandedClass + ' ' + AnnotationSidebar.options.bodyCollapsedClass;
    var sidebarClasses = AnnotationSidebar.options.sidebarExpandedClass + ' ' + AnnotationSidebar.options.sidebarCollapsedClass;

    var body = angular.element('body');
    var container = angular.element('.pnd-annotation-sidebar-container');
    var content = angular.element('.pnd-annotation-sidebar-content');

    // TODO: prelevare la dimensione reale
    // TODO: sarebbe meglio avere un metodo direttamente di toolbar?
    // var toolbarHeight = angular.element('toolbar nav').css('height');

    var state = {
        toolbarHeight: 30,
        newMarginTopSidebar: 0,
        sidebarCurrentHeight: 0,
        sidebarNewHeight: 0
    };

    container.css('height', body.innerHeight() + 'px');

    // Start reading the default
    if (AnnotationSidebar.options.isAnnotationSidebarExpanded) {
        body.addClass(AnnotationSidebar.options.bodyExpandedClass);
        container.addClass(AnnotationSidebar.options.sidebarExpandedClass);
    } else {
        body.addClass(AnnotationSidebar.options.bodyCollapsedClass);
        container.addClass(AnnotationSidebar.options.sidebarCollapsedClass);
    }

    // Watch annotation sidebar expanded or collapsed
    $scope.$watch(function() {
        return AnnotationSidebar.isAnnotationSidebarExpanded();
    }, function(currentState, oldState) {
        $scope.isAnnotationSidebarExpanded = currentState;

        if (currentState !== oldState) {
            body.toggleClass(bodyClasses);
            container.toggleClass(sidebarClasses);
        }
    }); 

    // Watch dashboard height for top of sidebar
    $scope.$watch(function() {
        return {
            dashboardHeight: Dashboard.getContainerHeight(),
            dashboardVisibility: Dashboard.isDashboardVisible()   
        };
    }, function(dashboardValue) {
        if (dashboardValue.dashboardVisibility){
            state.newMarginTopSidebar = state.toolbarHeight + dashboardValue.dashboardHeight;
            container.css('top', state.newMarginTopSidebar + 'px');
        } else {
            container.css('top', state.toolbarHeight + 'px');
        }
    }, true);

    // Annotation sidebar height
    var resizeSidebarHeight = function(bodyHeight, windowHeight, contentHeight) {
        state.sidebarNewHeight = Math.max(bodyHeight, windowHeight - state.toolbarHeight, contentHeight);
        state.sidebarCurrentHeight = container.innerHeight();
        if (state.sidebarNewHeight !== state.sidebarCurrentHeight) {
            container.css('height', state.sidebarNewHeight + 'px');
        }
    };
    $scope.$watch(function() {
        return {
            bodyHeight: body.innerHeight(),
            contentHeight: content.innerHeight()
        }
    }, function(heightValue) {
        resizeSidebarHeight(heightValue.bodyHeight, $window.innerHeight, heightValue.contentHeight);
    }, true);
    angular.element($window).bind('resize', function () {
        resizeSidebarHeight(body.innerHeight(), $window.innerHeight, content.innerHeight());
    });


    // # Filters
    
    $scope.filters = {
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

    var needToFilter = function() {
        for (var f in $scope.filters) {
            var current = $scope.filters[f].expression;
            if (typeof(current) === "string" && current !== '') {
                return true;
            } else if (angular.isArray(current) && current.length > 0) {
                return true;
            }
        }
        return false;
    };

    // Watch annotations
    $scope.$watch(function() {
        return AnnotationSidebar.getAllAnnotations();
    }, function(currentAnnotations) {
        $scope.allAnnotations = currentAnnotations;
        if (needToFilter()) {
            $scope.annotations = AnnotationSidebar.getAllAnnotationsFiltered($scope.filters);
        } else {
            $scope.annotations = currentAnnotations;
        }
    }); 

    $scope.$watch('filters', function(currentFilters) {
        // TODO: individuare un modo migliore per rilevare i singoli filtri attivi
        $scope.annotations = AnnotationSidebar.getAllAnnotationsFiltered(currentFilters);

    }, true);

    $scope.$watch(function() {
        return AnnotationSidebar.getAuthors();
    }, function(currentListAuthors) {
        $scope.authors = currentListAuthors;
    });
    $scope.$watch(function() {
        return AnnotationSidebar.getPredicates();
    }, function(currentListPredicates) {
        $scope.predicates = currentListPredicates;
    });
    $scope.$watch(function() {
        return AnnotationSidebar.getEntities();
    }, function(currentListEntities) {
        $scope.entities = currentListEntities;
    });
    $scope.$watch(function() {
        return AnnotationSidebar.getTypes();
    }, function(currentListTypes) { 
        $scope.types = currentListTypes;
        // $scope.types = $filter('orderBy')(currentListTypes, 'count');
        //$filter('orderBy')(array, expression, reverse);
    });

    $scope.toggleAuthor = function(author) {
        var indexAuthor = $scope.filters.author.expression.indexOf(author);
        if (indexAuthor === -1) {
            $scope.filters.author.expression.push(author);
        } else {
            $scope.filters.author.expression.splice(indexAuthor, 1);
        }
    };
    $scope.togglePredicates = function(predicates) {
        var indexPredicates = $scope.filters.predicates.expression.indexOf(predicates);
        if (indexPredicates === -1) {
            $scope.filters.predicates.expression.push(predicates);
        } else {
            $scope.filters.predicates.expression.splice(indexPredicates, 1);
        }
    };
    $scope.toggleEntities = function(entities) {
        var indexEntities = $scope.filters.entities.expression.indexOf(entities);
        if (indexEntities === -1) {
            $scope.filters.entities.expression.push(entities);
        } else {
            $scope.filters.entities.expression.splice(indexEntities, 1);
        }
    };
    $scope.toggleTypes = function(types) {
        var indexTypes = $scope.filters.types.expression.indexOf(types);
        if (indexTypes === -1) {
            $scope.filters.types.expression.push(types);
        } else {
            $scope.filters.types.expression.splice(indexTypes, 1);
        }
    };

    // get label of a type from his uri
    $scope.getLabelType = function(uri) {
        return TypesHelper.getLabel(uri);
    };

    AnnotationSidebar.log('Controller Run');
});