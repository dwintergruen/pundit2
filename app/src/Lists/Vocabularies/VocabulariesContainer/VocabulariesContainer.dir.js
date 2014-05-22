angular.module('Pundit2.Vocabularies')
    .directive('vocabulariesContainer', function() {
        return {
            restrict: 'E',
            scope: {
                
            },
            templateUrl: "src/Lists/Vocabularies/VocabulariesContainer/VocabulariesContainer.dir.tmpl.html",
            controller: "VocabulariesContainerCtrl"
        };
    });