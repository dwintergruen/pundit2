describe('Annomatic service', function() {

    var Annomatic, $httpBackend, $compile, $rootScope, $document,
        testAnnotationsEmpty = {
            time: 0,
            annotations: []
        },
        // TODO: read this from a fixture file
        testAnnotations = {
            time: 1,
            annotations: [
                {
                    "start": 3,
                    "end": 7,
                    "spot": "Pisa",
                    "confidence": 0.855,
                    "id": 9164,
                    "title": "Provincia di Pisa",
                    "uri": "http://it.wikipedia.org/wiki/Provincia_di_Pisa",
                    "abstract": "La provincia di Pisa è una provincia italiana della Toscana di oltre 415 000 abitanti. È la seconda Provincia toscana per popolazione.",
                    "label": "Provincia di Pisa",
                    "categories": [
                      "Provincia di Pisa"
                    ],
                    "types": [
                      "http://dbpedia.org/ontology/Place",
                      "http://dbpedia.org/ontology/PopulatedPlace",
                      "http://dbpedia.org/ontology/Settlement"
                    ],
                    "image": {
                      "full": "https://upload.wikimedia.org/wikipedia/commons/b/bf/Toscana_Pisa1_tango7174.jpg",
                      "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Toscana_Pisa1_tango7174.jpg/200px-Toscana_Pisa1_tango7174.jpg"
                    },
                    "lod": {
                      "wikipedia": "http://it.wikipedia.org/wiki/Provincia_di_Pisa",
                      "dbpedia": "http://it.dbpedia.org/resource/Provincia_di_Pisa"
                    }
                },
                {
                    "start": 13,
                    "end": 28,
                    "spot": "comune italiano",
                    "confidence": 0.9172,
                    "id": 1217,
                    "title": "Comuni d'Italia",
                    "uri": "http://it.wikipedia.org/wiki/Comuni_d%27Italia",
                    "abstract": "Il comune, in Italia, è l'ente locale fondamentale, autonomo ed indipendente secondo i princìpi consolidatisi nel Medioevo, e ripresi, in modo relativamente limitato, dalla rivoluzione francese, previsto dall' della Costituzione. Può essere suddiviso in frazioni, le quali possono a loro volta avere un limitato potere consultivo grazie alle consulte di frazione.",
                    "label": "Comune italiano",
                    "categories": [
                        "Comuni d'Italia",
                        "Diritto amministrativo italiano",
                        "Diritto costituzionale italiano"
                    ],
                    "types": [
                        "http://dbpedia.org/ontology/Place",
                        "http://dbpedia.org/ontology/PopulatedPlace",
                        "http://dbpedia.org/ontology/Settlement"
                    ],
                    "image": {
                        "full": "https://upload.wikimedia.org/wikipedia/commons/c/c3/Corona_di_comune.svg",
                        "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Corona_di_comune.svg/200px-Corona_di_comune.svg.png"
                    },
                    "lod": {
                        "wikipedia": "http://it.wikipedia.org/wiki/Comuni_d%27Italia",
                        "dbpedia": "http://it.dbpedia.org/resource/Comuni_d'Italia"
                    }
                },
            ]
        };

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$httpBackend_, _$compile_, _$rootScope_, _$document_) {
            Annomatic = $injector.get('Annomatic');
            $httpBackend = _$httpBackend_;
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $document = _$document_;
        });
    });

    afterEach(function() {
        angular.element('div.test-content').remove();
    });

    var annotateTestContent = function() {
        $httpBackend
            .when('POST', "https://api.dandelion.eu/datatxt/nex/v1?include_abstract=true&include_categories=true&include_image=true&include_lod=true&include_types=true&lang=it&min_confidence=0&min_length=3")
            .respond(testAnnotations);

        var elem = $compile("<div class='test-content'><p>Pisa è un comune italiano di 86.591 abitanti</p></div>")($rootScope);
        angular.element('body').append(elem);

        Annomatic.getDataTXTAnnotations(elem);
        $httpBackend.flush();

        return elem;
    };

    it('should start with no annotation', function() {
        expect(Annomatic.annotationNumber).toBe(0);
        expect(Annomatic.ann.byNum.length).toBe(0);
    });

    // TODO: move the httpbackend stuff to a function
    it('should get annotations with an HTTP call', function() {
        $httpBackend
            .when('POST', "https://api.dandelion.eu/datatxt/nex/v1?include_abstract=true&include_categories=true&include_image=true&include_lod=true&include_types=true&lang=it&min_confidence=0&min_length=3")
            .respond(testAnnotationsEmpty);
        
        var elem = $compile("Some random content")($rootScope);
        Annomatic.getDataTXTAnnotations(elem);

        $httpBackend.flush();
    });

});