angular.module('Pundit2.Core')
.constant('MYPUNDITDEFAULTS', {
    debug: true,
    loginTimerMS: 1000
})
.service('MyPundit', function(BaseComponent, MYPUNDITDEFAULTS, NameSpace, $http, $q, $timeout, $modal, $window) {
    
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
            url: NameSpace.get('asUsersCurrent'),
            withCredentials: true
            
        }).success(function(data) {
            console.log(data);
            // user is not logged in
            if(data.loginStatus === 0){
                myPundit.setUserLogged(false);
                myPundit.setLoginServer(data.loginServer);
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
    
    var timer;
    
    myPundit.login = function(){
        myPundit.setLoginStatus('waitingForLogIn');
        var url = myPundit.getLoginServer();
        
        $window.open(url, 'loginpopup', 'left=260,top=120,width=480,height=360');
        
        var check = function() {
            var promise = myPundit.checkLoggedIn();
            promise.then(function(value){
                if(value){
                    $timeout.cancel(timer);
                    return;
                } else {
                    console.log('checkLoggedIn');
                }
            });
            timer = $timeout(check, myPundit.options.loginTimerMS);
        };
        
        check();
        

    };
    
    var modalLogin = $modal( {template: '../src/Core/modal.login.tmpl.html', show:false});
    
    myPundit.openLoginModal = function(){
        modalLogin.$promise.then(modalLogin.show);
    };
    
    myPundit.closeLoginModal = function(){
        modalLogin.hide();
        $timeout.cancel(timer);
    };

    
    return myPundit;
    
});