describe('Calendar Popover Resource Panel service', function() {

    var ResourcePanel,
        $rootScope,
        $httpBackend,
        NameSpace,
        $compile,
        $document,
        RESOURCEPANELDEFAULTS;


    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$compile_, _$document_, _RESOURCEPANELDEFAULTS_){
        ResourcePanel = $injector.get('ResourcePanel');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        $document = _$document_;
        RESOURCEPANELDEFAULTS = _RESOURCEPANELDEFAULTS_;
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
    var getPopoverCalendarScope = function(){
        var popoverCalendar = angular.element.find('.pnd-popover-calendar');
        var scope = angular.element(popoverCalendar).scope();
        return scope;
    };


    it("should open a calendar with default date if no date is given in input", function() {

        var anchor = angular.element('.pnd-anchor')[0];

        // open popover calendar without date
        ResourcePanel.showPopoverCalendar("", anchor);
        $rootScope.$digest();

        // get popover scope
        var calendarPopoverScope = getPopoverCalendarScope();
        // at this time popover is open and scope must be defined
        expect(calendarPopoverScope).toBeDefined();
        // popover should be open with default date
        expect(calendarPopoverScope.selectedDate).toBe(RESOURCEPANELDEFAULTS.initialCalendarDate);
        // popover should have a save method
        expect(calendarPopoverScope.save).toBeDefined();
        // popover should have a cancel method
        expect(calendarPopoverScope.cancel).toBeDefined();

        // close popover
        ResourcePanel.hide();

    });

    it("should open a calendar popover with a given date", function() {

        var date = "1983-12-23";
        var anchor = angular.element('.pnd-anchor')[0];

        ResourcePanel.showPopoverCalendar(date, anchor);
        $rootScope.$digest();

        // get popover scope
        var calendarPopoverScope = getPopoverCalendarScope();
        // popover should be open with given text
        expect(calendarPopoverScope.selectedDate).toBe(date);

        ResourcePanel.hide();

    });

    it("should close a calendar popover", function() {

        var anchor = angular.element('.pnd-anchor')[0];
        // open popover calendar
        ResourcePanel.showPopoverCalendar("", anchor);
        $rootScope.$digest();
        // popover should be open
        var popover = angular.element.find('div.pnd-popover-calendar');
        expect(popover.length).toBe(1);
        // close popover
        ResourcePanel.hide();
        // popover should be not present in DOM
        popover = angular.element.find('div.pnd-popover-calendar');
        expect(popover.length).toBe(0);

    });


    it("should resolve a promise when save a date", function() {

        var date = "1983-12-23";
        var anchor = angular.element('.pnd-anchor')[0];

        var promise = ResourcePanel.showPopoverCalendar(date, anchor);
        $rootScope.$digest();

        // get popover scope
        var calendarPopoverScope = getPopoverCalendarScope();
        calendarPopoverScope.save();
        $rootScope.$digest();

        // after saved text, promise should be resolved with saved text
        promise.then(function(value) {
            expect(value).toBe(date);

            // and popover should be closed
            var popover = angular.element.find('div.pnd-popover-calendar');
            expect(popover.length).toBe(0);
        });

    });


    it("should be open only one calendar popover at time", function() {

        var anchor = angular.element('.pnd-anchor')[0];

        // open a calendar popover
        ResourcePanel.showPopoverCalendar("", anchor);
        $rootScope.$digest();

        // at this time should be open only 1 popover
        var popover = angular.element.find('div.pnd-popover-calendar');
        expect(popover.length).toBe(1);

        // try to open a new popover from the same target
        ResourcePanel.showPopoverCalendar("", anchor);
        $rootScope.$digest();

        // only 1 popover should be open
        popover = angular.element.find('div.pnd-popover-calendar');
        expect(popover.length).toBe(1);

        // create a new anchor for literal popover
        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-anchor-lit' style='position: absolute; left: -500px; top: -500px;'><div>");

        var anchorLit = angular.element('.pnd-anchor-lit')[0];

        // open a literal popover
        ResourcePanel.showPopoverLiteral("", anchorLit);
        $rootScope.$digest();

        // only 1 popover should be open
        // before to open calendar popover, literal popover should be closed
        popover = angular.element.find('div.pnd-popover-literal');
        expect(popover.length).toBe(1);

        //only calendar popover should be visible
        popover = angular.element.find('div.pnd-popover-calendar');
        expect(popover.length).toBe(0);

        // remove calendar anchor from DOM
        var body = $document.find('body');
        body.find('.pnd-anchor-lit').remove();

    });

    it("should be close popover calling cancel method", function() {

        var date;
        var anchor = angular.element('.pnd-anchor')[0];

        // open a literal popover
        ResourcePanel.showPopoverCalendar(date, anchor);
        $rootScope.$digest();

        var calendarPopoverScope = getPopoverCalendarScope();
        calendarPopoverScope.cancel();
        $rootScope.$digest();

        var popover = angular.element.find('div.pnd-popover-calendar');
        expect(popover.length).toBe(0);


    });




});