describe('Configuration Controller', function() {

    var $document, $rootScope, $compile, $window, korboConf, $timeout;

    beforeEach(module('KorboEE'));

    beforeEach(inject(function(_$rootScope_,  _$document_, _$compile_, _$window_, _$timeout_){
        $rootScope = _$rootScope_;
        $document = _$document_;
        $compile = _$compile_;
        $window = _$window_;
        $timeout = _$timeout_;
    }));

    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            korboConf = $injector.get('korboConf');
        });
    });

    // After each test remove any modal, or we end up with a lot of them!
    afterEach(function() {
        var body = $document.find('body');
        body.find('div.modal').remove();
        body.find('div.modal-backdrop').remove();
        body.removeClass('modal-open');
        delete $window['testConf'];
        delete $window['testConf1'];
        delete $window['testConf2'];
        delete $window[korboConf.globalObjectName];
    });

    // Compile the directive with testConf parameter and make a digest
    var compileDirective = function(){
        var elem = $compile('<korbo-entity-editor conf-name=\'testConf\'></korbo-entity-editor>')($rootScope);
        $rootScope.$digest();
        return elem;
    };

    // get the scope of the modal
    /*var getModalScope = function(){
        var modalContainer = angular.element.find('.ee-container');
        var modalScope = angular.element(modalContainer).scope();
        return modalScope;
    };*/


    it('should compile directive and open the modal with the right configuration', function() {

        var testConf = {
            endpoint: "http://korbo.local/v1",
            providers: {
                freebase: true,
                dbpedia: true
            },
            buttonLabel: "SEARCH TEST"
        };
        $window['testConf'] = testConf;

        var elem = compileDirective();

        var directiveScope = angular.element(elem).isolateScope();
        //directiveScope.open();
        $rootScope.$digest();

        //var modalScope = getModalScope();

        expect(directiveScope.conf).toBeDefined();
        expect(directiveScope.conf.buttonLabel).toBe(testConf.buttonLabel);

        /*
        expect(modalScope.conf).toBeDefined();
        expect(modalScope.conf.buttonLabel).toBe(testConf.buttonLabel);
        expect(modalScope.conf.endpoint).toBe(testConf.endpoint);
        */
    });

    it('should compile directive and open the modal with the default configuration, given a partial configuration', function() {

        $window['testConf'] = {
            endpoint: "http://korbo.local/v1/",
            providers: {
                freebase: true,
                dbpedia: true
            }
        };

        var elem = compileDirective();
        var directiveScope = angular.element(elem).isolateScope();
        //directiveScope.open();
        $rootScope.$digest();

        //var modalScope = getModalScope();

        /*
        expect(modalScope.conf).toBeDefined();
        expect(modalScope.conf.buttonLabel).toBe(KORBODEFAULTCONF.buttonLabel);
        */
        expect(directiveScope.conf).toBeDefined();
        expect(directiveScope.conf.buttonLabel).toBe(KORBODEFAULTCONF.buttonLabel);
    });

    it('should compile directive and open the modal with the default configuration, given an undefined configuration', function() {

        var elem = compileDirective();
        var directiveScope = angular.element(elem).isolateScope();
        //directiveScope.open();
        $rootScope.$digest();

        //var modalScope = getModalScope();

        expect($window['testConf']).toBeUndefined();
        /*
        expect(modalScope.conf).toBeDefined();
        expect(modalScope.conf.buttonLabel).toBe(KORBODEFAULTCONF.buttonLabel);
        expect(modalScope.conf.endpoint).toBe(KORBODEFAULTCONF.endpoint);
        */

        expect(directiveScope.conf).toBeDefined();
        expect(directiveScope.conf.buttonLabel).toBe(KORBODEFAULTCONF.buttonLabel);
        expect(directiveScope.conf.endpoint).toBe(KORBODEFAULTCONF.endpoint);
    });


    it('should compile directive and open the modal with different configuration', function() {

        var label1 = "SearchLabel1",
            label2 = "SearchLabel2",
            endpoint1 = "http://korbo.local1/v1/",
            endpoint2 = "http://korbo.local2/v2/";

        $window['testConf1'] = {
            endpoint: endpoint1,
            providers: {
                freebase: true,
                dbpedia: true
            },
            buttonLabel: label1
        };

        $window['testConf2'] = {
            endpoint: endpoint2,
            providers: {
                freebase: true,
                dbpedia: true
            },
            buttonLabel: label2
        };

        var elem = $compile("<korbo-entity-editor conf-name='testConf1'></korbo-entity-editor><korbo-entity-editor conf-name='testConf2'></korbo-entity-editor>")($rootScope);
        $rootScope.$digest();

        var directiveScope = angular.element(elem[0]).isolateScope();
        //directiveScope.open();
        $rootScope.$digest();

        expect(directiveScope.conf).toBeDefined();
        expect(directiveScope.conf.buttonLabel).toBe(label1);
        expect(directiveScope.conf.endpoint).toBe(endpoint1);

        //var modalScope = getModalScope();

        /*
        expect(modalScope.conf).toBeDefined();
        expect(modalScope.conf.buttonLabel).toBe(label1);
        expect(modalScope.conf.endpoint).toBe(endpoint1);

        modalScope.close();
        // this flush id due to the modal closing animation
        // without this timeout flush the modal css is still present in DOM
        $timeout.flush();
        $rootScope.$digest();
        */

        directiveScope = angular.element(elem[1]).isolateScope();
        $rootScope.$digest();

        expect(directiveScope.conf).toBeDefined();
        expect(directiveScope.conf.buttonLabel).toBe(label2);
        expect(directiveScope.conf.endpoint).toBe(endpoint2);

        /*
        directiveScope.open();
        $rootScope.$digest();
        modalScope = getModalScope();

        expect(modalScope.conf).toBeDefined();
        expect(modalScope.conf.buttonLabel).toBe(label2);
        expect(modalScope.conf.endpoint).toBe(endpoint2);

        modalScope.close();
        $rootScope.$digest();
        */

    });

    it('should be the configuration the same in all modal lifecyle ', function() {

        $window['testConf'] = {
            endpoint: "http://korbo.local/v1/",
            providers: {
                freebase: true,
                dbpedia: true
            }
        };

        var elem = compileDirective();
        var directiveScope = angular.element(elem).isolateScope();
        //directiveScope.open();
        $rootScope.$digest();
        var confDirettiva = korboConf.setConfiguration('testConf');
        korboConf.setIsOpenModal(false);

        //var modalScope = getModalScope();

        expect(confDirettiva).toBeDefined();
        expect(directiveScope.conf).toBeDefined();
        //expect(modalScope.conf).toBeDefined();


        expect(confDirettiva).toEqual(directiveScope.conf);
        //expect(confDirettiva).toEqual(modalScope.conf);
        //expect(modalScope.conf).toEqual(directiveScope.conf);

    });

});