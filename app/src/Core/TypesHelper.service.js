angular.module('Pundit2.Core')
.service('TypesHelper', function(BaseComponent, NameSpace) {
    var typesHelper = new BaseComponent("TypesHelper"),
        types = {};

    var getLabelFromType = function(uri) {
        var label;

        // Freebase custom labels
        if (uri.match(/http:\/\/www\.freebase\.com\/schema\//)) {
            label = uri.substring(31).replace(/\//g, ': ').replace(/_/g, ' ');
            return label;
        }

        // All other label types, take the last part
        label = uri.substring(uri.lastIndexOf('/') + 1);
        if (label.indexOf('#') !== -1) {
            label = label.substring(label.lastIndexOf('#') + 1);
        }

        return label;
    };

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
            types[uri].label = getLabelFromType(uri);
        }
    };

    typesHelper.getLabel = function(uri) {
        if (typeof(types[uri]) === "undefined") {
            types[uri] = {
                label: getLabelFromType(uri)
            };
        }
        return types[uri].label;
    };

    typesHelper.log("Component up and running");
    return typesHelper;
});