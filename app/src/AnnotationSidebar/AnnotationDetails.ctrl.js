/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationDetailsCtrl', function($scope, $element, AnnotationSidebar, AnnotationDetails, 
        AnnotationsExchange, AnnotationsCommunication, NotebookExchange, ItemsExchange,
        TextFragmentAnnotator, Toolbar, TypesHelper) {

    var currentId = $scope.id;
    var currentHeight = angular.element($element).find(".pnd-annotation-details").height();
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
        $scope.metaInfo = false;
        AnnotationDetails.toggleAnnotationView(currentId);
        if (!$scope.annotation.expanded){
            AnnotationSidebar.setAnnotationPosition(currentId, currentHeight)
        }
    };

    $scope.deleteAnnotation = function() {
        AnnotationsCommunication.deleteAnnotation($scope.annotation.id);
    };

    $scope.$watch(function() {
        return angular.element($element).find(".pnd-annotation-details-wrap").height();
    }, function(newHeight, oldHeight) {
        if (newHeight!=oldHeight && $scope.annotation.expanded){
            AnnotationSidebar.setAnnotationPosition(currentId, newHeight);
        }
    });

    $scope.$watch(function() {
        return AnnotationSidebar.isAnnotationSidebarExpanded();
    }, function(newState, oldState) {
        if (newState!=oldState){
            if(!AnnotationSidebar.isAnnotationSidebarExpanded()){
                AnnotationDetails.closeAllAnnotationView();
                AnnotationSidebar.setAnnotationPosition();
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
        var fragments = $scope.annotation.fragments;
        if(fragments.length > 0){
            for (var fragment in fragments){
                TextFragmentAnnotator.highlightById(fragments[fragment]);
            }
        }
    };

    $scope.mouseoutHandler = function() {
        var fragments = $scope.annotation.fragments;
        if(fragments.length > 0){
            for (var fragment in fragments){
                TextFragmentAnnotator.clearHighlightById(fragments[fragment]);
            }
        }
    };

    AnnotationDetails.log('Controller Details Run');
});