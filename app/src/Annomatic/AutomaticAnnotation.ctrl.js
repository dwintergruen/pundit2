angular.module('Pundit2.Annomatic')
.controller('AutomaticAnnotationCtrl', function($scope, $popover, Annomatic, $timeout) {

    $scope.$watch('num', function(num, oldValue) {
        if (typeof(num) === "undefined" && typeof(oldValue) === "undefined") {
            return;
        }
        
        // As soon as num is injected in the controller, we create the popover
        // for this annotation. 
        // Passing content as a string or 0 will result in an error :\
        $scope.popover = $popover(
            angular.element('.ann-'+$scope.num),
            {
                content: ""+$scope.num,
                template: 'src/Annomatic/AnnotationPopover.tmpl.html',
                trigger: 'manual'
            }
        );
        
        Annomatic.ann.autoAnnScopes[num] = $scope;
    });

    // stateClass is read by the template and written by the Annomatic service
    $scope.stateClass = 'ann-waiting';

    $scope.show = function() {
        if ($scope.popover.$isShown === true) { return; }
        Annomatic.closeAll();
        Annomatic.setState($scope.num, 'active');
        $timeout($scope.popover.show, 1);
    };
    
    $scope.hide = function() {
        if ($scope.popover.$isShown === false) {
            return;
        }
        Annomatic.setLastState($scope.num);
        $timeout($scope.popover.hide, 1);
    };

    $scope.handleSuggestionClick = function() {

        if (Annomatic.ann.byNum[$scope.num].hidden) { return; }

        // TODO: can we decide the popover position at run time?
        // like if the annotation is too close to left/right margins
        // just open it on right/left, else top. Same for top/bottom
        if (!$scope.popover.$isShown) {
            $scope.show();
        } else {
            $scope.hide();
        }
    };

});