angular.module('Pundit2.Core')
.constant('ITEMDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Item
     *
     * @description
     * `object`
     *
     * Configuration object for Item module. This factory is used to instantiate new item.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Item.iconDefault
     *
     * @description
     * `string`
     *
     * Icon used for item by default.
     *
     * Default value:
     * <pre> iconDefault: 'pnd-icon pnd-icon-eye' </pre>
     */
    iconDefault: 'pnd-icon pnd-icon-eye',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Item.iconImage
     *
     * @description
     * `string`
     *
     * Icon used for image item.
     *
     * Default value:
     * <pre> iconImage: 'pnd-icon pnd-icon-camera' </pre>
     */
    iconImage: 'pnd-icon pnd-icon-camera',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Item.iconText
     *
     * @description
     * `string`
     *
     * Icon used for text item.
     *
     * Default value:
     * <pre> iconText: 'pnd-icon pnd-icon-align-center' </pre>
     */
    iconText: 'pnd-icon pnd-icon-align-center',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Item.iconWebPage
     *
     * @description
     * `string`
     *
     * Icon used for web page item.
     *
     * Default value:
     * <pre> iconWebPage: 'pnd-icon-file-text' </pre>
     */
    iconWebPage: 'pnd-icon pnd-icon-file-text',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Item.iconEntity
     *
     * @description
     * `string`
     *
     * Icon used for entity item.
     *
     * Default value:
     * <pre> iconEntity: 'pnd-icon pnd-icon-code-fork' </pre>
     */
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
        if (this.type.indexOf(NameSpace.fragments.imagePart) !== -1) {
            // this.selector = [];

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
                        this.polygonUri = selectorUri;

                        // Polygon type selector: parse the json and push the object
                        // to this item .selector
                        if (selector[NameSpace.rdf.type][0].value === NameSpace.selectors.polygonType) {
                            var selectorValue = JSON.parse(selector[NameSpace.rdf.value][0].value);
                            this.polygon = selectorValue.points
                            // this.selector.push(JSON.parse(selector[NameSpace.rdf.value][0].value));
                        }
                    }
                }
            }

            // if (typeof(this.selector) !== "undefined" && this.selector in annotationRDF) {
            //     this.selector = annotationRDF[this.selector][NameSpace.rdf.value][0].value;
            // }
        } // if type: fragments.image

        // TODO: more special cases, named content, webpage, video fragment, other selectors?

        itemComponent.log("Created new item from annotation RDF: "+ this.label);
    };

    ItemFactory.prototype.toRdf = function() {
        // All item properties are encoded by their uri

        var i = { };
        // properties always present
        i[NameSpace.item.label] = [{ type:'literal', value: this.label}];
        i[NameSpace.item.type] = [];

        this.type.forEach(function(typeUri){
            i[NameSpace.item.type].push({ type:'uri', value: typeUri});
        });

        if (typeof(this.altLabel) !== 'undefined'){
            i[NameSpace.item.altLabel] = [{ type:'literal', value: this.altLabel}];
        }

        if (typeof(this.description) !== 'undefined'){
            i[NameSpace.item.description] = [{ type:'literal', value: this.description}];
        }

        if (typeof(this.image) !== 'undefined'){
            i[NameSpace.item.image] = [{type:'uri', value: this.image}];
        }

        if (typeof(this.pageContext) !== 'undefined'){
            i[NameSpace.item.pageContext] = [{ type:'uri', value: this.pageContext}];
        }

        if (typeof(this.isPartOf) !== 'undefined'){
            i[NameSpace.item.isPartOf] = [{ type:'uri', value: this.isPartOf}];
        }

        if (typeof(this.parentItemXP) !== 'undefined'){
            i[NameSpace.item.parentItemXP] = [{ type:'uri', value: this.parentItemXP}];
        }

        if (typeof(this.polygonUri) !== 'undefined'){
            i[NameSpace.item.selector] = [{ type:'uri', value: this.polygonUri}];
        }

        // TODO make a polygon selector uri and save

        return i;
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