angular.module('Pundit2.PageItemsContainer')
    .directive('pageItemsContainer', function() {
        return {
            restrict: 'E',
            scope: {
                
            },
            templateUrl: "src/PageItemsContainer/PageItemsContainer.dir.tmpl.html",
            controller: "PageItemsContainerCtrl"
        };
    });