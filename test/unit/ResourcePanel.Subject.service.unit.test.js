describe('Literal Popover Resource Panel service', function() {

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
        Client;

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

    var propCommonTopic = {
        label: "item common topic",
        description: "item description",
        type: ["http://www.freebase.com/schema/common/topic", "http://www.freebase.com/schema/interests/collection_category", "http://www.freebase.com/schema/base/popstra/product"]
    };

    var userLoggedIn = {
        loginStatus: 1,
        id: "myFakeId",
        uri: "http://myUri.fake",
        openid: "http://myOpenId.fake",
        firstName: "Mario",
        lastName: "Rossi",
        fullName: "Mario Rossi",
        email: "mario@rossi.it",
        loginServer: "http:\/\/demo-cloud.as.thepund.it:8080\/annotationserver\/login.jsp"
    };


    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$compile_, _$document_, _PageItemsContainer_, _ItemsExchange_, _Item_, _MyItems_, _MyPundit_, _Client_){
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
    }));

    beforeEach(function(){
        // used by service to append dropdown anchor
        // if not exist the service cannot pass element to $drodown serive
        // and cause "Cannot read property 'nodeName' of undefined"
        angular.element("body").append("<div data-ng-app='Pundit2'></div>");
        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-anchor' style='position: absolute; left: -500px; top: -500px;'><div>");

    });

    afterEach(function(){

        var body = $document.find('body');
        body.find('.pnd-anchor').remove();
        $rootScope.$digest();
        body.find("[data-ng-app='Pundit2']").remove();
        $rootScope.$digest();
        ItemsExchange.wipe();

    });

    // get the modal scope
    var getPopoverResourcePanelScope = function(){
        var popoverResPanel = angular.element.find('.pnd-resource-panel-popover');
        var scope = angular.element(popoverResPanel).scope();
        return scope;
    };

    it("should load all page items where no predicate is defined and user is not logged in", function() {

        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);
        var item3 = new Item("http://item3-uri", propCommonTopic);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item3, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor');
        // undefined triple
        var triple = ["", "", ""];
        var label = "";

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();

        // at this time popover should be open
        var rp = angular.element.find('.pnd-resource-panel-popover');
        expect(angular.element(rp).length).toBe(1);
        // and his scope should be defined
        var scope = getPopoverResourcePanelScope();
        expect(scope).toBeDefined();
        expect(scope.type).toBe('sub');
        // should be loaded all page items
        expect(scope.pageItems.length).toBe(3);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);
        expect(scope.pageItems[2]).toBe(item3);
        // my items should be empty because user is not logged in
        expect(scope.myItems.length).toBe(0);

    });

    it("should load all page items and my items where no predicate is defined and user is logged in", function() {

        // get login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);

        MyPundit.login();

        $rootScope.$digest();
        $httpBackend.flush();

        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);
        var item3 = new Item("http://item3-uri", propCommonTopic);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item3, PageItemsContainer.options.container);

        // add some my items
        var myItem1 = new Item("http://my-item2-uri", propFragImage);
        var myItem2 = new Item("http://my-item3-uri", propCommonTopic);
        ItemsExchange.addItemToContainer(myItem1, MyItems.options.container);
        ItemsExchange.addItemToContainer(myItem2, MyItems.options.container);

        var anchor = angular.element('.pnd-anchor');
        // undefined triple
        var triple = ["", "", ""];
        var label = "";

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();

        // at this time popover should be open
        var rp = angular.element.find('.pnd-resource-panel-popover');
        expect(angular.element(rp).length).toBe(1);
        // and his scope should be defined
        var scope = getPopoverResourcePanelScope();
        expect(scope).toBeDefined();
        expect(scope.type).toBe('sub');
        // should be loaded all page items
        expect(scope.pageItems.length).toBe(3);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);
        expect(scope.pageItems[2]).toBe(item3);
        // should be loaded all page items
        expect(scope.myItems.length).toBe(2);
        expect(scope.myItems[0]).toBe(myItem1);
        expect(scope.myItems[1]).toBe(myItem2);

    });

    it("should load all page items if item predicate is undefined", function() {
        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor');
        // undefined triple
        var triple = ["", "http://sss", ""];
        var label = "";

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();
        var scope = getPopoverResourcePanelScope();
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);

    });

    it("should load all page items if item predicate has empty domain", function() {

        var emptyDomainPred = {
            "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
            "label": "empty domain",
            "description": "The selected text fragment is a Person, a Work, a Place or a well defined Entity",
            "domain": "",
            "uri": "http://purl.org/pundit/ont/oa#identifies"
        };

        var predicate = new Item(emptyDomainPred.uri, emptyDomainPred);
        ItemsExchange.addItemToContainer(predicate, Client.options.container);

        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor');
        // undefined triple
        var triple = ["", emptyDomainPred.uri, ""];
        var label = "";

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();
        var scope = getPopoverResourcePanelScope();
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);
        expect(scope.myItems.length).toBe(0);

        ResourcePanel.hide();
        // get login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);

        MyPundit.login();

        $rootScope.$digest();
        $httpBackend.flush();

        // add some my items
        var myItem1 = new Item("http://my-item2-uri", propFragImage);
        var myItem2 = new Item("http://my-item3-uri", propCommonTopic);
        ItemsExchange.addItemToContainer(myItem1, MyItems.options.container);
        ItemsExchange.addItemToContainer(myItem2, MyItems.options.container);

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);
        expect(scope.myItems.length).toBe(2);
        expect(scope.myItems[0]).toBe(myItem1);
        expect(scope.myItems[1]).toBe(myItem2);

    });

    it("should load all page items if item predicate has undefined domain", function() {

        var undefDomainPred = {
            "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
            "label": "undefined domain",
            "description": "The selected text fragment is the translation of another text fragment",
            "range": ["http://purl.org/pundit/ont/ao#fragment-text"],
            "uri": "http://purl.org/pundit/ont/oa#isTranslationOf"
        };

        var predicate = new Item(undefDomainPred.uri, undefDomainPred);
        ItemsExchange.addItemToContainer(predicate, Client.options.container);

        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor');
        // undefined triple
        var triple = ["", undefDomainPred.uri, ""];
        var label = "";

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();
        var scope = getPopoverResourcePanelScope();
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);
        expect(scope.myItems.length).toBe(0);
    });

    it("should load only image and fragment image items", function() {

        // get login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);

        MyPundit.login();

        $rootScope.$digest();
        $httpBackend.flush();

        var ImagePred = {
            "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
            "label": "depicts",
            "description": "An image or part of an image depicts something",
            "domain": [
                "http://xmlns.com/foaf/0.1/Image",
                "http://purl.org/pundit/ont/ao#fragment-image"
            ],
            "range": [],
            "uri": "http://xmlns.com/foaf/0.1/depicts"
        };

        var predicate = new Item(ImagePred.uri, ImagePred);
        ItemsExchange.addItemToContainer(predicate, Client.options.container);

        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);
        var item3 = new Item("http://item3-uri", propImage);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item3, PageItemsContainer.options.container);

        // add some my items
        var myItem1 = new Item("http://my-item2-uri", propFragImage);
        var myItem2 = new Item("http://my-item3-uri", propCommonTopic);
        ItemsExchange.addItemToContainer(myItem1, MyItems.options.container);
        ItemsExchange.addItemToContainer(myItem2, MyItems.options.container);

        var anchor = angular.element('.pnd-anchor');
        // undefined triple
        var triple = ["", ImagePred.uri, ""];
        var label = "";

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();
        var scope = getPopoverResourcePanelScope();
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item2);
        expect(scope.pageItems[1]).toBe(item3);
        expect(scope.myItems.length).toBe(1);
        expect(scope.myItems[0]).toBe(myItem1);
    });

    it("should load only fragment text items", function() {
        // get login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        MyPundit.login();
        $rootScope.$digest();
        $httpBackend.flush();

        var FragmentTextPred = {
            "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
            "label": "quotes",
            "description": "The selected text fragment is a sentence from a Person or a Work, usually enclosed by quotations (eg: '')",
            "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
            "range": [
                "http://www.freebase.com/schema/people/person",
                "http://xmlns.com/foaf/0.1/Person",
                "http://dbpedia.org/ontology/Person",
                "http://www.freebase.com/schema/book/written_work",
                "http://www.freebase.com/schema/book/book"
            ],
            "uri": "http://purl.org/spar/cito/includesQuotationFrom"
        };

        var predicate = new Item(FragmentTextPred.uri, FragmentTextPred);
        ItemsExchange.addItemToContainer(predicate, Client.options.container);

        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);
        var item3 = new Item("http://item3-uri", propImage);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item3, PageItemsContainer.options.container);

        // add some my items
        var myItem1 = new Item("http://my-item2-uri", propFragImage);
        var myItem2 = new Item("http://my-item3-uri", propCommonTopic);
        ItemsExchange.addItemToContainer(myItem1, MyItems.options.container);
        ItemsExchange.addItemToContainer(myItem2, MyItems.options.container);

        var anchor = angular.element('.pnd-anchor');
        var triple = ["", FragmentTextPred.uri, ""];
        var label = "";

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();
        var scope = getPopoverResourcePanelScope();
        expect(scope.pageItems.length).toBe(1);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.myItems.length).toBe(0);

    });

    it("should close popover calling cancel method", function() {
        var anchor = angular.element('.pnd-anchor');
        var triple = ["", "", ""];
        var label = "";

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();
        var scope = getPopoverResourcePanelScope();
        scope.cancel();

        $rootScope.$digest();

        var popover = angular.element.find('div.pnd-resource-panel-popover');
        expect(popover.length).toBe(0);
    });

    it("should resolve a promise when save an item", function() {
        var item = new Item("http://item1-uri", propFragmentText);
        ItemsExchange.addItemToContainer(item, PageItemsContainer.options.container);
        var anchor = angular.element('.pnd-anchor');
        var triple = ["", "", ""];
        var label = "";

        // open a resource panel popover
        var promise = ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();
        var scope = getPopoverResourcePanelScope();
        scope.save(item);
        $rootScope.$digest();

        promise.then(function(value){
            expect(value).toBe(item);
            var popover = angular.element.find('div.pnd-resource-panel-popover');
            expect(popover.length).toBe(0);
        });

    });

    it("should be open only one popover at time", function() {

        var anchor = angular.element('.pnd-anchor');
        var triple = ["", "", ""];
        var label = "";

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();

        var popover = angular.element.find('div.pnd-resource-panel-popover');
        expect(popover.length).toBe(1);

        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();

        popover = angular.element.find('div.pnd-resource-panel-popover');
        expect(popover.length).toBe(1);

        // create a new anchor for another popover
        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-anchor-two' style='position: absolute; left: -500px; top: -500px;'><div>");

        var anchorTwo = angular.element('.pnd-anchor-two');

        ResourcePanel.showItemsForSubject(triple, anchorTwo, label);
        $rootScope.$digest();

        popover = angular.element.find('div.pnd-resource-panel-popover');
        expect(popover.length).toBe(1);

        // remove calendar anchor from DOM
        var body = $document.find('body');
        body.find('.pnd-anchor-two').remove();


    });



});