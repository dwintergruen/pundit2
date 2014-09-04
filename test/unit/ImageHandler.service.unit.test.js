describe('ImageHandler service', function() {
    
    var ImageHandler,
        NameSpace,
        $compile,
        $rootScope;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_$rootScope_, _$compile_, _ImageHandler_, _NameSpace_){
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        ImageHandler = _ImageHandler_;
        NameSpace = _NameSpace_;
    }));

    beforeEach(function(){
        angular.element('body').append('<img src="http://imgUrl.com">');
        $rootScope.$digest();
    });

    afterEach(function(){
        angular.element('img').remove();
    });

    it("should create item from img", function() {
        var el = angular.element('img')[0];
        var item = ImageHandler.createItemFromImage(el);
        expect(item.image).toBe(el.src);
        expect(item.type[0]).toBe(NameSpace.types.image);
        // TODO better check on xpointer ?
    });

});