describe('Toolbar service', function() {
    
    var Toolbar, MyPundit;
    
    var messageError1 = "Error 1";
    var messageError2 = "Error 2";
    var myCallback1 = function(){};
    var myCallback2 = function(){};

    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector) {
            Toolbar = $injector.get('Toolbar');
            MyPundit = $injector.get('MyPundit');
        });
    });

    // as default, getUserLogged() must return false
    it("should be isUserLogged = false as default", function() {
        expect(MyPundit.getUserLogged()).toBe(false);
    });
    
    it("should be isErrorShown false as default", function() {
        expect(Toolbar.getErrorShown()).toBe(false);
    });
    
    it("should be errorMessageDropdown empty as default", function() {
        expect(Toolbar.getErrorMessageDropdown().length).toBe(0);
    });
    
    it("should add an error correctly", function() {
        
        //at beginning error array must be empty
        expect(Toolbar.getErrorMessageDropdown().length).toBe(0);
        
        //add 2 error2 -- TODO: WHAT?
        Toolbar.addError(messageError1, myCallback1);
        Toolbar.addError(messageError2, myCallback2);
        
        //at this time error array should contain 2 element
        var errors = Toolbar.getErrorMessageDropdown();
        expect(errors.length).toBe(2);
        
        //check if errors added contain a message and a function
        for (var i=0; i<errors.length; i++){
            expect(typeof(errors[i].text)).toBe('string');
            expect(typeof(errors[i].click)).toBe('function');
        }
    });
    
    it("should remove an error", function() {
        
        //add 2 errors
        var errorId1 = Toolbar.addError(messageError1, myCallback1);
        Toolbar.addError(messageError2, myCallback2);
        
        // errors array should contain 2 elements
        expect(Toolbar.getErrorMessageDropdown().length).toBe(2);
        
        // remove first error
        Toolbar.removeError(errorId1);
        
        // errors array should contain only 1 element
        var errors = Toolbar.getErrorMessageDropdown();
        expect(errors.length).toBe(1);
        
        // errors array should contain only the second error added before
        expect(errors[0].text).toBe(messageError2);
        expect(errors[0].click).toEqual(jasmine.any(Function));
    });
    
    it("should set isErrorShown to true when an error is added", function() {
        
        // at beginning getErrorShown() should return false
        expect(Toolbar.getErrorShown()).toBe(false);
        
        // add an error
        Toolbar.addError(messageError1, myCallback1);
        
        // at this time getErrorShown() should return true
        expect(Toolbar.getErrorShown()).toBe(true);

    });
    
    it("should set isErrorShown to false when all errors are deleted", function() {
        
        //add 2 errors
        var errorId1 = Toolbar.addError(messageError1, myCallback1);
        var errorId2 = Toolbar.addError(messageError2, myCallback2);
        
        // at this time getErrorShown() should return true
        expect(Toolbar.getErrorShown()).toBe(true);
        
        // remove first error
        Toolbar.removeError(errorId1);
        
        // at this time getErrorShown() should return true
        expect(Toolbar.getErrorShown()).toBe(true);
        
        // remove last error
        Toolbar.removeError(errorId2);
        
        // at this time getErrorShown() should return false
        expect(Toolbar.getErrorShown()).toBe(false);
        
    });

});