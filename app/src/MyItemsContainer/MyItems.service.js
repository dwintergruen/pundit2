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

    // the item uri inside http request is named value
    // ItemFactory add item to itemsExchange default container
    // after add item to default duplicate it in myItems container
    myItems.getMyItems = function(){
        var item;

        console.log(NameSpace.get('asPref', {type: myItems.options.api}));

        $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            url: NameSpace.get('asPref', {type: myItems.options.api}),
            withCredentials: true         
        }).success(function(data) {

            for (var i in data.value) {
                // clean server object
                delete data.value[i].type;
                delete data.value[i].rdfData;
                delete data.value[i].favorite;
                // rename rdftype property in type
                data.value[i].type = data.value[i].rdftype;
                delete data.value[i].rdftype;
                // create new item
                item = new Item(data.value[i].value, data.value[i]);
                // add to myItems container
                ItemsExchange.addItemToContainer(item, myItems.options.container);
            }

            myItems.log('http success, find my items on server', data);

        }).error(function() {
            myItems.log('http error, cant find my items on server');
        });
    };

    // delete all my items from server (TODO and from items exchange)
    myItems.deleteAllMyItems = function(){
        var currentTime = new Date();

        $http({
            headers: {"Content-Type":"application/json;charset=UTF-8;"},
            //handleAs: "text",
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
    myItems.deleteSingleMyItems = function(value){

        // remove only when items ctx menu is fixed
        return;

        var currentTime = new Date();

        // get all my items
        var items = ItemsExchange.getItemsByContainer(myItems.options.container);

        // remove value from my items
        // TODO need to find by uri ?
        var index = items.indexOf(value);
        items.splice(index, 1);

        

        // if call http break all items on sever

        // update to server the new my items
        $http({
            headers: {"Content-Type":"application/json;charset=UTF-8;"},
            method: 'POST',
            url: NameSpace.get('asPref', {type: myItems.options.api}),
            withCredentials: true,
            data: angular.toJson({value: items, created: currentTime.getTime()})     
        }).success(function(data) {

            myItems.log('http success, delte single my items on server', data);

            // width splice the items array update correctly and item is removed from itemesExchange

        }).error(function() {
            myItems.log('http error, cant delte single my items on server');
        });
    };

    myItems.getMyItemsContainer = function(){
        return myItems.options.container;
    };

    return myItems;

});