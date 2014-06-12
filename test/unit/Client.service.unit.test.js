ddescribe('Client service', function() {
    
    var Client, NameSpace, SelectorsManager,
        $rootScope,
        $httpBackend;

    var testPunditConfig = {
        modules: {
            "Client": {
                bootModules: ['Toolbar', 'Dashboard', 'DisabledModule']
            },
            "DisabledModule": {
                active: false
            }
        }
    };

    /*var userNotLogged = {
        loginStatus: 0,
        loginServer: "http:\/\/demo-cloud.as.thepund.it:8080\/annotationserver\/login.jsp"
    };*/

    beforeEach(module('Pundit2'));

    /*
    beforeEach(module(
        'src/Dashboard/Dashboard.dir.tmpl.html',
        'src/Dashboard/DashboardPanel.dir.tmpl.html',
        'src/Toolbar/Toolbar.dir.tmpl.html'
    ));*/

    beforeEach(function(){
        // extend default config
        window.punditConfig = testPunditConfig;
        module('Pundit2');
    });

    beforeEach(inject(function( _$rootScope_, _$httpBackend_,
        _Client_, _NameSpace_, _SelectorsManager_ ){

        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        Client = _Client_;
        NameSpace = _NameSpace_;
        SelectorsManager = _SelectorsManager_;

    }));

    beforeEach(function(){
        angular.element("body").append("<div data-ng-app='Pundit2'></div>");
    });

    afterEach(function(){
        angular.element("[data-ng-app='Pundit2']").remove();
    });

    it('should initialize vocab selectors, fix root node class and emit boot event', function(){
        var emitted = false;

        $rootScope.$on('pundit-boot-done', function(){
            emitted = true;
        });

        Client.boot();
        expect(SelectorsManager.getActiveSelectors().length).toBeGreaterThan(0);
        // fix class to add css
        expect(angular.element("[data-ng-app='Pundit2']").hasClass('pnd-wrp')).toBe(true);
        expect(emitted).toBe(true);
    });

    it('should add to the dom the expected modules', function(){
        
        Client.boot();

        var rootNode = angular.element("[data-ng-app='Pundit2']"),
            bootModules = rootNode.children();

        // add only configured modules
        expect(bootModules.length).toBe(2);
        expect(rootNode.find('dashboard').length).toBe(1);
        expect(rootNode.find('toolbar').length).toBe(1);

    });

});