angular.module('Pundit2.Toolbar')
.controller('ToolbarCtrl', function($scope, Toolbar) {
    
    console.log('Toolbar controller constructor invoked');
    
    $scope.errorMessageDropdown = [
        {text: 'Custom error message according with user action', href:'#'}
    ];
    
    $scope.userNotLoggedDropdown = [
        {text: 'Please sign in to use Pundit', href:'#'},
        { "divider": true },
        {text: 'Sign in', href:'#'}
    ];
    
    $scope.userLoggedInDropdown = [
        {text: 'Log out', href:'#'}
    ];
    
    $scope.dropdown = [
        {text: 'Separated link', href: '#separatedLink', click:''}
      ];

});