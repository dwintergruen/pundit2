angular.module('Pundit2.Annotators')

.constant('TEXTFRAGMENTANNOTATORDEFAULTS', {
    // Class added to all of the consolidated text fragments
    wrapNodeClass: 'pnd-cons',
    // Classes to assign to named content to have them recognized by Pundit
    contentClasses: ['pundit-content'],
    // Type of the contextual menu we want for text fragments. Will be used by icons/bits etc
    contextualMenuType: 'annotatedTextFragment',
    // Add elements to the contextual menu?
    initContextualMenu: true
})

.service('TextFragmentAnnotator',
    function(TEXTFRAGMENTANNOTATORDEFAULTS, NameSpace, BaseComponent, Consolidation,
             XpointersHelper, ContextualMenu, $compile, $rootScope, $location) {

    // Create the component and declare what we deal with: text
    var tfa = new BaseComponent('TextFragmentAnnotator', TEXTFRAGMENTANNOTATORDEFAULTS);
    tfa.label = "text";
    tfa.type = NameSpace.fragments[tfa.label];

    // The orchestrator will be called by the consolidation service as single point of
    // interaction when it comes to deal with fragments. Let's subscribe the text type.
    Consolidation.addAnnotator(tfa);


    // Contextual Menu actions for text fragments
    var initContextualMenu = function() {
        ContextualMenu.addAction({
            type: [tfa.options.contextualMenuType],
            name: 'showAllAnnotations',
            label: 'Show all annotations for this fragment',
            showIf: function() {
                return true;
            },
            priority: 1,
            action: function(uri) {
                console.log('Consolidated icon click action', uri);
            }
        });

        ContextualMenu.addAction({
            type: [tfa.options.contextualMenuType],
            name: 'hideAllAnnotations',
            label: 'Hide all annotations for this fragment',
            showIf: function() {
                // TODO: show just if there is some ann open
                return true;
            },
            priority: 2,
            action: function(uri) {
                console.log('Consolidated icon click action', uri);
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
            tfa.log("Item not valid: not a valid xpointer uri"+ item.uri);
            return false;
        }

        // TODO: it's a valid text fragment if:
        // - one of its types is the fragment-text type
        // - has a part of
        // - has a page context
        // - .uri is an xpointer

        tfa.log("Item not valid: not recognized as a consolidable "+ tfa.label);
        return true;
    };

    tfa.getAvailableTargets = function() {
        var ret = [];

        // The page URL is for xpointers out of named contents
        ret.push($location.absUrl());

        // Look for named content: an element with a class listed in .contentClasses
        // then get its about attribute
        for (var l=tfa.options.contentClasses.length; l--;) {
            var className = tfa.options.contentClasses[l],
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
                bits: []
            };
            i++;
        }

        var xpaths = XpointersHelper.getXPathsFromXPointers(xpointers),
            sorted = XpointersHelper.splitAndSortXPaths(xpaths),
            // After splitting and sorting each bit has a list of fragment ids it belongs to.
            // Instead of using classes, these ids will be saved in a node attribute.
            xpathsFragmentIds = XpointersHelper.getClassesForXpaths(xpointers, sorted, xpaths, fragmentIds);

        XpointersHelper.updateDOM(sorted, tfa.options.wrapNodeClass, xpathsFragmentIds);

        // TODO: better name? Elsewhere?
        activateFragments();

        tfa.log(tfa.label +' consolidation: done!');
    };

    // For each fragment ID it will place an icon after the last BIT belonging
    // to the given fragment
    var placeIcons = function() {

        for (var c in fragmentIds) {
            var id = fragmentIds[c],
                lastBit = angular.element('[fragments*="'+ id +'"]').last();

            lastBit.after('<text-fragment-icon fragment="'+id+'"></text-fragment-icon>');
        }
    };

    // TODO: Move this to XpointersHelper .something() ?
    var activateFragments = function() {

        // TODO: do we want this to be configurable? Or icons are here to stay?
        placeIcons();

        var consolidated = angular.element('.pnd-cons');
        $compile(consolidated)($rootScope);

        var icons = angular.element('text-fragment-icon');
        $compile(icons)($rootScope);

        $rootScope.$$phase || $rootScope.$digest();

    };

    // Called by TextFragmentIcon directives: they will be placed after each consolidated
    // fragment.
    tfa.addFragmentIcon = function(icon) {
        fragmentById[icon.fragment].icon = icon;
        icon.fragmentUri = fragmentById[icon.fragment];

        // TODO: which icon to use? How do we know?

        tfa.log('Adding text fragment icon for fragment id='+ icon.fragment);
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
            fragmentById[id].bits[l].reset();
        }
        tfa.log('Clear highlight on fragment id='+ id +', # bits: '+ fragmentById[id].bits.length);
    };

    tfa.log("Component up and running");
    return tfa;
});