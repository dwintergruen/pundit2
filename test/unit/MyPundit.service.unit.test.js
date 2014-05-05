describe('MyPundit service', function() {
    
    var MyPundit, $rootScope, $httpBackend, NameSpace;
    
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
    
    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_){
        MyPundit = $injector.get('MyPundit');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
    }));

    
    it("should set isUserLogged to true if user is logged in", function() {

        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        MyPundit.checkLoggedIn();
        $rootScope.$digest();
        $httpBackend.flush();
        expect(MyPundit.getUserLogged()).toBe(true);
    });





});