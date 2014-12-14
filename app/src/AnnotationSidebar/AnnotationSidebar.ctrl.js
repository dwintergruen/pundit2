angular.module('Pundit2.AnnotationSidebar')

.controller('AnnotationSidebarCtrl', function($scope, $filter, $timeout, $document, $window,
    EventDispatcher, AnnotationSidebar, Dashboard, Config) {

    var bodyClasses = AnnotationSidebar.options.bodyExpandedClass + ' ' + AnnotationSidebar.options.bodyCollapsedClass;
    var sidebarClasses = AnnotationSidebar.options.sidebarExpandedClass + ' ' + AnnotationSidebar.options.sidebarCollapsedClass;

    // var html = angular.element('html');
    var body = angular.element('body');
    var container = angular.element('.pnd-annotation-sidebar-container');
    // var content = angular.element('.pnd-annotation-sidebar-content');

    var toolbarHeight = parseInt(angular.element('toolbar nav').css('height'), 10);

    var state = {
        toolbarHeight: toolbarHeight,
        newMarginTopSidebar: 0,
        sidebarCurrentHeight: 0,
        sidebarNewHeight: 0
    };

    var search = {
        iconMagnifier: AnnotationSidebar.options.inputIconSearch,
        iconFilter: AnnotationSidebar.options.inputIconFilter,
        clean: AnnotationSidebar.options.inputIconClear
    };

    var delay;

    $scope.annotationSidebar = AnnotationSidebar;
    $scope.filters = AnnotationSidebar.getFilters();
    $scope.isAnnomaticActive = Config.isModuleActive('Annomatic');
    $scope.isAnnotationSidebarExpanded = AnnotationSidebar.options.isAnnotationSidebarExpanded;
    $scope.isLoadingData = false;
    $scope.isLoading = false;

    $scope.fromMinDate = new Date();
    $scope.toMinDate = new Date();
    $scope.fromMaxDate = new Date();
    $scope.fromToDate = new Date();

    body.css('position', 'static');
    container.css('height', body.innerHeight() + 'px');

    // Start reading the default
    if (AnnotationSidebar.options.isAnnotationSidebarExpanded) {
        body.addClass(AnnotationSidebar.options.bodyExpandedClass);
        container.addClass(AnnotationSidebar.options.sidebarExpandedClass);
    } else {
        body.addClass(AnnotationSidebar.options.bodyCollapsedClass);
        container.addClass(AnnotationSidebar.options.sidebarCollapsedClass);
    }

    // Annotation sidebar height
    var resizeSidebarHeight = function() {
        var minHeightSidebar = AnnotationSidebar.minHeightRequired;
        var bodyHeight = body.innerHeight();
        // var htmlHeight = html.innerHeight();

        var newHeight = Math.max(minHeightSidebar, bodyHeight);
        container.css('height', newHeight + 'px');

        // var difference;
        // var documentHeight = $document.innerHeight();

        // if (documentHeight > minHeightSidebar && documentHeight > htmlHeight){
        //     console.log("questo caso");
        //     if (Dashboard.isDashboardVisible()){
        //         difference = state.toolbarHeight + Dashboard.getContainerHeight();
        //     } else {
        //         difference = state.toolbarHeight;
        //     }

        //     newHeight = documentHeight - difference;
        //     container.css('height', newHeight + 'px');      
        // }
    };

    // Temp fix for bs-datepicker issues min value
    var setMin = function(currentMin) {
        var newMinDate = new Date((currentMin && !isNaN(Date.parse(currentMin))) ? Date.parse(currentMin) : 0);
        newMinDate.setDate(newMinDate.getDate() - 1);

        return $filter('date')(newMinDate, 'yyyy-MM-dd');
    };

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

    $scope.updateSearch = function(freeText) {
        $timeout.cancel(delay);
        delay = $timeout(function() {
            AnnotationSidebar.filters.freeText.expression = freeText;
        }, 1000);
    };

    $scope.isFilterLabelShowed = function(currentInputText) {
        if (typeof(currentInputText) === 'string') {
            return currentInputText.length > 0;
        }
    };

    $scope.toggleFilterList = function(event) {
        var previousElement = angular.element('.pnd-annotation-sidebar-filter-show');
        var currentElement = angular.element(event.target.parentElement);

        $scope.searchAuthors = '';
        $scope.searchNotebooks = '';
        $scope.searchTypes = '';
        $scope.searchPredicates = '';
        $scope.searchEntities = '';

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
        if (AnnotationSidebar.filters.broken.expression === '') {
            AnnotationSidebar.filters.broken.expression = 'hideBroken';
        } else {
            AnnotationSidebar.filters.broken.expression = '';
        }
    };

    $scope.setSearchIcon = function(str) {
        if (typeof(str) === 'undefined' || str === '') {
            return search.iconMagnifier;
        } else {
            return search.clean;
        }
    };

    $scope.setFilterIcon = function(str) {
        if (typeof(str) === 'undefined' || str === '') {
            return search.iconFilter;
        } else {
            return search.clean;
        }
    };

    EventDispatcher.addListener('Pundit.loading', function(e) {
        var currentState = e.args;
        if (currentState !== $scope.isLoadingData) {
            AnnotationSidebar.toggleLoading();
            $scope.isLoadingData = currentState;
        }
    });

    EventDispatcher.addListener('AnnotationSidebar.toggleLoading', function(e) {
        $scope.isLoading = e.args;
    });

    // Watch annotation sidebar expanded or collapsed
    EventDispatcher.addListener('AnnotationSidebar.toggle', function(e) {
        var currentState = e.args;
        if (currentState !== $scope.isAnnotationSidebarExpanded) {
            body.toggleClass(bodyClasses);
            container.toggleClass(sidebarClasses);

            AnnotationSidebar.setAnnotationsPosition();

            $scope.isAnnotationSidebarExpanded = currentState;
        }
    });

    // Watch filters expanded or collapsed
    EventDispatcher.addListener('AnnotationSidebar.toggleFiltersContent', function(e) {
        $scope.isFiltersShowed = e.args;
    });

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
        if (typeof(minDate) !== 'undefined') {
            var newMinDate = $filter('date')(minDate, 'yyyy-MM-dd');
            $scope.fromMinDate = setMin(newMinDate);
            if (AnnotationSidebar.filters.fromDate.expression === '') {
                $scope.toMinDate = setMin(newMinDate);
            }
        }
    });
    $scope.$watch(function() {
        return AnnotationSidebar.getMaxDate();
    }, function(maxDate) {
        if (typeof(maxDate) !== 'undefined') {
            var newMaxDate = $filter('date')(maxDate, 'yyyy-MM-dd');
            $scope.toMaxDate = newMaxDate;
            if (AnnotationSidebar.filters.toDate.expression === '') {
                $scope.fromMaxDate = newMaxDate;
            }
        }
    });
    $scope.$watch('annotationSidebar.filters.fromDate.expression', function(currentFromDate) {
        if (typeof(currentFromDate) !== 'undefined') {
            $scope.toMinDate = setMin(currentFromDate);
        } else {
            $scope.toMinDate = setMin($scope.fromMinDate);
        }
    });
    $scope.$watch('annotationSidebar.filters.toDate.expression', function(currentToDate) {
        if (typeof(currentToDate) !== 'undefined') {
            $scope.fromMaxDate = currentToDate;
        } else {
            $scope.fromMaxDate = $scope.toMaxDate;
        }
    });

    $scope.$watch('annotationSidebar.filters', function(currentFilters) {
        if (AnnotationSidebar.filters.freeText.expression === '') {
            $scope.freeText = '';
        }
        $scope.annotations = AnnotationSidebar.getAllAnnotationsFiltered(currentFilters);
    }, true);

    // TODO Use EventDispatcher
    // Watch dashboard height for top of sidebar
    $scope.$watch(function() {
        return Dashboard.getContainerHeight();
    }, function(dashboardHeight) {
        state.newMarginTopSidebar = state.toolbarHeight + dashboardHeight;
        container.css('margin-top', state.newMarginTopSidebar + 'px');
    });
    $scope.$watch(function() {
        return Dashboard.isDashboardVisible();
    }, function(dashboardVisibility) {
        if (dashboardVisibility) {
            state.newMarginTopSidebar = state.toolbarHeight + Dashboard.getContainerHeight();
            container.css('margin-top', state.newMarginTopSidebar + 'px');
        } else {
            container.css('margin-top', state.toolbarHeight + 'px');
        }
    });

    $scope.$watch(function() {
        return AnnotationSidebar.minHeightRequired;
    }, function() {
        resizeSidebarHeight();
    });

    $scope.$watch(function() {
        return $document.innerHeight();
    }, function() {
        resizeSidebarHeight();
    });

    angular.element($window).bind('resize', function() {
        resizeSidebarHeight();
    });

    AnnotationSidebar.log('Controller Run');
});