describe('KorboEECommunication factory', function() {

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
    var basketID = 1;

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

        var korboComm = new KorboCommunicationFactory();
        // factory should be contain prototype functions
        expect(korboComm.search).toBeDefined();
        expect(korboComm.getItem).toBeDefined();
        expect(korboComm.save).toBeDefined();

    });

    it('should search a label ', function(){

        var korboComm = new KorboCommunicationFactory();

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

        var param = {
            'endpoint': endpoint,
            'label': val,
            'provider': prov,
            'offset': offset,
            'limit': limit,
            'language': lang
        };

        var container = "testContainer";

        var promise = korboComm.search(param, container);
        promise.then(function(){
            var items = ItemsExchange.getItemsByContainer(container);
            expect(items.length).toBe(3);
            expect(items[0].uri).toBe(itemResponseProv.data[0].id);
            expect(items[0].label).toBe(itemResponseProv.data[0].label);
            expect(items[1].uri).toBe(itemResponseProv.data[1].id);
            expect(items[1].label).toBe(itemResponseProv.data[1].label);
            expect(items[2].uri).toBe(itemResponseProv.data[2].id);
            expect(items[2].label).toBe(itemResponseProv.data[2].label);
            ItemsExchange.wipeContainer(container);
        });

        $httpBackend.flush();

    });

    it('should search get error ', function(){

        var korboComm = new KorboCommunicationFactory();
        var errorShown = false;

        $httpBackend
            .whenGET('http://korbo.local/search/items?lang=en&limit=10&offset=0&p=korbo&q=Dante')
            .respond(500);

        var param = {
            'endpoint': endpoint,
            'label': val,
            'provider': prov,
            'offset': offset,
            'limit': limit,
            'language': lang
        };

        var container = "testContainer";

        var promise = korboComm.search(param, container);
        promise.then(function(){

        },
        function(){
            errorShown = true;
            expect(errorShown).toBe(true);
        });

        $httpBackend.flush();

    });

    it('should save an entity and return location', function(){

        var korboComm = new KorboCommunicationFactory();

        var header = {"Accept":'application/json, text/plain, */*', "Content-Type":'application/json;charset=utf-8', "Access-Control-Expose-Headers":'Location', "Content-Language":'en'};

        var entityData = {
            "label": 'Dante',
            "abstract": 'my abstract',
            "type": ['http://philosopher.uri', 'http://place.uri'],
            "depiction": 'http://dep.it',
            "resource": ""
        };

        var headerResponse = {Location: "http://korbo2.local/v1/items/95"};

        var url = endpoint+"/baskets/"+basketID+"/items";

        $httpBackend
            .expectPOST(url, entityData, header)
            .respond(201, 'EVERYTHING OK', headerResponse);

        var promise = korboComm.save(entityData, lang, endpoint, basketID);

        promise.then(function(location){
            expect(location).toBe(headerResponse.Location);
        });

        $httpBackend.flush();

    });

    it('should save reject promise and get error', function(){

        var korboComm = new KorboCommunicationFactory();
        var errorShown = false;

        var header = {"Accept":'application/json, text/plain, */*', "Content-Type":'application/json;charset=utf-8', "Access-Control-Expose-Headers":'Location', "Content-Language":'en'};

        var entityData = {
            "label": 'Dante',
            "abstract": 'my abstract',
            "type": ['http://philosopher.uri', 'http://place.uri'],
            "depiction": 'http://dep.it',
            "resource": ""
        };


        var url = endpoint+"/baskets/"+basketID+"/items";

        $httpBackend
            .expectPOST(url, entityData, header)
            .respond(500);

        var promise = korboComm.save(entityData, lang, endpoint, basketID);

        promise.then(function(){

        },
        function(){
            errorShown = true;
            expect(errorShown).toBe(true);
        });

        $httpBackend.flush();

    });

    it('should get an item', function(){

        var korboComm = new KorboCommunicationFactory();
        var id = 118;

        var param = {
            'endpoint': endpoint,
            'item': {'uri': id},
            'provider': prov,
            'basketID': basketID,
            'language': lang
        };

        var response = {
            'id': id,
            'label': 'myItem',
            'description': 'myDescription',
            'depiction': 'http://mydepiction',
            'type': [{'uri':'http://uri1'}, {'uri':'http://uri2'}]
        };

        var url = endpoint + "/baskets/"+basketID+"/items/"+param.item.uri+"?p="+prov;

        $httpBackend
            .expectGET(url)
            .respond(response);

        var promise = korboComm.getItem(param);

        promise.then(function(res){
            expect(res.id).toBe(response.id);
            expect(res.label).toBe(response.label);
            expect(res.description).toBe(response.description);
            expect(res.depiction).toBe(response.depiction);
            expect(res.type.length).toBe(response.type.length);
            expect(res.type[0].uri).toBe(response.type[0].uri);
            expect(res.type[1].uri).toBe(response.type[1].uri);
            });

        $httpBackend.flush();

    });

    it('should show error on get item', function(){

        var korboComm = new KorboCommunicationFactory();
        var id = 118;

        var param = {
            'endpoint': endpoint,
            'item': {'uri': id},
            'provider': prov,
            'basketID': basketID,
            'language': lang
        };

        var errorShown = false;

        var url = endpoint + "/baskets/"+basketID+"/items/"+param.item.uri+"?p="+prov;

        $httpBackend
            .expectGET(url)
            .respond(500);

        var promise = korboComm.getItem(param);

        promise.then(function(){

        },
        function(){
            errorShown = true;
            expect(errorShown).toBe(true);
        });

        $httpBackend.flush();

    });








});