describe('Analytics service', function() {
    
    var Analytics,
        $window;

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector) {
            Analytics = $injector.get('Analytics');
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

});