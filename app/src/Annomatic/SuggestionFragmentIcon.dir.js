angular.module('Pundit2.Annomatic')

.directive('suggestionFragmentIcon', function() {
    return {
        restrict: 'E',
        scope: {
            fragment: '@'
        },
        templateUrl: 'src/Annomatic/SuggestionFragmentIcon.dir.tmpl.html',
        replace: true,
        controller: "SuggestionFragmentIconCtrl",
        link: function(scope, element) {} // link()
    };
});