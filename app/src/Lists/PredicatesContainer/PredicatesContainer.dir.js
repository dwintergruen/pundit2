angular.module('Pundit2.PredicatesContainer')

.directive('predicatesContainer', function() {
    return {
        restrict: 'E',
        scope: {

        },
        templateUrl: "src/Lists/PredicatesContainer/PredicatesContainer.dir.tmpl.html",
        controller: "PredicatesContainerCtrl"
    };
});