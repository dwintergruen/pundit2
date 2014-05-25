angular.module('Pundit2.Annomatic')
.controller('AnnomaticPanelCtrl', function($scope, Annomatic, $window) {

    // Get ready to use the service
    var gotAnnotations = false;
    $scope.getAnnotations = function() {
        if (gotAnnotations) { return; }
        gotAnnotations = true;
        Annomatic.getDataTXTAnnotations(annotationsRootNode);
    };
    $scope.startReview = function() {
        Annomatic.reviewNext(0);
    };
    
    $scope.Annomatic = Annomatic;
    
    $scope.$watch('filteredTypes', function(filtered, oldFiltered) {
        if (typeof(filtered) === "undefined" && typeof(oldFiltered) === "undefined") { return; }
        Annomatic.setTypeFilter(filtered);
    });


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