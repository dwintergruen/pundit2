describe('Config service with a punditConfig', function() {

    var $window,
        Config,
        PUNDITDEFAULTCONF,
        testName1 = "pundit.testModule1",
        testName2 = "pundit.testModule2",
        selectorName = "FooFooSelector",
        testPunditConfig;

    // Prepare a test config with a couple of modules and one
    // extra bogus selector, just to test the deepExtend on Config
    testPunditConfig = {
            something: 'something else',
            modules: {}
        };
    testPunditConfig.modules[testName1] = {
        active: true,
        someOtherParameter: 'test 1 test 1 test 1'
    };
    testPunditConfig.modules[testName2] = {
        active: false,
        someOtherParameter: 'test test test2'
    };

    testPunditConfig.modules.selectors = {};
    testPunditConfig.modules.selectors[selectorName] = {
        label: 'FOO FOO FOO', active: false
    };

    beforeEach(module('Pundit2'));
    beforeEach(function() {

        // DEBUG: Pundit2's run() blocks will get executed BEFORE the inject() inside the
        // beforeEach(), so we need to fix the punditConfig on the window object, the real
        // window one
        window.punditConfig = testPunditConfig;
        module('Pundit2');

        inject(function(_$window_, $injector) {
            window.punditConfig = testPunditConfig;
            PUNDITDEFAULTCONF = $injector.get('PUNDITDEFAULTCONF');
            $window = _$window_;
            $window.punditConfig = testPunditConfig;
            Config = $injector.get('Config');
        });
    });

    afterEach(function() {
        // DEBUG: for some reason the beforeEach block does NOT initialize $window.punditConfig
        // again correctly after the first test: for this describe() we keep the same punditConfig
        // and use it across it()
        delete $window.punditConfig;
        delete $window.PUNDIT;
        delete window.PUNDIT;
        delete window.punditConfig;
    });

    it("should override and extend the PUNDITDEFAULTCONF defaults", function() {
        expect(typeof($window.PUNDIT)).toBe("object");
        expect(typeof($window.PUNDIT.config)).toBe("object");
        
        // These havent changed in testPunditConfig
        expect(Config.vocabolaries).toEqual(PUNDITDEFAULTCONF.vocabolaries);
        expect(Config.useBasicRelations).toEqual(PUNDITDEFAULTCONF.useBasicRelations);

        // .modules changed!
        expect(Config.modules).not.toEqual(PUNDITDEFAULTCONF.modules);
        expect(Config.modules[testName1]).toEqual(testPunditConfig.modules[testName1]);
        expect(Config.modules[testName2]).toEqual(testPunditConfig.modules[testName2]);
        expect(Config.modules[testName1]).not.toEqual(Config.modules[testName2]);
    });
    
    it("should use the extended .modules for isModuleActive()", function() {
        expect(Config.isModuleActive(testName1)).toEqual(testPunditConfig.modules[testName1].active);
        expect(Config.isModuleActive(testName2)).toEqual(testPunditConfig.modules[testName2].active);
    });

    it("should deep extend objects inside the conf", function() {
        var selectors = 0,
            defaultSelectors = 0,
            i;
        for (i in Config.modules.selectors) {
            selectors++;
        }
        for (i in PUNDITDEFAULTCONF.selectors) {
            defaultSelectors++;
        }
        expect(selectors).not.toBe(defaultSelectors);
        expect(selectors).toBeGreaterThan(defaultSelectors);
        expect(typeof(Config.modules.selectors[selectorName])).toBe('object');
        expect(typeof(PUNDITDEFAULTCONF.modules.selectors[selectorName])).toBe('undefined');
    });

});