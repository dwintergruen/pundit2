describe('SelectorsManager service', function() {

    var SelectorsManager,
    $httpBackend,
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

    var url = "http://demo2.galassiaariosto.netseven.it/backend.php/reconcile?jsonp=JSON_CALLBACK&query=%7B%22query%22:%22term%22,%22properties%22:%7B%7D,%22limit%22:5%7D"
    var emptyResult = {
        result: []
    };

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        window.punditConfig = testPunditConfig;
        module('Pundit2');
    });

    beforeEach(inject(function(_SELECTORMANAGERDEFAULTS_, _SelectorsManager_, _$httpBackend_, _ItemsExchange_){
        SELECTORMANAGERDEFAULTS = _SELECTORMANAGERDEFAULTS_;
        SelectorsManager = _SelectorsManager_;
        $httpBackend = _$httpBackend_;
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

    iit('should correctly resolve get items promise', function(){
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
    
 
});