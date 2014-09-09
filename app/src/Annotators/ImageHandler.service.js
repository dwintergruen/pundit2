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
    TextFragmentHandler, XpointersHelper, Item, $compile, $timeout, $rootScope) {

    var ih = new BaseComponent('ImageHandler', IMAGEHANDLERDEFAULTS);

    // This function must be executed before than pundit is appended to DOM
    var timeoutPromise = null, exist = false, el = null, dir = null;
    angular.element('img').hover(function(evt){
        ih.clearTimeout();
        if (el !== null && evt.target.src !== el[0].src) {
            clear();
        }
        if (!exist) {
            // store a target (img) reference
            el = angular.element(evt.target)
                .addClass('pnd-pointed-img')
                .after('<img-menu ref="pnd-pointed-img"></img-menu>');
            // store a directive reference
            dir = $compile(angular.element('img-menu'))($rootScope);
            exist = true;
        }
    }, function(){
        // remove directive after 250ms
        ih.removeDirective();
    });

    var clear = function() {
        // remove css class from img
        el.removeClass('pnd-pointed-img');
        // remove directive
        dir.remove();
        // update state var
        exist = false;
        el = null;
    };

    var getXpFromNode = function(node) {
        var range = document.createRange();
        range.selectNode(node);
        return TextFragmentHandler.range2xpointer(range);
    };

    ih.clearTimeout = function() {
        if(timeoutPromise !== null) {
            $timeout.cancel(timeoutPromise);
            timeoutPromise = null;
        }
    };

    ih.removeDirective = function() {
        timeoutPromise =  $timeout(function(){
            clear();
        }, 100);
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