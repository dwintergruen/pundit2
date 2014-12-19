angular.module('Pundit2.VocabulariesContainer')

.directive('vocabulariesContainer', function() {
    return {
        restrict: 'E',
        scope: {

        },
        templateUrl: "src/Lists/VocabulariesContainer/VocabulariesContainer.dir.tmpl.html",
        controller: "VocabulariesContainerCtrl"
    };
});