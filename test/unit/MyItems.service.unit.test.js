describe('MyItems service', function() {

    var MyItems,
    $httpBackend,
    NameSpace,
    ItemsExchange,
    MYITEMSDEFAULTS;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_MyItems_, _$httpBackend_, _NameSpace_, _ItemsExchange_, _MYITEMSDEFAULTS_){
        MyItems = _MyItems_;
        $httpBackend = _$httpBackend_;
        NameSpace = _NameSpace_;
        ItemsExchange = _ItemsExchange_;
        MYITEMSDEFAULTS = _MYITEMSDEFAULTS_;
    }));

    afterEach(function(){
        ItemsExchange.wipe();
    });

    var myItemsHttpResponse = {
        created: 1400578032439,
        value: [
            {
                altLabel: "Dante, was a major Italian poet of the Middle Ages",
                description: "Dante, was a major Italian poet of the Middle Ages",
                isPartOf: "http://fake-url.it/release_bot/build/examples/dante-1.html",
                label: "Dante, was a major Italian poet of the Middle Ages",
                pageContext: "http://localhost/pundit/examples/ee.html",
                uri: "http://fake-url.it/dante-1.html",
                type: ["http://purl.org/pundit/ont/ao#fragment-text"]
            },
            {
                description: "Friedrich Wilhelm Nietzsche was a German philologist",
                image: "https://www.googleapis.com/freebase/v1/image/m/02wh0",
                label: "Friedrich Nietzsche",
                type: ["http://www.freebase.com/book/author", "http://www.freebase.com/common/topic"],
                uri: "http://demo-cloud.api.korbo.org/v1/items/1269"
            }
        ]
    };

    var oldPunditMyItemsHttpResponse = {
        created: 1400578032439,
        value: [
            {
                altLabel: "Dante, was a major Italian poet of the Middle Ages",
                description: "Dante, was a major Italian poet of the Middle Ages",
                isPartOf: "http://fake-url.it/release_bot/build/examples/dante-1.html",
                label: "Dante, was a major Italian poet of the Middle Ages",
                pageContext: "http://localhost/pundit/examples/ee.html",
                value: "http://fake-url.it/dante-1.html",
                rdftype: ["http://purl.org/pundit/ont/ao#fragment-text"],
                type: "oldPunditFakeType",
                rdfData: "oldPunditData"
            }
        ]
    };


    it('should get my items', function(){

        $httpBackend.whenGET(NameSpace.get('asPref')).respond(myItemsHttpResponse);

        MyItems.getMyItems();

        $httpBackend.flush();

        var items = ItemsExchange.getItemsByContainer(MYITEMSDEFAULTS.container);

        expect(items.length).toBe(2);
        expect(items[0].uri).toBe(myItemsHttpResponse.value[0].uri);
        expect(items[1].uri).toBe(myItemsHttpResponse.value[1].uri);

    });

    it('should get my items from old pundit', function(){

        $httpBackend.whenGET(NameSpace.get('asPref')).respond(oldPunditMyItemsHttpResponse);

        MyItems.getMyItems();

        $httpBackend.flush();

        var items = ItemsExchange.getItemsByContainer(MYITEMSDEFAULTS.container);

        expect(items.length).toBe(1);
        // deleted property
        expect(items[0].rdfData).toBeUndefined();
        expect(items[0].value).toBeUndefined();
        // renamed property
        expect(angular.equals(items[0].uri, oldPunditMyItemsHttpResponse.value[0].value)).toBe(true);
        expect(angular.equals(items[0].type, oldPunditMyItemsHttpResponse.value[0].rdftype)).toBe(true);

    });

    it('should delete all my items when http success', function(){

        $httpBackend.whenGET(NameSpace.get('asPref')).respond(myItemsHttpResponse);

        MyItems.getMyItems();

        $httpBackend.flush();

        expect(ItemsExchange.getItemsByContainer(MYITEMSDEFAULTS.container).length).toBe(2);

        $httpBackend.whenPOST(NameSpace.get('asPref')).respond(201, '');

        MyItems.deleteAllMyItems();

        $httpBackend.flush();

        expect(ItemsExchange.getItemsByContainer(MYITEMSDEFAULTS.container).length).toBe(0);
    });

    it('should not delete all my items when http fail', function(){

        $httpBackend.whenGET(NameSpace.get('asPref')).respond(myItemsHttpResponse);

        MyItems.getMyItems();

        $httpBackend.flush();

        expect(ItemsExchange.getItemsByContainer(MYITEMSDEFAULTS.container).length).toBe(2);

        $httpBackend.whenPOST(NameSpace.get('asPref')).respond(500, '');

        MyItems.deleteAllMyItems();

        $httpBackend.flush();

        expect(ItemsExchange.getItemsByContainer(MYITEMSDEFAULTS.container).length).toBe(2);
    });



});