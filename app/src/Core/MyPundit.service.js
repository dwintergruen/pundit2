angular.module('Pundit2.Core')
.constant('MYPUNDITDEFAULTS', {
    debug: true,
    loginTimerMS: 1000
})
.service('MyPundit', function(BaseComponent, MYPUNDITDEFAULTS, NameSpace, $http, $q, $timeout, $modal) {
    
    var myPundit = new BaseComponent('MyPundit', MYPUNDITDEFAULTS);
    
    var isUserLogged = false;
    var loginServer,
        loginStatus;
    
    var statusMessage = [];
    
    statusMessage['loggedOff'] = "To continue with this operation you must log in.";
    statusMessage['waitingForLogIn'] = "Please complete the process in the login window.";
    statusMessage['loggedIn'] = "You are logged in as: ";
    
    myPundit.setUserLogged = function(status){
        isUserLogged = status;
    };
    
    myPundit.getUserLogged = function(){
        return isUserLogged;
    };
    
    myPundit.setLoginServer = function(url){
        loginServer = url;
    };
    
    myPundit.getLoginServer = function(){
        return loginServer;
    };
    
    myPundit.setLoginStatus = function(status){
        loginStatus = status;
    }
    
    myPundit.getLoginStatus = function(){
        return loginStatus;
    }
    
    myPundit.getStatusMessage = function(status){
        return statusMessage[status];
    }
    
    myPundit.checkLoggedIn = function(){
        
        var promise = $q.defer();
        var httpCall;

        httpCall = $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            url: NameSpace.get('asUsersCurrent')
            
        }).success(function(data) {
            
            // user is not logged in
            if(data.loginStatus === 0){
                
                myPundit.setUserLogged(false);
                myPundit.setLoginServer(data.loginServer);
                myPundit.setLoginStatus("loggedOff");
                promise.resolve(false);

            }
            // user is logged in
            else {
                myPundit.setUserLogged(true);
                myPundit.setLoginStatus("loggedIn");
                promise.resolve(true);
            }
        
        }).error(function(data, statusCode) {

            promise.reject('error');
        });
        
        return promise.promise;
    };
    
    
    
    myPundit.openLoginModal = function(){
        
          // Pre-fetch an external template populated with a custom scope
          var myOtherModal = $modal( {template: '../src/Core/modal.login.tmpl.html'});
          // Show when some event occurs (use $promise property to ensure the template has been loaded)

    };

    
    return myPundit;
    
});