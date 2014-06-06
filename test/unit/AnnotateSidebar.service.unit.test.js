describe('AnnotationSidebar service', function() {
    
    var AnnotationSidebar,
        $window,
        $timeout,
        epsilon = 1, // ms to introduce a gap in $timeout.flush()
        $compile,
        $log,
        $httpBackend,
        $rootScope,
        ANNOTATIONSIDEBARDEFAULTS,
        Annotation,
        NameSpace;

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_, _$timeout_, _$compile_, _$httpBackend_, _$rootScope_, _ANNOTATIONSIDEBARDEFAULTS_) {
            AnnotationSidebar = $injector.get('AnnotationSidebar');
            Annotation = $injector.get('Annotation');
            NameSpace = $injector.get('NameSpace');
            AnnotationSidebar.options.debug = true;
            $window = _$window_;
            $log = _$log_;
            $timeout = _$timeout_;
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
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

    it('should be initialized the variables of detas', function(){
        var sidebarScope = compileAnnotationSidebarDirective().isolateScope();
        expect(sidebarScope.fromMinDate).not.toEqual('undefined');
        expect(sidebarScope.toMinDate).not.toEqual('undefined');
        expect(sidebarScope.fromMaxDate).not.toEqual('undefined');
        expect(sidebarScope.fromToDate).not.toEqual('undefined');
    });

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
        expect(AnnotationSidebar.isAnnotationsPanelActive()).toEqual(ANNOTATIONSIDEBARDEFAULTS.annotationsPanelActive);
    });

    it('should read default suggestions panel', function(){
        expect(AnnotationSidebar.isSuggestionsPanelActive()).toEqual(ANNOTATIONSIDEBARDEFAULTS.suggestionsPanelActive);
    });

    it('should change the annotations panel view', function(){
        expect(AnnotationSidebar.isAnnotationsPanelActive()).toEqual(ANNOTATIONSIDEBARDEFAULTS.annotationsPanelActive);
        expect(AnnotationSidebar.isSuggestionsPanelActive()).toEqual(ANNOTATIONSIDEBARDEFAULTS.suggestionsPanelActive);


        AnnotationSidebar.activateAnnotationsPanel();

        expect(AnnotationSidebar.isAnnotationsPanelActive()).toEqual(true);
        expect(AnnotationSidebar.isSuggestionsPanelActive()).toEqual(false);     
    });

    it('should change the suggestions panel view', function(){
        expect(AnnotationSidebar.isAnnotationsPanelActive()).toEqual(ANNOTATIONSIDEBARDEFAULTS.annotationsPanelActive);
        expect(AnnotationSidebar.isSuggestionsPanelActive()).toEqual(ANNOTATIONSIDEBARDEFAULTS.suggestionsPanelActive);


        AnnotationSidebar.activateSuggestionsPanel();

        expect(AnnotationSidebar.isAnnotationsPanelActive()).toEqual(false);
        expect(AnnotationSidebar.isSuggestionsPanelActive()).toEqual(true);     
    });

    it('should reset the filters', function(){

        AnnotationSidebar.filters['authors'].expression.push('http://fakeuri.it/test');
        var elementsList = AnnotationSidebar.getFilters();
        AnnotationSidebar.resetFilters();
        angular.forEach(AnnotationSidebar.filters, function(filter) {
            if (typeof(filter.expression) === 'string'){
                expect(filter.expression).toEqual('');
            } else if (typeof(filter.expression) === 'object'){
                expect(filter.expression.length).toEqual(0);
            }
        });
    });


    it('should sidebar get annotation after timeout refresh', function(){
        var myAnnotation;
        var testId = 'foo';
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: testId}))
            .respond(testAnnotations.simple2);
        var ann,
            promise = new Annotation(testId);
        waitsFor(function() { return ann; }, 2000);
        // runs(function() {
        //     expect(ann.id).toEqual(testId);
        // });
        promise.then(function(ret) {
            ann = ret;
        });
        $httpBackend.flush();

        $timeout.flush(AnnotationSidebar.options.annotationsRefresh - epsilon);
        myAnnotation = AnnotationSidebar.getAllAnnotations();
        expect(myAnnotation.length).toEqual(0);

        $timeout.flush(2 * epsilon);
        myAnnotation = AnnotationSidebar.getAllAnnotations();
        expect(myAnnotation.length).toEqual(1);
    });

    it('should filter be applied to the list of filtered annotations', function(){
        AnnotationSidebar.filters['authors'].expression.push('http://fakeuri.it/test');
        var currentFilters = AnnotationSidebar.filters;
        var myAnnotationFiltered = AnnotationSidebar.getAllAnnotationsFiltered(currentFilters);

        expect(myAnnotationFiltered.length).toEqual(0);
    });

    it('should service know if some filters are active', function(){
        AnnotationSidebar.resetFilters();
        expect(AnnotationSidebar.needToFilter()).toEqual(false);

        AnnotationSidebar.filters['authors'].expression.push('http://fakeuri.it/test');
        expect(AnnotationSidebar.needToFilter()).toEqual(true);
    });

    it('should setFilters works only if element exists in the current annotations', function(){
        AnnotationSidebar.resetFilters();
        expect(AnnotationSidebar.needToFilter()).toEqual(false);

        AnnotationSidebar.setFilter('authors', 'http://fakeuri.it/testAuthor');
        expect(AnnotationSidebar.needToFilter()).toEqual(false);
        AnnotationSidebar.removeFilter('authors', 'http://fakeuri.it/testAuthor');
    });

});