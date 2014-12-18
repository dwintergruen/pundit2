angular.module('Pundit2.MyItemsContainer')
    .directive('myItemsContainer', function() {
        return {
            restrict: 'E',
            scope: {
                hierarchystring: '@'
            },
            templateUrl: "src/Lists/MyItemsContainer/MyItemsContainer.dir.tmpl.html",
            controller: "MyItemsContainerCtrl"
        };
    });