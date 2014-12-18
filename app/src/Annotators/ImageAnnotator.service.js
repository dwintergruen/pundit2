angular.module('Pundit2.Annotators')

.service('ImageAnnotator', function(NameSpace, BaseComponent, $location,
    Consolidation, XpointersHelper, ImageFragmentAnnotatorHelper) {

    // Create the component and declare what we deal with: text
    var ia = new BaseComponent('ImageAnnotator');
    ia.label = "image";
    ia.type = NameSpace.types[ia.label];

    ia.labelIF = "imagePart";
    ia.typeIF = NameSpace.fragments[ia.labelIF];

    var imgConsClass = "pnd-cons-img";
    var svgTimeout;

    Consolidation.addAnnotator(ia);

    ia.isConsolidable = function(item) {
        var xpointerURI;

        if (!angular.isArray(item.type)) {
            ia.log("Item not valid: malformed type" + item.uri);
            return false;
        } else if (item.type.length === 0) {
            ia.log("Item not valid: types len 0" + item.uri);
            return false;
        } else if ((item.type.indexOf(ia.type) === -1) && (item.type.indexOf(ia.typeIF) === -1)) {
            ia.log("Item not valid: not have type image " + item.uri);
            return false;
        } else {
            if (item.type.indexOf(ia.type) !== -1) {
                xpointerURI = item.uri;
            } else if (item.type.indexOf(ia.typeIF) !== -1) {
                xpointerURI = item.parentItemXP;
            }

            if (!XpointersHelper.isValidXpointerURI(xpointerURI)) {
                ia.log("Item not valid: not a valid xpointer uri: " + xpointerURI);
                return false;
            } else if (!XpointersHelper.isValidXpointer(xpointerURI)) {
                ia.log("Item not valid: not consolidable on this page: " + xpointerURI);
                return false;
            }
        }

        // TODO: it's a valid image fragment if:
        // - one of its types is the fragment-image type [done]
        // - has a part of
        // - .selector contains something
        // ... etc etc

        ia.log("Item valid: " + item.label);
        return true;
    };

    ia.consolidate = function(items) {
        ia.log('Consolidating!');

        var uri, currentUri, xpointers = [],
            parentItemXPList = {};
        for (uri in items) {
            if (items[uri].type.indexOf(ia.type) !== -1) {
                currentUri = items[uri].uri;
            } else if (items[uri].type.indexOf(ia.typeIF) !== -1) {
                currentUri = items[uri].parentItemXP;
            }
            xpointers.push(currentUri);

            if (typeof(items[uri].polygon) !== 'undefined') {
                if (typeof(parentItemXPList[items[uri].parentItemXP]) !== 'undefined') {
                    parentItemXPList[items[uri].parentItemXP].push(items[uri].polygon);
                } else {
                    parentItemXPList[items[uri].parentItemXP] = [items[uri].polygon];
                }
            }
        }
        var xpaths = XpointersHelper.getXPathsFromXPointers(xpointers);
        for (uri in xpaths) {
            // TODO So bad! Add span (like Pundit1) and use it as reference
            // TODO Move DOM manipulation in Xpointer service
            var imgReference = angular.element(xpaths[uri].startNode.firstElementChild);
            imgReference.addClass(imgConsClass);
            // if (uri in parentItemXPList){
            //     for (polyIF in parentItemXPList[uri]){
            //         ImageFragmentAnnotatorHelper.drawPolygonOverImage(parentItemXPList[uri][polyIF],  imgReference);
            //     }
            // }
        }
    };

    ia.wipe = function() {
        var imgCons = angular.element('.' + imgConsClass);
        imgCons.removeClass(imgConsClass);
        // imgCons.siblings('svg.pnd-polygon-layer').remove();
    };

    ia.svgHighlightByItem = function(item) {
        // TODO check if the svg is yet built
        var currentUri, imgReference, xpaths = [];
        if ((item.type.indexOf(ia.typeIF) !== -1) && (typeof(item.polygon) !== 'undefined')) {
            currentUri = item.parentItemXP;
            xpaths = XpointersHelper.getXPathsFromXPointers([currentUri]);
            if (currentUri in xpaths) {
                imgReference = angular.element(xpaths[currentUri].startNode.firstElementChild);
                ImageFragmentAnnotatorHelper.drawPolygonOverImage(item.polygon, imgReference);
            }
        }
    };

    ia.svgClearHighlightByItem = function(item) {
        angular.element('.' + imgConsClass).siblings('span.pnd-cons-svg').remove();
        // var currentUri, imgReference, xpaths = [];
        // if ((item.type.indexOf(ia.typeIF) !== -1) && (typeof(item.polygon) !== 'undefined')){
        //     currentUri = item.parentItemXP;
        //     xpaths = XpointersHelper.getXPathsFromXPointers([currentUri]);
        //     if (currentUri in xpaths) {
        //         imgReference = angular.element(xpaths[currentUri].startNode.firstElementChild);
        //         imgReference.siblings('svg.pnd-polygon-layer').remove();
        //     }
        // }
    };

    ia.highlightById = function() {
        // TODO
    };

    ia.clearHighlightById = function() {
        // TODO
    };

    ia.highlightByUri = function() {
        // TODO
    };

    ia.clearHighlightByUri = function() {
        // TODO
    };

    ia.log("Component up and running");
    return ia;
});