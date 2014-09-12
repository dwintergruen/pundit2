angular.module('Pundit2.Annomatic')
.controller('AnnomaticPopoverCtrl', function($rootScope, $scope, Annomatic) {

    // Using popover's content variable to pass the number of the 
    // annotation
    $scope.num = parseInt($scope.content, 10);
    $scope.ann = Annomatic.ann;

    // Automatically open the details on popover open?
    $scope.showDetails = true;

    // Number of times this same suggestion occurs among all the suggestions.
    // Will be used to show the button to accept all of them at once
    $scope.instances = $scope.ann.byId[$scope.ann.byNum[$scope.num].id].length;

    $scope.hide = function() {
        $scope.$hide();
        Annomatic.setLastState($scope.num);
    };

    $scope.setOk = function() {
        $scope.$hide();

        if($scope.ann.savedByNum.indexOf($scope.num) === -1){
            Annomatic.save($scope.num);
        } else{
            Annomatic.setState($scope.num, 'accepted');
        }
    };
    
    $scope.setKo = function() {
        $scope.$hide();
        Annomatic.setState($scope.num, 'removed');
        Annomatic.reviewNext($scope.num + 1);
    };
    
    $scope.goNext = function() {
        $scope.$hide();
        Annomatic.setLastState($scope.num);
        Annomatic.reviewNext($scope.num + 1);
    };

    // $scope.goPrev = function() {
    //     $scope.$hide();
    //     Annomatic.setLastState($scope.num);
    //     Annomatic.reviewNext($scope.num - 1);  
    // };
    
    // $scope.acceptAll = function() {
    //     // TODO move this in service
    //     var id = $scope.ann.byNum[$scope.num].id,
    //         similar = $scope.ann.byId[id];

    //     for (var i=similar.length; i--;) {
    //         if($scope.ann.savedByNum.indexOf(similar[i]) === -1){
    //             Annomatic.save(similar[i]);
    //         } else{
    //             Annomatic.setState($scope.num, 'accepted');
    //         }
    //         // Annomatic.setState(similar[i], 'accepted');
    //     }
        
    //     $scope.$hide();
    //     // Annomatic.reviewNext($scope.num + 1);
    // };
    
    $scope.toggleSimilar = function() {
        var ann = $scope.ann.byNum[$scope.num],
            id = ann.id,
            similar = $scope.ann.byId[id];
            
        // Skipping num so we dont toggle the state of the current
        // automatic annotation
        for (var i=similar.length; i--;) {
            if (similar[i] !== $scope.num) {
                var similarAnn = Annomatic.ann.byNum[similar[i]];
                if (similarAnn.state !== "active") {
                    Annomatic.setState(similar[i], 'active');
                } else {
                    Annomatic.setLastState(similar[i]);
                }
            }
        }
        
    };

    $rootScope.$on('suggestions-mode-closed', function() {
        $scope.$hide();
    });

});