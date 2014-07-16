angular.module('Pundit2.Annotators')
.directive('imageFragmentIcon', function() {
    return {
        restrict: 'E',
        scope: {
            uri: '@'
        },
        templateUrl: 'src/Annotators/imageFragmentIcon.dir.tmpl.html',
        replace: true,
        link: function(scope, element /*, attrs */) {

            scope.clickHandler = function(evt) {
                console.log('********* clicked ********');
            };

        } // link()
    };
});