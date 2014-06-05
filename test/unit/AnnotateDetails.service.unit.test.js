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
        NameSpace,
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

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_, _$timeout_, _$compile_, _$httpBackend_, _$rootScope_, _ANNOTATIONDETAILSDEFAULTS_) {
            AnnotationDetails = $injector.get('AnnotationDetails');
            Annotation = $injector.get('Annotation');
            NameSpace = $injector.get('NameSpace');
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
        var myAnnotation;
        var testId = 'foo';

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
        var ann,
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
    
        var fakeScope = {
            id: 'foo'
        };
        AnnotationDetails.addAnnotationReference(fakeScope);

        var currentAnnotationDetails = AnnotationDetails.getAnnotationDetails('foo');
        expect(currentAnnotationDetails.id).toEqual('foo');
    });

    it('shoud ...', function(){
        // var fakeScope = {
        //     id: 'foo'
        // };
        // AnnotationDetails.addAnnotationReference(fakeScope);
        // console.log(AnnotationDetails.getAnnotationViewStatus('foo'));
    });
    

    

});