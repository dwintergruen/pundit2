angular.module('Pundit2.Core')
.factory('Item', function(BaseComponent, NameSpace) {
    var itemComponent = new BaseComponent("ItemFactory", {debug: true});

    function ItemFactory(value) {

        // Default values for the mandatory properties, in case
        // they dont get supplied elsewhere
        if (typeof(value) === "undefined") {
            itemComponent.err("Can't create an item without an URI");
            return;
        }
        this.uri = value;
        this.label = '';
    };

    ItemFactory.prototype.fromAnnotationRdf = function(annotationRDF) {

        var ns = NameSpace.item,
            itemRDF = annotationRDF[this.uri];

        // Treat properties as single values inside an array, read them
        // one by one by using the correct URI taken from the NameSpace,
        // doing some sanity checks
        for (var property in ns) {
            var propertyURI = ns[property];

            if (propertyURI in itemRDF) {
                this[property] = itemRDF[propertyURI][0].value;
            }
        }

        // Extract types
        var types = itemRDF[NameSpace.rdf.type];
        if (angular.isArray(types) && types.length > 0) {
            this.type = [];
            for (var t in types) {
                this.type.push(types[t].value);
                if (types[t].value in itemRDF) {
                    TypesHelper.add(types[t].value, 'somelabel');
                }
            }
        }

        // Special item type: image fragment
        if (this.type.indexOf(NameSpace.fragments.imageType) !== -1) {

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
        } // if type: fragments.imageType

        // TODO: more special cases, named content, webpage, video fragment, other selectors?

        itemComponent.log("Created new item: "+ this.label);
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