angular.module("Pundit2.MyItemsContainer")
.constant('MYITEMSDEFAULTS', {

    // Key used for the /services/preferences/ server API to store the my items object
    apiPreferencesKey: 'favorites',

    // Container used to store the my items in the itemsExchange
    container: 'myItems',

    debug: false
})
.service("MyItems", function(MYITEMSDEFAULTS, BaseComponent, NameSpace, Item, ItemsExchange,
                             ContextualMenu, MyPundit, Config,
                             $http, $rootScope) {

    var myItems = new BaseComponent("MyItems", MYITEMSDEFAULTS);


    var initContextualMenu = function() {

        // TODO: sanity checks on Config.modules.* ? Are they active? Think so??
        var cMenuTypes = [
            Config.modules.TextFragmentHandler.cMenuType,
            Config.modules.PageItemsContainer.cMenuType,
            Config.modules.TextFragmentAnnotator.cMenuType
        ];

        ContextualMenu.addDivider({
            priority: 99,
            type: cMenuTypes
        });

        ContextualMenu.addAction({
            name: 'addToMyItems',
            type: cMenuTypes,
            label: "Add to My Items",
            priority: 100,
            showIf: function(item) {
                return MyPundit.isUserLogged() &&
                    !ItemsExchange.isItemInContainer(item, myItems.options.container);
            },
            action: function(item) {
                myItems.addSingleMyItem(item);
                return true;
            }
        });

        ContextualMenu.addAction({
            name: 'removeFromMyItems',
            type: cMenuTypes,
            label: "Remove from My Items",
            priority: 100,
            showIf: function(item) {
                return MyPundit.isUserLogged() &&
                    ItemsExchange.isItemInContainer(item, myItems.options.container);
            },
            action: function(item) {
                myItems.deleteSingleMyItem(item);
                return true;
            }
        });

    }; // initContextualMenu()

    // When all modules have been initialized, services are up, Config are setup etc..
    $rootScope.$on('pundit-boot-done', function() {
        initContextualMenu();
    });

    // The very first time that we get my items from pundit server we might obtain pundit1 items:
    // - value is pundit2 uri property
    // - type property is not necessary (in pundit2 we use this property name with other semantic)
    // - rdfData is not necessary
    // - favorite is not necessary
    //
    // in pundit2 item:
    // - uri property replace value property
    // - type property replace rdftype property
    //
    // itemsExchange store all application items
    // "new Item()" adds the item to itemsExchange "default" container
    // then we add it to "myItems" container too

    myItems.getMyItems = function(){
        var item;

        $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            url: NameSpace.get('asPref', { key: myItems.options.apiPreferencesKey }),
            withCredentials: true         
        }).success(function(data) {
            var num = 0;

            if (typeof(data.redirectTo) !== 'undefined') {
                myItems.log('Get all my items on server produce a redirect response to: ', data);
                return;
            }

            // for each item
            for (var i in data.value) {
                num++;

                // TODO is pundit1 object? (need to add a dedicated flag?)
                if (data.value[i].rdftype) {
                    // delete property
                    delete data.value[i].type;
                    delete data.value[i].rdfData;
                    delete data.value[i].favorite;
                    // rename "rdftype" property in "type"
                    data.value[i].type = data.value[i].rdftype;
                    delete data.value[i].rdftype;
                    // rename "value" property in "uri"
                    data.value[i].uri = data.value[i].value;
                    delete data.value[i].value;
                }

                // create new item (now is a pundit2 item) (implicit add to default container)
                item = new Item(data.value[i].uri, data.value[i]);               
                
                // add to myItems container
                ItemsExchange.addItemToContainer(item, myItems.options.container);
            }

            myItems.log('Retrieved my items from the server: '+num+' items');

        }).error(function(msg) {
            myItems.log('Http error while retrieving my items from the server: ', msg);
        });
    };

    myItems.deleteAllMyItems = function(){
        var currentTime = new Date();

        // remove all my item on pundit server
        // setting it to []
        $http({
            headers: {"Content-Type":"application/json;charset=UTF-8;"},
            method: 'POST',
            url: NameSpace.get('asPref', { key: myItems.options.apiPreferencesKey }),
            withCredentials: true,
            data: angular.toJson({value: [], created: currentTime.getTime()})     
        }).success(function(data) {

            if (typeof(data.redirectTo) !== 'undefined') {
                myItems.log('Deleted all my items on server produce a redirect response to: ', data);
                return;
            }
            // remove all my items on application
            // controller watch now update the view
            ItemsExchange.wipeContainer(myItems.options.container);
            
            myItems.log('Deleted all my items on server', data);
        }).error(function(msg) {
            myItems.err('Cant delete my items on server: ', msg);
        });
    };

    myItems.deleteSingleMyItem = function(value){

        var currentTime = new Date();

        // get all my items (inside app)
        var items = ItemsExchange.getItemsByContainer(myItems.options.container);
        var index = items.indexOf(value);
        var copiedItems = angular.copy(items);
        // remove item from the copied array
        copiedItems.splice(index, 1);       

        // update to server the new my items 
        // the new my items format is different from pundit1 item format
        // this break pundit1 compatibility
        $http({
            headers: {"Content-Type":"application/json;charset=UTF-8;"},
            method: 'POST',
            url: NameSpace.get('asPref', { key: myItems.options.apiPreferencesKey }),
            withCredentials: true,
            data: angular.toJson({value: copiedItems, created: currentTime.getTime()})     
        }).success(function(data) {

            if (typeof(data.redirectTo) !== 'undefined') {
                myItems.log('Deleted single my item on server produce a redirect response to: ', data);
                return;
            }

            // remove value from my items
            // controller watch now update the view
            ItemsExchange.removeItemFromContainer(value, myItems.options.container);

            myItems.log('Deleted from my item: '+ value.label);

        }).error(function(msg) {
            myItems.err('Cant delete a my item on the server: ', msg);
        });
    };

    // add one item to my items on pundit server
    myItems.addSingleMyItem = function(value){

        var currentTime = new Date();
       
        // get all my items and make a copy
        var items = angular.copy(ItemsExchange.getItemsByContainer(myItems.options.container));
        // add new item to the copied array
        items.push(value);

        // update to server the new my items
        // the new my items format is different from pundit1 item format
        // this break punti1 compatibility
        $http({
            headers: {"Content-Type":"application/json;charset=UTF-8;"},
            method: 'POST',
            url: NameSpace.get('asPref', { key: myItems.options.apiPreferencesKey }),
            withCredentials: true,
            data: angular.toJson({value: items, created: currentTime.getTime()})     
        }).success(function(data) {

            if (typeof(data.redirectTo) !== 'undefined') {
                myItems.log('Add single item to my items on server produce a redirect response to: ', data);
                return;
            }

            // add value to my items
            // controller watch now update the view
            ItemsExchange.addItemToContainer(value, myItems.options.container);

            myItems.log('Added item to my items: '+ value.label);

        }).error(function(msg) {
            myItems.err('Cant add item to my items on the server: ', msg);
        });

    };

    myItems.getMyItemsContainer = function(){
        return myItems.options.container;
    };

    return myItems;

});