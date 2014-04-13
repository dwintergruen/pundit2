angular.module('Pundit2.Annomatic')
.controller('AnnotationPopoverCtrl', function($scope, Annotate) {

    // Using popover's content variable to pass the number of the 
    // annotation
    $scope.num = parseInt($scope.content, 10);
    $scope.ann = Annotate.ann;
    
    $scope.instances = $scope.ann.byId[$scope.ann.byNum[$scope.num].id].length;

    $scope.setOk = function(num) {
        num = parseInt(num, 10);
        $scope.$hide();
        Annotate.setState(num, 'accepted');
        Annotate.reviewNext(num+1);
    };
    
    $scope.setKo = function(num) {
        num = parseInt(num, 10);
        $scope.$hide();
        Annotate.setState(num, 'removed');
        Annotate.reviewNext(num+1);
    };
    
    $scope.goNext = function(num) {
        num = parseInt(num, 10);
        $scope.$hide();
        Annotate.setLastState(num);
        Annotate.reviewNext(num+1);
    };
    
    $scope.acceptAll = function(num) {
        num = parseInt(num, 10);
        
        var id = $scope.ann.byNum[num].id,
            similar = $scope.ann.byId[id];

        for (var i=similar.length; i--;) {
            Annotate.setState(similar[i], 'accepted');
        }
        
        $scope.$hide();
        Annotate.reviewNext(num+1);
    };
    
    $scope.toggleSimilar = function(num) {
        num = parseInt(num, 10);
        
        var ann = $scope.ann.byNum[num],
            id = ann.id,
            similar = $scope.ann.byId[id];
            
        // Skipping num so we dont toggle the state of the current
        // automatic annotation
        for (var i=similar.length; i--;) {
            if (similar[i] !== num) {
                var similarAnn = Annotate.ann.byNum[similar[i]];
                if (similarAnn.state !== "active") {
                    Annotate.setState(similar[i], 'active');
                } else {
                    Annotate.setLastState(similar[i]);
                }
            }
        }
        
    };

});