angular.module('Pundit2.Communication')
    .service('AnnotationsCommunication', function(BaseComponent, NameSpace, Toolbar, Consolidation, MyPundit,
        AnnotationsExchange, Annotation, NotebookExchange, Notebook, ItemsExchange, Config, XpointersHelper,
        $http, $q) {

    var annotationsCommunication = new BaseComponent("AnnotationCommunication");

    // get all annotations of the page from the server
    // add annotation inside annotationExchange
    // add items to page items inside itemsExchange
    // TODO add notebooks to notebooksExchange
    // than consilidate all items
    annotationsCommunication.getAnnotations = function() {

        var promise = $q.defer();

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
                a.then(function(ann){
                    // The annotation got loaded, it is already available
                    // in the AnnotationsExchange
                    var notebookID = ann.isIncludedIn;
                    if (typeof(NotebookExchange.getNotebookById(notebookID)) === 'undefined') {
                        // if the notebook is not loaded download it and add to notebooksExchange
                        new Notebook(notebookID);
                    }
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
                        promise.resolve(settled);
                    }
                });
                annPromises.push(a);
            }

        }, function(msg) {
            annotationsCommunication.err("Could not search for annotations, error from the server: "+msg);
            promise.reject(msg);
        });

        return promise.promise;

    };

    // delete specified annotation from server
    // TODO optimize (we must reload all annotation from server? i think that is not necessary)
    annotationsCommunication.deleteAnnotation = function(annID) {

        var promise = $q.defer();

        if(MyPundit.isUserLogged()){
            Toolbar.setLoading(true);
            $http({
                method: 'DELETE',
                url: NameSpace.get('asAnn', {id: annID}),
                withCredentials: true
            }).success(function() {
                Toolbar.setLoading(false);
                annotationsCommunication.log("Success annotation: "+annID+" correctly deleted");
                // remove annotation from relative notebook
                var notebookID = AnnotationsExchange.getAnnotationById(annID).isIncludedIn;
                var nt = NotebookExchange.getNotebookById(notebookID);
                if (typeof(nt) !== 'undefined') {
                    nt.removeAnnotation(annID);
                }
                // wipe page items
                ItemsExchange.wipeContainer(Config.modules.PageItemsContainer.container);
                // wipe all annotations (are in chace)
                AnnotationsExchange.wipe();
                // reload all annotation
                annotationsCommunication.getAnnotations().then(function(){
                    promise.resolve(annID);
                }, function(){
                    promise.reject("Error during getAnnotations after a delete of: "+annID);
                });

            }).error(function() {
                Toolbar.setLoading(false);
                annotationsCommunication.log("Error impossible to delete annotation: "+annID+" please retry.");
                promise.reject("Error impossible to delete annotation: "+annID);
            });
        } else {
            annotationsCommunication.log("Error impossible to delete annotation: "+annID+" you are not logged");
            promise.reject("Error impossible to delete annotation: "+annID+" you are not logged");
        }

        return promise.promise;
    };


    /* this API not work correctly sometimese save correctly the items sometimes not save correctly
    annotationsCommunication.editAnnotation = function(annID, graph, items, targets){

        $http({
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            url: NameSpace.get('asAnnContent', {id: annID}),
            params: {
                context: angular.toJson({
                    targets: targets,
                    pageContext: XpointersHelper.getSafePageContext()
                })
            },
            withCredentials: true,
            data: {
                "graph": graph,
                "items": items               
            }
        }).success(function(data) {
            console.log('Edit success', data);
        }).error(function(msg) {
            console.log("Edit Error", msg);
        });

    };*/

    return annotationsCommunication;

});