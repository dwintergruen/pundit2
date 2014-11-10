describe('Event Dispatcher', function() {

    var EventDispatcher,
        $window,
        $rootScope;

    var testPunditConfig = {
        something: 'something else',
        modules: {}
    };

    beforeEach(function() {
        module('Pundit2');
        inject(function($injector, _$window_, _$rootScope_) {
            $window = _$window_;
            $window.punditConfig = testPunditConfig;
            $rootScope = _$rootScope_;
            EventDispatcher = $injector.get('EventDispatcher');
        });
    });

    afterEach(function() {
        delete $window.punditConfig;
        delete $window.PUNDIT;
    });

    it('should add and remove listener', function() {
        var message,
            ref;

        ref = EventDispatcher.addListener('EventDispatcher.unit.test', function (e) {
            message = e.args;
        });

        expect(EventDispatcher.getListeners().length).toBe(1);

        EventDispatcher.removeListener(ref);

        expect(EventDispatcher.getListeners().length).toBe(0);
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

    it('should send a new message and resolve a promise', function() {
        var promiseValue,
            message;

        EventDispatcher.addListener('EventDispatcher.unit.test', function (e) {
            e.resolve('promise ok');
        });
        expect(EventDispatcher.getListeners().length).toBe(1);

        EventDispatcher.sendEvent('EventDispatcher.unit.test', 'test').then(function (e) {
            promiseValue = e;
        });
        $rootScope.$apply();
        expect(promiseValue[0]).toBe('promise ok');
    });

});