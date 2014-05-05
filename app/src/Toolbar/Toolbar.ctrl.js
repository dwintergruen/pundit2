angular.module('Pundit2.Toolbar')
.controller('ToolbarCtrl', function($scope, Toolbar, MyPundit) {
    
    var login = function() {
        MyPundit.login().then(function(userStatus) {
            Toolbar.setUserLogged(userStatus);
        });
    };
    
    var logout = function() {
        MyPundit.logout().then(function() {
            Toolbar.setUserLogged(false);
        });
    };
    
    $scope.errorMessageDropdown = Toolbar.getErrorMessageDropdown();

    $scope.userNotLoggedDropdown = [
        { text: 'Please sign in to use Pundit', href: '#' },
        { divider: true },
        { text: 'Sign in', click: login }
    ];
    
    $scope.userLoggedInDropdown = [
        { text: 'Log out', click: logout }
    ];
    
    $scope.userTemplateDropdown = [
        { text: 'My template 1', href: '#' },
        { text: 'My template 2', href: '#' },
        { text: 'My template 3', href: '#' }
    ];
    
    $scope.userNotebooksDropdown = [
        { text: 'Current notebook', href: '#' },
        { divider: true },
        { text: 'My notebook 1', href: '#' },
        { text: 'My notebook 2', href: '#' },
        { text: 'My notebook 3', href: '#' }
    ];
    
    $scope.userData = {};
    
    // listener for user status
    // when user is logged in, set flag isUserLogged to true
    $scope.$watch(function() { return Toolbar.getUserLogged(); }, function(newStatus) {
        $scope.isUserLogged = newStatus;
        $scope.userData = MyPundit.getUserData();
    });
    
    // listener for error status
    // when an error is occured in, set flag isErrorOccured to true
    $scope.$watch(function() { return Toolbar.getErrorShown(); }, function(newStatus) {
        $scope.isErrorOccured = newStatus;
    });

    // return true if no errors are occured --> status button ok must be visible
    $scope.showStatusButtonOk = function() {
        return $scope.isErrorOccured === false;
    };
    
    // return true if an error is occured --> status button error must be visible
    $scope.showStatusButtonError = function() {
        return $scope.isErrorOccured === true;
    };
    
    // return true if user is not logged in --> login button must be visible
    $scope.showLogin = function() {
        return $scope.isUserLogged === false;
    };
    
    // return true if user is logged in --> user button must be visible
    $scope.showUserButton = function() {
        return $scope.isUserLogged === true;
    };
    
    // return true if user is logged in --> dashboard button is active
    $scope.isDashboardActive = function() {
        return $scope.isUserLogged === true;
    };
    
    // return true if user is logged in --> get user ask link
    // return false if user is not logged in --> get default ask link
    $scope.isAskActive = function() {
        return $scope.isUserLogged === true;
    };
    
    // return true if user is logged in --> template button is active
    $scope.isTemplateModeActive = function() {
        return $scope.isUserLogged === true;
    };
    
    // return true if user is logged in --> template menu is active
    $scope.isTemplateMenuActive = function() {
        return $scope.isUserLogged === true;
    };
    
    // return true if user is logged in --> notebook menu is active
    $scope.isNotebookMenuActive = function() {
        return $scope.isUserLogged === true;
    };

    // get Ask the Pundit link
    $scope.getAskLink = function() {
        return Toolbar.getAskLink();
    };

});