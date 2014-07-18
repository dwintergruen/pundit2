angular.module('Pundit2.Annotators')
.service('ImageAnnotator', function(NameSpace, BaseComponent, $location,
    Consolidation, XpointersHelper) {

    // Create the component and declare what we deal with: text
    var ia = new BaseComponent('ImageAnnotator');
    ia.label = "image";
    ia.type = NameSpace.types[ia.label];

    var imgConsClass = "pnd-cons-img";

    Consolidation.addAnnotator(ia);
    
    ia.isConsolidable = function(item) {

        if (!angular.isArray(item.type)) {
            ia.log("Item not valid: malformed type"+ item.uri);
            return false;
        } else if (item.type.length === 0) {
            ia.log("Item not valid: types len 0"+ item.uri);
            return false;
        } else if (item.type.indexOf(ia.type) === -1) {
            ia.log("Item not valid: not have type image"+ item.uri);
            return false;
        } else if (!XpointersHelper.isValidXpointerURI(item.uri)) {
            ia.log("Item not valid: not a valid xpointer uri: "+ item.uri);
            return false;
        } else if (!XpointersHelper.isValidXpointer(item.uri)) {
            ia.log("Item not valid: not consolidable on this page: "+ item.uri);
            return false;
        }
        
        // TODO: it's a valid image fragment if:
        // - one of its types is the fragment-image type
        // - has a part of
        // - .selector contains something
        // ... etc etc

        ia.log("Item valid: "+ item.label);
        return true;
    };

    ia.consolidate = function(items) {
        ia.log('Consolidating!');

        var uri, xpointers = [];
        for (uri in items) {
            xpointers.push(uri);
        }
        var xpaths = XpointersHelper.getXPathsFromXPointers(xpointers);
        for (uri in xpaths) {
            angular.element(xpaths[uri].startNode.firstChild).addClass(imgConsClass);
        }
        // TODO : if an img is inside a consolidate text selection this not work
        // the img is not the first child. we can get the first img from all node childrens?
    };

    ia.wipe = function() {
        angular.element('.'+imgConsClass).removeClass(imgConsClass);
    };

    ia.log("Component up and running");
    return ia;
});