describe('Config service without a punditConfig', function() {

    var $window,
        Config,
        PUNDITDEFAULTCONF;

    delete window.punditConfig;
    delete window.PUNDIT;

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        delete window.punditConfig;
        delete window.PUNDIT;

        inject(function($injector, _$window_) {

            $window = _$window_;
            PUNDITDEFAULTCONF = $injector.get('PUNDITDEFAULTCONF');
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
        expect($window.PUNDIT.config).toEqual(Config);
    });

    it("should get the defaults from PUNDITDEFAULTCONF", function() {
        expect(Config.modules).toEqual(PUNDITDEFAULTCONF.modules);
        expect(Config.vocabularies).toEqual(PUNDITDEFAULTCONF.vocabularies);
        expect(Config.useBasicRelations).toEqual(PUNDITDEFAULTCONF.useBasicRelations);
    });

    it("should have a isModuleActive method", function() {
        expect(typeof(Config.isModuleActive)).toBe("function");
        expect(Config.isModuleActive('somethingNonExistent')).toBe(false);
    });


});