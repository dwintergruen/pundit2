angular.module('Pundit2.Annotators')
.service('TextFragmentAnnotator', function(NameSpace, BaseComponent, AnnotatorsOrchestrator, XpointersHelper, $compile, $rootScope) {

    // Create the component and declare what we deal with: text
    var tfa = new BaseComponent('TextFragmentAnnotator');
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

        // TODO: check if it is consolidable ON THIS PAGE

        tfa.log("Item not valid: not recognized as a consolidable "+ tfa.label);
        return true;
    };

    // Each fragment will be split into bits, each bit will carry a relation
    // to the parent fragment through this id
    var fragmentIds = {},
        // Map to get back from id to fragment uri
        fragmentById = {};

    tfa.consolidate = function(items) {

        tfa.log('Consolidating!');

        var xpointers = [],
            i = 0;

        // Reset them, each consolidate has its own unique list
        // TODO: better wipe up? other stuff to reset?
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
            // Instead of using classes, these ids will be saved in a node attribute. After
            // splitting and sorting each bit has a list of fragment ids it belongs to
            xpathsFragmentIds = XpointersHelper.getClassesForXpaths(xpointers, sorted, xpaths, fragmentIds);

        XpointersHelper.updateDOM(sorted, 'pnd-cons', xpathsFragmentIds);

        var consolidated = angular.element('.pnd-cons');
        $compile(consolidated)($rootScope);
        $rootScope.$$phase || $rootScope.$digest();

        tfa.log(tfa.label +' consolidation: done!', consolidated);

    };

    var fragmentsByXpointer = [];
    tfa.addFragmentBit = function(bit) {

        tfa.log('Adding fragment bit ', bit);
        var fragments = bit.fragments;

        // Fragment ids are split by a comma, gather them back in a array
        if (fragments.match(/,/)) {
            fragments = fragments.split(',');
        } else {
            fragments = [fragments];
        }

        for (var l=fragments.length; l--;) {
            var current = fragmentById[fragments[l]];
            current.bits.push(bit);

        }
        console.log('Adding cons fragment', fragments);

    };

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

    tfa.reset = function(uri) {

        var id = fragmentIds[uri];
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