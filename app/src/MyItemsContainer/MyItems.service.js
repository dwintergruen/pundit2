angular.module("Pundit2.MyItemsContainer")
.constant('MYITEMSDEFAULTS', {

    // where find my items on pundit server
    api: 'favorites',
    // where store my items inside itemsExchange
    container: 'myItems',

    debug: true
})
.service("MyItems", function(BaseComponent, NameSpace, $http, MYITEMSDEFAULTS) {

    var myItems = new BaseComponent("MyItems");

    // my items local storage
    var myItemsArray = [];

    // TODO how i can create item by new ItemFactory() without a uri?
    // inside http call the item uri is not present
    // ItemFactory add item to itemsExchange without a container
    myItems.getMyItems = function(){
        $http({
            headers: { 'Accept': 'application/json' },
            method: 'GET',
            url: NameSpace.get('asPref', {type: myItems.options.api})            
        }).success(function(data) {
            for (var i in data.value) {
                myItemsArray.push(data.value[i]);
                // TODO need to clean object ? need a copy?
                ItemsExchange.addItem(data.value[i], myItems.options.container);
            }
        }).error(function() {
            console.log('http error, cant find my items');
        });
    };



    return myItems;

});