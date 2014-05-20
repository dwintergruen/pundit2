angular.module("Pundit2.MyItemsContainer")
.constant('MYITEMSDEFAULTS', {

    // where find my items on pundit server
    api: 'favorites',
    // where store my items inside itemsExchange
    container: 'myItems',

    debug: true
})
.service("MyItems", function(BaseComponent, NameSpace, $http, Item, ItemsExchange, MYITEMSDEFAULTS) {

    var myItems = new BaseComponent("MyItems", MYITEMSDEFAULTS);

    // the first time that we get my items from pundit server we obtain pundit1 items:
    // - value is pundit2 uri property
    // - type property is not necessary (in pundit2 we use this property name with other semantic)
    // - rdfData is not necessary
    // - favorite is not necessary
    //
    // in pundit2 item:
    // - uri property replace value property
    // - type property replace rdftype property
    //
    // itemsExchange store items
    // new Item() add item to itemsExchange default container
    // then we duplicate it in myItems container

    myItems.getMyItems = function(){
        var item;

        $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            url: NameSpace.get('asPref', {type: myItems.options.api}),
            withCredentials: true         
        }).success(function(data) {

            for (var i in data.value) {

                // TODO is pundit1 object? (need to add a dedicated flag?)
                if (data.value[i].rdftype) {
                    // delete property
                    delete data.value[i].type;
                    delete data.value[i].rdfData;
                    delete data.value[i].favorite;
                    // rename rdftype property in type
                    data.value[i].type = data.value[i].rdftype;
                    delete data.value[i].rdftype;
                    // rename value property in uri
                    data.value[i].uri = data.value[i].value;
                    delete data.value[i].value;
                }

                // create new item (pundit2 item)
                item = new Item(data.value[i].uri, data.value[i]);               
                
                // add to myItems container
                ItemsExchange.addItemToContainer(item, myItems.options.container);
            }

            myItems.log('http success, find my items on server', data, ItemsExchange.getItems());

        }).error(function() {
            myItems.log('http error, cant find my items on server');
        });
    };

    // delete all my items from server 
    // TODO need an API call inside items exchange to delete all my items
    myItems.deleteAllMyItems = function(){
        var currentTime = new Date();

        $http({
            headers: {"Content-Type":"application/json;charset=UTF-8;"},
            method: 'POST',
            url: NameSpace.get('asPref', {type: myItems.options.api}),
            withCredentials: true,
            data: angular.toJson({value: [], created: currentTime.getTime()})     
        }).success(function(data) {

            myItems.log('http success, delte all my items on server', data);
            // need to remove my items from items exchange? need removeItemsFromContainer()

        }).error(function() {
            myItems.log('http error, cant delte all my items on server');
        });
    };

    // delete one item from server (TODO and from items exchange)
    // value to be an array with new my items to post on server ?
    myItems.deleteSingleMyItem = function(value){

        var currentTime = new Date();

        // get all my items
        var items = ItemsExchange.getItemsByContainer(myItems.options.container);

        // remove value from my items
        // TODO need to remove by API call
        ItemsExchange.removeItemFromContainer(value, myItems.options.container);        

        // update to server the new my items
        // the new my items format is different from pundit1 item format
        // this break punti1 compatibility
        $http({
            headers: {"Content-Type":"application/json;charset=UTF-8;"},
            method: 'POST',
            url: NameSpace.get('asPref', {type: myItems.options.api}),
            withCredentials: true,
            data: angular.toJson({value: items, created: currentTime.getTime()})     
        }).success(function(data) {

            myItems.log('http success, delte single my items on server', data);

        }).error(function() {
            myItems.log('http error, cant delte single my items on server');
        });
    };

    // add one item to my items on pundit server
    myItems.addSingleMyItem = function(value){

        var currentTime = new Date();

        // add value to my items
        ItemsExchange.addItemToContainer(value, myItems.options.container);       
        // get all my items
        var items = ItemsExchange.getItemsByContainer(myItems.options.container);

        // update to server the new my items
        // the new my items format is different from pundit1 item format
        // this break punti1 compatibility
        $http({
            headers: {"Content-Type":"application/json;charset=UTF-8;"},
            method: 'POST',
            url: NameSpace.get('asPref', {type: myItems.options.api}),
            withCredentials: true,
            data: angular.toJson({value: items, created: currentTime.getTime()})     
        }).success(function(data) {

            myItems.log('http success, add item to my items on server', data);

        }).error(function() {
            myItems.log('http error, cant add item to my items on server');
        });

    };

    myItems.getMyItemsContainer = function(){
        return myItems.options.container;
    };

    return myItems;

});