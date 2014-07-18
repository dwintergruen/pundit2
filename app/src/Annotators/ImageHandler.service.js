angular.module('Pundit2.Annotators')
.constant('IMAGEHANDLERDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ImageHandler.ignoreClasses
     *
     * @description
     * `array of string`
     *
     * List of classes added to content to ignore it and not annotate it.
     * Any content classed with any of these class will get ignored by the handler.
     * If selection to annotate start, ends or contains one of those classes, nothing will happen
     *
     * Default value:
     * <pre> ignoreClasses: ['pnd-ignore'] </pre>
     */

    ignoreClasses: ['pnd-ignore'],

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ImageHandler.container
     *
     * @description
     * `string`
     *
     * Name of the container used to store the image in the itemsExchange
     *
     * Default value:
     * <pre> container: 'createdTextFragments' </pre>
     */
    container: "createdImage",

    // Contextual menu type triggered by the text fragment handler. An Item will
    // be passed as resource

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ImageHandler.cMenuType
     *
     * @description
     * `string`
     *
     * Contextual menu type shown over image
     *
     * Default value:
     * <pre> cMenuType: 'ImageHandlerItem' </pre>
     */
    cMenuType: "imageHandlerItem",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ImageHandler.labelMaxLength
     *
     * @description
     * `number`
     *
     * Maximum characters number of image src used to create the label for annotation.
     *
     * Default value:
     * <pre> labelMaxLength: 40 </pre>
     */
    labelMaxLength: 40

})
.service('ImageHandler', function(IMAGEHANDLERDEFAULTS, NameSpace, BaseComponent, Config, 
    TextFragmentHandler, XpointersHelper, Item ) {

    var ih = new BaseComponent('ImageHandler', IMAGEHANDLERDEFAULTS);

    var getXpFromNode = function(node) {
        var range = document.createRange();
        range.selectNode(node);
        return TextFragmentHandler.range2xpointer(range); 
    };

    ih.createItemFromImage = function(img) {
        var values = {};

        values.uri = getXpFromNode(img);
        values.type = [NameSpace.types.image];
        values.description = img.src;
        values.image = img.src;

        values.label = values.description;
        if (values.label.length > ih.options.labelMaxLength) {
            values.label = values.label.substr(0, ih.options.labelMaxLength) + ' ..';
        }

        values.pageContext = XpointersHelper.getSafePageContext();
        values.isPartOf = values.uri.split('#')[0];

        return new Item(values.uri, values);
    };

    return ih;

});