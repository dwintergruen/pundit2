describe('BaseComponent service', function() {

    var BaseComponent,
        BASECOMPONENTDEFAULTS,
        $window,
        Config;
        
    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$window_) {
            $window = _$window_;
            BaseComponent = $injector.get('BaseComponent');
            BASECOMPONENTDEFAULTS = $injector.get('BASECOMPONENTDEFAULTS');
        });
        delete $window.PUNDIT;
    });
    
    afterEach(function() {
        delete $window.punditConfig;
        delete $window.PUNDIT;
    });
    
    it('should provide a base component with defaults and a log() method', function() {
        var testName = 'testName',
            custom = new BaseComponent(testName);
            
        expect(custom.name).toBe(testName);
        expect(custom.options.debug).toBe(BASECOMPONENTDEFAULTS.debug);
        expect(typeof custom.log).toBe("function");
    });

    it('should provide a base component overriding the defaults', function() {
        var testName = 'testName',
            testOptions = {debug: true},
            custom = new BaseComponent(testName, testOptions);
            
        expect(custom.options.debug).toBe(testOptions.debug);
    });

    it('should provide a base component with some custom options', function() {
        var testName = 'testName',
            testOptions = {something: true},
            custom = new BaseComponent(testName, testOptions);
            
        expect(custom.name).toBe(testName);
        expect(custom.options.something).toEqual(testOptions.something);
    });

    
    describe('BaseComponent after config is up and running', function() {

        var testName = "pundit.testModuleName",
            testPunditConfig = {
                something: 'something else',
                modules: {}
            };

        testPunditConfig.modules[testName] = {
            someOtherParameter: 'another secret'
        };
        
        beforeEach(function() {
            inject(function($injector, _$window_) {
                $window = _$window_;
                $window.punditConfig = testPunditConfig;
                Config = $injector.get('Config');
            });
        });

        it('should provide a base component with defaults taken from the global module conf', function() {
            var testOptions = {
                    someParameter: 'this is a secret'
                },
                custom = new BaseComponent(testName, testOptions);

            expect(custom.name).toBe(testName);
            expect(custom.options.someParameter).toEqual(testOptions.someParameter);

            // someOtherParameter is taken from the global punditConfig
            expect(custom.options.someOtherParameter).toEqual(testPunditConfig.modules[testName].someOtherParameter);
        });

        it('should provide a base component overriding the passed options with the global conf values', function() {

            var testOptions = {
                    someParameter: 'this is a secret',
                    someOtherParameter: 'ouch this is different'
                },
                custom = new BaseComponent(testName, testOptions);

            expect(custom.name).toBe(testName);
            expect(custom.options.someParameter).toEqual(testOptions.someParameter);

            // someOtherParameter is taken from the global punditConfig, which
            // overrides the options passed at instantiation time
            expect(custom.options.someOtherParameter).toEqual(testPunditConfig.modules[testName].someOtherParameter);
        });

        
    });

});