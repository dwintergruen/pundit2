describe('MyPundit service', function() {
    
    var MyPundit, $rootScope, $httpBackend, NameSpace, $timeout, $q, $modal, $document;
    
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

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$timeout_, _$q_, _$modal_, _$document_){
        MyPundit = $injector.get('MyPundit');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        $q = _$q_;
        $modal = _$modal_;
        $document = _$document_;
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

    it("should set loginStatus = loggedOff and open the modal if user is not logged in and login() is executed", function() {

        angular.element($document[0].body).append('<div data-ng-app="Pundit2" class="pnd-wrp"></div>');
        $rootScope.$digest();
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userNotLogged);

        MyPundit.login();
        
        $rootScope.$digest();
        $httpBackend.flush();
        
        // login status should be loggedOff
        expect(MyPundit.getLoginStatus()).toBe("loggedOff");
        
        // modal should be open
        var modalContainer = angular.element.find('div.pnd-login-modal-container');
        expect(modalContainer.length).toBe(1);
        
        // modal should contain cancel button and should be shown
        var cancelButton = angular.element.find('.pnd-login-modal-cancel');
        expect(cancelButton.length).toBe(1);
        expect(angular.element(cancelButton).hasClass('ng-hide')).toBe(false);
        
        // modal should contain open login popup button and should be shown
        var openPopUpButton = angular.element.find('.pnd-login-modal-openPopUp');
        expect(openPopUpButton.length).toBe(1);
        expect(angular.element(openPopUpButton).hasClass('ng-hide')).toBe(false);

        // close button should be hide
        var closeButton = angular.element.find('.pnd-login-modal-close');
        expect(closeButton.length).toBe(1);
        expect(angular.element(closeButton).hasClass('ng-hide')).toBe(true);
        
    });
    
    it("should correctly get logout when user is logged in", function() {
        
        var logoutOk = { logout: 1 };
        
        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $httpBackend.whenGET(NameSpace.get('asUsersLogout')).respond(logoutOk);
        
        // check if user is logged in or not
        MyPundit.checkLoggedIn();
        
        $rootScope.$digest();
        $httpBackend.flush();
        
        // at this time user should be logged in
        expect(MyPundit.getUserLogged()).toBe(true);
        
        // get logout
        MyPundit.logout();
        
        $rootScope.$digest();
        $httpBackend.flush();
        
        // after logout user shoud be not logged in anymore
        expect(MyPundit.getUserLogged()).toBe(false);
        
    });

});