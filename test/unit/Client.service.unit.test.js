describe('Client service', function() {
    
    var Client, NameSpace, SelectorsManager, ItemsExchange,
        $rootScope, $httpBackend, $templateCache, $compile;

    var testPunditConfig = {
        templates: [],
        modules: {
            "Client": {
                bootModules: ['Toolbar', 'Dashboard', 'DisabledModule', 'Preview'],
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
            },
            "Preview": {
                clientDashboardTemplate: 'templateClientId.html',
                clientDashboardPanel: "tools"
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
        $httpBackend.whenGET(NameSpace.get('asOpenAnnMetaSearch')+"?query=%7B%22resources%22:%5B%22http:%2F%2Fserver%2F%22%5D%7D&scope=all").respond({});
        $httpBackend.whenGET(NameSpace.get('asPref')).respond({});
    };

    var compileDirective = function(name){
        var elem = $compile('<'+name+'></'+name+'>')($rootScope);
        angular.element(name).remove();
        angular.element("[data-ng-app='Pundit2']").append(elem);
        $rootScope.$digest();
        return elem;
    };

    beforeEach(module('Pundit2'));

    beforeEach(function(){
        // extend default config
        window.punditConfig = testPunditConfig;
        module('Pundit2');
    });

    var ImageHandler;
    beforeEach(inject(function( _$rootScope_, _$httpBackend_, _$templateCache_, _$compile_,
        _Client_, _NameSpace_, _SelectorsManager_, _ItemsExchange_, _ImageHandler_ ){

        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $templateCache = _$templateCache_;
        $compile = _$compile_;
        Client = _Client_;
        NameSpace = _NameSpace_;
        SelectorsManager = _SelectorsManager_;
        ItemsExchange = _ItemsExchange_;
        ImageHandler = _ImageHandler_;

    }));

    beforeEach(function(){
        angular.element("body").append("<div data-ng-app='Pundit2'></div>");
    });

    afterEach(function(){
        angular.element("[data-ng-app='Pundit2']").remove();
        delete window.punditConfig;
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

    it('should add to the dom active modules inside dashboard panel', function(){

        $templateCache.put('templateClientId.html', '<div class="testClassToFindTmpl">TestContent</div>');
        addAllWhenHttp();
        
        Client.boot();

        var rootNode = angular.element("[data-ng-app='Pundit2']"),
            bootModules = rootNode.children();

        // add only configured modules
        expect(bootModules.length).toBe(2);
        expect(rootNode.find('dashboard').length).toBe(1);
        expect(rootNode.find('toolbar').length).toBe(1);

        compileDirective('dashboard');
        var el = angular.element.find("[paneltitle='tools'] .testClassToFindTmpl");
        expect(el.length).toBe(1);
        expect(el[0].innerHTML.indexOf("TestContent")).toBeGreaterThan(-1);
    });

    it('should load basic relations inside itemsExchange', function(){
        
        Client.boot();

        // read relations from testPunditConfig
        var relations = ItemsExchange.getItemsByContainer(Client.options.relationsContainer);

        expect(relations.length).toBe(1);
        expect(relations[0].uri).toEqual(testPunditConfig.modules.Client.basicRelations[0].uri);
    });

    // TODO test consolidation process
    it('http', function(){
        addAllWhenHttp();
        Client.boot();
        $httpBackend.flush();
        $rootScope.$digest();
    });

});