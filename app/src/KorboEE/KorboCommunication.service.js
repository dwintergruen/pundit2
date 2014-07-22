angular.module('KorboEE')
    .service('KorboCommunicationService', function($q, $http, BaseComponent, ItemsExchange, Item, $rootScope, $modal, korboConf, APIService){

        var korboCommunication = new BaseComponent("KorboCommunication");

        var isAutocompleteLoading = false;

        // set autocomplete loading status
        korboCommunication.setAutocompleteLoading = function(val){
            isAutocompleteLoading = val;
        };

        // get autocomplete loading status
        korboCommunication.isAutocompleteLoading = function(){
            return isAutocompleteLoading;
        };

        // create a new scope for korbo modal
        var KeeModalScope = $rootScope.$new();

        // initializa korbo modal
        var KeeModal = $modal({
            container: "[data-ng-app='Pundit2']",
            template: 'src/KorboEE/Modal/KorboEE.modal.tmpl.html',
            show: false,
            backdrop: 'static',
            scope: KeeModalScope,
            keyboard: false
        });

        // CONFIRM MODAL
        var confirmModalScope = $rootScope.$new();
        confirmModalScope.titleMessage = "Are you sure?";
        confirmModalScope.notifyMessage = "Are you sure you want to close the editor? You will lose any unsaved changes";

        confirmModalScope.cancel = function() {
            confirmModal.hide();
        };

        confirmModalScope.confirm = function() {
            var api = APIService.get(this.globalObjectName);
            confirmModal.hide();
            korboConf.setIsOpenModal(false);
            KeeModal.hide();
            korboConf.setIsOpenModal(false);
            api.fireOnCancel();
            entityToCopy = null;
            entity = null;
        };

        var confirmModal = $modal({
            container: "[data-ng-app='Pundit2']",
            template: 'src/Core/confirm.modal.tmpl.html',
            show: false,
            backdrop: 'static',
            scope: confirmModalScope
        });

        korboCommunication.showConfirmModal = function(globalObjectName){
            confirmModalScope.globalObjectName = globalObjectName;
            confirmModal.$promise.then(confirmModal.show);

        };


        // open korbo modal on New tab
        // if an entity is defined, the form in New tab will be fill with entity passed values
        korboCommunication.openModalOnNew = function(conf, entity, directiveScope){
            // open only if modal is not open yet

            if(korboConf.getIsOpenModal() === false){
                korboConf.setIsOpenModal(true);
                // if an entity is passed, set in the scope
                if(typeof(entity) !== 'undefined' || entity !== ''){
                    KeeModalScope.entityToCreate = entity;
                } else {
                    KeeModalScope.entityToCreate = null;
                }

                KeeModalScope.labelToSearch = null;
                KeeModalScope.idEntityToEdit = null;
                // set operation code
                KeeModalScope.op = "new";
                // set configuration object in scope
                KeeModalScope.conf = conf;
                // set directive scope in modal scope
                KeeModalScope.directiveScope = directiveScope;
                // show the modal
                KeeModal.$promise.then(KeeModal.show);
            }

        };

        // open modal in Search tab
        // if a label is defined, when modal is open start searching the label
        korboCommunication.openModalOnSearch = function(conf, val, directiveScope){
            if(korboConf.getIsOpenModal() === false){
                korboConf.setIsOpenModal(true);
                // if label is defined, set it in the modal scope
                if(typeof(val) !== 'undefined' || val !== ''){
                    KeeModalScope.labelToSearch = val;
                } else {
                    KeeModalScope.labelToSearch = null;
                }

                KeeModalScope.entityToCreate = null;
                KeeModalScope.idEntityToEdit = null;
                // set operation code
                KeeModalScope.op = "search";
                // set configuration object in scope
                KeeModalScope.conf = conf;
                // set directive scope in modal scope
                KeeModalScope.directiveScope = directiveScope;
                // show modal
                KeeModal.$promise.then(KeeModal.show);
            }
        };

        // open modal in Edit mode
        // it need the id of entity to edit
        korboCommunication.openModalOnEdit = function(conf, id, directiveScope){
            if(korboConf.getIsOpenModal() === false){
                korboConf.setIsOpenModal(true);
                if(typeof(id) !== 'undefined' || id !== ''){
                    KeeModalScope.idEntityToEdit = id;
                } else {
                    KeeModalScope.idEntityToEdit = null;
                }

                KeeModalScope.entityToCreate = null;
                KeeModalScope.labelToSearch = null;
                KeeModalScope.op = "edit";
                // set configuration object in scope
                KeeModalScope.conf = conf;
                // set directive scope in modal scope
                KeeModalScope.directiveScope = directiveScope;
                KeeModal.$promise.then(KeeModal.show);
            }
        };

        // close an open modal
        korboCommunication.closeModal = function(){
            if(korboConf.getIsOpenModal() === true){
                korboConf.setIsOpenModal(false);
                KeeModal.hide();
            }

        };

        // get a searching of a given label
        korboCommunication.autocompleteSearch = function(val, endpoint, prov, limit, offset, lang) {
            isAutocompleteLoading = true;
            // return an http Promise
            return $http({
                //headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                url: endpoint + "/search/items",
                cache: false,
                params: {
                    q: val,
                    p: prov,
                    limit: limit,
                    offset: offset,
                    lang: lang
                }
                // if no server error occures
            }).then(function(res) {
                    //if empty results is found, return an object with no found label
                if(res.data.metadata.totalCount === "0"){
                    var noFound = [{label:"no found", noResult:true}];
                    isAutocompleteLoading = false;
                    // on return http Promise will be resolved
                    return noFound;
                } else {
                    // if no empty results is found
                    // wipe container
                    ItemsExchange.wipeContainer("kee-"+prov);

                    // for each results, create an item...
                    for(var i=0; i<res.data.data.length; i++){

                        var item = {
                            uri: res.data.data[i].uri,
                            label: res.data.data[i].label,
                            description: res.data.data[i].abstract,
                            depiction: res.data.data[i].depiction,
                            type: []
                        }

                        for(var j=0; j<res.data.data[i].type.length; j++){
                            item.type.push(res.data.data[i].type[j]);
                        }
                        var itemToAdd = new Item(item.uri, item);

                        //... and add to container
                        ItemsExchange.addItemToContainer(itemToAdd, "kee-"+prov);
                    }
                    isAutocompleteLoading = false;
                    return res.data.data;
                }

            },
                // if server error is occurred, return error
            function(){
                isAutocompleteLoading = false;
                var errorServer = [{label:"error", errorServer:true}];
                return errorServer;
            });


        };

        var entity = null;
        // set selected entity
        korboCommunication.setSelectedEntity = function(e){
            entity = e;
        };

        // get selected entity
        korboCommunication.getSelectedEntity = function(){
            return entity;
        };

        var entityToCopy = null;

        // set entity to copy
        korboCommunication.setEntityToCopy = function(e){
            entityToCopy = e;
        };

        // get selected entity
        korboCommunication.getEntityToCopy = function(){
            return entityToCopy;
        };

        return korboCommunication;
    })

.factory('KorboCommunicationFactory', function($q, $http, Item, ItemsExchange){
        // selector instance constructor
        var KorboCommFactory = function(){

        };

        // this method accept the following parameters
        // param = {
        //   endpoint
        //   label
        //   provider
        //   offset
        //   limit
        //   language
        // }
        //
        // container: where add items
        //
        KorboCommFactory.prototype.search = function(param, container){
            var promise = $q.defer();
            $http({
                //headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                url: param.endpoint + "/search/items",
                cache: false,
                params: {
                    q: param.label,
                    p: param.provider,
                    limit: param.limit,
                    offset: param.offset,
                    lang: param.language
                }

            }).success(function(res){
                // wipe container
                ItemsExchange.wipeContainer(container);
                // for each results...
                for(var i=0; i<res.data.length; i++){
                    var item = {
                            uri: res.data[i].id,
                            label: res.data[i].label,
                            description: "",
                            depiction: "",
                            type: ['']
                            }
                    // ... create an item...
                    var itemToAdd = new Item(item.uri, item);
                    // ... and add it to container
                    ItemsExchange.addItemToContainer(itemToAdd, container);
                }

                promise.resolve();
            }).error(function(){
                promise.reject();
            });

            return promise.promise;
        };

        // this method accept the following parameters
        // param = {
        //   endpoint
        //   item
        //   provider
        //   basketID
        //   language
        // }
        //

        KorboCommFactory.prototype.getItem = function(param, useCache){
            var promise = $q.defer();
            $http({
                headers: { 'Accept-Language': param.language },
                method: 'GET',
                url: param.endpoint + "/baskets/"+param.basketID+"/items/"+param.item.uri+"",
                cache: useCache,
                params: {
                    p: param.provider
                }
            }).success(function(res){
                promise.resolve(res);
            }).error(function(){
                promise.reject();
            });

            return promise.promise;
        };

        // save an entity
        KorboCommFactory.prototype.save = function(entity, lan, baseURL, basketID){
            var promise = $q.defer();

            $http({
                headers: {'Access-Control-Expose-Headers': "Location", 'Content-Language': lan},
                method: 'POST',
                url: baseURL + "/baskets/" + basketID + "/items",
                data: entity
            }).success(function(data, status, headers){
                var location = headers('Location');

                promise.resolve(location);
            }).error(function(){
                promise.reject();
            });

            return promise.promise;
        };

        return KorboCommFactory;
    });