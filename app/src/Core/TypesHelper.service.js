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
                types[uri].label = annotationRdf[uri][NameSpace.item.label][0].value;
            }

            if (NameSpace.item.description in annotationRdf[uri]) {
                types[uri].description = annotationRdf[uri][NameSpace.item.description][0].value;
            }
        } else {
            // Type not found in annotation rdf .. let's invent at least label!
            types[uri].label = Utils.getLabelFromURI(uri);
        }
    };

    // Adds new information for the given type.
    // Label is mandatory.
    typesHelper.add = function(uri, label, description) {

        if(!(uri in types)) {
            types[uri] = {};
        }
        types[uri].label = label;

        if (typeof(description) !== "undefined") {
            types[uri].description = description;
        }
    };

    typesHelper.getLabel = function(uri) {

        // TODO: Other special cases for example for pundit ontology types?

        if (typeof(types[uri]) === "undefined") {
            var label;

            // If it's one of our types, we know the labels. If not, we create one
            // using Utils super charged label producer.
            if (uri.match(NameSpace.punditOntologyBaseURL) && uri in NameSpace.typesLabels) {
                label =  NameSpace.typesLabels[uri];
            } else {
                label = Utils.getLabelFromURI(uri);
            }

            types[uri] = {
                label: label
            };

        }
        return types[uri].label;
    };

    typesHelper.log("Component up and running");
    return typesHelper;
});