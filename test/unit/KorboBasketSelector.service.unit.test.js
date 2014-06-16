describe('KorboBasketSelector service', function() {

    var KorboBasketSelector,
    $httpBackend,
    KORBOBASKETSELECTORDEFAULTS,
    ItemsExchange;

    var url, detailsUrl;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_KORBOBASKETSELECTORDEFAULTS_, _KorboBasketSelector_, _$httpBackend_, _ItemsExchange_){
        KORBOBASKETSELECTORDEFAULTS = _KORBOBASKETSELECTORDEFAULTS_;
        KorboBasketSelector = _KorboBasketSelector_;
        $httpBackend = _$httpBackend_;
        ItemsExchange = _ItemsExchange_;

        url = new RegExp(KORBOBASKETSELECTORDEFAULTS.korboBasketReconURL),
        detailsUrl = new RegExp(KORBOBASKETSELECTORDEFAULTS.korboBasketMetadataURL+KORBOBASKETSELECTORDEFAULTS.baskets[0]);

    }));

    var emptyResult = {
        result: []
    };

    var itemsResult = {
        result: [
            {
                name: "MakesAReferenceTo",
                resource_url: "http://purl.org/net7/korbo/item/76108"
            }
        ]
    };

    var item1Details = {
        result: {
            description: "«The source text makes a reference to the targeted text»",
            image: "",
            rdftype: ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"]
        }
    };

    it('should correctly initialize a selector instance', function(){
        var conf = KORBOBASKETSELECTORDEFAULTS.instances[0],
            sel = new KorboBasketSelector(conf);

        expect(sel.config.active).toBe(conf.active);
        expect(sel.config.container).toBe(conf.container);
        expect(sel.config.label).toBe(conf.label);
    });

    it('should resolve promise when get empty result', function(){
        var conf = KORBOBASKETSELECTORDEFAULTS.instances[0],
            sel = new KorboBasketSelector(conf),
            called = false;

        $httpBackend.whenJSONP(url).respond(emptyResult);
        sel.getItems('term').then(function(){
            called = true;
        });
        
        $httpBackend.flush();

        var all = ItemsExchange.getAll(),
            container = conf.container;

        expect(all.itemListByContainer[container]).toBeUndefined();
        expect(called).toBe(true);
        
    });

    it('should correctly launch all items details http request when get not empty result', function(){
        var conf = KORBOBASKETSELECTORDEFAULTS.instances[0],
            sel = new KorboBasketSelector(conf),
            called = false;
 
        $httpBackend.whenJSONP(url).respond(itemsResult);
        $httpBackend.whenJSONP(detailsUrl).respond(item1Details);

        sel.getItems('term').then(function(){
            called = true;
        });
        
        // items http
        $httpBackend.flush(1);
        expect(called).toBe(false);

        // all details http calls
        $httpBackend.whenJSONP(url).respond(item1Details);
        $httpBackend.flush();        
        // promise is resolved when all http are completed
        expect(called).toBe(true);

        var all = ItemsExchange.getAll(),
            container = conf.container;

        expect(all.itemListByContainer[container]).toBeDefined();
        expect(all.itemListByContainer[container].length).toBe(1);

        var item = all.itemListByContainer[container][0];

        expect(item.uri).toBe(itemsResult.result[0].resource_url);
        expect(item.label).toBe(itemsResult.result[0].name);
        expect(item.description).toBe(item1Details.result.description);
        expect(item.type.length).toBe(item1Details.result.rdftype.length);
        
    });

});