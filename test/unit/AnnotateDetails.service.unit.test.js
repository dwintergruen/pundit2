/*global testAnnotations*/

describe('AnnotationDetails service', function() {
    
    var AnnotationDetails,
        $window,
        $timeout,
        // epsilon = 1, // ms to introduce a gap in $timeout.flush()
        $compile,
        $log,
        $httpBackend,
        $rootScope,
        ANNOTATIONDETAILSDEFAULTS,
        Annotation,
        NameSpace,
        EventDispatcher,
        MyPundit;

    var userLoggedIn = {
        loginStatus: 1,
        id: "myFakeId",
        uri: "http://myUri.fake",
        openid: "http://myOpenId.fake",
        firstName: "Mario",
        lastName: "Rossi",
        fullName: "Mario Rossi",
        email: "mario@rossi.it",
        loginServer: "http:\/\/demo-cloud.as.thepund.it:8080\/annotationserver\/login.jsp"
    };

    var fakeScope = {
        id: 'foo'
    };

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_, _$timeout_, _$compile_, _$httpBackend_, _$rootScope_, _ANNOTATIONDETAILSDEFAULTS_) {
            AnnotationDetails = $injector.get('AnnotationDetails');
            Annotation = $injector.get('Annotation');
            NameSpace = $injector.get('NameSpace');
            EventDispatcher = $injector.get('EventDispatcher');
            MyPundit = $injector.get('MyPundit');
            AnnotationDetails.options.debug = true;
            $window = _$window_;
            $log = _$log_;
            $timeout = _$timeout_;
            $compile = _$compile_;
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            ANNOTATIONDETAILSDEFAULTS = _ANNOTATIONDETAILSDEFAULTS_;
        });

        var promiseValue;

        var testId = fakeScope.id;

        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);

        // check if user is logged in or not
        var promise = MyPundit.checkLoggedIn();

        // waiting promise get be resolved
        waitsFor(function() { return typeof(promiseValue) !== 'undefined'; }, 2000);
        promise.then(function(val) {
            promiseValue = val;
        });

        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: testId}))
            .respond(testAnnotations.simple2);
        var ann;
        promise = new Annotation(testId);
        waitsFor(function() { return ann; }, 2000);
        promise.then(function(ret) {
            ann = ret;
        });
        
        $rootScope.$digest();
        $httpBackend.flush();

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


    it('should load correctly the annotations in the model', function(){
        AnnotationDetails.addAnnotationReference(fakeScope);

        var currentAnnotationDetails = AnnotationDetails.getAnnotationDetails(fakeScope.id);
        expect(currentAnnotationDetails.id).toEqual(fakeScope.id);
    });

    it('should read default expanded status', function(){
        AnnotationDetails.addAnnotationReference(fakeScope);
        expect(AnnotationDetails.getAnnotationViewStatus(fakeScope.id)).toEqual(ANNOTATIONDETAILSDEFAULTS.defaultExpanded);
    });

    it('should open annotation view', function(){
        AnnotationDetails.addAnnotationReference(fakeScope);
        expect(AnnotationDetails.getAnnotationViewStatus(fakeScope.id)).toEqual(ANNOTATIONDETAILSDEFAULTS.defaultExpanded);
        AnnotationDetails.openAnnotationView(fakeScope.id);
        expect(AnnotationDetails.getAnnotationViewStatus(fakeScope.id)).toEqual(true);
    });

    it('should open single annotation view', function(){
        AnnotationDetails.addAnnotationReference(fakeScope);
        expect(AnnotationDetails.getAnnotationViewStatus(fakeScope.id)).toEqual(ANNOTATIONDETAILSDEFAULTS.defaultExpanded);
        AnnotationDetails.openAnnotationView(fakeScope.id);
        expect(AnnotationDetails.getAnnotationViewStatus(fakeScope.id)).toEqual(true);
    });

    it('should toggle annotation view', function(){
        AnnotationDetails.addAnnotationReference(fakeScope);
        expect(AnnotationDetails.getAnnotationViewStatus(fakeScope.id)).toEqual(ANNOTATIONDETAILSDEFAULTS.defaultExpanded);
        AnnotationDetails.toggleAnnotationView(fakeScope.id);
        expect(AnnotationDetails.getAnnotationViewStatus(fakeScope.id)).not.toEqual(ANNOTATIONDETAILSDEFAULTS.defaultExpanded);
    });

    it('should close all annotation view', function(){
        AnnotationDetails.addAnnotationReference(fakeScope);
        expect(AnnotationDetails.getAnnotationViewStatus(fakeScope.id)).toEqual(ANNOTATIONDETAILSDEFAULTS.defaultExpanded);
        AnnotationDetails.openAnnotationView(fakeScope.id);
        AnnotationDetails.closeAllAnnotationView();
        expect(AnnotationDetails.getAnnotationViewStatus(fakeScope.id)).toEqual(false);
    });

    it('should update annotation details and open it', function(){
        // $rootScope.$emit('update-annotation-completed', fakeScope.id);
        EventDispatcher.sendEvent('AnnotationsCommunication.editAnnotation', fakeScope.id)
        var currentAnnotationDetails = AnnotationDetails.getAnnotationDetails(fakeScope.id);
        expect(typeof(currentAnnotationDetails)).toBe('object');
        expect(currentAnnotationDetails.expanded).toEqual(true);
    });

    it('should reset all annotation state', function(){
        AnnotationDetails.addAnnotationReference(fakeScope);
        AnnotationDetails.closeViewAndReset();
        var currentAnnotationDetails = AnnotationDetails.getAnnotationDetails(fakeScope.id);
        expect(currentAnnotationDetails.expanded).toEqual(false);
        expect(currentAnnotationDetails.ghosted).toEqual(false);
    });

    it('should user tool showed', function(){
        var userUri = userLoggedIn.uri;
        var isUser = AnnotationDetails.isAnnotationUser(userUri);
        expect(isUser).toEqual(true);
        var isTool = AnnotationDetails.isUserToolShowed(userUri);
        expect(isTool).toEqual(true);
    });

    it('should change ghost status', function(){
        AnnotationDetails.addAnnotationReference(fakeScope);
        
        AnnotationDetails.setGhosted(fakeScope.id);
        expect(AnnotationDetails.isAnnotationGhosted(fakeScope.id)).toEqual(true);
        
        AnnotationDetails.resetGhosted();
        expect(AnnotationDetails.isAnnotationGhosted(fakeScope.id)).toEqual(false);
    });
});