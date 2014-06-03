describe('Literal Popover Resource Panel service', function() {

    var ResourcePanel,
        $rootScope,
        $httpBackend,
        NameSpace,
        $compile,
        $document,
        PageItemsContainer,
        ItemsExchange,
        Item;


    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$compile_, _$document_, _PageItemsContainer_, _ItemsExchange_, _Item_){
        ResourcePanel = $injector.get('ResourcePanel');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        $document = _$document_;
        PageItemsContainer = _PageItemsContainer_;
        ItemsExchange = _ItemsExchange_;
        Item = _Item_;
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

    });

    // get the modal scope
    var getPopoverResourcePanelScope = function(){
        var popoverResPanel = angular.element.find('.pnd-resource-panel-popover');
        var scope = angular.element(popoverResPanel).scope();
        return scope;
    };

    iit("should be close popover calling cancel method", function() {

        var prop = {
            label: "item label",
            description: "item description",
            //uri: "http://item-uri",
            type: ["http://item-type"]
        };
        var item1 = new Item("http://item-uri", prop);
        ItemsExchange.addItemToContainer(item1, PageItemsContainer.options.container);

        var anchor = angular.element('.pnd-anchor');
        var triple = ["", "", ""];
        var label = "";
        // open a literal popover
        ResourcePanel.showItemsForSubject(triple, anchor, label);
        $rootScope.$digest();

        var scope = getPopoverResourcePanelScope();
        console.log(scope.type);
        expect(scope.type).toBe('sub');
        console.log(scope.pageItems);


    });



});