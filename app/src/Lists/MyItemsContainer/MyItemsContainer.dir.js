angular.module('Pundit2.MyItemsContainer')
    .directive('myItemsContainer', function() {
        return {
            restrict: 'E',
            scope: {
                
            },
            templateUrl: "src/Lists/MyItemsContainer/MyItemsContainer.dir.tmpl.html",
            controller: "MyItemsContainerCtrl"
        };
    });