describe('MyPundit service', function() {
    
    var MyPundit,
        $rootScope,
        $httpBackend,
        NameSpace,
        $timeout,
        $q,
        $modal,
        $document,
        MYPUNDITDEFAULTS,
        $log,
        $httpBackend2;
    
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
        'src/Core/Templates/login.modal.tmpl.html'
    ));
    
    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$timeout_, _$q_, _$modal_, _$document_, _MYPUNDITDEFAULTS_, _$log_){
        MyPundit = $injector.get('MyPundit');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;
        $q = _$q_;
        $modal = _$modal_;
        $document = _$document_;
        MYPUNDITDEFAULTS = _MYPUNDITDEFAULTS_;
        $log = _$log_;
        $httpBackend2 = _$httpBackend_;
    }));

    beforeEach(function() {
        angular.element($document[0].body).append('<div data-ng-app="Pundit2" class="pnd-wrp"></div>');
    });

    afterEach(function() {
        angular.element('div[data-ng-app="Pundit2"]').remove();
    });
    
    it("should check if user is logged in", function() {

		var promiseValue;

		$httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);

        // check if user is logged in or not
        var promise = MyPundit.checkLoggedIn();

		// waiting promise get be resolved
		waitsFor(function() { return typeof(promiseValue) !== 'undefined'; }, 2000);
		runs(function() {
			// promise should be resolved as true
			expect(promiseValue).toBe(true);

			// at this time user should be logged in, and isUserLogged should be true
			expect(MyPundit.isUserLogged()).toBe(true);

			// login status should be loggedIn
			expect(MyPundit.getLoginStatus()).toBe("loggedIn");
		});

		promise.then(function(val) {
			promiseValue = val;
		});
        
		$rootScope.$digest();
		$httpBackend.flush();

	});
    
	it("should check if user is not logged in", function() {

		var promiseValue;

		$httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userNotLogged);
        
		// check if user is logged in or not
		var promise = MyPundit.checkLoggedIn();

		// waiting promise get be resolved
		waitsFor(function() { return typeof(promiseValue) !== 'undefined'; }, 2000);
		runs(function() {
			// promise should be resolved as true
			expect(promiseValue).toBe(false);

			// at this time user should not be logged in, and isUserLogged should be false
			expect(MyPundit.isUserLogged()).toBe(false);
		});

		promise.then(function(value) {
			promiseValue = value;
		});
        
		$rootScope.$digest();
		$httpBackend.flush();

	});

    it("should checkLoggedIn notify error when server return error", function() {

        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(505);

        var serverError = false;

        var promise = MyPundit.checkLoggedIn();

        promise.then(function() {
            //if everything is ok do nothing

        }, function(){
            // if error is occurred
            serverError = true;
        });

        $rootScope.$digest();
        $httpBackend.flush();

        expect(serverError).toBe(true);

    });
    
	it("should get right user data if user is logged in", function() {

		var promiseValue;

		$httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        
		// check if user is logged in or not
		var promise = MyPundit.checkLoggedIn();

		waitsFor(function() { return typeof(promiseValue) !== 'undefined'; }, 2000);
		runs(function() {
			// promise should be resolved as true
			expect(promiseValue).toBe(true);

			// should get right user data
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

		promise.then(function(value) {
			promiseValue = value;
    });
        
        $rootScope.$digest();
        $httpBackend.flush();

    });
    
    it("should get empty user data if user is not logged in", function() {

		var promiseValue;

        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userNotLogged);
        
        var emptyUserData = {};
        
        // check if user is logged in or not
        var promise = MyPundit.checkLoggedIn();

		waitsFor(function() { return typeof(promiseValue) !== 'undefined'; }, 2000);
		runs(function() {
			// promise should be resolved as true
			expect(promiseValue).toBe(false);

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

		promise.then(function(value) {
			promiseValue = value;
		});

		$rootScope.$digest();
		$httpBackend.flush();

	});

    it("should set loginStatus = loggedOff and open the modal if user is not logged in and login() is executed", function() {

        var promiseValue;

        $httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userNotLogged);

        var promise = MyPundit.login();

        // wait for promise....
        waitsFor(function() { return typeof(promiseValue) !== 'undefined'; }, 2000);

        // promise should be return false
        runs(function() {
            expect(promiseValue).toBe(false);
        });

        // loginPromise should be resolved as false when login popup is closed
        promise.then(function(value) {
            promiseValue = value;
        });

        $rootScope.$digest();
        $httpBackend.flush();
        $timeout.flush();

    });
    
	it("should correctly get logout when user is logged in", function() {

		var promiseValue;
		var logoutOk = { logout: 1 };

		$httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
		$httpBackend.whenGET(NameSpace.get('asUsersLogout')).respond(logoutOk);
        
		// check if user is logged in or not
		var checkLoggedInPromise = MyPundit.checkLoggedIn();

		// wait for checkLoggedIn promise....
		waitsFor(function() { return typeof(promiseValue) !== 'undefined'; }, 2000);

		runs(function() {
			// checkLoggedIn promise should be return true
			expect(promiseValue).toBe(true);
			// at this time user should be logged in
			expect(MyPundit.isUserLogged()).toBe(true);
			// get logout()
			logoutTest();
		});

		// loginPromise should be resolved as false when cancel button is clicked
		checkLoggedInPromise.then(function(value) {
			promiseValue = value;
		});
        
		$rootScope.$digest();
        $httpBackend.flush();

		// get a logout and resolve promise
		var logoutTest = function(){
			var val;
			var logoutPromise = MyPundit.logout();

			// wait for logout promise....
			waitsFor(function() { return typeof(val) !== 'undefined'; }, 2000);

			// promise should be return false
			runs(function() {
				// promise should be returned as true
				expect(val).toBe(true);

				// at this time user should be not logged in
				expect(MyPundit.isUserLogged()).toBe(false);
			});

			logoutPromise.then(function(value) {
				val = value;
			});

			$rootScope.$digest();
			$httpBackend.flush();
		};

	});

    it("should logout notify error when server return error", function() {

        $httpBackend.whenGET(NameSpace.get('asUsersLogout')).respond(505);

        var serverError = false;

        var logoutPromise = MyPundit.logout();

        logoutPromise.then(function() {
            //if everything is ok do nothing

        }, function(){
            // if error is occurred
            serverError = true;

        });

        $rootScope.$digest();
        $httpBackend.flush();

        expect(serverError).toBe(true);
    });

	it("should resolve loginPromise as true when user is logged in", function() {

		var promiseValue;

		$httpBackend.whenGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);

		var promise = MyPundit.login();

		// wait for promise....
		waitsFor(function() { return typeof(promiseValue) !== 'undefined'; }, 2000);

		// promise should be return true
		runs(function() {
			expect(promiseValue).toBe(true);
		});

		// loginPromise should be resolved as true when user is logged in
		promise.then(function(value) {
			promiseValue = value;
		});

		$rootScope.$digest();
		$httpBackend.flush();
	});

    it("should log error if openLoginPopUp is called and loginPromise is not defined ", function() {

        $log.reset();

        // at the beginning no error messages are shown
        expect($log.error.logs.length).toBe(0);

        // calling openLoginPopUp should log an error message because at this time loginPromise is not defined
        MyPundit.openLoginPopUp();

        // an error message is shown
        expect($log.error.logs.length).toBe(1);

    });

    it("should reject loginPromise", function() {

        var serverError = false;

        var loginPromise = MyPundit.login();

        loginPromise.then(function() {
            //if everything is ok do nothing
        }, function(){
            // if error is occurred
            serverError = true;
        });

        // reject checkedLoggedIn promise
        $httpBackend.expectGET(NameSpace.get('asUsersCurrent')).respond(505);

        $httpBackend.flush();

        expect(serverError).toBe(true);

    });

    it("should start login polling timer ", function() {

        $httpBackend
            .expectGET(NameSpace.get('asUsersCurrent'))
            .respond(userNotLogged);

        MyPundit.login();

        //start polling

        // should be timeout tasks pending
        expect(function() {$timeout.verifyNoPendingTasks();}).toThrow();
        $httpBackend.expectGET(NameSpace.get('asUsersCurrent')).respond(userNotLogged);
        $rootScope.$digest();

        $timeout.flush(MYPUNDITDEFAULTS.loginPollTimerMS);
        $httpBackend.flush();

        // should be still timeout tasks pending
        expect(function() {$timeout.verifyNoPendingTasks();}).toThrow();

        // get user logged in
        $httpBackend.expectGET(NameSpace.get('asUsersCurrent')).respond(userLoggedIn);
        $rootScope.$digest();
        $timeout.flush();
        $httpBackend.flush();

        expect(MyPundit.getLoginStatus()).toBe("loggedIn");

        // flush timer to close modal
        $timeout.flush();

        // at this time should be not timeout tasks pending
        expect(function() {$timeout.verifyNoPendingTasks();}).not.toThrow();

    });

});