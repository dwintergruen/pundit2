describe('KorboEECommunication service', function() {

    var $httpBackend,
        $q,
        $rootScope,
        ItemsExchange,
        Item,
        KorboCommunicationService,
        KorboCommunicationFactory,
        $compile;

    var val = "Dante";
    var endpoint = "http://korbo.local";
    var prov = "korbo";
    var limit = 10;
    var offset = 0;
    var lang = "en";

    beforeEach(module('Pundit2'));

    beforeEach(inject(function( _$httpBackend_, _$q_, _$rootScope_, _ItemsExchange_, _Item_, _KorboCommunicationService_, _KorboCommunicationFactory_, _$compile_){
        ItemsExchange = _ItemsExchange_;
        Item = _Item_;
        KorboCommunicationService = _KorboCommunicationService_;
        KorboCommunicationFactory = _KorboCommunicationFactory_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    it('should set loading status correctly ', function(){

        // as default, loading should be false
        expect(KorboCommunicationService.isAutocompleteLoading()).toBe(false);

        // set loading to true
        KorboCommunicationService.setAutocompleteLoading(true);
        expect(KorboCommunicationService.isAutocompleteLoading()).toBe(true);

        // set loading to false
        KorboCommunicationService.setAutocompleteLoading(false);
        expect(KorboCommunicationService.isAutocompleteLoading()).toBe(false);
    });

    it('should start autocomplete search and return valid results', function(){

        // response with 3 items
        var itemResponseProv = {
            data: [{available_languages:["en"],uri:"http://uri1", basket_id:1,id:114,label:"label1",abstract:"",type:["http:\/\/person.uri","http:\/\/scientist.uri"],"depiction":""},
                {available_languages:["en"],uri:"http://uri2",basket_id:1,id:115,label:"label2",abstract:"",type:["http:\/\/person.uri","http:\/\/scientist.uri"],"depiction":""},
                {available_languages:["en"],uri:"http://uri3",basket_id:1,id:116,label:"label3",abstract:"",type:["http:\/\/person.uri","http:\/\/scientist.uri"],"depiction":""}],
            metadata: { limit: 10, offset: 0, totalCount: 3, pageCount: 1 }
        };

        $httpBackend
            .whenGET('http://korbo.local/search/items?lang=en&limit=10&offset=0&p=korbo&q=Dante')
            .respond(itemResponseProv);

        // at this time, autocomplete is not loading
        expect(KorboCommunicationService.isAutocompleteLoading()).toBe(false);

        var promise = KorboCommunicationService.autocompleteSearch(val, endpoint, prov, limit, offset, lang);

        // at this time autocomplete is loading
        expect(KorboCommunicationService.isAutocompleteLoading()).toBe(true);

        // when promise is resolved...
        promise.then(function(res){

            // ... loading should be stopped...
            expect(KorboCommunicationService.isAutocompleteLoading()).toBe(false);

            //... response should contain items...
            expect(res.length).toBe(itemResponseProv.data.length);
            expect(res[0].uri).toBe(itemResponseProv.data[0].uri);
            expect(res[1].uri).toBe(itemResponseProv.data[1].uri);
            expect(res[2].uri).toBe(itemResponseProv.data[2].uri);

            // ...and items should be added in item exchange
            expect(ItemsExchange.getItemByUri(res[0].uri).label).toBe(itemResponseProv.data[0].label);
            expect(ItemsExchange.getItemByUri(res[1].uri).label).toBe(itemResponseProv.data[1].label);
            expect(ItemsExchange.getItemByUri(res[2].uri).label).toBe(itemResponseProv.data[2].label);

        });

        $httpBackend.flush();
        $rootScope.$digest();

    });

    it('should start autocomplete search and return empty results', function(){

        // empty response
        var itemResponseEmpty = {
            data: [],
            metadata: { limit: 10, offset: 0, totalCount: "0", pageCount: 1 }
        };

        $httpBackend
            .whenGET('http://korbo.local/search/items?lang=en&limit=10&offset=0&p=korbo&q=Dante')
            .respond(itemResponseEmpty);

        // at this time, autocomplete is not loading
        expect(KorboCommunicationService.isAutocompleteLoading()).toBe(false);

        // calling autocomplete search
        var promise = KorboCommunicationService.autocompleteSearch(val, endpoint, prov, limit, offset, lang);

        // at this time autocomplete is loading
        expect(KorboCommunicationService.isAutocompleteLoading()).toBe(true);

        // when promise is resolved...
        promise.then(function(res){
            // ... loading should be stopped...
            expect(KorboCommunicationService.isAutocompleteLoading()).toBe(false);
            // ... and response should contain a flag that specificate response has no result
            expect(res[0].noResult).toBe(true);
        });

        $httpBackend.flush();
        $rootScope.$digest();

    });

    it('should return server error', function(){

        // catch http call and return error status code 500
        $httpBackend
            .whenGET('http://korbo.local/search/items?lang=en&limit=10&offset=0&p=korbo&q=Dante')
            .respond(500);

        // at this time, autocomplete is not loading
        expect(KorboCommunicationService.isAutocompleteLoading()).toBe(false);

        // calling autocomplete search
        var promise = KorboCommunicationService.autocompleteSearch(val, endpoint, prov, limit, offset, lang);

        // at this time autocomplete is loading
        expect(KorboCommunicationService.isAutocompleteLoading()).toBe(true);

        // when promise is resolved...
        promise.then(function(res){
            // ... loading should be stopped...
            expect(KorboCommunicationService.isAutocompleteLoading()).toBe(false);
            // ... and response should contain a flag that specificate error server is occurred
            expect(res[0].errorServer).toBe(true);
        });

        $httpBackend.flush();
        $rootScope.$digest();

    });



});