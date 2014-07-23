describe('Object Popover Resource Panel service', function() {

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
        var triple = ["", "", ""];

        // open a resource panel popover
        ResourcePanel.showItemsForObject(triple, anchor, "");
        $rootScope.$digest();

        // at this time popover should be open
        var rp = angular.element.find('.pnd-resource-panel-popover');
        expect(angular.element(rp).length).toBe(1);


        var scope = getPopoverResourcePanelScope();
        // and his scope should be defined
        expect(scope).toBeDefined();
        expect(scope.type).toBe('obj');

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
        var triple = ["", "", ""];

        // open a resource panel popover
        ResourcePanel.showItemsForObject(triple, anchor, "");
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

        // should be loaded all my items
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
        ResourcePanel.showItemsForObject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should be load all page items
        expect(scope.type).toBe('obj');
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);

    });

    it("should load all page items if item predicate has empty range", function() {

        var emptyRangePred = {
            "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
            "label": "empty domain",
            "description": "The selected text fragment is a Person, a Work, a Place or a well defined Entity",
            "range": "",
            "uri": "http://purl.org/pundit/ont/oa#identifies"
        };

        // add a predicate with an empty range
        var predicate = new Item(emptyRangePred.uri, emptyRangePred);
        ItemsExchange.addItemToContainer(predicate, Client.options.container);

        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor')[0];
        // undefined triple
        var triple = ["", emptyRangePred.uri, ""];

        // open a resource panel popover
        ResourcePanel.showItemsForObject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should load all page items
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

        // open a resource panel popover
        ResourcePanel.showItemsForObject(triple, anchor, "");
        $rootScope.$digest();

        // at this time should load all page items...
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);

        // ...and should load also all my items, because user is logged in
        expect(scope.myItems.length).toBe(2);
        expect(scope.myItems[0]).toBe(myItem1);
        expect(scope.myItems[1]).toBe(myItem2);

    });

    it("should load all page items if item predicate has undefined range", function() {

        var undefRangePred = {
            "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
            "label": "undefined domain",
            "description": "The selected text fragment is the translation of another text fragment",
            "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
            "uri": "http://purl.org/pundit/ont/oa#isTranslationOf"
        };

        // load a predicate with an undefined range
        var predicate = new Item(undefRangePred.uri, undefRangePred);
        ItemsExchange.addItemToContainer(predicate, Client.options.relationsContainer);

        // add some page items
        var item1 = new Item("http://item1-uri", propFragmentText);
        var item2 = new Item("http://item2-uri", propFragImage);

        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);
        ItemsExchange.addItemToContainer(item2, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", undefRangePred.uri, ""];

        // open a resource panel popover
        ResourcePanel.showItemsForObject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should load all page items
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item1);
        expect(scope.pageItems[1]).toBe(item2);

        // my items should be empty because user is not logged in
        expect(scope.myItems.length).toBe(0);
    });

    it("should open calendar if predicate is date ", function() {

        var dateRangePred = {
            "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
            "label": "period of dates ends at",
            "description": "The selected text fragment corresponds to the specified date period which ends at the specified Date",
            "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
            "range": ["http://www.w3.org/2001/XMLSchema#dateTime"],
            "uri": "http://purl.org/pundit/ont/oa#periodEndDate"
        };

        // add a predicate with dateTime type range
        var predicate = new Item(dateRangePred.uri, dateRangePred);
        ItemsExchange.addItemToContainer(predicate, Client.options.relationsContainer);

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", dateRangePred.uri, ""];

        ResourcePanel.showItemsForObject(triple, anchor, "");
        $rootScope.$digest();

        // no resource panel should be open
        var rp = angular.element.find('.pnd-resource-panel-popover');
        expect(angular.element(rp).length).toBe(0);

        // but should be open a calendar popover
        var popoverCalendar = angular.element.find('.pnd-popover-calendar');
        expect(angular.element(popoverCalendar).length).toBe(1);

    });

    it("should open literal popover if predicate is text ", function() {

        var textRangePred = {
            "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
            "label": "has comment (free text)",
            "description": "Any comment related to the selected fragment of text or image",
            "domain": [
                "http://purl.org/pundit/ont/ao#fragment-image",
                "http://purl.org/pundit/ont/ao#fragment-text",
                "http://xmlns.com/foaf/0.1/Image"
            ],
            "range": ["http://www.w3.org/2000/01/rdf-schema#Literal"],
            "uri": "http://schema.org/comment"
        };

        // add a predicate with literal type range
        var predicate = new Item(textRangePred.uri, textRangePred);
        ItemsExchange.addItemToContainer(predicate, Client.options.relationsContainer);

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", textRangePred.uri, ""];
        var label = "";

        ResourcePanel.showItemsForObject(triple, anchor, label);
        $rootScope.$digest();

        // no resource panel should be open
        var rp = angular.element.find('.pnd-resource-panel-popover');
        expect(angular.element(rp).length).toBe(0);

        // but should be open a literal popover
        var popoverLiteral = angular.element.find('.pnd-popover-literal');
        expect(angular.element(popoverLiteral).length).toBe(1);

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
            "range": ["http://purl.org/pundit/ont/ao#fragment-text"],
            "uri": "http://purl.org/spar/cito/includesQuotationFrom"
        };

        // add a predicate with fragment-text type range
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
        ResourcePanel.showItemsForObject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should load only pageItems matching with predicate range
        // in this case only item1
        expect(scope.pageItems.length).toBe(1);
        expect(scope.pageItems[0]).toBe(item1);

        // in this case none myItems match with predicate range
        expect(scope.myItems.length).toBe(0);

    });

    it("should load only image items", function() {

        // get login
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        MyPundit.login();
        $rootScope.$digest();
        $httpBackend.flush();

        var ImgPred = {
            "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
            "label": "quotes",
            "description": "The selected text fragment is a sentence from a Person or a Work, usually enclosed by quotations (eg: '')",
            "range": ["http://purl.org/pundit/ont/ao#fragment-image", "http://xmlns.com/foaf/0.1/Image"],
            "uri": "http://purl.org/spar/cito/includesQuotationFrom"
        };

        // add a predicate with image type range
        var predicate = new Item(ImgPred.uri, ImgPred);
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
        var triple = ["", ImgPred.uri, ""];

        // open a resource panel popover
        ResourcePanel.showItemsForObject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        // should load only pageItems matching with predicate range
        expect(scope.pageItems.length).toBe(2);
        expect(scope.pageItems[0]).toBe(item2);
        expect(scope.pageItems[1]).toBe(item3);

        // should load only myItems matching with predicate range
        expect(scope.myItems.length).toBe(1);
        expect(scope.myItems[0]).toBe(myItem1);

    });

    it("should not start searching label in vocab when input is empty", function() {

        var anchor = angular.element('.pnd-anchor')[0];
        var triple = ["", "", ""];

        // open resource panel with an empty label
        ResourcePanel.showItemsForObject(triple, anchor, "");
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        $timeout.flush();

        // label is empty and no search started
        // and in scope status, results and resEmpty should be not defined
        expect(scope.vocabObjStatus).toBeUndefined();
        expect(scope.vocabObjRes).toBeUndefined();
        expect(scope.vocabObjResEmpty).toBeUndefined();

    });

    //  TODO
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
        ResourcePanel.showItemsForObject(triple, anchor, label);
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();

        $timeout.flush();
        $httpBackend.flush();

        // get active selectors
        var selectors = SelectorsManager.getActiveSelectors();
        var selContainer = selectors[0].config.container;

        /*// open same popover, from same target and same label
        ResourcePanel.showItemsForObject(triple, anchor, label);
        $rootScope.$digest();
        $timeout.flush();

        // no http request shold be start
        $httpBackend.verifyNoOutstandingRequest();*/

        // open same popover, from same target and empty label
        ResourcePanel.showItemsForObject(triple, anchor, "");
        $rootScope.$digest();
        $timeout.flush();

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
        ResourcePanel.showItemsForObject(triple, anchor, otherLabel);
        $rootScope.$digest();
        $timeout.flush();
        $httpBackend.flush();

        // and new results should be set in the scope

    });

});
