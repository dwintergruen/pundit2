describe('Toolbar service', function() {
    
    var Toolbar;

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector) {
            Toolbar = $injector.get('Toolbar');
        });
    });

    it("should be isUserLogged = false as default", function() {
        
        // as default, getUserStatus() must be return false
        expect(Toolbar.getUserStatus()).toBe(false);
    });
    
    it("should set userLogged to status given as parameter ", function() {
        
        // at this time, getUserStatus() must return false
        expect(Toolbar.getUserStatus()).toBe(false);
        
        // set user as logged in
        Toolbar.setUserStatus(true);
        
        // at this time, getUserStatus() must return false
        expect(Toolbar.getUserStatus()).toBe(true);
        
        // set user as logged out
        Toolbar.setUserStatus(false);
        
        // at this time, getUserStatus() must return false
        expect(Toolbar.getUserStatus()).toBe(false);
        
    });

});