describe('MyPundit service', function() {
    
    var MyPundit, $rootScope, $httpBackend, NameSpace, $timeout, $q, $modal;
    
    var userNotLogged = {
        loginStatus: 0,
        loginServer: "http:\/\/demo-cloud.as.thepund.it:8080\/annotationserver\/login.jsp"
    };
    
    var userLoggedIn = {
        loginStatus: 1,
        id: "myFakeId",
        uri: "http://myUri.fake",
        openid: "http://myOpenId.fake",
        firstName: "Mario",
        lastName: "Rossi",
        fullName: "Mario Rossi",
        email: "mario@rossi.it",
        loginServer: "http:\/\/demo-cloud.as.thepund.it:8080\/annotationserver\/login.jsp"
    };
    
    beforeEach(module(
        'src/Core/login.modal.tmpl.html'
    ));
    
    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$timeout_, _$q_, _$modal_){
        MyPundit = $injector.get('MyPundit');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        $q = _$q_;
        $modal = _$modal_;
    }));

    
    it("should check if user is logged in", function() {

        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        
        // check if user is logged in or not
        MyPundit.checkLoggedIn();
        
        $rootScope.$digest();
        $httpBackend.flush();
        
        // at this time user should be logged in, and isUserLogged should be true
        expect(MyPundit.getUserLogged()).toBe(true);
        
        // login status should be loggedIn
        expect(MyPundit.getLoginStatus()).toBe("loggedIn");
        
    });
    
    it("should check if user is not logged in", function() {

        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userNotLogged);
        
        // check if user is logged in or not
        MyPundit.checkLoggedIn();
        
        $rootScope.$digest();
        $httpBackend.flush();
        
        // at this time user should not be logged in, and isUserLogged should be false
        expect(MyPundit.getUserLogged()).toBe(false);
    });
    
    it("should get right user data if user is logged in", function() {

        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        
        // check if user is logged in or not
        MyPundit.checkLoggedIn();
        
        $rootScope.$digest();
        $httpBackend.flush();
        
        var userData = MyPundit.getUserData();
        
        expect(userData.loginStatus).toBe(userLoggedIn.loginStatus);
        expect(userData.id).toBe(userLoggedIn.id);
        expect(userData.uri).toBe(userLoggedIn.uri);
        expect(userData.openid).toBe(userLoggedIn.openid);
        expect(userData.firstName).toBe(userLoggedIn.firstName);
        expect(userData.lastName).toBe(userLoggedIn.lastName);
        expect(userData.fullName).toBe(userLoggedIn.fullName);
        expect(userData.email).toBe(userLoggedIn.email);
        expect(userData.loginServer).toBe(userLoggedIn.loginServer);

    });
    
    it("should get empty user data if user is not logged in", function() {

        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userNotLogged);
        
        var emptyUserData = {};
        
        // check if user is logged in or not
        MyPundit.checkLoggedIn();
        
        $rootScope.$digest();
        $httpBackend.flush();
        
        // getUserData() should return an empty object
        var userData = MyPundit.getUserData();
        
        expect(userData).toMatch(emptyUserData);
        
        expect(userData.loginStatus).toBeUndefined(true);
        expect(userData.id).toBeUndefined(true);
        expect(userData.uri).toBeUndefined(true);
        expect(userData.openid).toBeUndefined(true);
        expect(userData.firstName).toBeUndefined(true);
        expect(userData.lastName).toBeUndefined(true);
        expect(userData.fullName).toBeUndefined(true);
        expect(userData.email).toBeUndefined(true);
        expect(userData.loginServer).toBeUndefined(true);

    });

    xit("should set loginStatus = loggedOff and open the modal if user is not logged in and login() is executed", function() {

        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userNotLogged);

        MyPundit.login();
        
        $rootScope.$digest();
        $httpBackend.flush();
        
        // login status should be loggedOff
        expect(MyPundit.getLoginStatus()).toBe("loggedOff");

        console.log(MyPundit.getLoginStatus());
        
        // modal should be open
        var modalContainer = angular.element.find('div.pnd-login-modal-container');
        expect(modalContainer.length).toBe(1);
        console.log(modalContainer.length);
        
    });



});