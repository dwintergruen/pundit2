angular.module('Pundit2.Core')
.factory('Item', function(BaseComponent, NameSpace) {
    var itemComponent = new BaseComponent("ItemFactory", {debug: true});

    function ItemFactory() {

    };

    ItemFactory.prototype.fromRdf = function(itemRDF) {

        var ns = NameSpace.item;

        // Those properties are a single value inside an array, read them
        // one by one by using the correct URI taken from the NameSpace,
        // doing some sanity checks
        for (var property in ns) {
            var propertyURI = ns[property];

            if (propertyURI in itemRDF) {
                this[property] = itemRDF[propertyURI][0].value;
            }
        }
        itemComponent.log('', itemRDF);

    };

    ItemFactory.prototype.toRdf = function(rdf) {
        // TODO
    };


    ItemFactory.prototype.toJsonLD = function(rdf) {
        // TODO .. why not? needed? :)
    };



    itemComponent.log('Component up and running');

    return ItemFactory;
});