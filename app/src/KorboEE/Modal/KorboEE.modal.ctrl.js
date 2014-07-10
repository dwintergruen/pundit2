angular.module('KorboEE')
    .controller('KeeModalCtrl', function($scope, $modal, KorboCommunicationService) {

        $scope.korboModalTabs = [
            {
                "title": "Search",
                "template": "src/KorboEE/Search/KorboEE.search.tmpl.html"
            },
            {
                "title": "New",
                "template": "src/KorboEE/New/KorboEE.new.tmpl.html"
            }
        ];

        $scope.$watch('op', function(val){

            if(val === 'search'){
                $scope.korboModalTabs.activeTab = 0;
                $scope.korboModalTabs[0].labelToSearch = $scope.labelToSearch;

            } else if(val === 'new'){
                $scope.korboModalTabs.activeTab = 1;
                $scope.korboModalTabs[1].entityToCreate = $scope.entityToCreate;
            }
        });

        $scope.closeKeeModal = function(){
            KorboCommunicationService.closeModal();
        }

    });