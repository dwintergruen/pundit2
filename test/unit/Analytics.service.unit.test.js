describe('Analytics service', function() {
    
    var Analytics,
        $window,
        $log,
        $timeout,
        epsilon = 1,
        eventCategory = 'testCategory',
        eventAction = 'testAction';

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_, _$timeout_) {
            Analytics = $injector.get('Analytics');
            Analytics.options.debug = true;
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

    it('should not call track() when doTracking false', function() {
        Analytics.options.doTracking = false;

        $log.reset();
        Analytics.track(eventCategory, eventAction);
        expect($log.log.logs.length).toEqual(0);
    });

    it('should call track()', function() {
        $log.reset();
        expect($log.log.logs.length).toEqual(0);
        Analytics.track(eventCategory, eventAction);
        expect($log.log.logs.length).toEqual(1);
    });

    it('should not send hits without category or action', function() {
        $log.reset();
        Analytics.track();
        expect($log.log.logs.length).toEqual(0);
        expect($log.error.logs.length).toEqual(1);
    });

    it('should decrease hits after track', function() {
        expect(Analytics.getHits()).toBe(Analytics.options.hits);
        Analytics.track(eventCategory, eventAction);
        Analytics.track(eventCategory, eventAction);
        expect(Analytics.getHits()).toBe(Analytics.options.hits - 2);
    });

    it('should increase one hit with timeout', function() {
        expect(Analytics.getHits()).toBe(Analytics.options.hits);
        Analytics.track(eventCategory, eventAction);
        expect(Analytics.getHits()).toBe(Analytics.options.hits - 1);
        $timeout.flush(Analytics.options.bufferDelay - epsilon);
        expect(Analytics.getHits()).toBe(Analytics.options.hits - 1);
        $timeout.flush(2 * epsilon);
        expect(Analytics.getHits()).toBe(Analytics.options.hits);
    });

    it('should increase two hits with timeout', function() {
        expect(Analytics.getHits()).toBe(Analytics.options.hits);
        Analytics.track(eventCategory, eventAction);
        Analytics.track(eventCategory, eventAction);
        expect(Analytics.getHits()).toBe(Analytics.options.hits - 2);
        $timeout.flush(Analytics.options.bufferDelay - epsilon);
        expect(Analytics.getHits()).toBe(Analytics.options.hits - 2);
        $timeout.flush(2 * epsilon);
        expect(Analytics.getHits()).toBe(Analytics.options.hits);
    });

    it('should timer replenish at a rate of 2 hit per second', function() {
        $log.reset();
        expect($log.log.logs.length).toEqual(0);

        expect(Analytics.getHits()).toBe(Analytics.options.hits);
        for(var i=1; i<=Analytics.options.hits; i++){
            Analytics.track(eventCategory, eventAction);
        }
        expect($log.log.logs.length).toEqual(Analytics.options.hits);
        expect(Analytics.getHits()).toBe(0);

        Analytics.track(eventCategory, eventAction);
        Analytics.track(eventCategory, eventAction);
        expect($log.log.logs.length).toEqual(Analytics.options.hits);
        expect(Analytics.getHits()).toBe(0);

        $timeout.flush(Analytics.options.bufferDelay - epsilon);
        expect(Analytics.getHits()).toBe(0);
        $timeout.flush(2 * epsilon);
        expect($log.log.logs.length).toEqual(Analytics.options.hits+2+1);
        expect(Analytics.getHits()).toBe(0);

        for(var j=1; j<=Analytics.options.hits; j++){
            $timeout.flush(Analytics.options.bufferDelay);
        }

        expect(Analytics.getHits()).toBe(Analytics.options.hits);
            
        //TODO: Da dividere in sotto-problemi per controlli piu' selettivi?
        //      Es. verificare che il numero di hits sia sempre <= 20
        //TODO: Come distinguere log del sendHits() da quello del updateHits()?
    });

});