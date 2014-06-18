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
.service('AnnotationDetails', function($rootScope, $filter, BaseComponent, AnnotationsExchange, Consolidation, ItemsExchange, MyPundit, TypesHelper, ANNOTATIONDETAILSDEFAULTS) {
    
    var annotationDetails = new BaseComponent('AnnotationDetails', ANNOTATIONDETAILSDEFAULTS);

    var state = {
        annotations: [],
        defaultExpanded: annotationDetails.options.defaultExpanded,
        isUserLogged: false,
        userData: {}
    };

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

    var isAnnotationBroken = function(currentAnnotation) {
        var annotation = currentAnnotation;
        var graph = annotation.graph;
        var currentItem;
        var list;
        var broken = false;

        for (var subject in graph){
            currentItem = ItemsExchange.getItemByUri(subject);

            if (!Consolidation.isConsolidated(currentItem)){
                broken = true;
                annotationDetails.log("notConsolidate subject-> ",currentItem);
            }

            for (var predicate in graph[subject]){

                list = graph[subject][predicate];
                for (var object in list){
                    objectValue = list[object].value;
                    objectType = list[object].type;

                    if (objectType === 'uri'){
                        currentItem = ItemsExchange.getItemByUri(objectValue);
                        if (!Consolidation.isConsolidated(currentItem)){
                            // TODO: la presenza di un oggetto rotto connota come rotta l'intera annotazione?
                            // broken = true;
                            annotationDetails.log("notConsolidate object-> ",currentItem);
                        }
                    } 
                }
            }
        }

        return broken;
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
            broken: isAnnotationBroken(currentAnnotation),
            expanded: state.defaultExpanded
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

    annotationDetails.toggleAnnotationView = function(currentId) {
        annotationDetails.closeAllAnnotationView(currentId);
        state.annotations[currentId].expanded = !state.annotations[currentId].expanded;
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