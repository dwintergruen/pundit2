angular.module('Pundit2.Core')
.factory('Item', function(BaseComponent, NameSpace, Utils, ItemsExchange) {
    var itemComponent = new BaseComponent("Item");

    var ItemFactory = function(uri, values) {
        // To create a new Item at least a URI is needed
        if (typeof(uri) === "undefined") {
            itemComponent.err("Can't create an item without an URI");
            return;
        }
        this.uri = uri;
        this.type = [];
        this.label = '';

        if (angular.isObject(values)) {
            itemComponent.log('Extending new Item with values ', values);
            Utils.deepExtend(this, values);
            console.log('#### Ed infatti, dopo: ', this);
        }

        // Add it to the exchange, ready to be .. whatever will be.
        ItemsExchange.addItem(this);
    };

    ItemFactory.prototype.isProperty = function() {
        return this.type.indexOf(NameSpace.rdf.property) !== -1;
    };

    ItemFactory.prototype.fromAnnotationRdf = function(annotationRDF) {

        var ns = NameSpace.item,
            itemRDF = annotationRDF[this.uri];

        // Cant find any rdf for this item?? Where is it?!1?
        if (typeof(itemRDF) === "undefined") {
            console.log('Error? No RDF for this item? ', this.uri);
            return;
        }

        // Treat properties as single values inside an array, read them
        // one by one by using the correct URI taken from the NameSpace,
        // doing some sanity checks
        for (var property in ns) {
            var propertyURI = ns[property];

            if (propertyURI in itemRDF) {
                this[property] = itemRDF[propertyURI][0].value;
            }
        }

        // Extract types as an array of URI, someone else will
        // take care of adding them to TypesHelper
        var types = itemRDF[NameSpace.rdf.type];
        if (angular.isArray(types) && types.length > 0) {
            this.type = [];
            for (var t in types) {
                this.type.push(types[t].value);
            }
        }

        // Special item type: image fragment
        if (this.type.indexOf(NameSpace.fragments.image) !== -1) {

            this.selector = [];

            // If there's a selector property in this item's RDF, cycle over
            // all of them, check if they're in the annotation RDF and extract
            // their value and append it to the item
            if (NameSpace.item.selector in itemRDF) {
                var selectorList = itemRDF[NameSpace.item.selector];
                for (var s in selectorList) {
                    var selectorUri = selectorList[s].value;

                    // Look for the RDF for this selector uri
                    if (selectorUri in annotationRDF) {
                        var selector = annotationRDF[selectorUri];

                        // Polygon type selector: parse the json and push the object
                        // to this item .selector
                        if (selector[NameSpace.rdf.type][0].value === NameSpace.selectors.polygonType) {
                            this.selector.push(JSON.parse(selector[NameSpace.rdf.value][0].value));
                        }
                    }
                }
            }

            if (typeof(this.selector) !== "undefined" && this.selector in annotationRDF) {
                this.selector = annotationRDF[this.selector][NameSpace.rdf.value][0].value;
            }
        } // if type: fragments.image

        // TODO: more special cases, named content, webpage, video fragment, other selectors?

        itemComponent.log("Created new item: "+ this.label);
    };

    ItemFactory.prototype.toRdf = function() {
        // TODO
    };


    ItemFactory.prototype.toJsonLD = function() {
        // TODO .. why not? needed? :)
    };



    itemComponent.log('Component up and running');

    return ItemFactory;
});