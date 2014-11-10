describe('Event Dispatcher', function() {

    var EventDispatcher,
        $window;

    var testPunditConfig = {
        something: 'something else',
        modules: {}
    };

    beforeEach(function() {
        module('Pundit2');
        inject(function($injector, _$window_) {
            $window = _$window_;
            $window.punditConfig = testPunditConfig;
            EventDispatcher = $injector.get('EventDispatcher');
        });
    });

    afterEach(function() {
        delete $window.punditConfig;
        delete $window.PUNDIT;
    });

    it('should add a new listener and send a message', function() {
        var message;

        EventDispatcher.addListener('EventDispatcher.unit.test', function (e) {
            message = e.args;
        });

        expect(EventDispatcher.getListeners().length).toBe(1);

        EventDispatcher.sendEvent('EventDispatcher.unit.test', 'test');

        expect(message).toBe('test');
    });

});