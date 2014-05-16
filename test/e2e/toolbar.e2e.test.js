describe("The toolbar module", function() {
    var p = protractor.getInstance();
    
    // check buttons state where user is not logged in
    var checkNotLoggedUserButtons = function() {
    
        // user button should be hide
        p.findElements(protractor.By.css('.pnd-toolbar-user-button.ng-hide')).then(function(userButton) {
            expect(userButton.length).toBe(1);
        });

        // login button should be visible
        p.findElements(protractor.By.css('.pnd-toolbar-login-button')).then(function(loginButton) {
            expect(loginButton.length).toBe(1);
            
            // click login button
            loginButton[0].click().then(function(){
                // dropdown-menu should be visible
                p.findElements(protractor.By.css('.pnd-toolbar-login-button .dropdown-menu li')).then(function(dropdownMenu) {
                    expect(dropdownMenu.length).toBe(2);
                    expect(dropdownMenu[0].getText()).toBe("Please sign in to use Pundit");
                    expect(dropdownMenu[1].getText()).toBe("Sign in");
                });
            });
        });

        // status button ok should be visible
        p.findElements(protractor.By.css('.pnd-toolbar-status-button-ok')).then(function(statusOkButton) {
            expect(statusOkButton.length).toBe(1);
        });
    
        // error button should be hide
        p.findElements(protractor.By.css('.pnd-toolbar-error-button.ng-hide')).then(function(errorButton) {
            expect(errorButton.length).toBe(1);
        });
    
        // ask the pundit button should be not active
        p.findElements(protractor.By.css('.pnd-toolbar-ask-button-not-active')).then(function(askButton) {
            expect(askButton.length).toBe(1);
        });
    
        // dashboard button should be not active
        p.findElements(protractor.By.css('.pnd-toolbar-dashboard-button .pnd-toolbar-not-active-element')).then(function(dashboardButton) {
            expect(dashboardButton.length).toBe(1);
        });
    
        // notebook button should be active
        p.findElements(protractor.By.css('.pnd-toolbar-notebook-menu-button .pnd-toolbar-not-active-element')).then(function(notebookButton) {
            expect(notebookButton.length).toBe(1);
            
            // click notebook button
            notebookButton[0].click().then(function(){
                // dropdown-menu should be visible
                p.findElements(protractor.By.css('.pnd-toolbar-notebook-menu-button .dropdown-menu li')).then(function(dropdownMenu) {
                    expect(dropdownMenu.length).toBe(2);
                    expect(dropdownMenu[0].getText()).toBe("Please sign in to use Pundit");
                    expect(dropdownMenu[1].getText()).toBe("Sign in");
                });
            });
        });
    };
    
    // check buttons state where user is logged in
    var checkLoggedUserButtons = function(){
        
        // user button should be visible and should show user full name
        p.findElements(protractor.By.css('.pnd-toolbar-user-button')).then(function(userButton) {
            expect(userButton.length).toBe(1);
            expect(userButton[0].getText()).toBe("Mario Rossi");
            
            // click user button
            userButton[0].click().then(function(){
                // dropdown-menu should be visible
                p.findElements(protractor.By.css('.pnd-toolbar-user-button .dropdown-menu li')).then(function(dropdownMenu) {
                    expect(dropdownMenu.length).toBe(1);
                    expect(dropdownMenu[0].getText()).toBe("Log out");
                });
            });
        });

        // login button should be hide
        p.findElements(protractor.By.css('.pnd-toolbar-login-button.ng-hide')).then(function(loginButton) {
            expect(loginButton.length).toBe(1);
        });
        
        // status button ok should be visible
        p.findElements(protractor.By.css('.pnd-toolbar-status-button-ok')).then(function(statusOkButton) {
            expect(statusOkButton.length).toBe(1);
        });
        
        // error button should be hide
        p.findElements(protractor.By.css('.pnd-toolbar-error-button.ng-hide')).then(function(errorButton) {
            expect(errorButton.length).toBe(1);
        });
        
        // ask the pundit button should be active
        p.findElements(protractor.By.css('.pnd-toolbar-ask-button-active')).then(function(askButton) {
            expect(askButton.length).toBe(1);
        });
        
        // dashboard button should be active
        p.findElements(protractor.By.css('.pnd-toolbar-dashboard-button .pnd-toolbar-active-element')).then(function(dashboardButton) {
            expect(dashboardButton.length).toBe(1);
        });

        // notebook button should be active
        p.findElements(protractor.By.css('.pnd-toolbar-notebook-menu-button .pnd-toolbar-active-element')).then(function(notebookButton) {
            expect(notebookButton.length).toBe(1);
        });
    };

    var httpMock = function () {
        angular.module('httpBackendMock', ['ngMockE2E'])
            .run(function ($httpBackend, NameSpace) {

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
                
                var logoutOk = { logout: 1 };

                $httpBackend.whenGET(NameSpace.get('asUsersLogout')).respond(logoutOk);
                $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
                
            });
        };
        
    beforeEach(function () {
        p.addMockModule('httpBackendMock', httpMock);
    });
      
    afterEach(function() {
        p.removeMockModule('httpBackendMock');
    });

    it('should show button in according with user status', function() {

        p.get('/app/examples/toolbar.html');

        // at the begin user is not logged in yet
        checkNotLoggedUserButtons();
        
        // click login button and get login
        p.findElement(protractor.By.css('.btn-example-login')).click().then(function() {
            // at this time user should be logged in
            checkLoggedUserButtons();
        });

        // click logout button
        p.findElement(protractor.By.css('.btn-example-logout')).click().then(function() {
            // at this time user should not be logged in anymore
            checkNotLoggedUserButtons();
        });

    });

});