angular.module('Pundit2.Preview')
    .controller('NotebookPreviewCtrl', function($scope, NotebookExchange, AnnotationsExchange) {

        $scope.$watch('id', function() {
            // TODO: special initialization for certain kind of items, like image fragments?
            $scope.notebook = NotebookExchange.getNotebookById($scope.id);
            //NotebookExchange.getAnnotationByNotebook($scope.notebook.id);
            var numAnnot = AnnotationsExchange.getAnnotationByNotebook($scope.notebook.id);
            if(typeof(numAnnot) === 'undefined' || numAnnot === null){
                $scope.numberOfAnnotations = 0;
            } else {
                $scope.numberOfAnnotations = numAnnot.length;
            }

            if(NotebookExchange.getCurrentNotebooks().id === $scope.notebook.id){
                $scope.isCurrent = true;
            } else {
                $scope.isCurrent = false;
            }


        });

    });