describe('BaseComponent service without punditConfig', function() {

    var BaseComponent,
        BASECOMPONENTDEFAULTS,
        $window,
        $log;

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_) {
            $window = _$window_;
            BaseComponent = $injector.get('BaseComponent');
            BASECOMPONENTDEFAULTS = $injector.get('BASECOMPONENTDEFAULTS');
            $log = _$log_;
        });
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

});