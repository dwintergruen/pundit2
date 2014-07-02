describe('SelectorsManager service', function() {

    var SelectorsManager,
    $httpBackend,
    $q,
    $rootScope,
    SELECTORMANAGERDEFAULTS,
    ItemsExchange;

    var testPunditConfig = {
        modules: {
            "KorboBasketSelector": {
                active: false
            },
            "FreebaseSelector": {
                active: false
            },
            "MurucaSelector": {

                active: true,

                instances: [
                    { 
                        label: 'MurucaTestLabel'
                    }
                ]
                
            }
        }
    };

    var url = new RegExp("http://demo2.galassiaariosto.netseven.it/backend.php/reconcile");
    var emptyResult = {
        result: []
    };
    var realResult = {
        result: [
            {
                description: "ZOPPINO 1536, Canto VII - Scena 1 - Azione 1 - Erifilla a cavallo del lupo",
                id: "7",
                match: false,
                name: "ZOPPINO 1536, Canto VII - Scena 1 - Azione 1 - Erifilla a cavallo del lupo",
                resource_url: "http://purl.org/galassiariosto/resources/azione_illustrazione/7",
                type: ["http://purl.org/galassiariosto/types/Azione"]
            }
        ]
    };

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        window.punditConfig = testPunditConfig;
        module('Pundit2');
    });

    beforeEach(inject(function(_SELECTORMANAGERDEFAULTS_, _SelectorsManager_, _ItemsExchange_,
        _$httpBackend_, _$q_, _$rootScope_){
        SELECTORMANAGERDEFAULTS = _SELECTORMANAGERDEFAULTS_;
        SelectorsManager = _SelectorsManager_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        ItemsExchange = _ItemsExchange_;
    }));

    afterEach(function(){
        delete window.punditConfig;
    });

    it('should correctly load selector', function(){
        // during the init process each selector read its config
        // then if active property is true is added to selectorsManager
        SelectorsManager.init();
        var sel = SelectorsManager.getActiveSelectors();
        expect(sel.length).toBe(1);
        expect(sel[0].config.label).toEqual('MurucaTestLabel');
    });

    it('should correctly resolve get items promise', function(){
        var resolved = false;
        var fakePromise = {then: function(){}};
        SelectorsManager.init();

        $httpBackend.whenJSONP(url).respond(emptyResult);

        SelectorsManager.getItems('term', fakePromise).then(function(){
            resolved = true;
        });

        $httpBackend.flush();

        expect(resolved).toBe(true);
    });

    it('should correctly wipe items container when promise is resolved', function(){
        var resolved = false;
        var promise = $q.defer();
        SelectorsManager.init();

        var sel = SelectorsManager.getActiveSelectors();

        $httpBackend.whenJSONP(url).respond(realResult);

        SelectorsManager.getItems('term', promise.promise).then(function(){
            resolved = true;
        });
        $httpBackend.flush();

        expect(resolved).toBe(true);
        var items = ItemsExchange.getItemsByContainer(sel[0].config.container+'term');
        expect(items.length).toBe(1);
        expect(items[0].uri).toBe('http://purl.org/galassiariosto/resources/azione_illustrazione/7');

        promise.resolve();
        $rootScope.$digest();
        expect(ItemsExchange.getItemsByContainer(sel[0].config.container+'term').length).toBe(0);
    });
    
 
});