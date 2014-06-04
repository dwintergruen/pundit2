describe('AnnotationDetails service', function() {
    
    var AnnotationDetails,
        $window,
        $timeout,
        epsilon = 1, // ms to introduce a gap in $timeout.flush()
        $compile,
        $log,
        $httpBackend,
        $rootScope,
        ANNOTATIONDETAILSDEFAULTS,
        Annotation,
        NameSpace;

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_, _$timeout_, _$compile_, _$httpBackend_, _$rootScope_, _ANNOTATIONDETAILSDEFAULTS_) {
            AnnotationDetails = $injector.get('AnnotationDetails');
            Annotation = $injector.get('Annotation');
            NameSpace = $injector.get('NameSpace');
            AnnotationDetails.options.debug = true;
            $window = _$window_;
            $log = _$log_;
            $timeout = _$timeout_;
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            ANNOTATIONDETAILSDEFAULTS = _ANNOTATIONDETAILSDEFAULTS_;
        });
    });

    afterEach(function() {
        angular.element('annotation-details').remove();
        delete $window.punditConfig;
        delete $window.PUNDIT;
    });

    // var compileAnnotationDetailsDirective = function(){
    //     var elem = $compile('<annotation-details></annotation-details>')($rootScope);
    //     $rootScope.$digest();
    //     return elem;
    // };

    

    

});