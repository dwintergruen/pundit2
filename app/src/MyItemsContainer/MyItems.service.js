angular.module("Pundit2.MyItemsContainer")
.constant('MYITEMSDEFAULTS', {

    // where find my items on pundit server
    api: 'favorites',
    // where store my items inside itemsExchange
    container: 'myItems',

    debug: true
})
.service("MyItems", function(BaseComponent, NameSpace, $http, MYITEMSDEFAULTS) {

    var myItems = new BaseComponent("MyItems", MYITEMSDEFAULTS);

    // the item uri inside http request is named value
    // ItemFactory add item to itemsExchange default container
    // after add item to default duplicate it in myItems container
    myItems.getMyItems = function(){
        var item;

        $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            url: NameSpace.get('asPref', {type: myItems.options.api})            
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
                item = new ItemFactory(data.value[i].value, data.value[i]);
                // add to myItems container
                ItemsExchange.addItemToContainer(item, myItems.options.container);
            }
        }).error(function() {
            console.log('http error, cant find my items');
        });
    };



    return myItems;

});