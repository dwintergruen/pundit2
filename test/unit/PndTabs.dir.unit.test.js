describe('Dashboard service', function() {

    var $window,
        $rootScope,
        $compile,
        $templateCache;

    var contentTemplate1 = "This is the content of the template 1",
        contentTemplate2 = "This is the content of the template 2";

    beforeEach(module('Pundit2'));

    beforeEach(module(
        'src/Dashboard/pndTabs.dir.tmpl.html'
    ));

    beforeEach(inject(function(_$window_, _$rootScope_, _$compile_, _$templateCache_){
        $window = _$window_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $templateCache = _$templateCache_;
    }));

    beforeEach(function() {
        $templateCache.put('t1.html', '<span class="template-content1">'+contentTemplate1+'</span>');
        $templateCache.put('t2.html', '<span class="template-content2">'+contentTemplate2+'</span>');
    });

    afterEach(function() {
        $rootScope.tabs = [];
    });

    beforeEach(function() {
        angular.element("body").append("<div data-ng-app='Pundit2' class='pnd-wrp'></div>");
    });

    var compileDirective = function(){

        var elem = $compile('<div class="pnd-wrp"><div pnd-tabs=tab style="width: 1000px"></div></div>')($rootScope);
        angular.element('body').append(elem);
        $rootScope.$digest();
        return elem;
    };

    // get the modal scope
    var getDirectiveScope = function(elem){
        var dirContainer = angular.element(elem).find('.pnd-tab-header');
        var dirScope = angular.element(dirContainer).scope();
        return dirScope;
    };

    it("should show the right number of tabs", function() {

        $rootScope.tabs = [
            {title:'tabs 1', template: 't1.html'},
            {title:'tabs 2', template: 't2.html'}
        ];

        var elem = compileDirective();
        $rootScope.$digest();

        var pndTabs = angular.element(elem).find('.pnd-tab-header>li:not(.pull-right)');
        expect(pndTabs.length).toBe($rootScope.tabs.length);


    });

    it("should show the right title of tabs", function() {

        $rootScope.tabs = [
            {title:'tabs 1', template: 't1.html'},
            {title:'tabs 2', template: 't2.html'},
            {title:'tabs 3', template: 't2.html'},
            {title:'tabs 4', template: 't2.html'}
        ];

        var elem = compileDirective();
        $rootScope.$digest();

        var pndTabs = angular.element(elem).find('.pnd-tab-header>li:not(.pull-right)');
        for(var i = 0; i<pndTabs.length; i++){
            expect(angular.element(pndTabs[i]).text().trim()).toBe($rootScope.tabs[i].title);
        }

    });

    it("should show the right content of tabs", function() {

        $rootScope.tabs = [
            {title:'tabs 1', template: 't1.html'},
            {title:'tabs 2', template: 't2.html'}
        ];

        var elem = compileDirective();
        $rootScope.$digest();

        var scope = getDirectiveScope(elem);

        // at the begin, should be active the first tab and its content should be visible
        var pndTabsContent = angular.element(elem).find('.pnd-tab-content>div.active');
        expect(angular.element(pndTabsContent).text().trim()).toBe(contentTemplate1);

        // click second tab
        var pndTabs = angular.element(elem).find('.pnd-tab-header>li:not(.pull-right) a');
        angular.element(pndTabs[1]).trigger('click');
        $rootScope.$digest();

        // at this time content should be changed and should be visible first tab content...
        pndTabsContent = angular.element(elem).find('.pnd-tab-content>div.active');
        expect(angular.element(pndTabsContent).text().trim()).toBe(contentTemplate2);
        // ...and active tab should be 1
        expect(scope.tabs.activeTab).toBe(1);

    });


});