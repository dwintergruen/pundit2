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

        // current tab provider selected in search tab
        $scope.currentProv = {};

        // modal tabs
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

        // set active tab in according with operation passed from callback
        $scope.$watch('op', function(val){

            if(val === 'search'){
                $scope.korboModalTabs.activeTab = 0;
                $scope.korboModalTabs[0].labelToSearch = $scope.labelToSearch;

            } else if(val === 'new'){
                $scope.korboModalTabs.activeTab = 1;
                $scope.korboModalTabs[1].entityToCreate = $scope.entityToCreate;
            }
        });

        // every time a tab in the modal (Search,New) is selected, update buttons visibility
        $scope.$watch('korboModalTabs.activeTab', function(){
            handleButton();
        });

        // close modal
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

        // set location, label and elemToSearch values of directive
        $scope.use = function(){
            // if is a korbo entity
            if($scope.itemSelected.providerFrom === 'korbo'){
                $scope.directiveScope.location = $scope.itemSelected.location;
                $scope.directiveScope.elemToSearch = $scope.itemSelected.label;
                $scope.directiveScope.label = $scope.itemSelected.label;
            // if is a no-korbo entity
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
            // fire onSave callback
            api.fireOnSave(obj);
            // fire onCancel callback
            api.fireOnCancel();
            // close modal
            KorboCommunicationService.closeModal();
            // set modal as close in configuration
            korboConf.setIsOpenModal(false);

        };

        $scope.itemSelected = null;
        // watching when an entity is selected
        $scope.$watch(function(){return KorboCommunicationService.getSelectedEntity()},
                    function(item){
                        if(item !== null){
                            $scope.itemSelected = item;
                        }
                    });

        // handle button visibility
        var handleButton = function(){

            // if no item is selected, set buttons visibility
            if($scope.itemSelected === null){
                $scope.showUseButton();
                $scope.showUseAndCopyButton();
                $scope.showCopyInEditorButton();
                $scope.showMoreInfoButton();
                $scope.showSaveAndAddButton();
            }

        };

        // set visibility Use button and Copy and Use button
        $scope.showUseButton = function(){

            // if Search tab is active
            if($scope.korboModalTabs.activeTab === 0){

                // if a non-korbo provider tab is selected and in configuration copyToKorboBeforeUse is set to true
                // show only Use and Copy button
                if($scope.currentProv.p !== 'korbo' && typeof($scope.conf.copyToKorboBeforeUse) !== 'undefined' && $scope.conf.copyToKorboBeforeUse){
                    $scope.showUse.visibility = false;
                    $scope.showUseAndCopy.visibility = true;

                // if korbo provider tab is selected and in configuration copyToKorboBeforeUse is set to true
                // show only Use button
                } else if($scope.currentProv.p === 'korbo' && typeof($scope.conf.copyToKorboBeforeUse) !== 'undefined' && $scope.conf.copyToKorboBeforeUse){
                    $scope.showUse.visibility = true;
                    $scope.showUseAndCopy.visibility = false;
                }

                // if in configuration copyToKorboBeforeUse is not defined or is set to false
                // show only Use button
                else if(typeof($scope.conf.copyToKorboBeforeUse) === 'undefined' || !$scope.conf.copyToKorboBeforeUse){
                    $scope.showUse.visibility = true;
                    $scope.showUseAndCopy.visibility = false;
                }

            // if New tab is active, hide Use button
            } else {
                $scope.showUse.visibility = false;
            }
        };

        // If New Tab is selected, hide Use and Copy button
        $scope.showUseAndCopyButton = function(){
            if($scope.korboModalTabs.activeTab === 1){
                $scope.showUseAndCopy.visibility = false;
            }
        };

        // show Copy in Editor button only in Search tab
        $scope.showCopyInEditorButton = function(){
            $scope.showCopyInEditor.visibility = $scope.korboModalTabs.activeTab === 0;
        };

        // show More Info button only in Search tab
        $scope.showMoreInfoButton = function(){
            $scope.showMoreInfo.visibility = $scope.korboModalTabs.activeTab === 0;

        };

        // show Save and Add button only in New tab
        $scope.showSaveAndAddButton = function(){
            $scope.showSaveAndAdd.visibility = $scope.korboModalTabs.activeTab === 1;
        };

    });