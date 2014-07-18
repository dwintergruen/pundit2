angular.module('KorboEE')
    .controller('KeeSearchCtrl', function($scope, $modal, KorboCommunicationService, KorboCommunicationFactory, ItemsExchange, $timeout, Preview) {

        var korboComm = new KorboCommunicationFactory();

        $scope.moduleName = 'KorboEE';

        // preview loading status
        $scope.previewIsLoading = false;

        // set label to search
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

        // initialize providers tabs
        $scope.contentTabs = [];

        // TODO in edit mode, non devo aggiungere korbo nella lista dei provider
        // push korbo provider
        $scope.contentTabs.push({
            title: 'Korbo',
            template: 'src/Lists/itemList.tmpl.html',
            items: [],
            itemsContainer: 'kee-korbo',
            provider: 'korbo',
            module: 'KorboEE'
        });

        // for each provider set in configuration, push it on tabs
        for(obj in $scope.conf.providers){

            if($scope.conf.providers[obj]){
                $scope.contentTabs.push({
                    title: obj,
                    template: 'src/Lists/itemList.tmpl.html',
                    items: [],
                    itemsContainer: 'kee-'+obj,
                    provider: obj,
                    module: 'KorboEE'
                });
            }
        };

        // set korbo tab as active tab
        $scope.active = $scope.contentTabs.activeTab = 0;


        var updateTimer;
        // when input text change, start searching label if its length is greater than value set in configuration
        $scope.$watch('elemToSearch', function(val){
            if(val.length >= $scope.conf.labelMinLength){
                $timeout.cancel(updateTimer);
                updateTimer = $timeout(function(){searchOnProviders(val)}, $scope.conf.updateTime);
                // if input type is empty
            } else if (val === ''){
                // wipe all providers results
                wipeResults();
                // set itemSelected to null
                $scope.itemSelected = null;
                // update total results
                $scope.korboModalTabs[0].totalResults = 0;
                // and clear sticky item
                Preview.clearItemDashboardSticky();

            }

        });

        // when select a provider tab, update buttons visibility
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

        // search a string in each providers
        var searchOnProviders = function(label){
            // iterate providers list and start searching for each in separate way
            for(var j=0; j<$scope.contentTabs.length; j++){
                (function(index) {
                    // build param object for search
                    var param = {};
                    param.label = label;
                    param.endpoint = $scope.conf.endpoint;
                    param.offset = 0;
                    param.limit = $scope.conf.limitSearchResult;
                    param.language = $scope.defaultLan.value;
                    // get current provider
                    param.provider = $scope.contentTabs[index].provider;
                    param.index = index;
                    // set loading status for current provider
                    $scope.contentTabs[index].isLoading = true;
                    // let start searching
                    korboComm.search(param, $scope.contentTabs[index].itemsContainer).then(
                        // when search is finished without errors
                        function(){
                            // set loading status to false
                            $scope.contentTabs[index].isLoading = false;
                            // set server error to false
                            $scope.contentTabs[index].serverError = false;
                            // get results from container in ItemsExchange
                            $scope.contentTabs[index].items = ItemsExchange.getItemsByContainer($scope.contentTabs[index].itemsContainer);
                            // update total results
                            $scope.korboModalTabs[0].totalResults += $scope.contentTabs[index].items.length;
                        },
                        // is server error is occured
                        function(){
                            $scope.contentTabs[index].isLoading = false;
                            // set status error to true
                            $scope.contentTabs[index].serverError = true;
                        });

                })(j)
            }
        };

        // wipe search results
        var wipeResults = function(){
            for(var j=0; j<$scope.contentTabs.length; j++){
                (function(index) {
                    // wipe current provider results ...
                    $scope.contentTabs[index].items = [];
                    // ...and its container in ItemsExchange
                    ItemsExchange.wipeContainer($scope.contentTabs[index].itemsContainer);
                })(j)
            }
        };

        $scope.previewError = false;

        // get a single entity to retriew all information to show in preview
        $scope.getItem = function(item){
            console.log("mouseover");
        };

        $scope.getItem = function(item){
            // set loading preview status to true
            console.log("get item: ", item);
            // build param to get call
            $scope.previewIsLoading = true;
            $scope.previewError = false;
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

            // call get HTTP
            var promise = korboComm.getItem(param);

            // when promise is resolved
            promise.then(function(res){

                //if label is empty, there are no results for that language and we need to do another get call with a valid language
                if(res.label === ''){
                    // get an available language for that item
                    param.language = res.available_languages[0];

                    // when the new promise is resolved
                    korboComm.getItem(param).then(function(r){
                        // get item from ItemExchange and update it
                        var updatedItem = ItemsExchange.getItemByUri(item.uri);
                        updatedItem.description = r.abstract;
                        updatedItem.type = angular.copy(r.type);
                        updatedItem.image = r.depiction;
                        updatedItem.location = r.uri;
                        updatedItem.resource = r.resource;
                        // set preview loading status to false
                        Preview.showDashboardPreview(updatedItem);
                        $scope.previewIsLoading = false;
                        $scope.previewError = false;
                    },
                    // IN CASE OF ERROR
                    function(){
                        Preview.hideDashboardPreview();
                        $scope.previewIsLoading = false;
                        $scope.previewError = true;
                    })

                    // if label is not empty, results get all items info
                } else {
                    // get item from ItemExchange and update it
                    var updatedItem = ItemsExchange.getItemByUri(item.uri);
                    updatedItem.description = res.abstract;
                    updatedItem.type = angular.copy(res.type);
                    updatedItem.image = res.depiction;
                    updatedItem.location = res.uri;
                    updatedItem.resource = res.resource;
                    Preview.showDashboardPreview(updatedItem);
                    $scope.previewIsLoading = false;
                    $scope.previewError = false;
                }

            },
            // IN CASE OF ERROR
            function(){
                Preview.hideDashboardPreview();
                $scope.previewIsLoading = false;
                $scope.previewError = true;
            });

        };

        $scope.itemSelected = null;
        $scope.isUseActive = false;

        // select an item
        $scope.select = function(item){
            // set the selected item as sticky in preview
            Preview.setItemDashboardSticky(item);
            $scope.isUseActive = true;
            $scope.itemSelected = item;
            // set provider where item selected is from
            $scope.itemSelected.providerFrom = $scope.contentTabs[$scope.contentTabs.activeTab].provider;
            // set selected item in korbo communication service
            KorboCommunicationService.setSelectedEntity($scope.itemSelected);

            // active more info button
            $scope.showMoreInfo.disabled = false;

            // if item selected is a korbo-item, show and set active only Use button, and hide Use and Copy Button
            if($scope.itemSelected.providerFrom === 'korbo'){
                $scope.showUse.disabled = false;
                $scope.showUse.visibility = true;
                $scope.showUseAndCopy.visibility = false;
            }

            // if item selected is a non korbo-item
            // show and set active only Use and Copy Button if in configuration  copyToKorboBeforeUse is set to true
            if($scope.itemSelected.providerFrom !== 'korbo' && typeof($scope.conf.copyToKorboBeforeUse) !== 'undefined' && $scope.conf.copyToKorboBeforeUse){
                $scope.showUseAndCopy.disabled = false;
                $scope.showUse.visibility = false;
                $scope.showUseAndCopy.visibility = true;
            // show and set active only Use Button if in configuration  copyToKorboBeforeUse is not defined or is set to false
            } else if($scope.itemSelected.providerFrom !== 'korbo' && (typeof($scope.conf.copyToKorboBeforeUse) === 'undefined' || !$scope.conf.copyToKorboBeforeUse)){
                $scope.showUse.disabled = false;
                $scope.showUse.visibility = true;
                $scope.showUseAndCopy.visibility = false;
            }

            // show and set active Copy in Editor button if current provider is set in configuration
            if($scope.conf.visualizeCopyButton.indexOf($scope.contentTabs[$scope.contentTabs.activeTab].provider) !== -1){
                $scope.showCopyInEditor.visibility = true;
                $scope.showCopyInEditor.disabled = false;
            } else {
                $scope.showCopyInEditor.disabled = true;
            }

        };

        // check if an item is the selected item or not
        $scope.isSelected = function(item){
            if ($scope.itemSelected !== null && $scope.itemSelected.uri === item.uri){
                return true;
            } else {
                return false;
            }
        };

        $scope.onMouseLeave = function(){
            Preview.hideDashboardPreview();
            $scope.previewIsLoading = false;
            $scope.previewError = false;

            //$scope.errorLoading = false;
        }

    });