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
     * Configuration object for AnnotationDetails module. AnnotationDetails 
     * directive is instantiated from the AnnotationSidebar and
     * contains details of the annotations.
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
.service('AnnotationDetails', function($rootScope, $filter, $timeout, $document, BaseComponent, Annotation, AnnotationSidebar, AnnotationsExchange, TemplatesExchange, Consolidation, ContextualMenu, Dashboard, ItemsExchange, MyPundit, TextFragmentAnnotator, TypesHelper, ANNOTATIONDETAILSDEFAULTS) {
    
    var annotationDetails = new BaseComponent('AnnotationDetails', ANNOTATIONDETAILSDEFAULTS);

    var state = {
        annotations: [],
        defaultExpanded: annotationDetails.options.defaultExpanded,
        isUserLogged: false,
        isGhostedActive: false,
        userData: {}
    };

    ContextualMenu.addAction({
        type: [TextFragmentAnnotator.options.cMenuType],
        name: 'showAllAnnotations',
        label: 'Show all annotations of this item',
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
            
            state.isGhostedActive = true;
            TextFragmentAnnotator.ghostAll();
            TextFragmentAnnotator.ghostRemoveByUri(item.uri);
        }
    });

    var isToBeIgnored = function(node) {
        var annClass = 'pnd-annotation-details-wrap';
        var filterClass = 'pnd-annotation-sidebar-filter-content';
        var refClass = 'pnd-annotation-details-ghosted';

        // Traverse every parent and check if it has one of the classes we
        // need to ignore. As soon as we find one, return true: must ignore.
        while (node.nodeName.toLowerCase() !== 'body') {
            if (angular.element(node).hasClass(annClass)) {
                if (angular.element(node).find('.'+refClass).length === 0){
                    return false;                   
                }
            }
            if (angular.element(node).hasClass(filterClass)) {
                return false;                   
            }
            // If there's no parent node .. even better, we didnt find anything wrong!
            if (node.parentNode === null) {
                return true;
            }
            node = node.parentNode;
        }
        return true;
    };

    $document.on('mousedown', function(downEvt) {
        var target = downEvt.target;

        if(state.isGhostedActive){
            if(isToBeIgnored(target)){
                annotationDetails.closeViewAndReset();
            }
        }

        $rootScope.$$phase || $rootScope.$digest();
    });

    var buildItemDetails = function(currentUri) {
        var currentItem = ItemsExchange.getItemByUri(currentUri);
        if(typeof(currentItem) !== 'undefined'){
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
        }
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

    annotationDetails.getAnnotationDetails = function(currentId) {
        if (currentId in state.annotations) {
            return state.annotations[currentId];
        }
    };

    annotationDetails.getAnnotationViewStatus = function(currentId) {
        return state.annotations[currentId].expanded;
    };

    annotationDetails.setGhosted = function(currentId) {
        if (typeof(state.annotations[currentId]) !== 'undefined') {
            state.annotations[currentId].ghosted = true;
        }
        state.isGhostedActive = true;
    };

    annotationDetails.resetGhosted = function() {
        for (var id in state.annotations){
            state.annotations[id].ghosted = false;
        }
        state.isGhostedActive = false;

    };

    annotationDetails.closeViewAndReset = function() {
        for (var id in state.annotations){
            state.annotations[id].ghosted = false;
            state.annotations[id].expanded = false;
            AnnotationSidebar.setAllPosition(id, AnnotationSidebar.options.annotationHeigth);
        }
        state.isGhostedActive = false;
        TextFragmentAnnotator.ghostRemoveAll();
    };

    annotationDetails.closeAllAnnotationView = function(skipId) {
        for (var id in state.annotations){
            if (id !== skipId){
                state.annotations[id].expanded = false;
                AnnotationSidebar.setAnnotationPosition(id, AnnotationSidebar.options.annotationHeigth);
            }
        }
    };

    annotationDetails.openAnnotationView = function(currentId) {
        if(typeof(state.annotations[currentId]) !== 'undefined'){
            if(!AnnotationSidebar.isAnnotationSidebarExpanded()){
                AnnotationSidebar.toggle();
            }
            annotationDetails.closeAllAnnotationView(currentId);
            state.annotations[currentId].expanded = true;
        } else{
            annotationDetails.log("Cannot find this annotation: id -> " + currentId);
        }
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

    annotationDetails.addAnnotationReference = function(scope, force) {
        var currentId = scope.id;
        var isBroken = scope.broken;
        var currentAnnotation = AnnotationsExchange.getAnnotationById(currentId);
        var expandedState = (force ? true : state.defaultExpanded);
        var template = TemplatesExchange.getTemplateById(currentAnnotation.hasTemplate);
        var currentColor;
        if (typeof(template) !== 'undefined') {
            currentColor = template.color;
        }

        if(typeof(state.annotations[currentId]) === 'undefined' || typeof(force) !== 'undefined'){
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
                broken: isBroken,
                expanded: expandedState,
                ghosted: false,
                color: currentColor,
                hasTemplate: template
            };
        }
    };

    $rootScope.$on('update-annotation-completed', function(e, annotationId) {
        annotationDetails.log('Update annotation');

        var targetAnnotation;
        var currentAnnotation;
        if(typeof(annotationId) !== 'undefined'){

            currentAnnotation = AnnotationsExchange.getAnnotationById(annotationId);
            targetAnnotation = {
                id: annotationId,
                broken: currentAnnotation.isBroken()
            }
            if(!AnnotationSidebar.isAnnotationSidebarExpanded()){
                AnnotationSidebar.toggle();
            }
            annotationDetails.closeAllAnnotationView(annotationId);
            annotationDetails.addAnnotationReference(targetAnnotation, true);
            
            // TODO: improve the update of the annotations in the sidebar
            $timeout(function(){
                var currentElement = angular.element('#'+annotationId);
                if (currentElement.length>0){
                    $('body').animate({scrollTop: currentElement.offset().top - Dashboard.getContainerHeight() - 30}, 'slow');
                }
            }, 100);  
  
        }
    });

    $rootScope.$watch(function() {
        return MyPundit.isUserLogged(); 
    }, function(newStatus) {
        state.isUserLogged = newStatus;
        state.userData = MyPundit.getUserData();
    });

    annotationDetails.log('Component running');
    return annotationDetails;
});