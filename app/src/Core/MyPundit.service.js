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

/**
 * @ngdoc service
 * @name MyPundit
 * @module Pundit2.Core
 * @description
 *
 * Handles the authentication workflow and stores informations about the logged-in user, like username, notebooks and other useful stuff.
 *
 * Checks if the user is logged in at startup, and request him to log in if needed.
 *
 *
 */
.service('MyPundit', function(BaseComponent, MYPUNDITDEFAULTS, NameSpace, $http, $q, $timeout, $modal, $window) {
    
    var myPundit = new BaseComponent('MyPundit', MYPUNDITDEFAULTS);
    
    var isUserLogged = false;
    var loginServer,
        loginStatus,
        userData = {};

    /**
     * @ngdoc method
     * @name MyPundit#getLoginStatus
     * @module Pundit2.Core
     * @function
     *
     * @description
     * Return the current login status.
     *
     * @return {string} current login status, that could be
     * * `loggedIn`: if user is correctly logged in
     * * `loggedOff`: if user is not logged in
     * * `waitingForLogIn`: when authentication workflow is running but user is not logged in yet
     *
    */
    myPundit.getLoginStatus = function() {
        return loginStatus;
    };

    /**
     * @ngdoc method
     * @name MyPundit#isUserLogged
     * @module Pundit2.Core
     * @function
     *
     * @description
     * Get if user is logged or not
     *
     * @return {boolean} true if user is logged in, false otherwise
     *
    */
    myPundit.isUserLogged = function() {
        return isUserLogged;
    };

    /**
     * @ngdoc method
     * @name MyPundit#getUserData
     * @module Pundit2.Core
     * @function
     *
     * @description
     * Return all information about logged-in user
     *
     * @return {object} object contain the following properties:
     * * `loginStatus` - `{number}`: must be 1 where user is logged in
     * * `id` - `{string}`: userID
     * * `uri` - `{string}`: user's profile uri
     * * `openid` - `{string}`: user's openid uri used to get login
     * * `firstName` - `{string}`: user's first name
     * * `lastName` - `{string}`: user's last name
     * * `fullName` - `{string}`: user's full name
     * * `email` - `{string}`: user's email
     * * `loginServer` - `{string}`: url to server login page
     *
     */
    myPundit.getUserData = function(){
        if(userData !== '' && typeof(userData) !== 'undefined') {
            return userData;
        }
    };

    /**
     * @ngdoc method
     * @name MyPundit#checkLoggedIn
     * @module Pundit2.Core
     * @function
     *
     * @description
     * Check if user is logged in or not.
     *
     * @returns {Promise} the promise will be resolved as true if is logged in, false otherwise
     *
     */
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
    

    var loginPromise;

    /**
     * @ngdoc method
     * @name MyPundit#login
     * @module Pundit2.Core
     * @function
     *
     * @description
     * Check if user is logged in or not and:
     *
     * * if user is logged in, resolve the login promise as true
     * * if user is not logged in, will be open the login modal to continue authentication
     *
     * @returns {Promise} the promise will be resolved as true when user has finished authentication and is logged in correctly, false otherwise
     *
     */
    myPundit.login = function() {

        loginPromise = $q.defer();
        
        myPundit.checkLoggedIn().then(
            function(isUserLoggedIn) {
                if(isUserLoggedIn === false){
                    loginStatus = "loggedOff";
                    //openLoginModal();
                    myPundit.openLoginPopUp();
                } else {
                    loginPromise.resolve(true);
                }
            }
        );
        
        return loginPromise.promise;
    };
    
    var loginPollTimer;

    /**
     * @ngdoc method
     * @name MyPundit#openLoginPopUp
     * @module Pundit2.Core
     * @function
     *
     * @description
     * Open the OpenID login popup where user can get login authentication
     *
     * When popup is opened, start a polling that check if login is happened or not
     *
     * When user is logged in correctly, promise will be resolves as true
     *
     * If user close modal login, promise will be resolved as false
     *
     */
    myPundit.openLoginPopUp = function(){

        if (typeof(loginPromise) === 'undefined') {
            myPundit.err("Login promise not defined, you should call login() first");
            return;
        } else {
            // login status is waiting for login
            loginStatus = "waitingForLogIn";

            // open popup to get login
            var loginpopup = $window.open(loginServer, 'loginpopup', 'left=260,top=120,width=480,height=360');

            // polls for login happened
            var check = function() {

                var promise = myPundit.checkLoggedIn();
                promise.then(
                    // success
                    function(isUserLogged){
                        if (isUserLogged){
                            $timeout.cancel(loginPollTimer);
                            loginPromise.resolve(true);
                            //$timeout(myPundit.closeLoginModal, myPundit.options.loginModalCloseTimer);
                        }
                    },
                    function(){
                        loginPromise.reject('login error');
                    }
                ); // end promise.then

                loginPollTimer = $timeout(check, myPundit.options.loginPollTimerMS);
            };

            check();

            $timeout(function(){
                $timeout.cancel(loginPollTimer);
                //loginPromise.reject('login error');
                loginPromise.resolve(false);
                loginpopup.close();
            }, 100000000);
        }

    };
    
    // logout

    /**
     * @ngdoc method
     * @name MyPundit#logout
     * @module Pundit2.Core
     * @function
     *
     * @description
     * Get user logout
     *
     * @returns {Promise} the promise will be resolved as true when user is logged out
     *
     */
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

    /**
     * @ngdoc method
     * @name MyPundit#closeLoginModal
     * @module Pundit2.Core
     * @function
     *
     * @description
     * Close login modal and cancel polling timeout
     *
     * Login promise will not be resolved
     *
     */
    myPundit.closeLoginModal = function(){
        loginModal.hide();
        $timeout.cancel(loginPollTimer);
    };
    
    // close modal, cancel timeout and resolve loginPromise
    /**
     * @ngdoc method
     * @name MyPundit#closeLoginModal
     * @module Pundit2.Core
     * @function
     *
     * @description
     * Close login modal and cancel polling timeout
     *
     * In this case, authentication process will be interrupted and login promise will be resolved as true
     *
     */
    myPundit.cancelLoginModal = function(){
        loginModal.hide();
        loginPromise.resolve(false);
        $timeout.cancel(loginPollTimer);
    };

    
    return myPundit;
    
});