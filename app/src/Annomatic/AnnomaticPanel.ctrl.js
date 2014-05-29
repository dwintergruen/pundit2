angular.module('Pundit2.Annomatic')
.controller('AnnomaticPanelCtrl', function($scope, Annomatic, Consolidation, ItemsExchange,
                                           TextFragmentAnnotator, XpointersHelper,
                                           $window, $q) {

    $scope.targets = TextFragmentAnnotator.getAvailableTargets(true);

    var gotAnnotations = false;
    $scope.getSuggestions = function() {

        if (gotAnnotations) { return; }
        gotAnnotations = true;

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
            promises.push(Annomatic.getDataTXTAnnotations(nodes[n]));
        }
        // TODO: if one the aggregated promises gets rejected ... all of them gets rejected :|
        // we can put the consolidation in in the rejected function too, maybe, not in the
        // finally(), since it only gets called if all of them are resolved.
        $q.all(promises).then(function() {
            Consolidation.consolidate(ItemsExchange.getItemsByContainer(Annomatic.options.container));
        });
    };

    $scope.startReview = function() {
        Annomatic.reviewNext(0);
    };
    
    $scope.Annomatic = Annomatic;

    // Watching changes on the select
    $scope.$watch('filteredTypes', function(filtered, oldFiltered) {
        if (typeof(filtered) === "undefined" && typeof(oldFiltered) === "undefined") { return; }
        Annomatic.setTypeFilter(filtered);
    }, true);

    var annotationsRootNode = angular.element('div.panel-body');

    var getSelectedRange = function() {
        var range;
        
        if ($window.getSelection().rangeCount === 0) {
            // console.log('Range count 0!');
            return null;
        }

        range = $window.getSelection().getRangeAt(0);

        // If the selected range is empty (this happens when the user clicks on something)...
        if  (range !== null && (range.startContainer === range.endContainer) && (range.startOffset === range.endOffset)) {
            // console.log("Range is not null, but start/end containers and offsets match: no selected range.");
            return null;
        }

        return range;

    }; // getSelectedRange()
    
    var ancestor;
    angular.element('body').on('mousedown', function() {

        angular.element('body').on('mousemove', function() {
            var r = getSelectedRange();
            if (r && r.commonAncestorContainer !== ancestor) {
                if (ancestor) {
                    angular.element(ancestor).removeClass('selecting-ancestor');
                }
                ancestor = r.commonAncestorContainer;
                
                if (ancestor.nodeType === Node.TEXT_NODE) {
                    ancestor = ancestor.parentNode;
                }
                angular.element(ancestor).addClass('selecting-ancestor');
            }
        });
    });

    angular.element('body').on('mouseup', function() {
        angular.element('body').off('mousemove');
        
        if (ancestor) {
            angular.element(ancestor).removeClass('selecting-ancestor');
            annotationsRootNode = angular.element(ancestor);
            $scope.getAnnotations();
        }
    });

});