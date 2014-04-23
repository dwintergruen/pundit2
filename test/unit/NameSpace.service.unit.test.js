describe('NameSpace service', function() {

    var NameSpace,
        $window,
        $log,
        Config;
        
    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$window_, _$log_) {
            $window = _$window_;
            $log = _$log_;
            NameSpace = $injector.get('NameSpace');
            Config = $injector.get('Config');
        });
    });
    
    afterEach(function() {
        delete $window.punditConfig;
        delete $window.PUNDIT;
    });
    
    it('should provide an .ns object on the PUNDIT object', function() {
        expect(typeof $window.PUNDIT.ns).toBe("object");
        expect($window.PUNDIT.ns).toBe(NameSpace);
    });
    
    it('should provide an item object', function() {
        expect(typeof NameSpace.item).toBe("object");
    });

    it('should provide a notebook object', function() {
        expect(typeof NameSpace.notebook).toBe("object");
    });

    it('should provide various Pundit server API URLs', function() {
        expect(NameSpace.as).toBe(Config.annotationServerBaseURL);
        expect(typeof NameSpace.asUsersCurrent).toBe("string");
        expect(typeof NameSpace.asUsersLogout).toBe("string");
        expect(typeof NameSpace.asUsers).toBe("string");
    });

    it('should provide a get() method to interpolate API URLs', function() {
        expect(typeof NameSpace.get).toBe("function");
    });

    it('should interpolate API URLs using get()', function() {
        var testID = "test123",
            foo = NameSpace.get('asOpenNBMeta', {id: testID});
        
        // The interpolated result:
        // - starts with the default AS base URL
        expect(foo.indexOf(Config.annotationServerBaseURL)).toBe(0);

        // - contains the various fixed parts
        expect(foo.indexOf("/open/notebooks")).not.toBe(-1);
        expect(foo.indexOf("/metadata")).not.toBe(-1);

        // - contains the interpolated variable
        expect(foo.indexOf(testID)).not.toBe(-1);
        
        // - contains the interpolated variable in the right place
        expect(foo.indexOf("/open/notebooks/" + testID + "/metadata")).not.toBe(-1);

        // - is the URL of the open notebooks meta API for the given ID
        expect(foo).toBe(Config.annotationServerBaseURL + "open/notebooks/" + testID + "/metadata");
    });

    it('should log an error and return undefined using get() with an incorrect number of variables', function() {
        $log.reset();
        var foo = NameSpace.get('asOpenNBMeta');
        expect(typeof foo).toBe("undefined");
        expect($log.error.logs.length).toEqual(1);
    });
    
    it('should log an error and return undefined using get() with an unknown property', function() {
        $log.reset();
        var foo = NameSpace.get("asdfghjkl");
        expect(typeof foo).toBe("undefined");
        expect($log.error.logs.length).toEqual(1);
    });

    it('should log an error and return undefined using get() with something which is not a string', function() {
        var foo;
        
        $log.reset();
        foo = NameSpace.get([1, 2, 3]);
        expect(typeof foo).toBe("undefined");
        expect($log.error.logs.length).toEqual(1);
        
        $log.reset();
        foo = NameSpace.get({a: 'a', b: 'b'});
        expect(typeof foo).toBe("undefined");
        expect($log.error.logs.length).toEqual(1);
    });

});