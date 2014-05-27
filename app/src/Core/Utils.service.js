angular.module('Pundit2.Core')
.service('Utils', function() {
    var Utils = {};
    
    Utils.deepExtend = function(destination, source) {
        for (var property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                destination[property] = destination[property] || {};
                arguments.callee(destination[property], source[property]);
            } else {
                destination[property] = angular.copy(source[property]);
            }
        }
        return destination;
    };

    Utils.getLabelFromURI = function(uri) {
        var label;

        // Freebase custom labels
        if (uri.match(/http:\/\/www\.freebase\.com\/schema\//)) {
            label = uri
                .substring(31)
                .replace(/\//g, ': ')
                .replace(/_/g, ' ');
            return label;
        }

        // DBPedia custom labels
        // Special case for DBPedia Types
        if (uri.match("http://dbpedia.org/ontology/")) {
            label = uri
                .substring(28)
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, function(str){ return str.toUpperCase(); });
            return label;
        }

        // All other label types, take the last part
        label = uri.substring(uri.lastIndexOf('/') + 1);
        if (label.indexOf('#') !== -1) {
            label = label.substring(label.lastIndexOf('#') + 1);
        }

        return label;
    };


    return Utils;
});