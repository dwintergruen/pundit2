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
.service('ImageFragmentHandler', function(IMAGEHANDLERDEFAULTS, NameSpace, BaseComponent, Config, TextFragmentHandler,
                                         ContextualMenu, XpointersHelper, Item, ItemsExchange, Toolbar, TripleComposer,
                                         $document, $rootScope) {

    var ifh = new BaseComponent('ImageFragmentHandler', IMAGEHANDLERDEFAULTS);

    $document.on('click', function(clickEvt) {
        var target = clickEvt.target;
        if (TextFragmentHandler.isToBeIgnored(target)) {
            ifh.log('ABORT: ignoring mouse DOWN event on document: ignore class spotted.');
            return;
        }

        // check if click on image
        if (typeof(target.src) !== 'undefined') {
            // TODO: this will create a new item in our container at each valid user selection.
            // how to wipe them up? If the user keeps selecting stuff we end up with LOADS and
            // LOADS of unused items.
            // Problem: the item might be used by the triple composer, or added to my items or
            // discarded at all.
            // Possible solution: wipe the container when triple composer is empty, ctx menu is
            // NOT shown on every dashboard open/close ?
            var item = ifh.createItemFromImage(target);
            ItemsExchange.addItemToContainer(item, ifh.options.container);

            ifh.log('Valid selection ended on document. Text fragment Item produced: '+ item.label);

            if (Toolbar.isActiveTemplateMode()) {
                //tfh.log('Item used as subject inside triple composer (template mode active).');
                //TripleComposer.addToAllSubject(item);
                //$rootScope.$emit('pnd-save-annotation');
                return;
            }

            ContextualMenu.show(clickEvt.pageX, clickEvt.pageY, item, ifh.options.cMenuType);
        }
    });

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