describe('AnnotationsExchange service', function() {
    
    var AnnotationsExchange,
        $q,
        $rootScope,
        $httpBackend;

    var url = "http://demo-cloud.as.thepund.it:8080/annotationserver/api/open/metadata/search?query=%7B%22resources%22:%5B%22http:%2F%2Fpurl.org%2Fpundit%2Fdemo-cloud-server%2Fannotation%2F0e097114%22%5D%7D&scope=all";
    
    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_AnnotationsExchange_, _$rootScope_, _$q_, _$httpBackend_){
        AnnotationsExchange = _AnnotationsExchange_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
    }));

    afterEach(function(){
        AnnotationsExchange.wipe();
    });

    it('should correctly add annotation', function(){
        var ann = {
            _q: $q.defer(),
            id: "testAnnId1",
            graph: {},
            items: {}
        };

        AnnotationsExchange.addAnnotation(ann);

        var list = AnnotationsExchange.getAnnotations(),
            idList = AnnotationsExchange.getAnnotationsHash();
        // ann is added when the promise is resolved
        expect(list.length).toBe(0);
        expect(idList[ann.id]).toBeUndefined();
        ann._q.resolve(ann);
        $rootScope.$apply();
        expect(list.length).toBe(1);
        expect(idList[ann.id]).toBe(ann);
        expect(list[0]).toBe(ann);

        // not duplicate annotation (by id)
        var ann2 = {
            _q: $q.defer(),
            id: "testAnnId1"
        };
        AnnotationsExchange.addAnnotation(ann2);
        ann2._q.resolve(ann2);
        $rootScope.$apply();
        expect(list.length).toBe(1);
        // not override annotation
        expect(idList[ann.id]).toBe(ann);
    });

    it('should correctly wipe annotations', function(){
        var ann = {
            _q: $q.defer(),
            id: "testAnnId1",
            graph: {},
            items: {}
        };
        var ann2 = {
            _q: $q.defer(),
            id: "testAnnId2",
            graph: {},
            items: {}
        };

        AnnotationsExchange.addAnnotation(ann);
        AnnotationsExchange.addAnnotation(ann2);
        ann._q.resolve(ann);
        ann2._q.resolve(ann2);
        $rootScope.$apply();

        expect(AnnotationsExchange.getAnnotations().length).toBe(2);

        AnnotationsExchange.wipe();
        
        expect(AnnotationsExchange.getAnnotations().length).toBe(0);
    });

    it('should correctly get annotation by id', function(){
        var ann = {
            _q: $q.defer(),
            id: "testAnnId1",
            graph: {},
            items: {}
        };
        var ann2 = {
            _q: $q.defer(),
            id: "testAnnId2",
            graph: {},
            items: {}
        };

        AnnotationsExchange.addAnnotation(ann);
        AnnotationsExchange.addAnnotation(ann2);
        ann._q.resolve(ann);
        ann2._q.resolve(ann2);
        $rootScope.$apply();

        expect(AnnotationsExchange.getAnnotationById("testAnnId1")).toBe(ann);
        expect(AnnotationsExchange.getAnnotationById("fakeAnnId")).toBeUndefined();
    });

    it('should correctly search annotation by uri', function(){
        var resolved = false,
            httpRes = {
            'http://purl.org/pundit/demo-cloud-server/annotation/0e097114': {
                creator: [ {type: 'uri', value: 'http://purl.org/pundit/demo-cloud-server/user/00c16512'} ]
            }
        };

        $httpBackend.whenGET(url).respond(httpRes);

        var promise = AnnotationsExchange.searchByUri('http://purl.org/pundit/demo-cloud-server/annotation/0e097114');
        promise.then(function(ids){
            resolved = true;
            expect(ids.length).toBe(1);
            expect(ids[0]).toEqual("0e097114");
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(resolved).toBe(true);
        
    });

    it('should correctly reject promise when search annotation by uri and not found it', function(){
        var rejected = false,
            httpRes = {
            'http://purl.org/pundit/demo-cloud-server/annotation/0e097114': {
                creator: [ {type: 'uri', value: 'http://purl.org/pundit/demo-cloud-server/user/00c16512'} ]
            }
        };

        $httpBackend.whenGET(url).respond(500, 'error msg');

        var promise = AnnotationsExchange.searchByUri('http://purl.org/pundit/demo-cloud-server/annotation/0e097114');
        promise.then( function(){ },function(msg){
            rejected = true;
            expect(msg.indexOf("500")).toBeGreaterThan(-1);
        });

        $httpBackend.flush();
        $rootScope.$apply();

        expect(rejected).toBe(true);
        
    });

});