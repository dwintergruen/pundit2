angular.module('Pundit2.Core')

.controller('LoginModalCtrl', function($scope, MyPundit) {

    var statusMessage = {};

    statusMessage.loggedOff = "To continue with this operation you must log in.";
    statusMessage.waitingForLogIn = "Please complete the process in the login window.";
    statusMessage.loggedIn = "You are logged in as: ";

    // get message to display
    $scope.$watch(function() {
        return MyPundit.getLoginStatus();
    }, function(status) {
        $scope.notifyMessage = statusMessage[status];
        if (MyPundit.isUserLogged()) {
            var userData = MyPundit.getUserData();
            $scope.notifyMessage = statusMessage[status] + " " + userData.fullName;
        }
    });

    $scope.loginPopUp = function() {
        MyPundit.openLoginPopUp();
    };

    $scope.logout = function() {
        MyPundit.logout();
    };

    $scope.closeModal = function() {
        MyPundit.closeLoginModal();
    };

    $scope.cancelModal = function() {
        MyPundit.cancelLoginModal();
    };

    $scope.isUserLogged = function() {
        return MyPundit.isUserLogged();
    };
});