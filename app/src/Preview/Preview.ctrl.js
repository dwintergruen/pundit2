angular.module('Pundit2.Preview')
    .controller('PreviewCtrl', function($scope, Preview, TypesHelper, Utils) {

        $scope.itemDashboardPreview = {};
        //$scope.hasImage = false;

        $scope.$watch(function() { return Preview.getDashboardPreview() }, function(newItem) {
            $scope.itemDashboardPreview = newItem;
            $scope.hasImage = typeof(newItem.image) !== 'undefined' && newItem.image !== '';
            $scope.itemIsAnImage = checkIfItemIsImage(newItem);

        });

        var checkIfItemIsImage = function(item) {
            if(typeof(item) !== 'undefined' && typeof(item.type) !== 'undefined' ){
                for(var i = 0; i < item.type.length; i++){
                    if(Utils.getLabelFromURI(item.type[i]) === 'Fragment-image'){
                        return true;
                    }
                    //console.log(Utils.getLabelFromURI(item.type[i]));
                }

                return false;
            }

        };

        $scope.getLabelType = function(uri) {
            return TypesHelper.getLabel(uri);
        }
    });
