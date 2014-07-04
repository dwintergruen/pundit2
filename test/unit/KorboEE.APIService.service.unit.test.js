describe('API service', function(){

    beforeEach(module('APIModule'));

    var conf = { globalObjectName: 'testTEST' },
        conf2 = { globalObjectName: 'testTESTXYZ' },
        APIService, $window;

    beforeEach(inject(function(_$window_, _APIService_){
        APIService = _APIService_;
        $window = _$window_;
    }));


    it('should return an api object ready to be used calling init()', function(){
        var api = APIService.init(conf);

        expect(api.conf).toEqual(conf);
        expect(api.addEvent).toEqual(jasmine.any(Function));
    });

    it('should return an api object by init() and get()', function(){
        var api1 = APIService.init(conf),
            api2 = APIService.get(conf.globalObjectName);

        expect(api1).toBe(api2);
    });

    it('should add the global object to $window', function(){
        APIService.init(conf);
        expect($window[conf.globalObjectName]).toEqual(jasmine.any(Object));
    });

    it('should add different global objects to $window by calling init() with different conf', function(){
        var api1 = APIService.init(conf),
            api2 = APIService.init(conf2);

        expect(api1).not.toBe(api2);
    });


    describe('addEvent() and on* callbacks', function() {

        it('should add an on* callback to the global object', function(){
            var api = APIService.init(conf);

            api.addEvent('Test');
            expect($window[conf.globalObjectName].onTest).toEqual(jasmine.any(Function));
        });

        it('should add two or more on* callbacks to the global object', function(){
            var api = APIService.init(conf);

            api.addEvent(['Test1', 'Test2', 'Test3']);
            expect($window[conf.globalObjectName].onTest1).toEqual(jasmine.any(Function));
            expect($window[conf.globalObjectName].onTest2).toEqual(jasmine.any(Function));
            expect($window[conf.globalObjectName].onTest3).toEqual(jasmine.any(Function));
        });

        it('should register a callback and call it', function(){
            var api = APIService.init(conf);

            api.addEvent('Test');

            var bool = false;
            $window[conf.globalObjectName].onTest(function() {
                bool = true;
            });
            expect(bool).toBe(false);

            api.fireOnTest();
            expect(bool).toBe(true);
        });

        it('should register separate callbacks and call them independently', function(){
            var api1 = APIService.init(conf),
                api2 = APIService.init(conf2);

            api1.addEvent('Test1');
            api2.addEvent('Test2');

            var v1 = 'pre1';
            $window[conf.globalObjectName].onTest1(function() {
                v1 = 'post1';
            });
            expect(v1).toBe('pre1');

            var v2 = 'pre2';
            $window[conf2.globalObjectName].onTest2(function() {
                v2 = 'post2';
            });
            expect(v2).toBe('pre2');

            api1.fireOnTest1();
            expect(v1).toBe('post1');
            expect(v2).toBe('pre2');

            api2.fireOnTest2();
            expect(v1).toBe('post1');
            expect(v2).toBe('post2');

        });

        it('should register a callback and call it with the given parameters', function(){
            var api = APIService.init(conf);

            api.addEvent('Test');

            var x = false,
                y = false;
            $window[conf.globalObjectName].onTest(function(a, b) {
                x = a;
                y = b;
            });
            expect(x).toBe(false);
            expect(y).toBe(false);

            api.fireOnTest(true, 'test');
            expect(x).toBe(true);
            expect(y).toBe('test');
        });

        it('should register more callbacks and call all of them', function(){
            var api = APIService.init(conf);

            api.addEvent('Test');

            var bool1 = false,
                bool2 = false,
                param = 'testXYZ';
            $window[conf.globalObjectName].onTest(function(arg) {
                bool1 = arg;
            });
            $window[conf.globalObjectName].onTest(function(arg) {
                bool2 = arg;
            });

            expect(bool1).toBe(false);
            expect(bool2).toBe(false);

            api.fireOnTest(param);
            expect(bool1).toBe(param);
            expect(bool2).toBe(param);
        });
    });

    describe('addFeature() and call* methods', function() {
        it('should add a call* method to the global object', function(){
            var api = APIService.init(conf);

            api.addFeature('Test');
            expect($window[conf.globalObjectName].callTest).toEqual(jasmine.any(Function));
        });

        it('should add two or more call* methods to the global object', function(){
            var api = APIService.init(conf);

            api.addFeature(['Test1', 'Test2', 'Test3']);
            expect($window[conf.globalObjectName].callTest1).toEqual(jasmine.any(Function));
            expect($window[conf.globalObjectName].callTest2).toEqual(jasmine.any(Function));
            expect($window[conf.globalObjectName].callTest3).toEqual(jasmine.any(Function));
        });

        it('should register a feature and call it', function(){
            var api = APIService.init(conf);

            api.addFeature('Test');

            var bool = false;
            api.exposeTest(function() {
                bool = true;
            });
            expect(bool).toBe(false);

            $window[conf.globalObjectName].callTest();
            expect(bool).toBe(true);
        });

        it('should register separate features and call them independently', function(){
            var api1 = APIService.init(conf),
                api2 = APIService.init(conf2);

            api1.addFeature('Test1');
            api2.addFeature('Test2');

            var v1 = 'pre1';
            api1.exposeTest1(function() {
                v1 = 'post1';
            });
            expect(v1).toBe('pre1');

            var v2 = 'pre2';
            api2.exposeTest2(function() {
                v2 = 'post2';
            });
            expect(v2).toBe('pre2');

            $window[conf.globalObjectName].callTest1();
            expect(v1).toBe('post1');
            expect(v2).toBe('pre2');

            $window[conf2.globalObjectName].callTest2();
            expect(v1).toBe('post1');
            expect(v2).toBe('post2');
        });

        it('should register a feature and call it with the given parameters', function(){
            var api = APIService.init(conf);

            api.addFeature('Test');

            var x = false,
                y = false;
            api.exposeTest(function(a, b) {
                x = a;
                y = b;
            });
            expect(x).toBe(false);
            expect(y).toBe(false);

            $window[conf.globalObjectName].callTest(true, 'test');
            expect(x).toBe(true);
            expect(y).toBe('test');
        });

    });

});