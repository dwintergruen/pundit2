/*jshint strict: false*/

angular.module('Pundit2.AnnotationSidebar')
.controller('AnnotationDetailsCtrl', function($scope, AnnotationSidebar, AnnotationDetails, 
        AnnotationsExchange, Notebook, ItemsExchange, Toolbar, TypesHelper) {

    var currentId = $scope.id;
    AnnotationDetails.addAnnotationReference($scope);

    $scope.annotation = AnnotationDetails.getAnnotationDetails(currentId);
    if (AnnotationDetails.isUserToolShowed($scope.annotation.creator)){
        $scope.askLink = Toolbar.options.askLinkDefault + '#/myNotebooks/';    
    } else {
        $scope.askLink = Toolbar.options.askLinkDefault + '#/notebooks/';    
    }

    var notebookId = $scope.annotation.notebookId;
    var notebookRef = new Notebook(notebookId);
    notebookRef.then(function(nb) {
        $scope.notebookName = nb.label;
    }, function(message) {
        $scope.notebookName = "Failed to load notebook: "+message;
    });

    $scope.toggleAnnotation = function(){
        $scope.metaInfo = false;
        AnnotationDetails.toggleAnnotationView(currentId);
    };

    $scope.isUserToolShowed = function() {
        return AnnotationDetails.isUserToolShowed($scope.annotation.creator);
    };

    AnnotationDetails.log('Controller Details Run');
});