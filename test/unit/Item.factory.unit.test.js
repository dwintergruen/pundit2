describe('Item Factory', function() {

    var Item,
        NameSpace,
        ItemsExchange,
        $log,
        ITEMDEFAULTS;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _Item_, _ItemsExchange_, _$log_, _ITEMDEFAULTS_){
        Item = _Item_;
        NameSpace = $injector.get('NameSpace');
        ItemsExchange = _ItemsExchange_;
        $log = _$log_;
        ITEMDEFAULTS = _ITEMDEFAULTS_;
    }));

    afterEach(function(){
        // wipe all items in ItemsExchange
        ItemsExchange.wipe();
    });

    it('should create an item with default values', function(){

        var item = new Item("http://uri");
        var itemCreated = ItemsExchange.getItemByUri("http://uri");

        // item created and item returned by ItemsExchange must be the same
        expect(item.uri).toBe(itemCreated.uri);
        expect(item.label).toBe(itemCreated.label);
        expect(item.type).toBe(itemCreated.type);

        // item create must have default label
        expect(itemCreated.label).toBe("default item label");
        // and an empty array type
        expect(itemCreated.type.length).toBe(0);

    });

    it('should log error where try to create an item without uri', function(){

        $log.reset();
        // at this time no error should be log yet
        expect($log.error.logs.length).toBe(0);
        // try to create an item without uri
        new Item();
        // an error shoul be log
        expect($log.error.logs.length).toBe(1);
        // item should not be created
        expect(ItemsExchange.getItems().length).toBe(0);

    });

    it('should create an item with given properties', function(){

        new Item("http://uri", testItems.propFragmentText);
        var itemCreated = ItemsExchange.getItemByUri("http://uri");

        // item create must have given values
        expect(itemCreated.label).toBe(testItems.propFragmentText.label);
        expect(itemCreated.description).toBe(testItems.propFragmentText.description);
        expect(itemCreated.type.length).toBe(testItems.propFragmentText.type.length);
        expect(itemCreated.type[0]).toBe(testItems.propFragmentText.type[0]);

        // a new item should have prototype function
        expect(itemCreated.isProperty).toBeDefined();
        expect(itemCreated.isTextFragment).toBeDefined();
        expect(itemCreated.isImage).toBeDefined();
        expect(itemCreated.isImageFragment).toBeDefined();
        expect(itemCreated.isWebPage).toBeDefined();
        expect(itemCreated.isEntity).toBeDefined();
        expect(itemCreated.fromAnnotationRdf).toBeDefined();
        expect(itemCreated.toRdf).toBeDefined();
        expect(itemCreated.toJsonLD).toBeDefined();
        expect(itemCreated.getIcon).toBeDefined();
        expect(itemCreated.getClass).toBeDefined();

    });

    it('should recognized an item as image', function(){

        var item = new Item("http://img-uri", testItems.propImage);
        expect(item.isImage()).toBe(true);
        expect(item.getIcon()).toBe(ITEMDEFAULTS.iconImage);
        expect(item.getClass()).toBe(ITEMDEFAULTS.classImage);
    });

    it('should recognized an item as image fragment', function(){

        var item = new Item("http://uri", testItems.propFragImage);
        expect(item.isImageFragment()).toBe(true);
        expect(item.getIcon()).toBe(ITEMDEFAULTS.iconImage);
        expect(item.getClass()).toBe(ITEMDEFAULTS.classImage);
    });

    it('should recognized an item as text fragment', function(){

        var item = new Item("http://uri", testItems.propFragmentText);
        expect(item.isTextFragment()).toBe(true);
        expect(item.getIcon()).toBe(ITEMDEFAULTS.iconText);
        expect(item.getClass()).toBe(ITEMDEFAULTS.classText);
    });

    it('should recognized an item as entity', function(){

        var item = new Item("http://uri", testItems.propCommonTopic);
        expect(item.isEntity()).toBe(true);
        expect(item.getIcon()).toBe(ITEMDEFAULTS.iconEntity);
        expect(item.getClass()).toBe(ITEMDEFAULTS.classEntity);
    });

    it('should recognized an item as web page', function(){

        var item = new Item("http://uri", testItems.propWebPage);
        expect(item.isWebPage()).toBe(true);
        expect(item.getIcon()).toBe(ITEMDEFAULTS.iconWebPage);
        expect(item.getClass()).toBe(ITEMDEFAULTS.classWebPage);
    });

    it('should recognized an item as web page', function(){

        var item = new Item("http://uri", testItems.propProperty);
        expect(item.isProperty()).toBe(true);
        expect(item.getIcon()).toBe(ITEMDEFAULTS.iconDefault);
        expect(item.getClass()).toBe(ITEMDEFAULTS.classDefault);
    });


});