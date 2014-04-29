angular.module('Pundit2.Toolbar')
.controller('ToolbarCtrl', function($scope, Toolbar) {
    
    // default Ask The Pundit link
    // TODO: spostare in Toolbar.service come default
    $scope.ASKLINK = "http://ask.thepund.it/";
    
    $scope.errorMessageDropdown = Toolbar.getError();
    
    $scope.userNotLoggedDropdown = [
        {text: 'Please sign in to use Pundit', href:'#'},
        { "divider": true },
        {text: 'Sign in', href:'#'}
    ];
    
    $scope.userLoggedInDropdown = [
        {text: 'Log out', href:'#'}
    ];
    
    $scope.userTemplateDropdown = [
        {text: 'My template 1', href:'#'},
        {text: 'My template 2', href:'#'},
        {text: 'My template 3', href:'#'}
    ];
    
    $scope.userNotebooksDropdown = [
        {text: 'Current notebook', href:'#'},
        { "divider": true },
        {text: 'My notebook 1', href:'#'},
        {text: 'My notebook 2', href:'#'},
        {text: 'My notebook 3', href:'#'}
    ];
    
    // listener for user status
    // when user is logged in, set flag isUserLogged to true
    $scope.$watch(function(){ return Toolbar.getUserStatus(); }, function(newStatus){
        $scope.isUserLogged = newStatus;
    });
    
    // listener for error status
    // when an error is occured in, set flag isErrorOccured to true
    $scope.$watch(function(){ return Toolbar.getErrorShown(); }, function(newStatus){
        $scope.isErrorOccured = newStatus;
    });
    
    // set status button visibility
    $scope.showStatusButtonOk = function(){
        return $scope.isUserLogged === true;
    };
    
    // set error button visibility
    $scope.showStatusButtonError = function(){
        return $scope.isErrorOccured === true;
    };
    
    // set login button visibility
    $scope.showLogin = function(){
        return $scope.isUserLogged === false;
    };
    
    // set user button visibility
    $scope.showUserButton = function(){
        return $scope.isUserLogged === true;
    };
    
    // set dashboard visibility
    $scope.isDashboardActive = function(){
        return $scope.isUserLogged === true;
    };
    
    // set Ask the Pundit button visibility
    $scope.isAskActive = function(){
        return $scope.isUserLogged === true;
    };
    
    // set Template Mode button visibility
    $scope.isTemplateModeActive = function(){
        return $scope.isUserLogged === true;
    };
    
    // set template menu visibility
    $scope.isTemplateMenuActive = function(){
        return $scope.isUserLogged === true;
    };
    
    // set notebook menu visibility
    $scope.isNotebookMenuActive = function(){
        return $scope.isUserLogged === true;
    };
    
    // set Ask the Pundit link
    // TODO: if user is logged in, link must be get in configuration
    $scope.getAskLink = function(){
        return Toolbar.getAskLink();
    };
    

});