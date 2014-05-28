angular.module('Pundit2.Core')
.constant('ITEMDEFAULTS', {
    iconDefault: 'pnd-icon pnd-icon-eye',
    iconImage: 'pnd-icon pnd-icon-camera',
    iconText: 'pnd-icon pnd-icon-align-center',
    iconWebPage: 'pnd-icon-file-text',
    iconEntity: 'pnd-icon pnd-icon-code-fork',

    classDefault: 'pnd-item-default',
    classImage: 'pnd-item-image',
    classText: 'pnd-item-text',
    classWebPage: 'pnd-item-web-page',
    classEntity: 'pnd-item-entity'
})
.factory('Item', function(BaseComponent, NameSpace, Utils, ItemsExchange, ITEMDEFAULTS) {
    var itemComponent = new BaseComponent("Item", ITEMDEFAULTS);

    var ItemFactory = function(uri, values) {
        // To create a new Item at least a URI is needed
        if (typeof(uri) === "undefined") {
            itemComponent.err("Can't create an item without an URI");
            return;
        }
        this.uri = uri;
        this.type = [];
        this.label = 'default item label';

        if (angular.isObject(values)) {
            itemComponent.log('Extending new Item with values '+this.uri, values);
            Utils.deepExtend(this, values);
        }

        // Add it to the exchange, ready to be .. whatever will be.
        ItemsExchange.addItem(this);
    };

    ItemFactory.prototype.isProperty = function() {
        return this.type.indexOf(NameSpace.rdf.property) !== -1;
    };

    ItemFactory.prototype.isTextFragment = function() {
        return this.type.indexOf(NameSpace.fragments.text) !== -1;
    };

    ItemFactory.prototype.isImage = function() {
        return this.type.indexOf(NameSpace.types.image) !== -1;
    };

    ItemFactory.prototype.isImageFragment = function() {
        return this.type.indexOf(NameSpace.fragments.imagePart) !== -1;
    };

    ItemFactory.prototype.isWebPage = function() {
        return this.type.indexOf(NameSpace.types.page) !== -1;
    };

    // It's an entity if it's not an image, a property, a text fragment or a webpage
    ItemFactory.prototype.isEntity = function() {
        return !this.isImage() &&
            !this.isProperty() &&
            !this.isTextFragment() &&
            !this.isImage() &&
            !this.isImageFragment() &&
            !this.isWebPage();
    };

    ItemFactory.prototype.fromAnnotationRdf = function(annotationRDF) {

        var ns = NameSpace.item,
            itemRDF = annotationRDF[this.uri];

        // Cant find any rdf for this item?? Where is it?!1?
        if (typeof(itemRDF) === "undefined") {
            itemComponent.log('Error? No RDF for this item? ', this.uri);
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

        itemComponent.log("Created new item from annotation RDF: "+ this.label);
    };

    ItemFactory.prototype.toRdf = function() {
        // TODO types?
        return {
            uri: this.uri,
            types: this.type
        };
    };


    ItemFactory.prototype.toJsonLD = function() {
        // TODO .. why not? needed? :)
    };

    ItemFactory.prototype.getIcon = function() {

        if (this.isImage() || this.isImageFragment()) {
            return itemComponent.options.iconImage;
        } else if (this.isTextFragment()) {
            return itemComponent.options.iconText;
        } else if (this.isWebPage()) {
            return itemComponent.options.iconWebPage;
        } else if (this.isEntity()) {
            return itemComponent.options.iconEntity;
        }

        return itemComponent.options.iconDefault;
    };

    ItemFactory.prototype.getClass = function() {

        if (this.isImage() || this.isImageFragment()) {
            return itemComponent.options.classImage;
        } else if (this.isTextFragment()) {
            return itemComponent.options.classText;
        } else if (this.isWebPage()) {
            return itemComponent.options.classWebPage;
        } else if (this.isEntity()) {
            return itemComponent.options.classEntity;
        }

        return itemComponent.options.classDefault;
    };



    itemComponent.log('Component up and running');

    return ItemFactory;
});