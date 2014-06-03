describe('AnnotationSidebar service', function() {
    
    var AnnotationSidebar,
        $window,
        $timeout,
        $compile,
        $log,
        ANNOTATIONSIDEBARDEFAULTS;

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_, _$timeout_, _$compile_, _ANNOTATIONSIDEBARDEFAULTS_) {
            AnnotationSidebar = $injector.get('AnnotationSidebar');
            AnnotationSidebar.options.debug = true;
            $window = _$window_;
            $log = _$log_;
            $timeout = _$timeout_;
            $compile = _$compile_;
            ANNOTATIONSIDEBARDEFAULTS = _ANNOTATIONSIDEBARDEFAULTS_;
        });
    });

    afterEach(function() {
        angular.element('annotation-sidebar').remove();
        delete $window.punditConfig;
        delete $window.PUNDIT;
    });

    var compileAnnotationSidebarDirective = function(){
        var elem = $compile('<annotation-sidebar></annotation-sidebar>')($rootScope);
        $rootScope.$digest();
        return elem;
    };

    it('should change the expanded state', function(){
        var beforeToggleState = AnnotationSidebar.isAnnotationSidebarExpanded();
        expect(AnnotationSidebar.isAnnotationSidebarExpanded()).toEqual(beforeToggleState);
        AnnotationSidebar.toggle();
        expect(AnnotationSidebar.isAnnotationSidebarExpanded()).toEqual(!beforeToggleState);
    });

    it('should change the filter view state', function(){
        var beforeFilterToggleState = AnnotationSidebar.isFiltersExpanded();
        expect(AnnotationSidebar.isFiltersExpanded()).toEqual(beforeFilterToggleState);
        AnnotationSidebar.toggleFiltersContent();
        expect(AnnotationSidebar.isFiltersExpanded()).toEqual(!beforeFilterToggleState);
    });

    it('should read default annotations panel', function(){
        expect(AnnotationSidebar.isAnnotationsPanelActive()).toBe(ANNOTATIONSIDEBARDEFAULTS.annotationsPanelActive);
    });

    it('should read default suggestions panel', function(){
        expect(AnnotationSidebar.isSuggestionsPanelActive()).toBe(ANNOTATIONSIDEBARDEFAULTS.suggestionsPanelActive);
    });

    it('should change the annotations panel view', function(){
        expect(AnnotationSidebar.isAnnotationsPanelActive()).toBe(ANNOTATIONSIDEBARDEFAULTS.annotationsPanelActive);
        expect(AnnotationSidebar.isSuggestionsPanelActive()).toBe(ANNOTATIONSIDEBARDEFAULTS.suggestionsPanelActive);


        AnnotationSidebar.activateAnnotationsPanel();

        expect(AnnotationSidebar.isAnnotationsPanelActive()).toBe(true);
        expect(AnnotationSidebar.isSuggestionsPanelActive()).toBe(false);     
    });

    it('should change the suggestions panel view', function(){
        expect(AnnotationSidebar.isAnnotationsPanelActive()).toBe(ANNOTATIONSIDEBARDEFAULTS.annotationsPanelActive);
        expect(AnnotationSidebar.isSuggestionsPanelActive()).toBe(ANNOTATIONSIDEBARDEFAULTS.suggestionsPanelActive);


        AnnotationSidebar.activateSuggestionsPanel();

        expect(AnnotationSidebar.isAnnotationsPanelActive()).toBe(false);
        expect(AnnotationSidebar.isSuggestionsPanelActive()).toBe(true);     
    });

    it('should reset the filters', function(){

        // AnnotationSidebar.setFilter('authors', 'http://fakeuri.it/test');
        AnnotationSidebar.filters['authors'].expression.push('http://fakeuri.it/test');
        // AnnotationSidebar.toggleActiveFilter('authors', 'http://fakeuri.it/test');
        var elementsList = AnnotationSidebar.getFilters();
        AnnotationSidebar.resetFilters();
        angular.forEach(AnnotationSidebar.filters, function(filter) {
            if (typeof(filter.expression) === 'string'){
                expect(filter.expression).toBe('');
            } else if (typeof(filter.expression) === 'object'){
                // for (var f in elementsList[filter.filterName]){
                //     expect(elementsList[filter.filterName][f].active).toBe(false);
                // }
                expect(filter.expression.length).toBe(0);
            }
        });
    });

    // it('should ..', function(){

    //     $timeout.flush();
    // });

});