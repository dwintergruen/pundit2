angular.module('Pundit2.Annotators')
.service('ImageFragmentAnnotator', function(NameSpace, BaseComponent, $location,
    Consolidation, ImageFragmentHandler, XpointersHelper) {

    // Create the component and declare what we deal with: text
    var ifa = new BaseComponent('ImageFragmentAnnotator');
    ifa.label = "image";
    ifa.type = NameSpace.fragments[ifa.label];

    //Consolidation.addAnnotator(ifa);
    
    ifa.isConsolidable = function(item) {
        if (!angular.isArray(item.type)) {
            ifa.log("Item not valid: malformed");
            return false;
        } else if (item.type.length === 0) {
            ifa.log("Item not valid: types len 0");
            return false;
        }
        
        // TODO: it's a valid image fragment if:
        // - one of its types is the fragment-image type
        // - has a part of
        // - .selector contains something
        // ... etc etc
        if (item.type.indexOf(ifa.type) !== -1) {
            ifa.log("Item is a fragment! "+ ifa.label);
            return true;
        }
        
        // TODO: check if it is consolidable ON THIS PAGE

        ifa.log("Item not valid: not recognized as a consolidable "+ ifa.label);
        return false;
    };

    ifa.wipe = function() {
        // TODO
    };

    ifa.log("Component up and running");
    return ifa;
});