describe('Client service', function() {
    
    var Client, NameSpace, SelectorsManager, ItemsExchange,
        $rootScope,
        $httpBackend;

    var testPunditConfig = {
        modules: {
            "Client": {
                bootModules: ['Toolbar', 'Dashboard', 'DisabledModule'],
                basicRelations: [
                    {
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
                    }
                ]
            },
            "DisabledModule": {
                active: false
            }
        }
    };

    var userNotLogged = {
        loginStatus: 0,
        loginServer: "http:\/\/demo-cloud.as.thepund.it:8080\/annotationserver\/login.jsp"
    };

    var addAllWhenHttp = function() {
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userNotLogged);
        $httpBackend
            .when('GET', NameSpace.get('asOpenAnn', {id: 'foo'}))
            .respond({});
    };

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
        _Client_, _NameSpace_, _SelectorsManager_, _ItemsExchange_ ){

        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        Client = _Client_;
        NameSpace = _NameSpace_;
        SelectorsManager = _SelectorsManager_;
        ItemsExchange = _ItemsExchange_;

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

    it('should add to the dom active modules', function(){
        
        Client.boot();

        var rootNode = angular.element("[data-ng-app='Pundit2']"),
            bootModules = rootNode.children();

        // add only configured modules
        expect(bootModules.length).toBe(2);
        expect(rootNode.find('dashboard').length).toBe(1);
        expect(rootNode.find('toolbar').length).toBe(1);
    });

    it('should load basic relations inside itemsExchange', function(){
        
        Client.boot();

        // read relations from testPunditConfig
        var relations = ItemsExchange.getItemsByContainer(Client.options.relationsContainer);

        expect(relations.length).toBe(1);
        expect(relations[0].uri).toEqual(testPunditConfig.modules.Client.basicRelations[0].uri);
    });

    /*it('http', function(){
        addAllWhenHttp();
        Client.boot();
        $httpBackend.flush();
    });*/

});