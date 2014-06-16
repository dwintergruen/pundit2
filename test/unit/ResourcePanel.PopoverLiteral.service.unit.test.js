describe('Literal Popover Resource Panel service', function() {

    var ResourcePanel,
        $rootScope,
        $httpBackend,
        NameSpace,
        $compile,
        $document;


    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$compile_, _$document_){
        ResourcePanel = $injector.get('ResourcePanel');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        $document = _$document_;
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
    var getPopoverLiteralScope = function(){
        var popoverLiteral = angular.element.find('.pnd-popover-literal');
        var scope = angular.element(popoverLiteral).scope();
        return scope;
    };

    it('should expose expected API', function(){

        expect(ResourcePanel.showPopoverLiteral).toBeDefined();
        expect(ResourcePanel.showPopoverCalendar).toBeDefined();
        expect(ResourcePanel.showItemsForSubject).toBeDefined();
        expect(ResourcePanel.showItemsForObject).toBeDefined();
        expect(ResourcePanel.showProperties).toBeDefined();
        expect(ResourcePanel.hide).toBeDefined();
    });

    it("should open an empty literal popover", function() {

        var anchor = angular.element('.pnd-anchor')[0];

        ResourcePanel.showPopoverLiteral("", anchor);
        $rootScope.$digest();

        // get popover scope
        var literalPopoverScope = getPopoverLiteralScope();
        // at this time popover is open and scope must be defined
        expect(literalPopoverScope).toBeDefined();
        // popover should be open with an empty text
        expect(literalPopoverScope.literalText).toBe("");
        // popover should have a save method
        expect(literalPopoverScope.save).toBeDefined();
        // popover should have a cancel method
        expect(literalPopoverScope.cancel).toBeDefined();

        // close popover
        ResourcePanel.hide();
        //$rootScope.$digest();

    });

    it("should open a literal popover with a given text", function() {

        var text = "My fake test";
        var anchor = angular.element('.pnd-anchor')[0];

        ResourcePanel.showPopoverLiteral(text, anchor);
        $rootScope.$digest();

        // get popover scope
        var literalPopoverScope = getPopoverLiteralScope();
        // popover should be open with given text
        expect(literalPopoverScope.literalText).toBe(text);

        ResourcePanel.hide();

    });

    it("should close a literal popover", function() {

        var anchor = angular.element('.pnd-anchor')[0];

        ResourcePanel.showPopoverLiteral("", anchor);
        $rootScope.$digest();

        // get popover scope
        var literalPopoverScope = getPopoverLiteralScope();
        // popover should be open with given text
        expect(literalPopoverScope).toBeDefined();
        var popover = angular.element.find('div.pnd-popover-literal');
        expect(popover.length).toBe(1);

        ResourcePanel.hide();

        popover = angular.element.find('div.pnd-popover-literal');
        expect(popover.length).toBe(0);

    });

    it("should resolve a promise when save a literal", function() {

        var text = "My custom text";
        var anchor = angular.element('.pnd-anchor')[0];

        var promise = ResourcePanel.showPopoverLiteral(text, anchor);
        $rootScope.$digest();

        // get popover scope
        var literalPopoverScope = getPopoverLiteralScope();
        literalPopoverScope.save();
        $rootScope.$digest();

        // after saved text, promise should be resolved with saved text
        promise.then(function(value) {
            expect(value).toBe(text);

            // and popover should be closed
            var popover = angular.element.find('div.pnd-popover-literal');
            expect(popover.length).toBe(0);
        });

    });

    it("should be open only one popover at time", function() {

        var anchor = angular.element('.pnd-anchor')[0];

        // open a literal popover
        ResourcePanel.showPopoverLiteral("", anchor);
        $rootScope.$digest();

        // at this time should be open only 1 popover
        var popover = angular.element.find('div.pnd-popover-literal');
        expect(popover.length).toBe(1);

        // try to open a new popover from the same target
        ResourcePanel.showPopoverLiteral("", anchor);
        $rootScope.$digest();

        // only 1 popover should be open
        popover = angular.element.find('div.pnd-popover-literal');
        expect(popover.length).toBe(1);

        // create a new anchor for calendar popover
        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-anchor-cal' style='position: absolute; left: -500px; top: -500px;'><div>");

        var anchorCal = angular.element('.pnd-anchor-cal')[0];

        // open a calendar popover
        ResourcePanel.showPopoverCalendar("", anchorCal);
        $rootScope.$digest();

        // only 1 popover should be open
        // before to open calendar popover, literal popover should be closed
        popover = angular.element.find('div.pnd-popover-literal');
        expect(popover.length).toBe(0);

        //only calendar popover should be visible
        popover = angular.element.find('div.pnd-popover-calendar');
        expect(popover.length).toBe(1);

        // remove calendar anchor from DOM
        var body = $document.find('body');
        body.find('.pnd-anchor-cal').remove();

    });

    it("should be close popover calling cancel method", function() {

        var text;
        var anchor = angular.element('.pnd-anchor')[0];

        // open a literal popover
        ResourcePanel.showPopoverLiteral(text, anchor);
        $rootScope.$digest();

        var literalPopoverScope = getPopoverLiteralScope();
        expect(literalPopoverScope.literalText).toBe("");
        literalPopoverScope.cancel();
        $rootScope.$digest();

        var popover = angular.element.find('div.pnd-popover-literal');
        expect(popover.length).toBe(0);


    });

});