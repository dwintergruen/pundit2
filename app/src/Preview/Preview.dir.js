angular.module('Pundit2.Preview')
    .directive('preview', function() {
        return {
            restrict: 'E',
            scope: {
                useInKorbo: '@'
            },
            templateUrl: "src/Preview/DashboardPreview.dir.tmpl.html",
            controller: 'PreviewCtrl'
        };
    });
