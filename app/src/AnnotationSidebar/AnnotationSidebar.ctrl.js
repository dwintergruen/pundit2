/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationSidebarCtrl', function($scope, $filter, $timeout, $window, AnnotationSidebar, Dashboard, Toolbar) {
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

    var search = {
        icon: AnnotationSidebar.options.inputIconSearch,
        clean: AnnotationSidebar.options.inputIconClear
    };

    $scope.annotationSidebar = AnnotationSidebar;

    $scope.filters = AnnotationSidebar.getFilters();

    container.css('height', body.innerHeight() + 'px');

    // Start reading the default
    if (AnnotationSidebar.options.isAnnotationSidebarExpanded) {
        body.addClass(AnnotationSidebar.options.bodyExpandedClass);
        container.addClass(AnnotationSidebar.options.sidebarExpandedClass);
    } else {
        body.addClass(AnnotationSidebar.options.bodyCollapsedClass);
        container.addClass(AnnotationSidebar.options.sidebarCollapsedClass);
    }

    $scope.isSuggestionsPanelActive = function() {
        return AnnotationSidebar.isSuggestionsPanelActive();
    };
    $scope.activateSuggestionsPanel = function() {
        AnnotationSidebar.activateSuggestionsPanel();
    };

    $scope.isAnnotationsPanelActive = function() {
        return AnnotationSidebar.isAnnotationsPanelActive();
    };
    $scope.activateAnnotationsPanel = function() {
        AnnotationSidebar.activateAnnotationsPanel();
    };


    $scope.$watch(function() {
        return Toolbar.isLoading();
    }, function(currentState, oldState) {
        if (currentState !== oldState) {
            $scope.isLoading = currentState;
        }
    });

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
    }, function(currentState) {
        $scope.isFiltersShowed = currentState;
    }); 

    // Watch dashboard height for top of sidebar
    $scope.$watch(function() {
        return Dashboard.getContainerHeight();
    }, function(dashboardHeight) {
        state.newMarginTopSidebar = state.toolbarHeight + dashboardHeight;
        container.css('top', state.newMarginTopSidebar + 'px');
    });
    $scope.$watch(function() {
        return Dashboard.isDashboardVisible();
    }, function(dashboardVisibility) {
        if (dashboardVisibility){
            state.newMarginTopSidebar = state.toolbarHeight + Dashboard.getContainerHeight();
            container.css('top', state.newMarginTopSidebar + 'px');
        } else {
            container.css('top', state.toolbarHeight + 'px');
        }
    });

    // Annotation sidebar height
    var resizeSidebarHeight = function(bodyHeight, windowHeight, contentHeight) {
        state.sidebarNewHeight = Math.max(bodyHeight, windowHeight - state.toolbarHeight, contentHeight);
        state.sidebarCurrentHeight = container.innerHeight();
        if (state.sidebarNewHeight !== state.sidebarCurrentHeight) {
            container.css('height', state.sidebarNewHeight + 'px');
        }
    };
    $scope.$watch(function() {
        return body.innerHeight();
    }, function(heightValue) {
        resizeSidebarHeight(heightValue, $window.innerHeight, content.innerHeight());
    });
    $scope.$watch(function() {
        return content.innerHeight();
    }, function(heightValue) {
        resizeSidebarHeight(body.innerHeight(), $window.innerHeight, heightValue);
    });
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

    $scope.$watch('freeText', function(freeText) {
        $timeout(function(){
            AnnotationSidebar.filters.freeText.expression = freeText;
        }, 1500);
    });

    $scope.$watch('annotationSidebar.filters', function(currentFilters) {
        if(AnnotationSidebar.filters.freeText.expression === ''){
            $scope.freeText = '';
        }
        $scope.annotations = AnnotationSidebar.getAllAnnotationsFiltered(currentFilters);
    }, true);

    // $scope.$watch(function() {
    //     return AnnotationSidebar.getFilters();
    // }, function(currentFiltersList, oldFilterList) {
    //     // console.log("getFilters watch", angular.equals(currentFiltersList, oldFilterList));
    //     $scope.filters = currentFiltersList;
    // }, true);
        

    $scope.isFilterLabelShowed = function(currentInputText) {
        if (typeof(currentInputText) === 'string'){
            return currentInputText.length > 0;
        }
    };

    $scope.toggleFilterList = function(event) {
        var previousElement = angular.element('.pnd-annotation-sidebar-filter-show');
        var currentElement = angular.element(event.target.parentElement);

        // Close all filter list and toggle the current
        previousElement.not(currentElement).removeClass('pnd-annotation-sidebar-filter-show');
        currentElement.toggleClass('pnd-annotation-sidebar-filter-show');
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

    $scope.toggleBrokenAnnotations = function() {
        if(AnnotationSidebar.filters.broken.expression === ''){
            AnnotationSidebar.filters.broken.expression = 'hideBroken';
        } else{
            AnnotationSidebar.filters.broken.expression = '';
        }
    }

    $scope.setSearchIcon = function(str) {
        if (typeof(str) === 'undefined' || str === '') {
            return search.icon;
        } else {
            return search.clean;
        }
    };

    AnnotationSidebar.log('Controller Run');
});