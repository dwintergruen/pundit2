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
        delete window.punditConfig;

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

        var anchor = angular.element('.pnd-anchor')[0];
        // undefined triple
        var triple = ["", "", ""];

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, "");
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

        var anchor = angular.element('.pnd-anchor')[0];
        // undefined triple
        var triple = ["", "", ""];

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        // at this time popover should be open
        var rp = angular.element.find('.pnd-resource-panel-popover');
        expect(angular.element(rp).length).toBe(1);

        // and his scope should be defined
        var scope = getPopoverResourcePanelScope();

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

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", "http://sss", ""];

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should be loaded all page tems
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

        // add a predicate with an empty domain
        var predicate = new Item(emptyDomainPred.uri, emptyDomainPred);
        ItemsExchange.addItemToContainer(predicate, Client.options.relationsContainer);

        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor')[0];

        var triple = ["", emptyDomainPred.uri, ""];

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should be loaded all page items
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);

        // my items should be empty because user is not logged in
        expect(scope.myItems.length).toBe(0);

        // close resource panel
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

        // open a resource panel popover with user logged in
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        // should be loaded all page items
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);

        // at this time also my items should be loaded
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

        // add a predicate with an undefined domain
        var predicate = new Item(undefDomainPred.uri, undefDomainPred);
        ItemsExchange.addItemToContainer(predicate, Client.options.relationsContainer);

        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", undefDomainPred.uri, ""];

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should be loaded all page items
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);

        // my items should be empty because user is not logged in
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

        // add a predicate with domain as image type
        var predicate = new Item(ImagePred.uri, ImagePred);
        ItemsExchange.addItemToContainer(predicate, Client.options.relationsContainer);

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

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", ImagePred.uri, ""];

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should load only page items matching with predicate domain
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

        // add a predicate with domain as fragment text type
        var predicate = new Item(FragmentTextPred.uri, FragmentTextPred);
        ItemsExchange.addItemToContainer(predicate, Client.options.relationsContainer);

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

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", FragmentTextPred.uri, ""];

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should load only page items matching with predicate domain
        expect(scope.pageItems.length).toBe(1);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.myItems.length).toBe(0);

    });

    it("should close popover calling cancel method", function() {
        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", "", ""];

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();
        // call cancel() method that should be close the popover
        scope.cancel();

        $rootScope.$digest();

        // at this time popover should be closed
        var popover = angular.element.find('div.pnd-resource-panel-popover');
        expect(popover.length).toBe(0);
    });

    it("should resolve a promise when save an item", function() {

        // add an item
        var item = new Item("http://item1-uri", propFragmentText);
        ItemsExchange.addItemToContainer(item, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", "", ""];

        // open a resource panel popover
        var promise = ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // save the item
        scope.save(item);
        $rootScope.$digest();

        promise.then(function(value){
            // promise should be resolved with item saved
            expect(value).toBe(item);
            // and popover should be closed
            var popover = angular.element.find('div.pnd-resource-panel-popover');
            expect(popover.length).toBe(0);
        });

    });

    it("should be open only one popover at time", function() {

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", "", ""];

        // open a resource panel popover
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        // at this time popover should be open
        var popover = angular.element.find('div.pnd-resource-panel-popover');
        expect(popover.length).toBe(1);

        // open the same popover
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        // at this time should be only 1 popover visible
        popover = angular.element.find('div.pnd-resource-panel-popover');
        expect(popover.length).toBe(1);

        // create a new anchor for another popover
        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-anchor-two' style='position: absolute; left: -500px; top: -500px;'><div>");

        var anchorTwo = angular.element('.pnd-anchor-two')[0];

        // open a new popover
        ResourcePanel.showItemsForSubject(triple, anchorTwo, "");
        $rootScope.$digest();

        // popover visible should be always only 1
        popover = angular.element.find('div.pnd-resource-panel-popover');
        expect(popover.length).toBe(1);

        // remove anchor two from DOM
        var body = $document.find('body');
        body.find('.pnd-anchor-two').remove();

    });

    it("should start searching label in vocab", function() {

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", "", ""];
        var label = "term";

        // Muruca search url for 'term' label
        var url = "http://demo2.galassiaariosto.netseven.it/backend.php/reconcile?jsonp=JSON_CALLBACK&query=%7B%22query%22:%22term%22,%22type%22:%22http:%2F%2Fpurl.org%2Fgalassiariosto%2Ftypes%2FAzione%22,%22properties%22:%7B%7D,%22limit%22:5%7D";

        // Muruca mocked result for 'term' label
        var realResult = {
            result: [
                {
                    description: "ZOPPINO 1536, Canto VII - Scena 1 - Azione 1 - Erifilla a cavallo del lupo",
                    id: "7",
                    match: false,
                    name: "ZOPPINO 1536, Canto VII - Scena 1 - Azione 1 - Erifilla a cavallo del lupo",
                    resource_url: "http://purl.org/galassiariosto/resources/azione_illustrazione/7",
                    type: ["http://purl.org/galassiariosto/types/Azione"]
                },
                {
                    description: "GIOLITO 1542, Canto XIX - Scena 2 - Azione 1 - Angelica incontra un pastore a cavallo (XIX, 23, vv. 1-2)",
                    id: "1149",
                    match: false,
                    name: "GIOLITO 1542, Canto XIX - Scena 2 - Azione 1 - Angelica incontra un pastore a cavallo (XIX, 23, vv. 1-2)",
                    resource_url: "http://purl.org/galassiariosto/resources/azione_illustrazione/1149",
                    type: ["http://purl.org/galassiariosto/types/Azione"]
                }
            ]
        };

        // selectors manager initialization
        SelectorsManager.init();
        $rootScope.$digest();

        $httpBackend.whenJSONP(url).respond(realResult);

        // open resource panel with 'term' label
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();
        // at this time status should be loading
        expect(scope.vocabSubStatus).toBe('loading');

        $timeout.flush();
        $httpBackend.flush();

        // get active selectors
        var selectors = SelectorsManager.getActiveSelectors();
        var selContainer = selectors[0].config.container;

        // after flush, search should be finished and status should be done
        expect(scope.vocabSubStatus).toBe('done');
        // and results should be set in scope
        expect(scope.vocabSubRes[selContainer].length).toBe(realResult.result.length);
        expect(scope.vocabSubRes[selContainer][0].uri).toBe(realResult.result[0].resource_url);
        expect(scope.vocabSubRes[selContainer][1].uri).toBe(realResult.result[1].resource_url);

        // results is not empty
        expect(scope.vocabSubResEmpty).toBe(false);

        // open same popover, from same target and same label
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();
        $timeout.flush();

        // no http request shold be start
        $httpBackend.verifyNoOutstandingRequest();

        // open same popover, from same target and empty label
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();
        $timeout.flush();

        // result should be empty
        expect(scope.vocabSubRes.length).toBe(0);

        // in the same resource panel, search a new label
        var otherLabel = "gio";

        // Muruca search url for 'gio' label
        var otherUrl = "http://demo2.galassiaariosto.netseven.it/backend.php/reconcile?jsonp=JSON_CALLBACK&query=%7B%22query%22:%22gio%22,%22type%22:%22http:%2F%2Fpurl.org%2Fgalassiariosto%2Ftypes%2FAzione%22,%22properties%22:%7B%7D,%22limit%22:5%7D";

        // Muruca mocked result for 'gio' label
        var otherResult = {
            result: [
                {
                    description: "ZOPPINO 1536, Canto VII - Scena 1 - Azione 1 - Erifilla a cavallo del lupo",
                    id: "8",
                    match: false,
                    name: "ZOPPINO 1536, Canto VII - Scena 1 - Azione 1 - Erifilla a cavallo del lupo",
                    resource_url: "http://purl.org/galassiariosto/resources/azione_illustrazione/newIllustr",
                    type: ["http://purl.org/galassiariosto/types/Azione"]
                }
            ]
        };

        $httpBackend.whenJSONP(otherUrl).respond(otherResult);

        // search 'gio' label in resource panel
        ResourcePanel.showItemsForSubject(triple, anchor, otherLabel);
        $rootScope.$digest();
        $timeout.flush();
        $httpBackend.flush();

        // after flush, search should be finished and status should be done
        expect(scope.vocabSubStatus).toBe('done');

        // and new results should be set in the scope
        expect(scope.vocabSubRes[selContainer].length).toBe(otherResult.result.length);
        expect(scope.vocabSubRes[selContainer][0].uri).toBe(otherResult.result[0].resource_url);
        expect(scope.vocabSubResEmpty).toBe(false)
    });

    it("should not start searching label in vocab when input is empty", function() {

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", "", ""];

        // open resource panel without a string to search
        ResourcePanel.showItemsForSubject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        $timeout.flush();

        // label is empty and no search started
        // and in scope status, results and resEmpty should be not defined
        expect(scope.vocabSubStatus).toBeUndefined();
        expect(scope.vocabSubRes).toBeUndefined();
        expect(scope.vocabSubResEmpty).toBeUndefined();

    });

});