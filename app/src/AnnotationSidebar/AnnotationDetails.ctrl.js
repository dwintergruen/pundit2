/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationDetailsCtrl', function($scope, $rootScope, $element, $modal, $timeout,
        AnnotationSidebar, AnnotationDetails, AnnotationsExchange, AnnotationsCommunication,
        NotebookExchange, ItemsExchange, TripleComposer, Dashboard, ImageAnnotator,
        TextFragmentAnnotator, Toolbar, TypesHelper, MyPundit) {

    var currentId = $scope.id;
    var currentElement = angular.element($element).find(".pnd-annotation-details-wrap");
    var initialHeight = AnnotationSidebar.options.annotationHeigth;
    AnnotationDetails.addAnnotationReference($scope);

    $scope.annotation = AnnotationDetails.getAnnotationDetails(currentId);
    if (AnnotationDetails.isUserToolShowed($scope.annotation.creator)){
        $scope.askLink = Toolbar.options.askLinkDefault + '#/myNotebooks/';    
    } else {
        $scope.askLink = Toolbar.options.askLinkDefault + '#/notebooks/';    
    }

    var notebookId = $scope.annotation.notebookId;

    $scope.notebookName = 'Downloading notebook in progress'
    var cancelWatchNotebookName = $scope.$watch(function() {
        return NotebookExchange.getNotebookById(notebookId);;
    }, function(nb) {
        if (typeof(nb) !== 'undefined') {
            $scope.notebookName = nb.label;
            cancelWatchNotebookName();
        }
    });

    $scope.toggleAnnotation = function(){
        if(!AnnotationSidebar.isAnnotationSidebarExpanded()){
            AnnotationSidebar.toggle();
        }
        // if(AnnotationDetails.isAnnotationGhosted(currentId)){
        //     AnnotationDetails.closeViewAndReset();
        // }
        $scope.metaInfo = false;
        AnnotationDetails.toggleAnnotationView(currentId);
        if (!$scope.annotation.expanded){
            AnnotationSidebar.setAllPosition(currentId, initialHeight);
        }
    };

    // confirm modal
    var modalScope = $rootScope.$new();
    modalScope.titleMessage = "Delete Annotation"

    // confirm btn click
    modalScope.confirm = function() {
        if (MyPundit.isUserLogged()) {
            currentElement.addClass('pnd-annotation-details-delete-in-progress');
            AnnotationsCommunication.deleteAnnotation($scope.annotation.id).then(function(){
                modalScope.notifyMessage = "Your annotation has been deleted successfully";
            }, function(){
                currentElement.removeClass('pnd-annotation-details-delete-in-progress');
                modalScope.notifyMessage = "Impossible to delete the annotation. Please reatry later.";
            });
        }
        $timeout(function(){
            confirmModal.hide();
        }, 1000);
    };

    // cancel btn click
    modalScope.cancel = function() {
        confirmModal.hide();
    };

    var confirmModal = $modal({
        container: "[data-ng-app='Pundit2']",
        template: 'src/Core/confirm.modal.tmpl.html',
        show: false,
        backdrop: 'static',
        scope: modalScope
    });

    // open modal
    var openConfirmModal = function(){
        // promise is needed to open modal when template is ready
        modalScope.notifyMessage = "Are you sure you want to delete this annotation? After you can no longer recover.";
        confirmModal.$promise.then(confirmModal.show);
    };

    $scope.deleteAnnotation = function() {
        openConfirmModal();
    };

    $scope.showEdit = function() {
        return typeof($scope.annotation.hasTemplate) === 'undefined';
    };

    $scope.editAnnotation = function() {
        TripleComposer.editAnnotation($scope.annotation.id);
        if(!Dashboard.isDashboardVisible()){
            Dashboard.toggle();
        }
        $rootScope.$emit('pnd-dashboard-show-tab', TripleComposer.options.clientDashboardTabTitle);
    };

    $scope.$watch(function() {
        return currentElement.height();
    }, function(newHeight, oldHeight) {
        if (newHeight!=oldHeight && $scope.annotation.expanded){
            AnnotationSidebar.setAllPosition(currentId, newHeight);
        }
    });

    $scope.$watch(function() {
        return AnnotationSidebar.isAnnotationSidebarExpanded();
    }, function(newState, oldState) {
        if (newState!=oldState){
            if(!AnnotationSidebar.isAnnotationSidebarExpanded()){
                AnnotationDetails.closeViewAndReset();
                AnnotationSidebar.setAllPosition();
            }
        }
    });

    $scope.toggleObjectInfo = function(type, value){
        if(type !== 'uri'){
            return value;
        } else {
            return !value;
        }
    };

    $scope.isUserToolShowed = function() {
        return AnnotationDetails.isUserToolShowed($scope.annotation.creator);
    };

    $scope.mouseoverHandler = function() {
        var currentItem;
        var items = $scope.annotation.itemsUriArray;
        for (var index in items){
            currentItem = ItemsExchange.getItemByUri(items[index]);
            if (typeof(currentItem) !== 'undefined'){
                if (currentItem.isTextFragment()) {
                    TextFragmentAnnotator.highlightByUri(items[index]);
                } else if (currentItem.isImageFragment()) {
                    //ImageFragmentAnnotator.highlightByUri(items[index]);
                } else if (currentItem.isImage()) {
                    ImageAnnotator.highlightByUri(items[index]);
                }
            }
        }
    };

    $scope.mouseoutHandler = function() {
        var currentItem;
        var items = $scope.annotation.itemsUriArray;
        for (var index in items){
            currentItem = ItemsExchange.getItemByUri(items[index]);
            if (typeof(currentItem) !== 'undefined'){
                if (currentItem.isTextFragment()) {
                    TextFragmentAnnotator.clearHighlightByUri(items[index]);
                } else if (currentItem.isImageFragment()) {
                    //ImageFragmentAnnotator.clearHighlightByUri(items[index]);
                } else if (currentItem.isImage()) {
                    ImageAnnotator.clearHighlightByUri(items[index]);
                }
            }
        }
    };

    $scope.mouseoverItemHandler = function(itemUri) {
        var currentItem = ItemsExchange.getItemByUri(itemUri);
        if (typeof(currentItem) !== 'undefined'){
            if (currentItem.isTextFragment()) {
                TextFragmentAnnotator.highlightByUri(itemUri);
            } else if (currentItem.isImageFragment()) {
                //ImageFragmentAnnotator.highlightByUri(itemUri);
            } else if (currentItem.isImage()) {
                ImageAnnotator.highlightByUri(itemUri);
            }
        }
    };

    $scope.mouseoutItemHandler = function(itemUri) {
        var currentItem = ItemsExchange.getItemByUri(itemUri);
        if(typeof(currentItem) !== 'undefined'){
            if (currentItem.isTextFragment()) {
                TextFragmentAnnotator.clearHighlightByUri(itemUri);
            } else if (currentItem.isImageFragment()) {
                //ImageFragmentAnnotator.clearHighlightByUri(itemUri);
            } else if (currentItem.isImage()) {
                ImageAnnotator.clearHighlightByUri(itemUri);
            }
        }
    };

    AnnotationDetails.log('Controller Details Run');
});