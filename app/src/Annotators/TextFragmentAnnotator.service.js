angular.module('Pundit2.Annotators')

.constant('TEXTFRAGMENTANNOTATORDEFAULTS', {
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TextFragmentAnnotator
     *
     * @description
     * `object`
     *
     * Configuration object for Text Fragment Annotator module.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TextFragmentAnnotator.cMenuType
     *
     * @description
     * `string`
     *
     * Type of the contextual menu to trigger on text fragments icons clicks.
     *
     * Default value:
     * <pre> cMenuType: 'annotatedTextFragment' </pre>
     */
    cMenuType: 'annotatedTextFragment',

    // Class to get the consolidated icon: normal consolidated fragment
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TextFragmentAnnotator.annotationIconClass
     *
     * @description
     * `string`
     *
     * Icon shown for annotation
     *
     * Default value:
     * <pre> annotationIconClass: 'pnd-icon-tag' </pre>
     */
    annotationIconClass: "pnd-icon-tag",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TextFragmentAnnotator.myItemsIconClass
     *
     * @description
     * `string`
     *
     * Icon shown for my items
     *
     * Default value:
     * <pre> myItemsIconClass: 'pnd-icon-bookmark' </pre>
     */
    myItemsIconClass: "pnd-icon-bookmark",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#TextFragmentAnnotator.suggestionIconClass
     *
     * @description
     * `string`
     *
     * Icon shown for annotation suggestion
     *
     * Default value:
     * <pre> suggestionIconClass: 'pnd-icon-pencil' </pre>
     */
    suggestionIconClass: "pnd-icon-pencil"

})

.service('TextFragmentAnnotator',
    function(TEXTFRAGMENTANNOTATORDEFAULTS, NameSpace, BaseComponent, Consolidation,
             XpointersHelper, ItemsExchange, Config, TripleComposer, Toolbar,
             $compile, $rootScope, $location) {

    // Create the component and declare what we deal with: text
    var tfa = new BaseComponent('TextFragmentAnnotator', TEXTFRAGMENTANNOTATORDEFAULTS);
    tfa.label = "text";
    tfa.type = NameSpace.fragments[tfa.label];

    // The orchestrator will be called by the consolidation service as single point of
    // interaction when it comes to deal with fragments. Let's subscribe the text type.
    Consolidation.addAnnotator(tfa);

    tfa.isConsolidable = function(item) {
        if (!angular.isArray(item.type)) {
            tfa.log("Item not valid: malformed");
            return false;
        } else if (item.type.length === 0) {
            tfa.log("Item not valid: types len 0");
            return false;
        } else if (item.type.indexOf(tfa.type) === -1) {
            tfa.log("Item not valid: not a "+ tfa.type);
            return false;
        } else if (!XpointersHelper.isValidXpointerURI(item.uri)) {
            tfa.log("Item not valid: not a valid xpointer uri: "+ item.uri);
            return false;
        } else if (!XpointersHelper.isValidXpointer(item.uri)) {
            tfa.log("Item not valid: not consolidable on this page: "+ item.uri);
            return false;
        }

        // TODO: it's a valid text fragment if:
        // - has a part of
        // - has a page context

        tfa.log("Item valid: try to consolidate "+ item.label);
        return true;
    };

    // Each fragment will be split into bits, each bit will carry a relation
    // to the parent fragment through this id
    var fragmentIds = {},
        // For the given id it will contain an object with:
        // .uri : uri of the original item
        // .bits: array of scopes of the bit directives for this fragment
        // .icon: scope of the icon directive for this fragment
        // .item: Item belonging to this id
        fragmentById = {};

    // All of the items passed should be consolidable (checked by isConsolidable), in the
    // consolidation service, gathering all annotators
    // TODO: better check twice? :|
    tfa.consolidate = function(items) {
        
        tfa.log('Consolidating!');

        var xpointers = [],
            i = 0;

        // TODO: better wipe up? other stuff to reset?
        // Reset them, each consolidate has its own unique list
        fragmentIds = {};
        fragmentById = {};

        for (var uri in items) {
            xpointers.push(uri);
            fragmentIds[uri] = ["fr-"+i];
            fragmentById["fr-"+i] = {
                uri: uri,
                bits: [],
                item: items[uri]
            };
            i++;
        }

        var xpaths = XpointersHelper.getXPathsFromXPointers(xpointers),
            sorted = XpointersHelper.splitAndSortXPaths(xpaths),
            // After splitting and sorting each bit has a list of fragment ids it belongs to.
            // Instead of using classes, these ids will be saved in a node attribute.
            xpathsFragmentIds = XpointersHelper.getClassesForXpaths(xpointers, sorted, xpaths, fragmentIds);

        XpointersHelper.updateDOM(sorted, XpointersHelper.options.wrapNodeClass, xpathsFragmentIds);

        // TODO: better name? Elsewhere?
        activateFragments();

        tfa.log(tfa.label +' consolidation: done!');
    };

    // For each fragment ID it will place an icon after the last BIT belonging
    // to the given fragment
    var placeIcons = function() {
        var n = 0;
            // To see what kind of fragment item is it, check which container it belongs to
            amContainer = Config.modules.Annomatic.container;

        for (var c in fragmentIds) {
            var id = fragmentIds[c],
                lastBit = angular.element('.'+ id).last(),
                // TODO: put this name in .options ?
                directive = "text-fragment-icon";

            if (ItemsExchange.isItemInContainer(fragmentById[id].item, amContainer)) {
                // TODO: put this name in .options, in Annomatic ?
                directive = "suggestion-fragment-icon";
            }

            tfa.log('Placing fragment icon '+ n++, id, lastBit.attr('fragments'));
            lastBit.after('<'+ directive +' fragment="'+id+'"></'+ directive +'>');
        }
    };

    // TODO: Move this to XpointersHelper .something() ?
    var activateFragments = function() {

        // TODO: do we want this to be configurable? Or icons are here to stay?
        placeIcons();

        var consolidated = angular.element('.pnd-cons');
        $compile(consolidated)($rootScope);

        var icons = angular.element('text-fragment-icon, suggestion-fragment-icon');
        $compile(icons)($rootScope);

        $rootScope.$$phase || $rootScope.$digest();

    };

    // Wipes everything done by the annotator:
    // - removes the icons, if present
    // - unwraps the fragments
    tfa.wipe = function() {

        fragmentIds = {};
        fragmentById = {};

        // Remove icons
        angular.element('.' + XpointersHelper.options.textFragmentIconClass).remove();

        // Replace wrapped nodes with their content
        var bits = angular.element('.'+ XpointersHelper.options.wrapNodeClass);
        angular.forEach(bits, function(node) {
            var parent = node.parentNode;
            while (node.firstChild)
                parent.insertBefore(node.firstChild, node);
            angular.element(node).remove();
        });

        // Finally merge splitted text nodes
        XpointersHelper.mergeTextNodes(angular.element('body')[0]);
    };


    // Called by TextFragmentIcon directives: they will be placed after each consolidated
    // fragment.
    tfa.addFragmentIcon = function(icon) {
        fragmentById[icon.fragment].icon = icon;
        icon.item = fragmentById[icon.fragment].item;

        tfa.log('Adding fragment icon for fragment id='+ icon.fragment);
    };

    // Called by TextFragmentBit directives: they will wrap every bit of annotated content
    // for every xpointer we save an array of those bits. Each bit can belong to more
    // than one xpointer (overlaps!)
    tfa.addFragmentBit = function(bit) {
        var fragments = bit.fragments;

        // Fragment ids are split by a comma, gather them back in a array. Otherwise
        // they are a string
        if (fragments.match(/,/)) {
            fragments = fragments.split(',');
        } else {
            fragments = [fragments];
        }

        for (var l=fragments.length; l--;) {
            var current = fragmentById[fragments[l]];
            current.bits.push(bit);
        }
        tfa.log('Adding consolidated fragment bit', fragments);
    };

    tfa.getFragmentIdByUri = function(uri) {
        if (typeof(fragmentIds[uri]) !== "undefined") {
            return fragmentIds[uri];
        }
    };

    tfa.getFragmentIconScopeById = function(id) {
        if (typeof(fragmentById[id]) !== "undefined") {
            return fragmentById[id].icon;
        }
    };

    tfa.getBitsById = function(id) {
        if (typeof(fragmentById[id]) !== "undefined") {
            return fragmentById[id].bits;
        }
    };

    tfa.highlightByUri = function(uri) {
        if (typeof(fragmentIds[uri]) === "undefined") {
            tfa.log('Not highlighting given URI: fragment id not found');
            return;
        }
        tfa.highlightById(fragmentIds[uri][0]);
    };

    tfa.highlightById = function(id) {
        for (var l=fragmentById[id].bits.length; l--;) {
            fragmentById[id].bits[l].high();
        }
        tfa.log('Highlighting fragment id='+ id +', # bits: '+ fragmentById[id].bits.length);
    };


    tfa.clearHighlightByUri  = function(uri) {
        if (typeof(fragmentIds[uri]) === "undefined") {
            tfa.log('Not clearing highlight on given URI: fragment id not found');
            return;
        }
        tfa.clearHighlightById(fragmentIds[uri]);
    };

    tfa.clearHighlightById  = function(id) {
        for (var l=fragmentById[id].bits.length; l--;) {
            fragmentById[id].bits[l].clear();
        }
        tfa.log('Clear highlight on fragment id='+ id +', # bits: '+ fragmentById[id].bits.length);
    };

    // Hides and shows a single fragment (identified by its item's URI)
    tfa.showByUri = function(uri) {
        if (typeof(fragmentIds[uri]) === "undefined") {
            tfa.log('Not showing fragment for given URI: fragment id not found');
            return;
        }
        var id = fragmentIds[uri];
        for (var l=fragmentById[id].bits.length; l--;) {
            fragmentById[id].bits[l].show();
        }
    };

    tfa.hideByUri = function(uri) {
        if (typeof(fragmentIds[uri]) === "undefined") {
            tfa.log('Not hiding fragment for given URI: fragment id not found');
            return;
        }
        var id = fragmentIds[uri];
        for (var l=fragmentById[id].bits.length; l--;) {
            fragmentById[id].bits[l].hide();
        }
    };

    // Hides and shows every fragment
    tfa.hideAll = function() {
        for (var uri in fragmentIds) {
            tfa.hideByUri(uri);
        }
    };

    tfa.showAll = function() {
        for (var uri in fragmentIds) {
            tfa.showByUri(uri);
        }
    };

    // Ghost and remove ghost from a single fragment (identified by its item's URI)
    tfa.ghostByUri = function(uri) {
        if (typeof(fragmentIds[uri]) === "undefined") {
            tfa.log('Fragment id not found');
            return;
        }
        var id = fragmentIds[uri];
        for (var l=fragmentById[id].bits.length; l--;) {
            fragmentById[id].bits[l].ghost();
        }
    };

    tfa.ghostRemoveByUri = function(uri) {
        if (typeof(fragmentIds[uri]) === "undefined") {
            tfa.log('Fragment id not found');
            return;
        }
        var id = fragmentIds[uri];
        for (var l=fragmentById[id].bits.length; l--;) {
            fragmentById[id].bits[l].expo();
        }
    };

    // Hides and shows every fragment
    tfa.ghostAll = function() {
        for (var uri in fragmentIds) {
            tfa.ghostByUri(uri);
        }
    };

    tfa.ghostRemoveAll = function() {
        for (var uri in fragmentIds) {
            tfa.ghostRemoveByUri(uri);
        }
    };

    tfa.log("Component up and running");
    return tfa;
});