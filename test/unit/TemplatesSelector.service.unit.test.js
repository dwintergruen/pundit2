describe('TemplatesSelector service', function() {
    
    var TemplatesSelector, TemplatesExchange, Config, ItemsExchange,
        $rootScope, $httpBackend;

    beforeEach(function(){
        module('Pundit2');
    });

    beforeEach(inject(function(_TemplatesSelector_, _TemplatesExchange_, _ItemsExchange_, _Config_,
        _$rootScope_, _$httpBackend_){

        TemplatesSelector = _TemplatesSelector_;
        TemplatesExchange = _TemplatesExchange_;
        Config = _Config_;
        ItemsExchange = _ItemsExchange_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;

    }));

    it('should resolve the promise if config templates are empty', function(){
        Config.templates = [];
        var resolved;
        TemplatesSelector.getAll().then(function(){
            resolved = true;
            expect(TemplatesExchange.getTemplates().length).toBe(0);
        });
        $rootScope.$digest();
        expect(resolved).toBe(true);
    });

    it('should resolve the promise if server responde undefined', function(){
        Config.templates = ['http://template-url-test-conf.com/t1'];
        $httpBackend.expectJSONP(new RegExp(Config.templates[0])).respond(undefined);

        var resolved;
        TemplatesSelector.getAll().then(function(){
            resolved = true;
            expect(TemplatesExchange.getTemplates().length).toBe(0);
        });

        $httpBackend.flush();
        expect(resolved).toBe(true);
    });

    it('should resolve the promise if server responde with error', function(){
        Config.templates = ['http://template-url-test-conf.com/t1'];
        $httpBackend.expectJSONP(new RegExp(Config.templates[0])).respond(500, undefined);

        var resolved;
        TemplatesSelector.getAll().then(function(){
            resolved = true;
            expect(TemplatesExchange.getTemplates().length).toBe(0);
        });

        $httpBackend.flush();
        expect(resolved).toBe(true);
    });

    it('should correctly import template from jsonp', function(){
        Config.templates = ['http://template-url-test-conf.com/t1'];
        $httpBackend.expectJSONP(new RegExp(Config.templates[0])).respond({
            triples: [
                {
                    predicate: {uri: 'predicateTestUri', label: 'predicate label'} // uri, label, range, domain
                }
            ]
        });

        var resolved;
        TemplatesSelector.getAll().then(function(){
            resolved = true;

            var tmpls = TemplatesExchange.getTemplates();
            expect(tmpls.length).toBe(1);
            expect(tmpls[0].id).toBe(Config.templates[0]);
            expect(tmpls[0].triples.length).toBe(1);
            expect(tmpls[0].triples[0].predicate.uri).toBe('predicateTestUri');
            expect(tmpls[0].triples[0].predicate.type[0]).toBe("http://www.w3.org/1999/02/22-rdf-syntax-ns#Property");

            var predicate = ItemsExchange.getItemByUri('predicateTestUri');
            expect(predicate).toBeDefined();
            expect(predicate.label).toBe('predicate label');
        });

        $httpBackend.flush();
        expect(resolved).toBe(true);
    });

});