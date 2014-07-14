angular.module('KorboEE')
    .controller('KeeNewCtrl', function($scope, $modal, KorboCommunicationService) {

        $scope.tabs = [];
        $scope.imageUrl = "";
        $scope.tabs.push({
            title: 'EN',
            label: '',
            description: '',
            content: 'English'
        });

        $scope.tabs.push({
            title: 'EN',
            label: '',
            description: '',
            content: 'Italian'
        });

        $scope.tabs.push({
            title: 'EN',
            label: '',
            description: '',
            content: 'Spanish'
        });

        $scope.tabs.push({
            title: 'EN',
            label: '',
            description: '',
            content: 'English'
        });

        $scope.tabs.push({
            title: 'EN',
            label: '',
            description: '',
            content: 'English'
        });

        $scope.tabs.push({
            title: 'EN',
            label: '',
            description: '',
            content: 'English'
        });

    $scope.save = function(){
        console.log($scope.imageUrl);
    };


    });