angular.module('Pundit2.Communication')
    .service('AnnotationsCommunication', function(BaseComponent, NameSpace, Toolbar, Consolidation,
        AnnotationsExchange, Annotation, $http, $q) {

    var annotationsCommunication = new BaseComponent("AnnotationCommunication");

    // get all annotations of the page from the server
    // add annotation inside annotationExchange
    // add items to page items inside itemsExchange
    // than consilidate all items
    annotationsCommunication.getAnnotations = function() {

        Toolbar.setLoading(true);

        var uris = Consolidation.getAvailableTargets(),
            annPromise = AnnotationsExchange.searchByUri(uris);

        annotationsCommunication.log('Getting annotations for available targets', uris);

        annPromise.then(function(ids) {
            annotationsCommunication.log('Found '+ids.length+' annotations on the current page.');

            if (ids.length === 0) {
                Toolbar.setLoading(false);
                return;
            }

            var annPromises = [],
                settled = 0;
            for (var i=0; i<ids.length; i++) {

                var a = new Annotation(ids[i]);
                a.then(function(){
                    // The annotation got loaded, it is already available
                    // in the AnnotationsExchange
                }, function(error) {
                    annotationsCommunication.log("Could not retrieve annotation: "+ error);
                    // TODO: can we try again? Let the user try again with an error on
                    // the toolbar?
                }).finally().then(function() {
                    settled++;
                    annotationsCommunication.log('Received annotation '+settled+'/'+annPromises.length);
                    if (settled === annPromises.length) {
                        annotationsCommunication.log('All promises settled, consolidating');

                        Consolidation.consolidateAll();
                        Toolbar.setLoading(false);
                    }
                });
                annPromises.push(a);
            }

        }, function(msg) {
            annotationsCommunication.err("Could not search for annotations, error from the server: "+msg);
        });

    };

    return annotationsCommunication;

});