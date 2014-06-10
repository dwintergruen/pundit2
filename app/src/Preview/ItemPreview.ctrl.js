angular.module('Pundit2.Preview')
    .controller('ItemPreviewCtrl', function($scope, TypesHelper, ItemsExchange) {

        // get the label of a type from his uri
        $scope.getTypeLabel = function(uri) {
            return TypesHelper.getLabel(uri);
        };


        $scope.$watch('uri', function() {
            // TODO: special initialization for certain kind of items, like image fragments?
            $scope.item = ItemsExchange.getItemByUri($scope.uri);
        });

        $scope.typeHidden = true;

        $scope.showAlltypes = function() {
            // get div where types list is shown
            var div = angular.element('div.pnd-preview-item-types');

            // get current height of div where types list is shown
            var divHeight = angular.element('div.pnd-preview-item-types').height();

            // toggle types visibility

            // set height to auto to show all types
            // and set flag typeHidden to show right caret icon
            if(divHeight === $scope.heigthTypesDiv){
                $scope.typeHidden = false;
                div.css({
                    'height' : 'auto'
                });
            } else {
                // set height to fixed height, in this way show only few types
                // and set flag typeHidden to show right caret icon
                $scope.typeHidden = true;
                div.css({
                    'height' : $scope.heigthTypesDiv
                });
            }
        };

    });