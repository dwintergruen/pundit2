angular.module('Pundit2.Preview')
    .controller('ItemPreviewCtrl', function($scope, TypesHelper, ItemsExchange, Preview) {

        // get the label of a type from his uri
        $scope.getTypeLabel = function(uri) {
            return TypesHelper.getLabel(uri);
        };

        $scope.$watch('uri', function() {
            // TODO: special initialization for certain kind of items, like image fragments?
            $scope.item = ItemsExchange.getItemByUri($scope.uri);
        });

        $scope.showAlltypes = function() {
            var h = Preview.getheigthTypesDiv();
            var div = angular.element('div.pnd-preview-item-types');
            var divHeight = angular.element('div.pnd-preview-item-types').height();
            if(divHeight === h){
                div.css({
                    'height' : 'auto'
                });
            } else {
                div.css({
                    'height' : h
                });
            }

        }

    });