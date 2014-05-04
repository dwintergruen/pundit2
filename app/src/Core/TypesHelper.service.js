angular.module('Pundit2.Core')
.service('TypesHelper', function(BaseComponent, NameSpace, Utils) {
    var typesHelper = new BaseComponent("TypesHelper"),
        types = {};

    // Adds a type and some property extracting it from an annotation
    // rdf. If there's nothing, it will produce at least a label for it
    typesHelper.addFromAnnotationRdf = function(uri, annotationRdf) {

        // If we know this type already .. skip!
        if (uri in types) {
            return;
        }

        types[uri] = {};
        if (uri in annotationRdf) {
            if (NameSpace.item.label in annotationRdf[uri]) {
                types[uri].label = annotationRdf[uri][NameSpace.item.label];
            }

            if (NameSpace.item.description in annotationRdf[uri]) {
                types[uri].description = annotationRdf[uri][NameSpace.item.description];
            }
        } else {
            // Type not found in annotation rdf .. let's invent at least label!
            types[uri].label = Utils.getLabelFromURI(uri);
        }
    };

    typesHelper.getLabel = function(uri) {
        if (typeof(types[uri]) === "undefined") {
            types[uri] = {
                label: Utils.getLabelFromURI(uri)
            };
        }
        return types[uri].label;
    };

    typesHelper.log("Component up and running");
    return typesHelper;
});