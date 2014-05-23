angular.module('Pundit2.Preview')
    .directive('preview', function() {
        return {
            restrict: 'E',
            scope: { },
            templateUrl: "src/Preview/DashboardPreview.dir.tmpl.html",
            controller: 'PreviewCtrl'
        };
    });
