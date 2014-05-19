angular.module('Pundit2.MyItemsContainer')
    .directive('myItemsContainer', function() {
        return {
            restrict: 'E',
            scope: {
                
            },
            templateUrl: "src/MyItemsContainer/MyItemsContainer.dir.tmpl.html",
            controller: "MyItemsContainerCtrl"
        };
    });