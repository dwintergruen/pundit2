angular.module('Pundit2.Core')
.constant('MYPUNDITDEFAULTS', {
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#MyPundit
     *
     * @description
     * `object`
     *
     * Configuration for MyPundit module
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#MyPundit.loginPollTimerMS
     *
     * @description
     * `number`
     *
     * Time interval for checking if user is logged in or not.
     * Time is expressed in milliseconds.
     * When login modal is open and user is getting log in, each <loginPollTimerMS> milliseconds server check if user is logged in or not
     *
     * Default value:
     * <pre> loginPollTimerMS: 1000 </pre>
     */
    loginPollTimerMS: 1000,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#MyPundit.loginModalCloseTimer
     *
     * @description
     * `number`
     *
     * Time interval for closing login modal, after user has logged in correctly.
     * Time is expressed in milliseconds.
     * When user is logged in, if modal isn't close by user clicking Close button, after <loginModalCloseTimer> millisecond,
     * modal will close automatically
     *
     * Default value:
     * <pre> loginModalCloseTimer: 1000 </pre>
     */
    loginModalCloseTimer: 1000
})
.service('MyPundit', function(BaseComponent, MYPUNDITDEFAULTS, NameSpace, $http, $q, $timeout, $modal, $window) {
    
    var myPundit = new BaseComponent('MyPundit', MYPUNDITDEFAULTS);
    
    var isUserLogged = false;
    var loginServer,
        loginStatus,
        userData = {};
    
    // return the current login status
    myPundit.getLoginStatus = function() {
        return loginStatus;
    };
    
    // get if user is logged or not 
    myPundit.isUserLogged = function() {
        return isUserLogged;
    };
    
    // get if user is logged or not 
    myPundit.getUserData = function(){
        if(userData !== '' && typeof(userData) !== 'undefined') {
            return userData;
        }
    };

    // check if the user is logged in or not 
    // return a promise, resolved as true if user is logged in
    // false otherwise
    myPundit.checkLoggedIn = function() {

        var promise = $q.defer(),
            httpCall;
        
        httpCall = $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            url: NameSpace.get('asUsersCurrent'),
            withCredentials: true
            
        }).success(function(data) {
            // user is not logged in
            if (data.loginStatus === 0) {
                isUserLogged = false;
                loginServer = data.loginServer;
                promise.resolve(false);
            } else {
                // user is logged in
                isUserLogged = true;
                loginStatus = "loggedIn";
                userData = data;
                promise.resolve(true);
            }
        
        }).error(function() {
            myPundit.err("Server error");
            promise.reject('check logged in promise error');
        });
        
        return promise.promise;
    };
    
    // check if user is not logged in, then open login modal
    var loginPromise;
    myPundit.login = function() {

        loginPromise = $q.defer();
        
        myPundit.checkLoggedIn().then(
            function(isUserLoggedIn) {
                if(isUserLoggedIn === false){
                    loginStatus = "loggedOff";
                    openLoginModal();
                } else {
                    loginPromise.resolve(true);
                }
            }
        );
        
        return loginPromise.promise;
    };
    
    var loginPollTimer;

    // start login workflow:
    // get login url
    // open popup to get login
    // polls for login happened
    // return promise, resolved as true when user is logged in
    myPundit.openLoginPopUp = function(){

        if (typeof(loginPromise) === 'undefined') {
            myPundit.err("Login promise not defined, you should call login() first");
            return;
        } else {
            // login status is waiting for login
            loginStatus = "waitingForLogIn";

            // open popup to get login
            $window.open(loginServer, 'loginpopup', 'left=260,top=120,width=480,height=360');

            // polls for login happened
            var check = function() {

                var promise = myPundit.checkLoggedIn();
                promise.then(
                    // success
                    function(isUserLogged){
                        if (isUserLogged){
                            $timeout.cancel(loginPollTimer);
                            loginPromise.resolve(true);
                            $timeout(myPundit.closeLoginModal, myPundit.options.loginModalCloseTimer);
                        }
                    },
                    function(){
                        loginPromise.reject('login error');
                    }
                ); // end promise.then

                loginPollTimer = $timeout(check, myPundit.options.loginPollTimerMS);
            };

            check();
        }

    };
    
    // logout
    myPundit.logout = function(){
        
        var logoutPromise = $q.defer(),
            httpCallLogout;
        
        httpCallLogout = $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            url: NameSpace.get('asUsersLogout'),
            withCredentials: true
            
        }).success(function() {
            isUserLogged = false;
            userData = {};
            logoutPromise.resolve(true);
            
        }).error(function() {
            logoutPromise.reject('logout promise error');
        });
        
        return logoutPromise.promise;
    };
    
    // MODAL HANDLER
    
    var loginModal = $modal({
        container: "[data-ng-app='Pundit2']",
        template: 'src/Core/login.modal.tmpl.html',
        show: false,
        backdrop: 'static'
    });
    
    // open modal
    var openLoginModal = function(){
        // promise is needed to open modal when template is ready
        loginModal.$promise.then(loginModal.show);
    };
    
    // close modal and cancel timeout 
    myPundit.closeLoginModal = function(){
        loginModal.hide();
        $timeout.cancel(loginPollTimer);
    };
    
    // close modal, cancel timeout and resolve loginPromise
    myPundit.cancelLoginModal = function(){
        loginModal.hide();
        loginPromise.resolve(false);
        $timeout.cancel(loginPollTimer);
    };

    
    return myPundit;
    
});