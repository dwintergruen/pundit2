describe('Annotation', function() {

    var $httpBackend, $log,
        Annotation, NameSpace;

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$httpBackend_, _$log_) {
            $httpBackend = _$httpBackend_;
            $log = _$log_;
            Annotation = $injector.get('Annotation');
            NameSpace = $injector.get('NameSpace');
        });
    });

    var mockAsOpenAnn = function(id, res) {
        $log.reset();
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: id}))
            .respond(res);
        $httpBackend.flush();
    };

    it("should start an http call when passing an annotation ID", function() {
        var testId = 'foo';
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: testId}))
            .respond({});

        var ann = new Annotation(testId);
        $httpBackend.flush();
    });


    it("should raise an error when the response from the server is undefined", function() {
        var ann, promise,
            testId = 'foo';

        promise = new Annotation(testId);
        promise.then(function(ret) { ann = ret; });

        mockAsOpenAnn(testId, undefined);

        // When ann is ready (promise got resolved), runs the tests
        waitsFor(function() { return ann; }, 2000);
        runs(function() {
            expect(ann.id).toBe(testId);
            expect($log.error.logs.length).toBe(1);
            console.log('ara che ann 111 ', ann.id, $log.error.logs);
        });
    });

    it("should resolve a promise when the server has responded", function() {
        var testId = 'foo';
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: testId}))
            .respond(testAnnotations.simple1);

        var ann,
            promise = new Annotation(testId);
        waitsFor(function() { return ann; }, 2000);
        runs(function() {
            expect(ann.id).toBe(testId);
        });
        promise.then(function(ret) {
            ann = ret;
        });
        $httpBackend.flush();

    });
    
});