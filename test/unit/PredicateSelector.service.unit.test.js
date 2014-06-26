describe('PredicateSelector service', function() {

    var PredicateSelector,
        Config,
        $httpBackend;

    beforeEach(module('Pundit2'));

    var testUrl1 = "http://testUrl.jsonp"
    var testPunditConfig = {
        vocabularies: [testUrl1]
    };
    beforeEach(function(){
        // extend default config
        window.punditConfig = testPunditConfig;
        module('Pundit2');
    });

    afterEach(function(){
        delete window.punditConfig;
    });

    beforeEach(inject(function(_$httpBackend_, _PredicateSelector_, _Config_){
        $httpBackend = _$httpBackend_;
        PredicateSelector = _PredicateSelector_;
        Config = _Config_;
    }));

    var emptyResult = {
        result: {}
    };
    var badResult = {
        result: {vocab_type: "wrong-type"}
    };
    var badResult2 = {
        result: {
            vocab_type: "predicates"
            // not have items property
        }
    };
    var goodResult = {
        result: {
            vocab_type: "predicates",
            items: [
                {
                    "value":"http://purl.org/dc/terms/creator",
                    "label":"has creator",
                    "description":"The selected text fragment has been created by a specific Person",
                    "nodetype":"node",
                    "is_root_node":true,
                    "rdftype":[
                        "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
                    ],
                    "domain":[
                        "http://xmlns.com/foaf/0.1/Image",
                        "http://purl.org/pundit/ont/ao#fragment-image",
                        "http://purl.org/pundit/ont/ao#fragment-text"
                    ],
                    "range":[
                        "http://dbpedia.org/ontology/Person",
                        "http://xmlns.com/foaf/0.1/Person",
                        "http://www.freebase.com/schema/people/person"
                    ],
                    "children":{}
                }
            ]
        }
    };

    it("should correctly resolve promise if get empty result", function(){
        $httpBackend.whenJSONP(testUrl1+"?jsonp=JSON_CALLBACK").respond(emptyResult);

        var called = false;
        PredicateSelector.getAllVocabularies().then(function(res){
            called = true;
            expect(res.length).toBe(0);
        });

        $httpBackend.flush();
        expect(called).toBe(true);
    });

    it("should correctly resolve promise if get undefined", function(){
        $httpBackend.whenJSONP(testUrl1+"?jsonp=JSON_CALLBACK").respond(undefined);

        var called = false;
        PredicateSelector.getAllVocabularies().then(function(res){
            called = true;
            expect(res.length).toBe(0);
        });

        $httpBackend.flush();
        expect(called).toBe(true);
    });

    it("should correctly resolve promise if get non predicates vocabularie type", function(){
        $httpBackend.whenJSONP(testUrl1+"?jsonp=JSON_CALLBACK").respond(badResult);

        var called = false;
        PredicateSelector.getAllVocabularies().then(function(res){
            called = true;
            expect(res.length).toBe(0);
        });

        $httpBackend.flush();
        expect(called).toBe(true);
    });

    it("should correctly resolve promise if get result without items", function(){
        $httpBackend.whenJSONP(testUrl1+"?jsonp=JSON_CALLBACK").respond(badResult2);

        var called = false;
        PredicateSelector.getAllVocabularies().then(function(res){
            called = true;
            expect(res.length).toBe(0);
        });

        $httpBackend.flush();
        expect(called).toBe(true);
    });

    it("should correctly resolve promise if get a good result", function(){
        $httpBackend.whenJSONP(testUrl1+"?jsonp=JSON_CALLBACK").respond(goodResult);

        var called = false;
        PredicateSelector.getAllVocabularies().then(function(res){
            called = true;
            expect(res.length).toBe(1);
        });

        $httpBackend.flush();
        expect(called).toBe(true);
    });

});