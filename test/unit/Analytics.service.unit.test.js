describe('Analytics service', function() {
    
    var Analytics,
        $window;

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector, _$window_) {
            Analytics = $injector.get('Analytics');
            $window = _$window_;
        });
    });

    afterEach(function() {
        delete $window.punditConfig;
        delete $window.PUNDIT;
    });

    // it('should inject the analytics.js script', function() {
    //     inject(function(Analytics) {
    //       expect(document.querySelectorAll("script[src='http://www.google-analytics.com/analytics.js']").length).toBe(1);
    //     });
    // });

    it("should create the global google analytics object", function() {
        expect(typeof $window[Analytics.options.globalTracker]).toBe("function");
    });

    // TODO: .track() if doTracking: must log a message
    // TODO: .track() if !doTracking: must not log

});