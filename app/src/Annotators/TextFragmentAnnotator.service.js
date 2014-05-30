angular.module('Pundit2.Annotators')

.constant('TEXTFRAGMENTANNOTATORDEFAULTS', {

    // Type of the contextual menu to trigger on text fragments icons clicks.
    // Will be used by icons/bits etc
    cMenuType: 'annotatedTextFragment',

    // Add elements to the contextual menu?
    initContextualMenu: true,

    // Class to get the consolidated icon: normal consolidated fragment
    annotationIconClass: "pnd-icon-tag",
    myItemsIconClass: "pnd-icon-bookmark",
    suggestionIconClass: "pnd-icon-pencil"

})

.service('TextFragmentAnnotator',
    function(TEXTFRAGMENTANNOTATORDEFAULTS, NameSpace, BaseComponent, Consolidation,
             XpointersHelper, ContextualMenu, ItemsExchange, Config,
             $compile, $rootScope, $location) {

    // Create the component and declare what we deal with: text
    var tfa = new BaseComponent('TextFragmentAnnotator', TEXTFRAGMENTANNOTATORDEFAULTS);
    tfa.label = "text";
    tfa.type = NameSpace.fragments[tfa.label];

    // The orchestrator will be called by the consolidation service as single point of
    // interaction when it comes to deal with fragments. Let's subscribe the text type.
    Consolidation.addAnnotator(tfa);

    // Contextual Menu actions for text fragments??
    var initContextualMenu = function() {
        ContextualMenu.addAction({
            type: [tfa.options.cMenuType],
            name: 'showAllAnnotations',
            label: 'Show all annotations for this fragment',
            showIf: function() {
                return true;
            },
            priority: 10,
            action: function(item) {
                // TODO: ask the ann sidebar to add a filter showing all annotations involving
                // this item, then let the sidebar call hideAll() and show() on every item
                // which belongs to filtered annotations
                tfa.hideAll();
                tfa.showByUri(item.uri);
            }
        });

        ContextualMenu.addAction({
            type: [tfa.options.cMenuType],
            name: 'hideAllAnnotations',
            label: 'Hide all annotations for this fragment',
            showIf: function() {
                // TODO: show just if there is some ann open
                return true;
            },
            priority: 11,
            action: function(item) {
                // TODO: ask the Annotation Sidebar to add a filter hiding this item
                // .. is this "hide all" action needed?
                tfa.hideByUri(item.uri);
            }
        });
    };

    if (tfa.options.initContextualMenu) {
        initContextualMenu();
    }

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

        tfa.log("Item not valid: not recognized as a consolidable "+ tfa.label);
        return true;
    };

    tfa.getAvailableTargets = function(onlyNamedContents) {
        var ret = [],
            nc = XpointersHelper.options.namedContentClasses;

        // The page URL is for xpointers out of named contents
        if (typeof(onlyNamedContents) === "undefined" || onlyNamedContents !== true) {
            ret.push($location.absUrl());
        }

        // Look for named content: an element with a class listed in .namedContentClasses
        // then get its about attribute
        for (var l=nc.length; l--;) {
            var className = nc[l],
                nodes = angular.element('.'+className);

            for (var n=nodes.length; n--;) {
                // If it doesnt have the attribute, dont add it
                var uri = angular.element(nodes[n]).attr('about');
                // TODO: better checks of what we find inside about attributes? A lil regexp
                // or we let do this at the server?
                if (uri) {
                    ret.push(uri);
                }
            }
        }

        return ret;
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

    tfa.log("Component up and running");
    return tfa;
});