angular.module('Pundit2.Preview')
    .directive('itemPreview', function() {
        return {
            restrict: 'E',
            scope: {
                uri: '@'
            },
            templateUrl: "src/Preview/ItemPreview.dir.tmpl.html",
            controller: 'ItemPreviewCtrl',

              link: function postLink(scope, elem, attrs) {
                  scope.a = angular.element(elem).find('li.pnd-preview-single-type');
              }

        };
    });
