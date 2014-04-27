describe('BaseComponent service with global conf', function() {

    var BaseComponent,
        BASECOMPONENTDEFAULTS,
        $window,
        $log,
        Config;

        var testName = "pundit.testModuleName",
            testPunditConfig = {
                something: 'something else',
                modules: {}
            };

        testPunditConfig.modules[testName] = {
            someOtherParameter: 'another secret'
        };

    // To test the BaseComponent with a proper Config made up
    // from defaults + $window.punditConfig we must be sure
    // to inject BaseComponent _AFTER_ the punditConfig is in
    // place, or its initialization will occur without it

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_) {
            $window = _$window_;
            $window.punditConfig = testPunditConfig;
            BaseComponent = $injector.get('BaseComponent');
            BASECOMPONENTDEFAULTS = $injector.get('BASECOMPONENTDEFAULTS');
            $log = _$log_;
            Config = $injector.get('Config');
        });
    });

    afterEach(function() {
        delete $window.punditConfig;
        delete $window.PUNDIT;
    });

    it('should provide a base component with defaults taken from the global module conf', function() {
        var testOptions = {
                someParameter: 'this is a secret',
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

    it('should log with $log.log calling .log() when debugAllModules is true', function() {
        var testName = 'testName',
            custom = new BaseComponent(testName, {debug: false});

        // debug is false, debugAllModules is false by default: no logs
        $log.reset();
        expect($log.log.logs.length).toEqual(0);
        custom.log('test log 1');
        expect($log.log.logs.length).toEqual(0);

        // force debugAllModules to true, expect a log
        Config.debugAllModules = true;
        custom.log('test log 2');
        expect($log.log.logs.length).toEqual(1);
    });

});