/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.constant('ANNOTATIONDETAILSDEFAULTS', {
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationDetails
     *
     * @description
     * `object`
     *
     * Configuration for AnnotationDetails
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationDetails.defaultExpanded
     *
     * @description
     * `boolean`
     *
     * Initial state of the single annotation, expanded or collapsed
     *
     * Default value:
     * <pre> defaultExpanded: false </pre>
     */
    defaultExpanded: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#AnnotationDetails.debug
     *
     * @description
     * `boolean`
     *
     * Active debug log
     *
     * Default value:
     * <pre> debug: false </pre>
     */
    debug: false
})
.service('AnnotationDetails', function($rootScope, $filter, BaseComponent, Annotation, AnnotationSidebar, AnnotationsExchange, Consolidation, ContextualMenu, ItemsExchange, MyPundit, TextFragmentAnnotator, TypesHelper, ANNOTATIONDETAILSDEFAULTS) {
    
    var annotationDetails = new BaseComponent('AnnotationDetails', ANNOTATIONDETAILSDEFAULTS);

    var state = {
        annotations: [],
        defaultExpanded: annotationDetails.options.defaultExpanded,
        isUserLogged: false,
        userData: {}
    };

    ContextualMenu.addAction({
        type: [TextFragmentAnnotator.options.cMenuType],
        name: 'showAllAnnotations',
        label: 'Show all annotations on this item',
        showIf: function() {
            return true;
        },
        priority: 10,
        action: function(item) {
            if(!AnnotationSidebar.isAnnotationSidebarExpanded()){
                AnnotationSidebar.toggle();
            }
            annotationDetails.closeViewAndReset();
            for(var annotation in state.annotations) {
                if(state.annotations[annotation].itemsUriArray.indexOf(item.uri) === -1){
                    state.annotations[annotation].ghosted = true;
                }
            }
            
            TextFragmentAnnotator.hideAll();
            TextFragmentAnnotator.showByUri(item.uri);
        }
    });

    var buildItemDetails = function(currentUri) {
        var currentItem = ItemsExchange.getItemByUri(currentUri);
        var result = {
            uri: currentUri,
            label: currentItem.label,
            description: currentItem.description,
            image: (typeof currentItem.image !== 'undefined' ? currentItem.image : null),
            class: currentItem.getClass(),
            icon: currentItem.getIcon(),
            typeLabel: (typeof currentItem.type[0] !== 'undefined' ? TypesHelper.getLabel(currentItem.type[0]) : null),
            // typeLabel: TypesHelper.getLabel(currentItem.type[0]),
            typeClass: 'uri'
        };
        return result;
    };

    var buildMainItem = function(currentAnnotation) {
        var annotation = currentAnnotation;
        var firstUri;
        var mainItem = {};
        
        for (firstUri in annotation.graph){
            break;
        }
        
        mainItem = buildItemDetails(firstUri);

        return mainItem;
    };

    var buildObjectsArray = function(list, annotation) {
        var results = [];
        var objectValue;
        var objectType;
        for (var object in list){
            objectValue = list[object].value;
            objectType = list[object].type;

            if (objectType === 'uri'){
                results.push(buildItemDetails(objectValue));
            } else {
                results.push(
                    {
                        uri: null,
                        label: objectValue,
                        description: objectValue,
                        image: null,
                        class: null, // TODO: valutare
                        icon: null,
                        typeLabel: objectType,
                        typeClass: objectType
                    }
                );
            }
        }
        return results;
    };

    var buildItemsArray = function(currentAnnotation) {
        var annotation = currentAnnotation;
        var graph = annotation.graph;
        var results = [];

        for (var subject in graph){
            for (var predicate in graph[subject]){
                results.push(
                    {
                        subject: buildItemDetails(subject),
                        predicate: buildItemDetails(predicate),
                        objects: buildObjectsArray(graph[subject][predicate], annotation)
                    }
                );
            }
        }

        return results;
    };

    var buildItemsUriArray = function(currentAnnotation) {
        var annotation = currentAnnotation;
        var items = annotation.items;
        var results = [];

        for (var item in items){
            if(results.indexOf(item) === -1){
                results.push(item);
            }
        }

        return results;
    };

    var getFragments = function(currentAnnotation) {
        var annotation = currentAnnotation;
        var graph = annotation.graph;
        var results = [];
        var currentItem;

        for (var subject in graph){
            currentItem = ItemsExchange.getItemByUri(subject);
            if (Consolidation.isConsolidated(currentItem)){
                results.push(TextFragmentAnnotator.getFragmentIdByUri(subject));
            }

            for (var predicate in graph[subject]){

                var objectList = graph[subject][predicate];
                for (var object in objectList){
                    objectValue = objectList[object].value;
                    objectType = objectList[object].type;

                    if (objectType === 'uri'){
                        currentItem = ItemsExchange.getItemByUri(objectValue);
                        if (Consolidation.isConsolidated(currentItem)){
                            results.push(TextFragmentAnnotator.getFragmentIdByUri(objectValue));
                        }
                    }

                }
            }
        }
        return results;
    };

    annotationDetails.addAnnotationReference = function(scope) {
        var currentId = scope.id;
        var currentAnnotation = AnnotationsExchange.getAnnotationById(currentId);

        state.annotations[currentId] = {
            id: currentId,
            creator: currentAnnotation.creator,
            creatorName: currentAnnotation.creatorName,
            created: currentAnnotation.created,
            notebookId: currentAnnotation.isIncludedIn,
            scopeReference: scope,
            mainItem: buildMainItem(currentAnnotation),
            itemsArray: buildItemsArray(currentAnnotation),
            itemsUriArray: buildItemsUriArray(currentAnnotation),
            broken: currentAnnotation.isBroken(),
            expanded: state.defaultExpanded,
            ghosted: false,
            fragments: getFragments(currentAnnotation)
        };
    };

    annotationDetails.getAnnotationDetails = function(currentId) {
        if (currentId in state.annotations) {
            return state.annotations[currentId];
        }
    };

    annotationDetails.getAnnotationViewStatus = function(currentId) {
        return state.annotations[currentId].expanded;
    };

    annotationDetails.resetGhosted = function() {
        for (var id in state.annotations){
            state.annotations[id].ghosted = false;
        }
    };

    annotationDetails.closeViewAndReset = function() {
        for (var id in state.annotations){
            state.annotations[id].ghosted = false;
            state.annotations[id].expanded = false;
        }
        TextFragmentAnnotator.showAll();
    };

    annotationDetails.closeAllAnnotationView = function(skipId) {
        for (var id in state.annotations){
            if (id !== skipId){
                state.annotations[id].expanded = false;
            }
        }
    };

    annotationDetails.openAnnotationView = function(currentId) {
        annotationDetails.closeAllAnnotationView(currentId);
        state.annotations[currentId].expanded = true;
    };

    annotationDetails.openSingleAnnotationView = function(currentId) {
        state.annotations[currentId].expanded = true;
    };

    annotationDetails.toggleAnnotationView = function(currentId) {
        annotationDetails.closeAllAnnotationView(currentId);
        state.annotations[currentId].expanded = !state.annotations[currentId].expanded;
    };

    annotationDetails.isAnnotationGhosted = function(currentId) {
        return state.annotations[currentId].ghosted;
    };

    annotationDetails.isAnnotationUser = function(creator) {
        return creator === state.userData.uri;
    };    

    annotationDetails.isUserToolShowed = function(creator) {
        return state.isUserLogged === true && creator === state.userData.uri;
    };

    $rootScope.$watch(function() {
        return MyPundit.isUserLogged(); 
    }, function(newStatus) {
        state.isUserLogged = newStatus;
        state.userData = MyPundit.getUserData();
    });

    annotationDetails.log('Component running');
    return annotationDetails;
});