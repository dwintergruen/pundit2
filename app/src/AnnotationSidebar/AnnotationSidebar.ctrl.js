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

    $scope.annotationSidebar = AnnotationSidebar;

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

    // Watch filters expanded or collapsed
    $scope.$watch(function() {
        return AnnotationSidebar.isFiltersExpanded();
    }, function(currentState, oldState) {
        $scope.isFiltersShowed = currentState;
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


    // # Filters //

    $scope.fromMinDate = new Date();
    $scope.toMinDate = new Date();
    $scope.fromMaxDate = new Date();
    $scope.fromToDate = new Date();

    // Temp fix for bs-datepicker issues min value
    var setMin = function(currentMin){
        var newMinDate = new Date( (currentMin && !isNaN(Date.parse(currentMin))) ? Date.parse(currentMin) : 0 );
        newMinDate.setDate(newMinDate.getDate() - 1);

        return $filter('date')(newMinDate, 'yyyy-MM-dd');
    };

    // Watch annotations
    $scope.$watch(function() {
        return AnnotationSidebar.getAllAnnotations();
    }, function(currentAnnotations) {
        $scope.allAnnotations = currentAnnotations;
        if (AnnotationSidebar.needToFilter()) {
            $scope.annotations = AnnotationSidebar.getAllAnnotationsFiltered(AnnotationSidebar.filters);
        } else {
            $scope.annotations = currentAnnotations;
        }
    }); 

    $scope.$watch(function() {
        return AnnotationSidebar.getMinDate();
    }, function(minDate) {
        if (typeof(minDate) !== 'undefined'){
            var newMinDate = $filter('date')(minDate, 'yyyy-MM-dd');
            $scope.fromMinDate = setMin(newMinDate);
            if (AnnotationSidebar.filters.fromDate.expression === ''){
                // AnnotationSidebar.filters.fromDate.expression = newMinDate;
                $scope.toMinDate = setMin(newMinDate);
            }
        }
    }); 
    $scope.$watch(function() {
        return AnnotationSidebar.getMaxDate();
    }, function(maxDate) {
        if (typeof(maxDate) !== 'undefined'){
            var newMaxDate = $filter('date')(maxDate, 'yyyy-MM-dd');
            $scope.toMaxDate = newMaxDate;
            if (AnnotationSidebar.filters.toDate.expression === ''){
                // AnnotationSidebar.filters.toDate.expression = newMaxDate;
                $scope.fromMaxDate = newMaxDate;
            }
        }
    });
    $scope.$watch('annotationSidebar.filters.fromDate.expression', function(currentFromDate) {
        if (typeof(currentFromDate) !== 'undefined'){
            $scope.toMinDate = setMin(currentFromDate);
        } else{
            $scope.toMinDate = setMin($scope.fromMinDate);
        }
    });
    $scope.$watch('annotationSidebar.filters.toDate.expression', function(currentToDate) {
        if (typeof(currentToDate) !== 'undefined'){
            $scope.fromMaxDate = currentToDate;
        } else{
            $scope.fromMaxDate = $scope.toMaxDate;
        }
    });

    $scope.$watch('annotationSidebar.filters', function(currentFilters) {
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
    });

    $scope.activeFilter = function (uri){
        var findIndex;

        for (var f in AnnotationSidebar.filters){
            currentFilter = AnnotationSidebar.filters[f];
            findIndex = currentFilter.expression.indexOf(uri);
            if (findIndex !== -1){
                return true;
            }
        }

        return false;
    };

    $scope.showFilter = function(event){
        var currentElement = angular.element(event.target.parentElement);
        currentElement.addClass('pnd-annotation-sidebar-filter-show');
    };
    $scope.hideFilter = function(event){
        var currentElement = angular.element(event.currentTarget);
        currentElement.removeClass('pnd-annotation-sidebar-filter-show');
    };

    $scope.toggleFilter = function(currentFilter, currentUri) {
        var indexFilter = AnnotationSidebar.filters[currentFilter].expression.indexOf(currentUri);
        if (indexFilter === -1) {
            AnnotationSidebar.filters[currentFilter].expression.push(currentUri);
            AnnotationSidebar.toggleActiveFilter(currentFilter, currentUri);
        } else {
            AnnotationSidebar.filters[currentFilter].expression.splice(indexFilter, 1);
            AnnotationSidebar.toggleActiveFilter(currentFilter, currentUri);
        }
    };

    // $scope.toggleAuthor = function(author) {
    //     var indexAuthor = AnnotationSidebar.filters.author.expression.indexOf(author);
    //     if (indexAuthor === -1) {
    //         AnnotationSidebar.filters.author.expression.push(author);
    //         AnnotationSidebar.toggleActiveFilter('authors', author);
    //     } else {
    //         AnnotationSidebar.filters.author.expression.splice(indexAuthor, 1);
    //         AnnotationSidebar.toggleActiveFilter('authors', author);
    //     }
    // };
    $scope.togglePredicates = function(predicates) {
        var indexPredicates = AnnotationSidebar.filters.predicates.expression.indexOf(predicates);
        if (indexPredicates === -1) {
            AnnotationSidebar.filters.predicates.expression.push(predicates);
            AnnotationSidebar.toggleActiveFilter('predicates', predicates);
        } else {
            AnnotationSidebar.filters.predicates.expression.splice(indexPredicates, 1);
            AnnotationSidebar.toggleActiveFilter('predicates', predicates);
        }
    };
    $scope.toggleEntities = function(entities) {
        var indexEntities = AnnotationSidebar.filters.entities.expression.indexOf(entities);
        if (indexEntities === -1) {
            AnnotationSidebar.filters.entities.expression.push(entities);
            AnnotationSidebar.toggleActiveFilter('entities', entities);
        } else {
            AnnotationSidebar.filters.entities.expression.splice(indexEntities, 1);
            AnnotationSidebar.toggleActiveFilter('entities', entities);
        }
    };
    $scope.toggleTypes = function(types) {
        var indexTypes = AnnotationSidebar.filters.types.expression.indexOf(types);
        if (indexTypes === -1) {
            AnnotationSidebar.filters.types.expression.push(types);
            AnnotationSidebar.toggleActiveFilter('types', types);
        } else {
            AnnotationSidebar.filters.types.expression.splice(indexTypes, 1);
            AnnotationSidebar.toggleActiveFilter('types', types);
        }
    };

    AnnotationSidebar.log('Controller Run');
});