/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.constant('ANNOTATIONDETAILSDEFAULTS', {
    debug: false
})
.service('AnnotationDetails', function($rootScope, $filter, BaseComponent, AnnotationsExchange, ItemsExchange, MyPundit, TypesHelper, ANNOTATIONDETAILSDEFAULTS) {
    
    var annotationDetails = new BaseComponent('AnnotationDetails', ANNOTATIONDETAILSDEFAULTS);

    var state = {
        annotations: [],
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
            typeLabel: TypesHelper.getLabel(currentItem.type[0])
        };
        // console.log("lab"+)
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
                        typeLabel: objectType
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

    annotationDetails.addAnnotationReference = function(scope) {
        var currentId = scope.id;
        var currentAnnotation = AnnotationsExchange.getAnnotationById(currentId);

        state.annotations[currentId] = {
            id: currentId,
            creator: currentAnnotation.creator,
            creatorName: currentAnnotation.creatorName,
            created: currentAnnotation.created,
            scopeReference: scope,
            mainItem: buildMainItem(currentAnnotation),
            itemsArray: buildItemsArray(currentAnnotation),
            expanded: false
        };
    };

    annotationDetails.getAnnotationDetails = function(currentId) {
        if (currentId in state.annotations) {
            return state.annotations[currentId];
        }
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