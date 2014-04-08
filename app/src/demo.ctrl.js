angular.module('Pundit2')
.controller('DemoCtrl', function($scope, DataTXTResource, Annotate) {

    // Get ready to use the service
    var gotAnnotations = false;
    $scope.getAnnotations = function() {
        if (gotAnnotations) return;
        gotAnnotations = true;
        Annotate.getDataTXTAnnotations(angular.element('div.panel-body'));
    };
    $scope.startReview = function() {
        Annotate.reviewNext(0);
    };
    $scope.Annotate = Annotate;
    
});