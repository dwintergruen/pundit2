/*global testAnnotations*/

describe('Annotation', function() {

    var $httpBackend, $log,
        Annotation, NameSpace, ItemsExchange,
        PAGEITEMSCONTAINERDEFAULTS;

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$httpBackend_, _$log_) {
            $httpBackend = _$httpBackend_;
            $log = _$log_;
            Annotation = $injector.get('Annotation');
            NameSpace = $injector.get('NameSpace');
            ItemsExchange = $injector.get('ItemsExchange');
            PAGEITEMSCONTAINERDEFAULTS = $injector.get('PAGEITEMSCONTAINERDEFAULTS');
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
        var ann;
        var testId = 'foo';
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: testId}))
            .respond({});

        ann = new Annotation(testId);
        $httpBackend.flush();
    });


    it("should raise an error when the response from the server is undefined", function() {
        var ann,
            promise,
            testId = 'foo';

        promise = new Annotation(testId);
        promise.then(function(ret) { ann = ret; });

        mockAsOpenAnn(testId, undefined);

        // When ann is ready (promise got resolved), runs the tests
        waitsFor(function() { return ann; }, 2000);
        runs(function() {
            expect(ann.id).toBe(testId);
            expect($log.error.logs.length).toBe(1);
        });
    });

    it("should reject promise and raise an error when GET fail", function() {
        var testId = 'foo';
        $log.reset();
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: testId}))
            .respond(500, 'error msg');

        var promise = new Annotation(testId);

        // promise is rejected after flush
        promise.then(function(){ }, function(ret) {
            expect(ret.indexOf("500")).toBeGreaterThan(-1);
            expect($log.error.logs.length).toBe(1);
        });

        $httpBackend.flush();
        
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

    it("should correctly add entities, predicates and items uri to annotation", function() {
        var testId = 'foo';
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: testId}))
            .respond(testAnnotations.simple2);

        var ann,
            promise = new Annotation(testId);
        waitsFor(function() { return ann; }, 2000);
        runs(function() {
            var subUri = Object.keys(testAnnotations.simple2.graph)[0],
                predUri = Object.keys(testAnnotations.simple2.graph[subUri])[0],
                objUri = testAnnotations.simple2.graph[subUri][predUri][0].value;

            expect(ann.id).toBe(testId);

            expect(ann.entities[0]).toBe(subUri);
            expect(typeof(ann.items[subUri])).toBe('object');

            expect(ann.predicates[0]).toBe(predUri);
            expect(typeof(ann.items[predUri])).toBe('object');

            expect(ann.entities[1]).toBe(objUri);
            expect(typeof(ann.items[objUri])).toBe('object');

        });
        promise.then(function(ret) {
            ann = ret;
        });
        $httpBackend.flush();
    });

    it("should correctly add annotation items to itemsExchange", function() {
        var testId = 'foo';
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: testId}))
            .respond(testAnnotations.simple2);

        var ann,
            promise = new Annotation(testId);
        waitsFor(function() { return ann; }, 2000);
        runs(function() {
            var subUri = Object.keys(testAnnotations.simple2.graph)[0],
                predUri = Object.keys(testAnnotations.simple2.graph[subUri])[0],
                objUri = testAnnotations.simple2.graph[subUri][predUri][0].value;

            var subject = ItemsExchange.getItemByUri(subUri),
                predicate = ItemsExchange.getItemByUri(predUri),
                object = ItemsExchange.getItemByUri(objUri);

            expect(typeof(subject)).toBe('object');
            expect(typeof(predicate)).toBe('object');
            expect(typeof(object)).toBe('object');

            // items is added to page items container (not predicate)
            expect(ItemsExchange.getItemsByContainer(PAGEITEMSCONTAINERDEFAULTS.container).length).toBe(3);
        });
        promise.then(function(ret) {
            ann = ret;
        });
        $httpBackend.flush();
    });

    it("should correctly add annotation metadata", function() {
        var testId = 'foo';
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: testId}))
            .respond(testAnnotations.simple2);

        var ann,
            promise = new Annotation(testId);
        waitsFor(function() { return ann; }, 2000);
        runs(function() {
            var metaUri = Object.keys(testAnnotations.simple2.metadata)[0];
            var currentMeta = testAnnotations.simple2.metadata[metaUri];
            var isIncludedInUri = currentMeta[NameSpace.annotation.isIncludedIn][0].value;
            var notebookId = isIncludedInUri.match(/[a-z0-9]*$/)[0];
            
            var targetValue = currentMeta[NameSpace.annotation.target][0].value;

            expect(ann.uri).toBe(Object.keys(testAnnotations.simple2.metadata)[0]);
            expect(ann.isIncludedIn).toEqual(notebookId);
            expect(ann.target[0]).toEqual(targetValue);
        });
        promise.then(function(ret) {
            ann = ret;
        });
        $httpBackend.flush();
    });

    it("should annotation be broken before consolidation", function() {
        var testId = 'foo';
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: testId}))
            .respond(testAnnotations.simple2);

        var ann,
            promise = new Annotation(testId);
        waitsFor(function() { return ann; }, 2000);
        runs(function() {
            expect(ann.isBroken()).toBe(true);

        });
        promise.then(function(ret) {
            ann = ret;
        });
        $httpBackend.flush();
    });
    
});