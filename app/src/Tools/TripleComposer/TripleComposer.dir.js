angular.module('Pundit2.TripleComposer')
.directive('tripleComposer', function() {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: "src/Tools/TripleComposer/TripleComposer.dir.tmpl.html",
        controller: "TripleComposerCtrl"
    };
});