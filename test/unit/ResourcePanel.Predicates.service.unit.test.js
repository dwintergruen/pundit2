/*global testPredicates*/

describe('Subject Popover Resource Panel service', function() {

    var ResourcePanel,
        $rootScope,
        $httpBackend,
        NameSpace,
        $compile,
        $document,
        PageItemsContainer,
        ItemsExchange,
        Item,
        MyItems,
        MyPundit,
        Client,
        SelectorsManager,
        $timeout,
        $window;

    var propFragmentText = {
        label: "item fragment text",
        description: "item description",
        type: ["http://purl.org/pundit/ont/ao#fragment-text"]
    };


    var propFragImage = {
        label: "item fragment image",
        description: "item description",
        type: ["http://purl.org/pundit/ont/ao#fragment-image"]
    };

    var propImage = {
        label: "item image",
        description: "item description",
        type: ["http://xmlns.com/foaf/0.1/Image"]
    };

    var propNoType = {
        label: "item image",
        description: "item description",
        type: [""]
    };

    var propUndefType = {
        label: "item image",
        description: "item description"
    };

    // var propCommonTopic = {
    //     label: "item common topic",
    //     description: "item description",
    //     type: ["http://www.freebase.com/schema/common/topic", "http://www.freebase.com/schema/interests/collection_category", "http://www.freebase.com/schema/base/popstra/product"]
    // };

    var propNoMatch = {
        label: "item image",
        description: "item description",
        type: ["inesistente"]
    };

    var testPunditConfig = {
        modules: {
            "KorboBasketSelector": {
                active: false
            },
            "FreebaseSelector": {
                active: false
            }
        }
    };

    // predicates
    var hasComment, similarTo, depicts, dates, talksAbout;

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        window.punditConfig = testPunditConfig;
        module('Pundit2');

    });


    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$compile_, _$document_, _PageItemsContainer_, _ItemsExchange_,
                               _Item_, _MyItems_, _MyPundit_, _Client_, _SelectorsManager_, _$timeout_, _$window_){
        ResourcePanel = $injector.get('ResourcePanel');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        $document = _$document_;
        PageItemsContainer = _PageItemsContainer_;
        ItemsExchange = _ItemsExchange_;
        Item = _Item_;
        MyItems = _MyItems_;
        MyPundit = _MyPundit_;
        Client = _Client_;
        SelectorsManager = _SelectorsManager_;
        $timeout = _$timeout_;
        $window = _$window_;
    }));

    var initPredicate = function() {
        // add some predicates
        hasComment = new Item(testPredicates.hasComment.uri, testPredicates.hasComment);
        ItemsExchange.addItemToContainer(hasComment, Client.options.relationsContainer);

        similarTo = new Item(testPredicates.similarTo.uri, testPredicates.similarTo);
        ItemsExchange.addItemToContainer(similarTo, Client.options.relationsContainer);

        depicts = new Item(testPredicates.depicts.uri, testPredicates.depicts);
        ItemsExchange.addItemToContainer(depicts, Client.options.relationsContainer);

        dates = new Item(testPredicates.dates.uri, testPredicates.dates);
        ItemsExchange.addItemToContainer(dates, Client.options.relationsContainer);

        talksAbout = new Item(testPredicates.talksAbout.uri, testPredicates.talksAbout);
        ItemsExchange.addItemToContainer(talksAbout, Client.options.relationsContainer);
    };

    beforeEach(function(){
        // used by service to append dropdown anchor
        // if not exist the service cannot pass element to $drodown serive
        // and cause "Cannot read property 'nodeName' of undefined"
        angular.element("body").append("<div data-ng-app='Pundit2'></div>");
        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-anchor' style='position: absolute; left: -500px; top: -500px;'><div>");

        initPredicate();

    });

    afterEach(function(){

        // remove from DOM
        var body = $document.find('body');
        body.find('.pnd-anchor').remove();
        $rootScope.$digest();
        body.find("[data-ng-app='Pundit2']").remove();
        $rootScope.$digest();
        // wipe all items in ItemsExchange
        ItemsExchange.wipe();
        // delete configuration
        delete window.punditConfig;

    });

    // get the popover scope
    var getPopoverResourcePanelScope = function(){
        var popoverResPanel = angular.element.find('.pnd-resource-panel-popover');
        var scope = angular.element(popoverResPanel).scope();
        return scope;
    };

    it("should load all predicates when no predicates and objects are defined", function() {

        var anchor = angular.element('.pnd-anchor')[0];

        // undefined triple
        var triple = {
            subject: null,
            predicate: null,
            object: null
        };

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        // at this time popover should be open
        var rp = angular.element.find('.pnd-resource-panel-popover');
        expect(angular.element(rp).length).toBe(1);

        // and his scope should be defined
        var scope = getPopoverResourcePanelScope();
        expect(scope).toBeDefined();
        expect(scope.type).toBe('pr');

        // should be loaded all properties
        expect(scope.properties.length).toBe(5);
        expect(scope.properties[0].uri).toBe(testPredicates.hasComment.uri);
        expect(scope.properties[1].uri).toBe(testPredicates.similarTo.uri);
        expect(scope.properties[2].uri).toBe(testPredicates.depicts.uri);
        expect(scope.properties[3].uri).toBe(testPredicates.dates.uri);
        expect(scope.properties[4].uri).toBe(testPredicates.talksAbout.uri);

    });

    it("should show right predicates when only subjects is defined", function() {

        // add a subject with fragment-image type
        var item = new Item("http://item1-uri", propFragImage);
        ItemsExchange.addItemToContainer(item, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = {
            subject: item,
            predicate: null,
            object: null
        };

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        // at this time popover scope should be defined
        var scope = getPopoverResourcePanelScope();

        // should load only predicates with domain containing image-fragment type or empty range
        expect(scope.properties.length).toBe(3);
        expect(scope.properties[0].uri).toBe(testPredicates.hasComment.uri);
        expect(scope.properties[1].uri).toBe(testPredicates.similarTo.uri);
        expect(scope.properties[2].uri).toBe(testPredicates.depicts.uri);
    });

    it("should show all predicates when item subjects is undefined", function() {

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = {
            subject: {uri: "http://item1-uri"},
            predicate: null,
            object: null
        };

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should load all predicates
        expect(scope.properties.length).toBe(5);

    });

    it("should show right predicates when only object is defined", function() {

        // add a subject with fragment-image type
        var item = new Item("http://item1-uri", propFragmentText);
        ItemsExchange.addItemToContainer(item, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = {
            subject: null,
            predicate: null,
            object: item
        };

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should load only predicates with domain containing image-fragment type or empty domain
        expect(scope.properties.length).toBe(3);
        expect(scope.properties[0].uri).toBe(testPredicates.similarTo.uri);

    });

    it("should show all predicates when item object is undefined", function() {

        var anchor = angular.element('.pnd-anchor')[0];

        var triple = {
            subject: null,
            predicate: null,
            object: {uri: "http://item1-uri"}
        };

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should load all predicates
        expect(scope.properties.length).toBe(5);

    });

    it("should show right predicates when both subject and object are defined", function() {

        var anchor = angular.element('.pnd-anchor')[0];

        // add an object item
        var object = new Item("http://object-uri", propFragmentText);
        ItemsExchange.addItemToContainer(object, PageItemsContainer.options.container);

        // add a subject item
        var subject = new Item("http://subject-uri", propFragImage);
        ItemsExchange.addItemToContainer(subject, PageItemsContainer.options.container);

        var triple = {
            subject: subject,
            predicate: null,
            object: object
        };

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should load only predicates matching with both object and subject
        expect(scope.properties.length).toBe(2);
        expect(scope.properties[0].uri).toBe(testPredicates.similarTo.uri);

    });

    it("should show no predicates when there are no match", function() {

        var anchor = angular.element('.pnd-anchor')[0];

        // add an item
        var item = new Item("http://item-uri", propNoMatch);
        ItemsExchange.addItemToContainer(item, PageItemsContainer.options.container);

        var triple = {
            subject: item,
            predicate: null,
            object: item
        };

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();
        // in this case, no properties match with item
        expect(scope.properties.length).toBe(0);
    });

    it("should show all predicates when subject and object have no types", function() {
        var anchor = angular.element('.pnd-anchor')[0];

        // add a subject item with type undefined
        var sub = new Item("http://sub-uri", propUndefType);
        ItemsExchange.addItemToContainer(sub, PageItemsContainer.options.container);

        // add an object item with empty type
        var obj = new Item("http://obj-uri", propNoType);
        ItemsExchange.addItemToContainer(obj, PageItemsContainer.options.container);

        // var triple = ["http://sub-uri", "", "http://obj-uri"];
        var triple = {
            subject: sub,
            predicate: null,
            object: obj
        };

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();
        // should show all properties
        expect(scope.properties.length).toBe(5);
    });

    it("should show right predicates when subject has valid types and object has no types", function() {
        var anchor = angular.element('.pnd-anchor')[0];

        // add a subject item with valid type
        var sub = new Item("http://sub-uri", propImage);
        ItemsExchange.addItemToContainer(sub, PageItemsContainer.options.container);

        // add an object item with empty type
        var obj = new Item("http://obj-uri", propNoType);
        ItemsExchange.addItemToContainer(obj, PageItemsContainer.options.container);

        // var triple = ["http://sub-uri", "", "http://obj-uri"];
        var triple = {
            subject: sub,
            predicate: null,
            object: obj
        };

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();
        // should load only properties matching with subject types
        expect(scope.properties.length).toBe(3);
        expect(scope.properties[0].uri).toBe(testPredicates.hasComment.uri);
        expect(scope.properties[1].uri).toBe(testPredicates.similarTo.uri);
        expect(scope.properties[2].uri).toBe(testPredicates.depicts.uri);

    });

    it("should show right predicates when subject has no types and object has valid types", function() {
        var anchor = angular.element('.pnd-anchor')[0];

        // add a subject item with empty type
        var sub = new Item("http://sub-uri", propNoType);
        ItemsExchange.addItemToContainer(sub, PageItemsContainer.options.container);

        // add an object item with valid type
        var obj = new Item("http://obj-uri", propFragmentText);
        ItemsExchange.addItemToContainer(obj, PageItemsContainer.options.container);

        // var triple = ["http://sub-uri", "", "http://obj-uri"];
        var triple = {
            subject: sub,
            predicate: null,
            object: obj
        };

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();
        // should load only properties matching with object types
        expect(scope.properties.length).toBe(3);
        expect(scope.properties[0].uri).toBe(testPredicates.similarTo.uri);

    });

    it("should filter properties labels", function() {

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = {
            subject: null,
            predicate: null,
            object: null
        };

        // open a resource panel popover without label
        ResourcePanel.showProperties(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should show all properties
        expect(scope.properties.length).toBe(5);

        // open same popover passing a label
        ResourcePanel.showProperties(triple, anchor, "tal");
        $rootScope.$digest();

        // should filter properties and show only properties matching with 'tal'
        // in this case should be only one: talksAbout
        expect(scope.properties.length).toBe(1);
        expect(scope.properties[0].uri).toBe(testPredicates.talksAbout.uri);

    });

});
