/*global testNotebooks*/

describe('Notebook factory', function() {
    
    var Notebook, NOTEBOOKDEFAULTS, NameSpace,
        $httpBackend, $log;
    
    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_$httpBackend_, _$log_, _NOTEBOOKDEFAULTS_,  _Notebook_, _NameSpace_){
        $httpBackend = _$httpBackend_;
        $log = _$log_;
        NOTEBOOKDEFAULTS = _NOTEBOOKDEFAULTS_;
        Notebook = _Notebook_;
        NameSpace = _NameSpace_;
    }));

    it("should start an http call when passing a notebook ID", function() {
        var testId = 'foo';
        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond({});

        new Notebook(testId);
        $httpBackend.flush();
    });

    it("should reject promise and raise an error when GET fail", function() {
        var testId = 'foo';
        $log.reset();
        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond(500, 'error msg');

        var promise = new Notebook(testId);

        // promise is rejected after flush
        promise.then(function(){ }, function(ret) {
            expect(ret.indexOf("500")).toBeGreaterThan(-1);
            expect($log.error.logs.length).toBe(1);
        });

        $httpBackend.flush();
        
    });

    it("should resolve promise when GET success", function() {
        var testId = 'simple1ID';
        $log.reset();
        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);

        var promise = new Notebook(testId);

        // promise is resolved after flush
        promise.then(function(nt){
            expect(nt.id).toBe('simple1ID');
            expect(nt.label).toBe('Notebook Label');

            expect(nt.visibility).toBe('private');
            expect(nt.isPublic()).toBe(false);
            expect(nt.isCurrent()).toBe(false);

            expect(nt.creatorName).toBe('Giacomo');
            expect(nt.includes.length).toBe(1);
            expect(nt.includes[0]).toBe('testannid99');
        });

        $httpBackend.flush();
        
    });

    it("should have prototype properties", function() {
        var testId = 'simple1ID';
        $log.reset();
        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);

        var promise = new Notebook(testId);

        // promise is resolved after flush
        promise.then(function(nt){
            expect(nt.getIcon()).toBe(NOTEBOOKDEFAULTS.iconDefault);
            expect(nt.getClass()).toBe(NOTEBOOKDEFAULTS.classDefault);

            nt.setPublic();
            expect(nt.isPublic()).toBe(true);
            nt.setPrivate();
            expect(nt.isPublic()).toBe(false);

        });

        $httpBackend.flush();
        
    });

});