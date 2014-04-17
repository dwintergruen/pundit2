describe('Config service without a punditConfig', function() {

    var $window,
        Config,
        PUNDITDEFAULTCONF;
        
    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$window_) {
            $window = _$window_;
            PUNDITDEFAULTCONF = $injector.get('PUNDITDEFAULTCONF');
        });
    });

    afterEach(function() {
        delete $window.PUNDIT;
    });

    // Before initializing Config, PUNDIT should not exist. 
    // It gets initialized as soon as it is instantiated,
    // for example by any BaseComponent-*
    describe("without loading any Config", function() {
        it("should not define PUNDIT on window", function() {
            expect(typeof($window.PUNDIT)).toBe("undefined");
        });
    });

    describe("after loading Config", function() {
        beforeEach(function() {
            delete $window.PUNDIT;
            inject(function($injector) {
                Config = $injector.get('Config');
            });
        });

        afterEach(function() {
            delete $window.PUNDIT;
        });

        it("should create PUNDIT on the window scope", function() {
            expect(typeof($window.PUNDIT)).toBe("object");
            expect(typeof($window.PUNDIT.config)).toBe("object");
        });

        it("should create PUNDIT.config equal as Config", function() {
            expect($window.PUNDIT.config).toBe(Config);
        });
    
        it("should get the defaults from PUNDITDEFAULTCONF", function() {
            expect(Config.modules).toEqual(PUNDITDEFAULTCONF.modules);
            expect(Config.vocabolaries).toEqual(PUNDITDEFAULTCONF.vocabolaries);
            expect(Config.useBasicRelations).toEqual(PUNDITDEFAULTCONF.useBasicRelations);
        });
    
        it("should have a isModuleActive method", function() {
            expect(typeof(Config.isModuleActive)).toBe("function");
            expect(Config.isModuleActive('somethingNonExistent')).toBe(false);
        });

    });

});