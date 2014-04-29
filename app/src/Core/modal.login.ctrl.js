angular.module('Pundit2.Core')
.controller('ModalLoginCtrl', function($scope, MyPundit) {
    
    $scope.$watch(function(){ return MyPundit.getLoginStatus(); }, function(status){
        $scope.notifyMessage = MyPundit.getStatusMessage(status);
    });
});