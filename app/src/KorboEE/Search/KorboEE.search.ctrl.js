angular.module('KorboEE')
    .controller('KeeSearchCtrl', function($scope, $modal, KorboCommunicationService, KorboCommunicationFactory, ItemsExchange, $timeout, Preview) {

        var korboComm = new KorboCommunicationFactory();

        if(typeof($scope.pane.labelToSearch) !== 'undefined'&& $scope.pane.labelToSearch !== ''){
            $scope.elemToSearch = $scope.pane.labelToSearch;
        } else {
            $scope.elemToSearch = '';
        }

        // set default language
        $scope.defaultLan = $scope.conf.languages[0];
        for (var j in $scope.conf.languages){
            if($scope.conf.languages[j].state === true) {
                $scope.defaultLan = $scope.conf.languages[j];
                break;
            } // end if
        } // end for

        $scope.contentTabs = [];

        $scope.contentTabs.push({
            title: 'Korbo',
            template: 'src/Lists/itemList.tmpl.html',
            items: [],
            itemsContainer: 'kee-korbo',
            provider: 'korbo'
        });

        for(obj in $scope.conf.providers){

            if($scope.conf.providers[obj]){
                $scope.contentTabs.push({
                    title: obj,
                    template: 'src/Lists/itemList.tmpl.html',
                    items: [],
                    itemsContainer: 'kee-'+obj,
                    provider: obj
                });
            }
        };

        $scope.active = $scope.contentTabs.activeTab = 0;

        var updateTimer;
        $scope.$watch('elemToSearch', function(val){
            if(val.length >= $scope.conf.labelMinLength){
                $timeout.cancel(updateTimer);
                updateTimer = $timeout(function(){searchOnProviders(val)}, $scope.conf.updateTime);
            } else if (val === ''){
                wipeResults();
                $scope.itemSelected = null;
                $scope.korboModalTabs[0].totalResults = 0;
                Preview.clearItemDashboardSticky();

            }

        });

        $scope.$watch('contentTabs.activeTab', function(tab){
            $scope.currentProv.p = $scope.contentTabs[tab].provider;
            if($scope.itemSelected === null){
                if($scope.contentTabs[tab].provider !== 'korbo' && typeof($scope.conf.copyToKorboBeforeUse) !== 'undefined' && $scope.conf.copyToKorboBeforeUse){
                    $scope.showUse.visibility = false;
                    $scope.showUseAndCopy.visibility = true;

                } else if($scope.contentTabs[tab].provider === 'korbo' && typeof($scope.conf.copyToKorboBeforeUse) !== 'undefined' && $scope.conf.copyToKorboBeforeUse){
                    $scope.showUse.visibility = true;
                    $scope.showUseAndCopy.visibility = false;
                }
                else if(typeof($scope.conf.copyToKorboBeforeUse) === 'undefined' || !$scope.conf.copyToKorboBeforeUse){
                    $scope.showUse.visibility = true;
                    $scope.showUseAndCopy.visibility = false;
                }

                //TODO controlli sulla configurazione del pulsante copy
            }


        });

        var searchOnProviders = function(label){
            for(var j=0; j<$scope.contentTabs.length; j++){
                (function(index) {
                    var param = {};
                    param.label = label;
                    param.endpoint = $scope.conf.endpoint;
                    param.offset = 0;
                    param.limit = $scope.conf.limitSearchResult;
                    param.language = $scope.defaultLan.value;
                    param.provider = $scope.contentTabs[index].provider;
                    param.index = index;
                    $scope.contentTabs[index].isLoading = true;
                    korboComm.search(param, $scope.contentTabs[index].itemsContainer).then(
                        function(){
                            $scope.contentTabs[index].isLoading = false;
                            $scope.contentTabs[index].serverError = false;
                            $scope.contentTabs[index].items = ItemsExchange.getItemsByContainer($scope.contentTabs[index].itemsContainer);
                            $scope.korboModalTabs[0].totalResults += $scope.contentTabs[index].items.length;
                        }, function(){
                            $scope.contentTabs[index].isLoading = false;
                            $scope.contentTabs[index].serverError = true;
                        });

                })(j)
            }
        };

        var wipeResults = function(){
            for(var j=0; j<$scope.contentTabs.length; j++){
                (function(index) {
                    $scope.contentTabs[index].items = [];
                    ItemsExchange.wipeContainer($scope.contentTabs[index].itemsContainer);
                })(j)
            }
        };

        $scope.getItem = function(item){
            var param = {};
            param.endpoint = $scope.conf.endpoint;
            if($scope.contentTabs[$scope.contentTabs.activeTab].provider === 'korbo'){
                param.basketID = 'null';
            } else {
                param.basketID = $scope.conf.basketID;
            }

            param.language = $scope.defaultLan.value;
            param.provider = $scope.contentTabs[$scope.contentTabs.activeTab].provider;
            param.item = item;
            var promise = korboComm.getItem(param);

            promise.then(function(res){
                if(res.label === ''){
                    param.language = res.available_languages[0];
                    korboComm.getItem(param).then(function(r){
                        var updatedItem = ItemsExchange.getItemByUri(item.uri);
                        updatedItem.description = r.abstract;
                        updatedItem.type = angular.copy(r.type);
                        updatedItem.image = r.depiction;
                        updatedItem.location = r.uri;
                    })
                } else {
                    var updatedItem = ItemsExchange.getItemByUri(item.uri);
                    updatedItem.description = res.abstract;
                    updatedItem.type = angular.copy(res.type);
                    updatedItem.image = res.depiction;
                    updatedItem.location = res.uri;
                }

            });

        };

        $scope.itemSelected = null;
        $scope.isUseActive = false;

        $scope.select = function(item){
            Preview.setItemDashboardSticky(item);
            $scope.isUseActive = true;
            $scope.itemSelected = item;
            $scope.itemSelected.providerFrom = $scope.contentTabs[$scope.contentTabs.activeTab].provider;
            KorboCommunicationService.setSelectedEntity($scope.itemSelected);


            $scope.showMoreInfo.disabled = false;

            // se ho selezionato un entità da korbo devo nascondere useAndCopy e visualizzare solo Use attivo
            if($scope.itemSelected.providerFrom === 'korbo'){
                $scope.showUse.disabled = false;
                $scope.showUse.visibility = true;
                $scope.showUseAndCopy.visibility = false;
            }

            if($scope.itemSelected.providerFrom !== 'korbo' && typeof($scope.conf.copyToKorboBeforeUse) !== 'undefined' && $scope.conf.copyToKorboBeforeUse){
                $scope.showUseAndCopy.disabled = false;
                $scope.showUse.visibility = false;
                $scope.showUseAndCopy.visibility = true;
            } else if($scope.itemSelected.providerFrom !== 'korbo' && (typeof($scope.conf.copyToKorboBeforeUse) === 'undefined' || !$scope.conf.copyToKorboBeforeUse)){
                $scope.showUse.disabled = false;
                $scope.showUse.visibility = true;
                $scope.showUseAndCopy.visibility = false;
            }

            if($scope.conf.visualizeCopyButton.indexOf($scope.contentTabs[$scope.contentTabs.activeTab].provider) !== -1){
                $scope.showCopyInEditor.visibility = true;
                $scope.showCopyInEditor.disabled = false;
            } else {
                $scope.showCopyInEditor.disabled = true;
            }



        };


        $scope.isSelected = function(item){
            if ($scope.itemSelected !== null && $scope.itemSelected.uri === item.uri){
                return true;
            } else {
                return false;
            }
        };

    });