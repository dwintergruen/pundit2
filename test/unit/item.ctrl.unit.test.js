describe("Item", function(){

    var $rootScope,
        $compile,
        Annotation,
        ItemsExchange,
        Preview;

    var item1 = {
        label: "item label",
        description: "item description",
        uri: "http://item-uri",
        type: ["http://item-type"],
        // work around to run tests
        isProperty: function(){ return false; }
    };

    beforeEach(module('Pundit2'));

    beforeEach(module('src/Item/Item.dir.tmpl.html'));

    beforeEach(inject(function(_$rootScope_, _$compile_, _Annotation_,  _ItemsExchange_, _Preview_){
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        Annotation = _Annotation_;
        ItemsExchange = _ItemsExchange_;
        Preview = _Preview_;
    }));

    var compileDirective = function(item){
        var elem = $compile('<item uri="'+item.uri+'"></item>')($rootScope);
        angular.element('body').append(elem);
        $rootScope.$digest();
        return elem;
    };

    afterEach(function(){
        Preview.hideDashboardPreview();
        Preview.clearItemDashboardSticky();
        angular.element('item').remove();
    });

    xit('should correctly get item', function(){
        var item, el;
        var p = new Annotation("8fd05a49");
        p.then(function(ret) {
            item = ItemsExchange.getItems()[0];
            el = compileDirective(item);
        });
        waitsFor(function() { return item; }, 2000);
        runs(function() {
            var scope = el.scope();
            expect(scope.item).toBeDefined();
            expect(scope.itemTypeLabel).toBeDefined();
            expect(typeof(scope.itemTypeLabel)).toBe('string');
            expect(typeof(scope.item.label)).toBe('string');
        });

    });

    it('should correctly get item and initialize scope', function(){
        ItemsExchange.addItem(item1);

        var el = compileDirective(item1);
        var scope = el.isolateScope();

        expect(scope.item).toBeDefined();
        expect(scope.itemTypeLabel).toBeDefined();
        expect(typeof(scope.itemTypeLabel)).toBe('string');
        expect(typeof(scope.item.label)).toBe('string');
        expect(scope.isStickyItem).toBe(false);
    });

    it('should correctly show item inside preview', function(){
        ItemsExchange.addItem(item1);

        var el = compileDirective(item1);
        var scope = el.isolateScope();

        scope.onItemMouseOver();
        var item = Preview.getItemDashboardPreview();
        expect(item).toBe(scope.item);
    });

    it('should correctly hide item inside preview', function(){
        ItemsExchange.addItem(item1);

        var el = compileDirective(item1);
        var scope = el.isolateScope();

        scope.onItemMouseOver();
        scope.onItemMouseLeave();

        var item = Preview.getItemDashboardPreview();
        expect(item).toBe(null);
    });

    it('should correctly set item to stcky inside preview', function(){
        ItemsExchange.addItem(item1);

        var el = compileDirective(item1);
        var scope = el.isolateScope();

        scope.onClickSticky();

        expect(scope.isStickyItem).toBe(true);

        var item = Preview.getItemDashboardSticky();
        expect(item).toBe(scope.item);
    });

});