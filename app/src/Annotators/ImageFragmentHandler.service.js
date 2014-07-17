angular.module('Pundit2.Annotators')
.constant('IMAGEHANDLERDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ImageFragmentHandler.ignoreClasses
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
     * @name modules#ImageFragmentHandler.container
     *
     * @description
     * `string`
     *
     * Name of the container used to store the text fragment in the itemsExchange
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
     * @name modules#ImageFragmentHandler.cMenuType
     *
     * @description
     * `string`
     *
     * Contextual menu type shown by the text fragment handler
     *
     * Default value:
     * <pre> cMenuType: 'ImageHandlerItem' </pre>
     */
    cMenuType: "imageFragmentHandlerItem",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#ImageFragmentHandler.labelMaxLength
     *
     * @description
     * `number`
     *
     * Maximum characters number of selected text used to create the label for annotation.
     *
     * Default value:
     * <pre> labelMaxLength: 40 </pre>
     */
    labelMaxLength: 40

})
.service('ImageFragmentHandler', function(IMAGEHANDLERDEFAULTS, NameSpace, BaseComponent, Config, 
    TextFragmentHandler, XpointersHelper, Item ) {

    var ifh = new BaseComponent('ImageFragmentHandler', IMAGEHANDLERDEFAULTS);

    var getXpFromNode = function(node) {
        var range = document.createRange();
        range.selectNode(node);
        return TextFragmentHandler.range2xpointer(range); 
    };

    ifh.createItemFromImage = function(img) {
        var values = {};

        values.uri = getXpFromNode(img);
        values.type = [NameSpace.types.image];
        values.description = img.src;
        values.image = img.src;

        values.label = values.description;
        if (values.label.length > ifh.options.labelMaxLength) {
            values.label = values.label.substr(0, ifh.options.labelMaxLength) + ' ..';
        }

        values.pageContext = XpointersHelper.getSafePageContext();
        values.isPartOf = values.uri.split('#')[0];

        return new Item(values.uri, values);
    };

    return ifh;

});