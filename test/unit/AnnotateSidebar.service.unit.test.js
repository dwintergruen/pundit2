describe('AnnotationSidebar service', function() {
    
    var AnnotationSidebar,
        $window,
        $log;

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_) {
            AnnotationSidebar = $injector.get('AnnotationSidebar');
            AnnotationSidebar.options.debug = true;
            $window = _$window_;
            $log = _$log_;
        });
    });

    afterEach(function() {
        delete $window.punditConfig;
        delete $window.PUNDIT;
    });

    // it('should ..', function(){
    //     expect(AnnotationSidebar.isAnnotationSidebarExpanded()).toEqual(AnnotationSidebar.options.isAnnotationSidebarExpanded);
    // });

    it('should change the expanded state', function(){
        var beforeToggleState = AnnotationSidebar.isAnnotationSidebarExpanded();
        expect(AnnotationSidebar.isAnnotationSidebarExpanded()).toEqual(beforeToggleState);
        AnnotationSidebar.toggle();
        expect(AnnotationSidebar.isAnnotationSidebarExpanded()).toEqual(!beforeToggleState);
    });

    // it('should change the filter view state', function(){
    //     var beforeFilterToggleState = AnnotationSidebar.isFiltersExpanded();
    //     expect(AnnotationSidebar.isFiltersExpanded()).toEqual(beforeFilterToggleState);
    //     AnnotationSidebar.toggleFiltersContent();
    //     expect(AnnotationSidebar.isAnnotationSidebarExpanded()).toEqual(!beforeFilterToggleState);
    // });


});