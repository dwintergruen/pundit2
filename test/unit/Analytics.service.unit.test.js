describe('Analytics service', function() {
    
    var Analytics,
        $window,
        $log,
        $timeout;

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_, _$timeout_) {
            Analytics = $injector.get('Analytics');
            Analytics.options.debug = true; //qui?! 
            $window = _$window_;
            $log = _$log_;
            $timeout = _$timeout_;
        });
    });

    afterEach(function() {
        delete $window.punditConfig;
        delete $window.PUNDIT;
    });


    it('should create the global google analytics object', function() {
        expect(typeof $window[Analytics.options.globalTracker]).toBe('function');
    });

    it('should not generate eventTrack with doTracking false', function() {
        Analytics.options.doTracking = false;

        $log.reset();
        Analytics.track('gui-x', 'load', 'test load analytics', '4');
        expect($log.log.logs.length).toEqual(0);
    });

    it('should generate eventTrack', function() {
        $log.reset();
        Analytics.track('gui-x', 'load', 'test load analytics', '4');
        expect($log.log.logs.length).toEqual(1);
    });

    it('should not generate eventTrack without category or action', function() {
        $log.reset();
        Analytics.track();
        expect($log.error.logs.length).toEqual(1);
    });

    it('should decrease hits after track', function() {
        Analytics.track('gui-x', 'load', 'test load analytics', '4');
        Analytics.track('gui-y', 'load', 'test load analytics', '4');
        expect(Analytics.getHits()).toBe(18);
    });

    it('should increase hits with timeout', function() {
        Analytics.track('gui-x', 'load', 'test load analytics', '4');
        $timeout.flush(1000.01);
        expect(Analytics.getHits()).toBe(20);

        Analytics.track('gui-x', 'load', 'test load analytics', '4');
        Analytics.track('gui-y', 'load', 'test load analytics', '4');
        $timeout.flush(1000.01);
        expect(Analytics.getHits()).toBe(20);
    });

});