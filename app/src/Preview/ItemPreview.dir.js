angular.module('Pundit2.Preview')
    .directive('itemPreview', function() {
        return {
            restrict: 'E',
            scope: {
                uri: '@'
            },
            templateUrl: "src/Preview/ItemPreview.dir.tmpl.html",
            controller: 'ItemPreviewCtrl',
            require: '^preview',
            link: function(scope, elem, attrs, controllerInstance) {
                scope.previewCtrl = controllerInstance;

                // add previewItem scope to parent directive
                controllerInstance.addScope(scope);

            }
        };
    });
