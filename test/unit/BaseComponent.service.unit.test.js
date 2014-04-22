describe('BaseComponent service', function() {

    var BaseComponent,
        BASECOMPONENTDEFAULTS,
        $window,
        $log,
        Config;
        
    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_) {
            $window = _$window_;
            BaseComponent = $injector.get('BaseComponent');
            BASECOMPONENTDEFAULTS = $injector.get('BASECOMPONENTDEFAULTS');
            $log = _$log_;
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
    
    it('should call $log.log with the log() method when debug is true', function() {
        var testName = 'testName',
            custom = new BaseComponent(testName, {debug: true});

        // $log here is from ngMock http://docs.angularjs.org/api/ngMock/service/$log
        $log.reset();
        custom.log('Test log');
        expect($log.log.logs.length).toEqual(1);
    });

    it('should not call $log.log with the log() method when debug is false', function() {
        var testName = 'testName',
            custom = new BaseComponent(testName, {debug: false});

        $log.reset();
        custom.log('Test log');
        expect($log.log.logs.length).toEqual(0);
    });
    
    it('should provide a base component with defaults and an err() method', function() {
        var testName = 'testName',
            custom = new BaseComponent(testName);
            
        expect(typeof custom.err).toBe("function");
    });

    it('should call $log.err with the err() method regardless of debug', function() {
        var testName = 'testName',
            custom = new BaseComponent(testName, {debug: false});

        $log.reset();
        custom.err('Test log');
        expect($log.error.logs.length).toEqual(1);
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

});