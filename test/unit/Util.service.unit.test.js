describe('Util service', function() {
    
    var Utils;

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector) {
            Utils = $injector.get('Utils');
        });
    });
    
    
    it('should provide a deepExtend() method', function() {
        expect(typeof Utils.deepExtend).toBe("function");
    });

    it('should extend objects deeply', function() {
        var ob1 = {
                a: 'test test',
                b: 'test 123',
                c: [1, 2],
                d: [2, 3],
                e: {
                    e1: 'test abc',
                    e2: 'test def',
                    e3: {
                        ee1: 'test ghi'
                    }
                }
            },
            ob2 = {
                b: 'TEST TEST TEST',
                d: [4, 5, 6, true],
                e: {
                    e1: 'TEST TEST TEST',
                    e3: {
                        ee2: 'TEST TEST TEST'
                    }
                }
            },
            original = angular.copy(ob1);
            
        Utils.deepExtend(ob1, ob2);
        
        // .a must be the same
        expect(ob1.a).toBe(original.a);

        // .b is overwritten
        expect(ob1.b).toBe(ob2.b);
        expect(ob1.b).not.toBe(original.b);

        // .c must have the same content (not the same reference)
        expect(ob1.c).toEqual(original.c);
        
        // .d is overwritten
        expect(ob1.d).toEqual(ob2.d);
        expect(ob1.d).not.toEqual(original.d);
        
        // .e and .e.e3 got extended, must not have the same content as 
        // the starting objects
        expect(ob1.e).not.toEqual(original.e);
        expect(ob1.e).not.toEqual(ob2.e);
        expect(ob1.e.e3).not.toEqual(original.e.e3);
        expect(ob1.e.e3).not.toEqual(ob2.e.e3);
        
        // .e is a mix of the two
        expect(typeof ob2.e.e3.ee1).toBe('undefined');
        expect(typeof original.e.e3.ee2).toBe('undefined');
        expect(ob1.e.e3.ee1).toBe(original.e.e3.ee1);
        expect(ob1.e.e3.ee2).toBe(ob2.e.e3.ee2);

    });

});