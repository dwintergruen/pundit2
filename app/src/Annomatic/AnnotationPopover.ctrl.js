angular.module('Pundit2.Annomatic')
.controller('AnnotationPopoverCtrl', function($scope, Annomatic) {

    // Using popover's content variable to pass the number of the 
    // annotation
    $scope.num = parseInt($scope.content, 10);
    $scope.ann = Annomatic.ann;
    
    $scope.instances = $scope.ann.byId[$scope.ann.byNum[$scope.num].id].length;

    $scope.setOk = function(num) {
        num = parseInt(num, 10);
        $scope.$hide();
        Annomatic.setState(num, 'accepted');
        Annomatic.reviewNext(num+1);
    };
    
    $scope.setKo = function(num) {
        num = parseInt(num, 10);
        $scope.$hide();
        Annomatic.setState(num, 'removed');
        Annomatic.reviewNext(num+1);
    };
    
    $scope.goNext = function(num) {
        num = parseInt(num, 10);
        $scope.$hide();
        Annomatic.setLastState(num);
        Annomatic.reviewNext(num+1);
    };
    
    $scope.acceptAll = function(num) {
        num = parseInt(num, 10);
        
        var id = $scope.ann.byNum[num].id,
            similar = $scope.ann.byId[id];

        for (var i=similar.length; i--;) {
            Annomatic.setState(similar[i], 'accepted');
        }
        
        $scope.$hide();
        Annomatic.reviewNext(num+1);
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
                var similarAnn = Annomatic.ann.byNum[similar[i]];
                if (similarAnn.state !== "active") {
                    Annomatic.setState(similar[i], 'active');
                } else {
                    Annomatic.setLastState(similar[i]);
                }
            }
        }
        
    };

});