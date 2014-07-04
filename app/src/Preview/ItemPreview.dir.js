angular.module('Pundit2.Preview')
    .directive('itemPreview', function() {
        return {
            restrict: 'E',
            scope: {
                uri: '@',
                sticking: '=sticking'
            },
            templateUrl: "src/Preview/ItemPreview.dir.tmpl.html",
            controller: 'ItemPreviewCtrl'
        };
    });
