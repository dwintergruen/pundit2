angular.module('Pundit2.Annotators')
.service('ImageFragmentAnnotator', function(NameSpace, BaseComponent, $location,
    Consolidation, ImageFragmentHandler, XpointersHelper) {

    // Create the component and declare what we deal with: text
    var ifa = new BaseComponent('ImageFragmentAnnotator');
    ifa.label = "image";
    ifa.type = NameSpace.fragments[ifa.label];

    Consolidation.addAnnotator(ifa);
    
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

    ifa.getAvailableTargets = function(onlyNamedContents) {
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

    ifa.wipe = function() {
        // TODO
    };

    ifa.log("Component up and running");
    return ifa;
});