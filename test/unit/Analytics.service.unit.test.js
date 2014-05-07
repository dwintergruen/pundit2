describe('Analytics service', function() {
    
    var Analytics,
        $window,
        $log,
        $timeout,
        epsilon = 1, // ms to introduce a gap in $timeout.flush()
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

    it('should not call track() when doTracking is false', function() {
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

    it('should not send hits without hits available', function() {
        var currentLog,
            hitsSent;
        $log.reset();
        expect($log.log.logs.length).toEqual(0);
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);
        
        // fill the queue to check that doesn't make calls without hits available
        for(var i=1; i<=Analytics.options.maxHits; i++){
            Analytics.track(eventCategory, eventAction);
        }

        // attempting to send
        Analytics.track(eventCategory, eventAction);
        Analytics.track(eventCategory, eventAction);

        currentLog = $log.log.logs[$log.log.logs.length-1].toString();
        hitsSent = parseInt(currentLog.match(/\d+(?=\ssent)/), 10);
        
        // check the number of sends
        expect(hitsSent).toEqual(Analytics.options.maxHits);
        expect(Analytics.getHits()).toEqual(0);
    });

    it('should decrease hits after calling track()', function() {
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);
        Analytics.track(eventCategory, eventAction);
        Analytics.track(eventCategory, eventAction);
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits - 2);
    });

    it('should increase one hit with after bufferDelay ms', function() {
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);
        Analytics.track(eventCategory, eventAction);
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits - 1);

        // check that there isn't any increase, right before bufferDelay ms
        $timeout.flush(Analytics.options.bufferDelay - epsilon);
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits - 1);

        // check that there is an increase, right after bufferDelay ms
        $timeout.flush(2 * epsilon);
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);
    });

    it('should increase two hits after bufferDelay ms', function() {
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);
        Analytics.track(eventCategory, eventAction);
        Analytics.track(eventCategory, eventAction);
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits - 2);

        // check that there isn't any increase, right before bufferDelay ms
        $timeout.flush(Analytics.options.bufferDelay - epsilon);
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits - 2);

        // check that there is an increase, right after bufferDelay ms
        $timeout.flush(2 * epsilon);
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);
    });

    it('should never have more available hits than maxHits', function() {
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);

        // Put 5 items in the queue
        for(var i=1; i<=5; i++){
            Analytics.track(eventCategory, eventAction);
        }
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits - 5);

        // Wait more bufferDelay ms than needed, and check the hits
        for(var j=1; j<=Analytics.options.maxHits; j++){
            $timeout.flush(Analytics.options.bufferDelay);
        }
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);
    });


    // TODO RAF: occhio che manca uno spazio in cima a sto test
    // TODO RAF 2: cosa testa sto test? Volevi testare che quando la coda e' vuota
    // non viene spedita subito una hit?
   it('should buffer be empty', function() {
        $log.reset();
        expect($log.log.logs.length).toEqual(0);
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);

        for(var i=1; i<=Analytics.options.maxHits; i++){
            Analytics.track(eventCategory, eventAction);
        }

        expect(Analytics.getHits()).toEqual(0);
    });

    it('should replenish available hits at a rate of 2 per second', function() {
        $log.reset();
        expect($log.log.logs.length).toEqual(0);
        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);

        // Fill the queue with maxHits items, we have 0 available hits after
        for(var i=1; i<=Analytics.options.maxHits; i++){
            Analytics.track(eventCategory, eventAction);
        }
        expect(Analytics.getHits()).toEqual(0);


        // Right before bufferDelay ms, there's still 0 hits available
        $timeout.flush(Analytics.options.bufferDelay - epsilon);
        expect(Analytics.getHits()).toEqual(0);

        // Right after bufferDelay ms, getHits() should return 2 hits
        $timeout.flush(2 * epsilon);
        expect(Analytics.getHits()).toEqual(2);

        for(var j=1; j<=Analytics.options.maxHits; j++){
            $timeout.flush(Analytics.options.bufferDelay);
        }

        expect(Analytics.getHits()).toEqual(Analytics.options.maxHits);
    });

});