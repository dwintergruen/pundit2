angular.module('KorboEE')
    .controller('KeeModalCtrl', function($scope, $modal, KorboCommunicationService, APIService, korboConf) {

        var api = APIService.get($scope.conf.globalObjectName);

        // set default language
        $scope.defaultLan = $scope.conf.languages[0];
        for (var j in $scope.conf.languages){
            if($scope.conf.languages[j].state === true) {
                $scope.defaultLan = $scope.conf.languages[j];
                break;
            } // end if
        } // end for

        $scope.currentProv = {};

        $scope.korboModalTabs = [
            {
                "title": "Search",
                "template": "src/KorboEE/Search/KorboEE.search.tmpl.html",
                "totalResults": 0
            },
            {
                "title": "New",
                "template": "src/KorboEE/New/KorboEE.new.tmpl.html"
            }
        ];

        // button states
        $scope.showUse = {
            "visibility":  false,
            "disabled":    true
        };

        $scope.showUseAndCopy = {
            "visibility":  false,
            "disabled":    true
        };

        $scope.showCopyInEditor = {
            "visibility":  false,
            "disabled":    true
        };

        $scope.showMoreInfo = {
            "visibility":  false,
            "disabled":    true
        };

        $scope.showSaveAndAdd = {
            "visibility":  false,
            "disabled":    true
        };

        $scope.$watch('op', function(val){

            if(val === 'search'){
                $scope.korboModalTabs.activeTab = 0;
                $scope.korboModalTabs[0].labelToSearch = $scope.labelToSearch;

            } else if(val === 'new'){
                $scope.korboModalTabs.activeTab = 1;
                $scope.korboModalTabs[1].entityToCreate = $scope.entityToCreate;
            }
        });

        $scope.$watch('korboModalTabs.activeTab', function(){
            handleButton();
        });

        $scope.closeKeeModal = function(){
            KorboCommunicationService.closeModal();
        }



        $scope.copyAndUse = function(){
            //TODO
            console.log("vuoi usare e copiare ", $scope.itemSelected);
        };

        $scope.moreInfo = function(){
            //TODO
            console.log("vuoi more info di ", $scope.itemSelected);
        };

        $scope.copyInEditor = function(){
            //TODO
            console.log("vuoi copiare ", $scope.itemSelected);
        };

        $scope.use = function(){
            console.log("use click", $scope.itemSelected);
            if($scope.itemSelected.providerFrom === 'korbo'){
                $scope.directiveScope.location = $scope.itemSelected.location;
                $scope.directiveScope.elemToSearch = $scope.itemSelected.label;
                $scope.directiveScope.label = $scope.itemSelected.label;

            } else {
                //TODO controllare la location nel caso di entità non di korbo
                $scope.directiveScope.location = "fake location?";
                $scope.directiveScope.elemToSearch = $scope.itemSelected.label;
                $scope.directiveScope.label = $scope.itemSelected.label;
            }

            // declare object returned onSave() call
            var obj = {};
            obj.value = $scope.directiveScope.location;
            obj.label = $scope.itemSelected.label;
            obj.type = $scope.itemSelected.type;
            obj.image = $scope.itemSelected.image;
            obj.description = $scope.itemSelected.description;
            obj.language = $scope.defaultLan.value;
            api.fireOnSave(obj);
            api.fireOnCancel();
            KorboCommunicationService.closeModal();
            korboConf.setIsOpenModal(false);

        };

        $scope.itemSelected = null;

        $scope.$watch(function(){return KorboCommunicationService.getSelectedEntity()},
                    function(item){
                        if(item !== null){
                            $scope.itemSelected = item;
                        }
                    });

        var handleButton = function(){
            if($scope.itemSelected === null){
                $scope.showUseButton();
                $scope.showUseAndCopyButton();
                $scope.showCopyInEditorButton();
                $scope.showMoreInfoButton();
                $scope.showSaveAndAddButton();
            }

        };

        $scope.showUseButton = function(){
            if($scope.korboModalTabs.activeTab === 0){

                if($scope.currentProv.p !== 'korbo' && typeof($scope.conf.copyToKorboBeforeUse) !== 'undefined' && $scope.conf.copyToKorboBeforeUse){
                    $scope.showUse.visibility = false;
                    $scope.showUseAndCopy.visibility = true;

                } else if($scope.currentProv.p === 'korbo' && typeof($scope.conf.copyToKorboBeforeUse) !== 'undefined' && $scope.conf.copyToKorboBeforeUse){
                    $scope.showUse.visibility = true;
                    $scope.showUseAndCopy.visibility = false;
                }
                else if(typeof($scope.conf.copyToKorboBeforeUse) === 'undefined' || !$scope.conf.copyToKorboBeforeUse){
                    $scope.showUse.visibility = true;
                    $scope.showUseAndCopy.visibility = false;
                }
            } else {
                $scope.showUse.visibility = false;
            }
        };

        $scope.showUseAndCopyButton = function(){
            if($scope.korboModalTabs.activeTab === 1){
                $scope.showUseAndCopy.visibility = false;
            }
        };

        $scope.showCopyInEditorButton = function(){
            if($scope.korboModalTabs.activeTab === 0){
                $scope.showCopyInEditor.visibility = true;
            } else {
                $scope.showCopyInEditor.visibility = false;
            }
        };

        $scope.showMoreInfoButton = function(){
            if($scope.korboModalTabs.activeTab === 0){
                $scope.showMoreInfo.visibility = true;
            } else {
                $scope.showMoreInfo.visibility = false;
            }
        };

        $scope.showSaveAndAddButton = function(){
            if($scope.korboModalTabs.activeTab === 1){
                $scope.showSaveAndAdd.visibility = true;
            } else {
                $scope.showSaveAndAdd.visibility = false;
            }
        };

    });