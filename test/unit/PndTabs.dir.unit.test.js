describe('Dashboard service', function() {

    var $window,
        $rootScope,
        $compile,
        $templateCache;

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
        $templateCache.put('t1.html', 'This is the content of the template 1');
        $templateCache.put('t2.html', 'This is the content of template 2');

    });

    afterEach(function() {
        $rootScope.tabs = [];
    });

    var compileDirective = function(){

        var elem = $compile('<div pnd-tabs=tabs style="width: 100px"></div>')($rootScope);
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

        var pndTabs = angular.element(elem).find('.pnd-tab-header>li');
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
        var scope = getDirectiveScope(elem);

        var pndTabs = angular.element(elem).find('.pnd-tab-header>li');
        for(var i = 0; i<pndTabs.length; i++){
            expect(angular.element(pndTabs[i]).text().trim()).toBe($rootScope.tabs[i].title);
        }

    });

});