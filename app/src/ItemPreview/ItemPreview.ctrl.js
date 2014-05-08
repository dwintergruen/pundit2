angular.module('Pundit2.ItemPreview')
    .controller('ItemPreviewCtrl', function($scope, ItemPreview, TypesHelper) {

        $scope.itemToPreview = {};
        //$scope.hasImage = false;

        $scope.$watch(function() { return ItemPreview.getDashboardPreview() }, function(newItem) {
            $scope.itemToPreview = newItem;
            $scope.hasImage = typeof(newItem.image) !== 'undefined' && newItem.image !== '';
        });

        $scope.getLabelType = function(uri) {
            return TypesHelper.getLabel(uri);
        }
    });
