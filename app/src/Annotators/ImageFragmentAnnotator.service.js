angular.module('Pundit2.Annotators')
.service('ImageFragmentAnnotator', function(NameSpace, BaseComponent, $location,
    Consolidation, ImageFragmentHandler, XpointersHelper) {

    // Create the component and declare what we deal with: text
    var ifa = new BaseComponent('ImageFragmentAnnotator');
    ifa.label = "image";
    ifa.type = NameSpace.types[ifa.label];

    Consolidation.addAnnotator(ifa);
    
    ifa.isConsolidable = function(item) {

        if (!angular.isArray(item.type)) {
            ifa.log("Item not valid: malformed type"+ item.uri);
            return false;
        } else if (item.type.length === 0) {
            ifa.log("Item not valid: types len 0"+ item.uri);
            return false;
        } else if (item.type.indexOf(ifa.type) === -1) {
            ifa.log("Item not valid: not have type image"+ item.uri);
            return false;
        } else if (!XpointersHelper.isValidXpointerURI(item.uri)) {
            ifa.log("Item not valid: not a valid xpointer uri: "+ item.uri);
            return false;
        } else if (!XpointersHelper.isValidXpointer(item.uri)) {
            ifa.log("Item not valid: not consolidable on this page: "+ item.uri);
            return false;
        }
        
        // TODO: it's a valid image fragment if:
        // - one of its types is the fragment-image type
        // - has a part of
        // - .selector contains something
        // ... etc etc

        ifa.log("Item valid: "+ item.label);
        return true;
    };

    ifa.consolidate = function(items) {
        // TODO
    };

    ifa.wipe = function() {
        // TODO
    };

    ifa.log("Component up and running");
    return ifa;
});