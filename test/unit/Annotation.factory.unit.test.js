describe('Annotation', function() {

    var $httpBackend, $log,
        Annotation, NameSpace, ItemsExchange,
        PAGEITEMSCONTAINERDEFAULTS;

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$httpBackend_, _$log_, _ItemsExchange_, _PAGEITEMSCONTAINERDEFAULTS_) {
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
            expect(ItemsExchange.getItemsByContainer(PAGEITEMSCONTAINERDEFAULTS.container).length).toBe(2);
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
            var notebookId = 'e39af478';
            // TODO take it from fixture file
            var targetValue = 'http://metasound.dibet.univpm.it/exmaple';
            expect(ann.uri).toBe(Object.keys(testAnnotations.simple2.metadata)[0]);
            expect(ann.isIncludedIn).toEqual(notebookId);
            expect(ann.target[0]).toEqual(targetValue);
        });
        promise.then(function(ret) {
            ann = ret;
        });
        $httpBackend.flush();
    });
    
});