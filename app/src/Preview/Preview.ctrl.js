angular.module('Pundit2.Preview')
    .controller('PreviewCtrl', function($scope, Preview, TypesHelper, Utils, NameSpace) {

        $scope.itemDashboardPreview = "";

		// check where a new item is selected to get a preview
        $scope.$watch(function() { return Preview.getItemDashboardPreview(); }, function(newItem) {
            $scope.itemDashboardPreview = newItem;

            // check if item has an image to show
			$scope.hasImage = typeof(newItem.image) !== 'undefined' && newItem.image !== '';

	        // true is item is an image
			$scope.itemIsAnImage = checkIfItemIsImage(newItem);

        });

		// return true if dashboard preview is empty
        $scope.isItemEmpty = function() {
            return $scope.itemDashboardPreview === "";
        };

		// return true if no item is sticky
		$scope.isStickyItemEmpty = function() {
			return  Preview.getItemDashboardSticky() === "";
		};

		// return true if current item in preview panel is the sticky item
		$scope.isStickyItem = function() {
			var stickyItem = Preview.getItemDashboardSticky();
			if( typeof(stickyItem) === 'undefined' || typeof($scope.itemDashboardPreview) === 'undefined') {
				return false;
			} else {
				return stickyItem.uri === $scope.itemDashboardPreview.uri;
			}
		};

		$scope.clearSticky = function() {
			Preview.clearItemDashboardSticky();
		};

		// check if item is an image or not
		// return true if is an image, false otherwise
        var checkIfItemIsImage = function(item) {
            if(typeof(item) !== 'undefined' && typeof(item.type) !== 'undefined' ) {

				// for each type, check if is an image-type
                for(var i = 0; i < item.type.length; i++){

                    if(TypesHelper.getLabel(item.type[i]) === NameSpace.types.image || TypesHelper.getLabel(item.type[i]) === NameSpace.fragments.imagePart) {
                        return true;
                    }
                }
                return false;
            }

        };

		// get label of a type from his uri
        $scope.getLabelType = function(uri) {
            return TypesHelper.getLabel(uri);
        };
    });
