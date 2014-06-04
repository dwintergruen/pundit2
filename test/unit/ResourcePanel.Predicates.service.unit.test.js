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

    it("should load all predicates where no predicates and objects are defined", function() {

        // add some predicates
        var predicate1 = new Item(testPredicates.pred1.uri, testPredicates.pred1);
        ItemsExchange.addItemToContainer(predicate1, Client.options.relationsContainer);

        var predicate2 = new Item(testPredicates.pred2.uri, testPredicates.pred2);
        ItemsExchange.addItemToContainer(predicate2, Client.options.relationsContainer);

        var predicate3 = new Item(testPredicates.pred3.uri, testPredicates.pred3);
        ItemsExchange.addItemToContainer(predicate3, Client.options.relationsContainer);

        var predicate4 = new Item(testPredicates.pred4.uri, testPredicates.pred4);
        ItemsExchange.addItemToContainer(predicate4, Client.options.relationsContainer);
        $rootScope.$digest();

        var anchor = angular.element('.pnd-anchor');
        // undefined triple
        var triple = ["", "", ""];
        var label = "";

        // open a resource panel popover
        ResourcePanel.showProperties(triple, anchor, label);
        $rootScope.$digest();

        // at this time popover should be open
        var rp = angular.element.find('.pnd-resource-panel-popover');

        expect(angular.element(rp).length).toBe(1);
        // and his scope should be defined
        var scope = getPopoverResourcePanelScope();
        expect(scope).toBeDefined();
        expect(scope.type).toBe('pr');
        // should be loaded all properties
        expect(scope.properties.length).toBe(4);
        expect(scope.properties[0].uri).toBe(testPredicates.pred1.uri);
        expect(scope.properties[1].uri).toBe(testPredicates.pred2.uri);
        expect(scope.properties[2].uri).toBe(testPredicates.pred3.uri);
        expect(scope.properties[3].uri).toBe(testPredicates.pred4.uri);
        // my items should be undefined

    });





});
