angular.module('Pundit2.Core')
.controller('ModalLoginCtrl', function($scope, MyPundit, $window) {
    
    // get message to display
    $scope.$watch(function(){ return MyPundit.getLoginStatus(); }, function(status){
        $scope.notifyMessage = MyPundit.getStatusMessage(status);
    });
    
    $scope.login = function(){
        MyPundit.login();
    };
    
    $scope.closeModal = function(){
        MyPundit.closeLoginModal();
    };
});