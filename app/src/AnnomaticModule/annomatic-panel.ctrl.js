angular.module('Pundit2.AnnomaticModule')
.controller('AnnomaticPanelCtrl', function($scope, Annotate) {

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
    
    $scope.$watch('filteredTypes', function(filtered, oldFiltered) {
        if (typeof(filtered) === "undefined" && typeof(oldFiltered) === "undefined") return;
        Annotate.setTypeFilter(filtered);
    });

});