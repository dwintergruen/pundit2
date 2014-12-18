angular.module('Pundit2.Annotators')

.constant('PAGEANNOTATORDEFAULTS', {
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageAnnotator
     *
     * @description
     * `object`
     *
     * Configuration for Page Annotator module
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PageAnnotator.debug
     *
     * @description
     * `boolean`
     *
     * Active debug log
     *
     * Default value:
     * <pre> debug: false </pre>
     */
    debug: false

})

.service('PageAnnotator', function(PAGEANNOTATORDEFAULTS, NameSpace, BaseComponent, XpointersHelper, Consolidation) {
    // ContextualMenu, XpointersHelper, Item, ItemsExchange, Toolbar, TripleComposer,
    // $document

    var pageAnnotator = new BaseComponent('PageAnnotator', PAGEANNOTATORDEFAULTS);

    // Create the component and declare what we deal with: text
    pageAnnotator.label = "page";
    pageAnnotator.type = NameSpace.types[pageAnnotator.label];

    Consolidation.addAnnotator(pageAnnotator);

    pageAnnotator.isConsolidable = function(item) {

        if (!angular.isArray(item.type)) {
            pageAnnotator.log("Item not valid: malformed type" + item.uri);
            return false;
        } else if (item.type.length === 0) {
            pageAnnotator.log("Item not valid: types len 0" + item.uri);
            return false;
        } else if (item.type.indexOf(pageAnnotator.type) === -1) {
            pageAnnotator.log("Item not valid: not have type page " + item.uri);
            return false;
        } else if (item.uri !== XpointersHelper.getSafePageContext()) {
            pageAnnotator.log("Item not valid: not consolidable on this page");
            return false;
        }

        pageAnnotator.log("Item valid: " + item.label);
        return true;
    };

    pageAnnotator.consolidate = function( /*items*/ ) {
        pageAnnotator.log('Consolidating!');

        // TODO Add something to the page?
    };

    pageAnnotator.wipe = function() {
        // TODO
    };


    pageAnnotator.log('Component up and running');
    return pageAnnotator;
});