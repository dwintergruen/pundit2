describe('ImageAnnotator service', function() {
    
    var ImageAnnotator,
        ImageHandler,
        Consolidation,
        NameSpace,
        $compile,
        $rootScope;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_$rootScope_, _$compile_, _NameSpace_,
        _Consolidation_, _ImageHandler_, _ImageAnnotator_){
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        NameSpace = _NameSpace_;
        Consolidation = _Consolidation_;
        ImageHandler = _ImageHandler_;
        ImageAnnotator = _ImageAnnotator_;
    }));

    beforeEach(function(){
        angular.element('body').append('<img src="http://imgUrl.com">');
        $rootScope.$digest();
    });

    afterEach(function(){
        angular.element('img').remove();
    });

    it("should be consolidable", function() {
        var item = ImageHandler.createItemFromImage(angular.element('img')[0]);
        expect(ImageAnnotator.isConsolidable(item)).toBe(true);
    });

    it("should not be consolidable", function() {
        expect(ImageAnnotator.isConsolidable(testItems.completeFragmentTextItem)).toBe(false);
    });

    xit("should consolidate", function() {
        var item = ImageHandler.createItemFromImage(angular.element('img')[0]);
        var items = { };
        items[item.uri] = item;
        ImageAnnotator.consolidate(items);
        $rootScope.$digest();
        // why first child is empty?
    });

});