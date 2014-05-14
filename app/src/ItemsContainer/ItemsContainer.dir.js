angular.module('Pundit2.ItemsContainer')
    .directive('itemsContainer', function() {
        return {
            restrict: 'E',
            scope: { },
            controller: "ItemsContainerCtrl",
            templateUrl: "src/ItemsContainer/ItemsContainer.dir.tmpl.html",
            link: function(/* scope, el, attrs, ctrl */) {
                // Stuff to do on link? read some conf?

            }
        };
    });