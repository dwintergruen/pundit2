angular.module('Pundit2.Communication')
    .service('AnnotationsCommunication', function(BaseComponent, NameSpace, Toolbar, Consolidation, MyPundit,
        AnnotationsExchange, Annotation, NotebookExchange, Notebook, ItemsExchange, Config, XpointersHelper,
        $http, $q, $rootScope) {

    var annotationsCommunication = new BaseComponent("AnnotationCommunication");

    // get all annotations of the page from the server
    // add annotation inside annotationExchange
    // add items to page items inside itemsExchange
    // add notebooks to notebooksExchange
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

    annotationsCommunication.saveAnnotation = function(graph, items, targets, templateID){

        var completed = 0,
            promise = $q.defer();

        Toolbar.setLoading(true);

        var postData = {
            graph: graph,
            items: items
        };
        if (typeof(templateID) !== 'undefined') {
            postData.metadata = {template: templateID};
        }

        $http({
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            url: NameSpace.get('asNBCurrent'),
            params: {
                context: angular.toJson({
                    targets: targets,
                    pageContext: XpointersHelper.getSafePageContext()
                })
            },
            withCredentials: true,
            data: postData
        }).success(function(data) {                    

            // TODO if is rejected ???
            new Annotation(data.AnnotationID).then(function(){

                var ann = AnnotationsExchange.getAnnotationById(data.AnnotationID);

                // get notebook that include the new annotation
                var nb = NotebookExchange.getNotebookById(ann.isIncludedIn);

                // if no notebook is defined, it means that user is logged in a new user in Pundit and has not any notebooks
                // so create a new notebook and add annotation in new notebook in NotebookExchange
                if(typeof(nb) === 'undefined'){
                    new Notebook(ann.isIncludedIn, true).then(function(id){
                        NotebookExchange.getNotebookById(id).addAnnotation(data.AnnotationID);
                    });
                } else {
                    // otherwise if user has a notebook yet, use it to add new annotation in that notebook in NotebookExchange
                    NotebookExchange.getNotebookById(ann.isIncludedIn).addAnnotation(data.AnnotationID);
                }
                Consolidation.consolidateAll();
                $rootScope.$emit('update-annotation-completed', data.AnnotationID);
                // TODO move inside notebook then?
                Toolbar.setLoading(false);
                promise.resolve(ann.id);
            }, function(){
                // rejected, impossible to download annotation from server
                annotationsCommunication.log("Error: impossible to get annotation from server after save");
                Toolbar.setLoading(false);
                promise.reject();
            });
        }).error(function(msg) {
            // TODO
            annotationsCommunication.log("Error: impossible to save annotation", msg);
            Toolbar.setLoading(false);
            promise.reject();
        });

        return promise.promise;

    };


    // this API not work correctly sometimese save correctly the items sometimes not save correctly
    // TODO : safety check if we get an error in one of the two http calls
    annotationsCommunication.editAnnotation = function(annID, graph, items, targets){

        var completed = 0,
            promise = $q.defer();

        Toolbar.setLoading(true);

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
                "graph": graph
            }
        }).success(function() {
            if (completed > 0) {
                AnnotationsExchange.getAnnotationById(annID).update().then(function(){
                    Consolidation.consolidateAll();
                    $rootScope.$emit('update-annotation-completed', annID);
                    promise.resolve();
                });
            }
            Toolbar.setLoading(false);          
            completed++;
            annotationsCommunication.log("Graph correctly updated: "+annID);
        }).error(function() {
            Toolbar.setLoading(false);            
            promise.reject();
            annotationsCommunication.log("Error during graph editing of "+annID);
        });

        $http({
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            url: NameSpace.get('asAnnItems', {id: annID}),
            withCredentials: true,
            data: items
        }).success(function() {
            if (completed > 0) {
                AnnotationsExchange.getAnnotationById(annID).update().then(function(){
                    Consolidation.consolidateAll();
                    $rootScope.$emit('update-annotation-completed', annID);
                    promise.resolve();
                });
            }
            Toolbar.setLoading(false);         
            completed++;
            annotationsCommunication.log("Items correctly updated: "+annID);
        }).error(function() {
            Toolbar.setLoading(false);            
            promise.reject();
            annotationsCommunication.log("Error during items editing of "+annID);
        });

        return promise.promise;

    };

    return annotationsCommunication;

});