angular.module('KorboEE')
    .controller('KeeSearchCtrl', function($scope, $modal, KorboCommunicationService) {
        console.log($scope.conf);

        if(typeof($scope.pane.labelToSearch) !== 'undefined'&& $scope.pane.labelToSearch !== ''){
            $scope.elemToSearch = $scope.pane.labelToSearch;
        } else {
            $scope.pane.labelToSearch = '';
        }

        $scope.contentTabs = [];

        $scope.contentTabs.push({
            title: 'Korbo',
            template: 'src/Lists/itemList.tmpl.html',
            items: [],
            itemsContainer: 'korbo'
        });

        for(obj in $scope.conf.providers){

            if($scope.conf.providers[obj]){
                $scope.contentTabs.push({
                    title: obj,
                    template: 'src/Lists/itemList.tmpl.html',
                    items: [],
                    itemsContainer: obj
                });
            }

        };



    });