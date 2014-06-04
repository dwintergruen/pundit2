describe('SelectorsManager service', function() {

    var SelectorsManager,
    $httpBackend,
    SELECTORMANAGERDEFAULTS,
    ItemsExchange;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_SELECTORMANAGERDEFAULTS_, _SelectorsManager_, _$httpBackend_, _ItemsExchange_){
        SELECTORMANAGERDEFAULTS = _SELECTORMANAGERDEFAULTS_;
        SelectorsManager = _SelectorsManager_;
        $httpBackend = _$httpBackend_;
        ItemsExchange = _ItemsExchange_;
    }));

    it('should correctly load selectors (added inside client)', function(){
        SelectorsManager.init();
        expect(SelectorsManager.getActiveSelectors().length).toBeGreaterThan(0);
    });

    // TODO
 
});