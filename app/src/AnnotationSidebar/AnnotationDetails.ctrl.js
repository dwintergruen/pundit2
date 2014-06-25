/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationDetailsCtrl', function($scope, AnnotationSidebar, AnnotationDetails, 
        AnnotationsExchange, NotebookExchange, ItemsExchange, TextFragmentAnnotator, Toolbar, TypesHelper) {

    var currentId = $scope.id;
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
        $scope.metaInfo = false;
        AnnotationDetails.toggleAnnotationView(currentId);
    };

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