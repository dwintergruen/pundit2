angular.module('Pundit2.Toolbar')
.service('Toolbar', function() {

    console.log('ToolbarService is invoked');
    
    var userStatus = {
        loggedIn : false,
        userName: 'Gino'
    };
    
    this.setUserStatus = function(isLogged){
        userStatus.loggedIn = isLogged;
    }
    
    this.getUserStatus = function(){
        return userStatus;
    }

});