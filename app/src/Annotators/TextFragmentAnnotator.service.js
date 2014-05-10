angular.module('Pundit2.Annotators')
.constant('TEXTFRAGMENTANNOTATORDEFAULTS', {
    // Class added to all of the consolidated text fragments
    wrapNodeClass: 'pnd-cons',
    // Classes to assign to named content to have them recognized by Pundit
    contentClasses: ['pundit-content']
})
.service('TextFragmentAnnotator',
    function(TEXTFRAGMENTANNOTATORDEFAULTS, NameSpace, BaseComponent, AnnotatorsOrchestrator,
             XpointersHelper, $compile, $rootScope, $location) {

    // Create the component and declare what we deal with: text
    var tfa = new BaseComponent('TextFragmentAnnotator', TEXTFRAGMENTANNOTATORDEFAULTS);
    tfa.label = "text";
    tfa.type = NameSpace.fragments[tfa.label];

    AnnotatorsOrchestrator.addAnnotator(tfa);
    
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
        // Map to get back from id to fragment uri
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

        activateFragments();

        tfa.log(tfa.label +' consolidation: done!');
    };

    // TODO: Move this to XpointersHelper .something() ?
    var activateFragments = function() {

        var foo = true;
        for (var c in fragmentIds) {

            // TODO: Better way to find out the last bit following DOM's order?
            var lastBit = angular.element('[fragments*="'+ fragmentIds[c] +'"]').last();

            // TODO: use a directive
            // - mouseover (highlight)
            // - mouseoout (reset highlight)
            // - click (cmenu)
            // - right click (cmenu)

            // TODO: place the right icon, how to check? What icons do we accept? How to
            // decide which one to use? Item type?
            var icon = "pnd-icon-tag";
            if (foo) {
                icon = "pnd-icon-thumb-tack";
                foo =  false;
            }

            lastBit.after('<span style="color: red; margin: 0px 1px;" class="'+icon+'"></span>');
        }

        var consolidated = angular.element('.pnd-cons');
        $compile(consolidated)($rootScope);
        $rootScope.$$phase || $rootScope.$digest();

    };

    // Called by FragmentBit directives: they will wrap every bit of annotated content
    // for every xpointer we save an array of those bits. Each bit can belong to more
    // than one xpointer (overlaps!)
    tfa.addFragmentBit = function(bit) {

        tfa.log('Adding fragment bit ', bit);
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

    // TODO: find a better name
    tfa.high = function(uri) {

        var id;
        if (uri in fragmentIds) {
            id = fragmentIds[uri][0];
        } else {
            tfa.log('Not highlighting, fragment id not found');
            return;
        }

        tfa.log('Highlighting fragment ', id, fragmentById[id].bits.length);
        for (var l=fragmentById[id].bits.length; l--;) {
            fragmentById[id].bits[l].high();
        }

    };

    // TODO: find a better name
    tfa.reset = function(uri) {

        var id = fragmentIds[uri];
        if (typeof(id) === "undefined") {
            return;
        }

        tfa.log('Reset fragment ', id, fragmentById[id].bits.length);
        for (var l=fragmentById[id].bits.length; l--;) {
            fragmentById[id].bits[l].reset();
        }

    };

    tfa.log("Component up and running");
    return tfa;
});