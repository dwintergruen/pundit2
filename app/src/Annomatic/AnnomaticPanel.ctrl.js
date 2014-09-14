angular.module('Pundit2.Annomatic')
.controller('AnnomaticPanelCtrl', function($scope, Annomatic, Consolidation, ItemsExchange,
                                           TextFragmentAnnotator, XpointersHelper, AnnotationSidebar,
                                           $window, $q) {

    $scope.targets = Consolidation.getAvailableTargets(true);
    $scope.gotAnnotations = false;

    $scope.getSuggestions = function() {

        if ($scope.gotAnnotations){ 
            return; 
        }
        $scope.gotAnnotations = true;
        Annomatic.hardReset();
        AnnotationSidebar.toggleLoading();

        var nodes = [],
            namedClasses = XpointersHelper.options.namedContentClasses,
            selectors = [];

        for (var len=$scope.targets.length; len--;) {
            selectors.push("[about='"+$scope.targets[len]+"']");
        }
        selectors.join(',');
        angular.forEach(angular.element(selectors.join(',')), function(node){
            for (var l=namedClasses.length; l--;) {
                if (angular.element(node).hasClass(namedClasses[l])) {
                    nodes.push(node);
                    break;
                }
            }
        });

        Annomatic.log('Asking for annotations on '+nodes.length+' nodes: ', nodes);

        var promises = [];
        for (var n=nodes.length; n--;) {
            promises.push(Annomatic.getAnnotations(nodes[n]));
        }
        $q.all(promises).then(function() {
            // TOOD: add loading check
            AnnotationSidebar.toggleLoading();
            Consolidation.consolidate(ItemsExchange.getItemsByContainer(Annomatic.options.container));
        });
    };

    $scope.getSuggestionsArea = function(){
        Annomatic.getAnnotationByArea();
    }

    $scope.startReview = function() {
        Annomatic.reviewNext(0);
    };

    $scope.saveReview = function() {
        Annomatic.saveAll();
    };
    
    $scope.Annomatic = Annomatic;

    $scope.$watch(function() {
        return Annomatic.ann.savedById;
    }, function(annotationsList) {
        $scope.annotations = annotationsList;
    });

    // Watching changes on the select
    $scope.$watch('filteredTypes', function(filtered, oldFiltered) {
        if (typeof(filtered) === "undefined" && typeof(oldFiltered) === "undefined") { return; }
        Annomatic.setTypeFilter(filtered);
    }, true);

    // var annotationsRootNode = angular.element('div.panel-body');

});