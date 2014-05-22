angular.module('Pundit2.Preview')
.controller('PreviewCtrl', function($scope, Preview, TypesHelper, $window) {

    $scope.itemDashboardPreview = null;

    // check where a new item is selected to get a preview
    $scope.$watch(function() { return Preview.getItemDashboardPreview(); }, function(newItem) {
        $scope.itemDashboardPreview = newItem;

        // check if item has an image to show
        if(newItem === null) {
            $scope.hasImage = false;
        } else {
            $scope.hasImage = (typeof(newItem.image) !== 'undefined');
        }

        // true is item is an image
        $scope.itemIsAnImage = Preview.isItemDashboardAnImage();

    });

    $scope.getWelcomeHeaderMessage = function() {
      return Preview.getWelcomeHeaderMessage();
    };

    $scope.getWelcomeBodyMessage = function() {
        return Preview.getWelcomeBodyMessage();
    };

    // return true if dashboard preview is empty
    $scope.isItemEmpty = function() {
        return $scope.itemDashboardPreview === null;
    };

    // return true if no item is sticky
    $scope.isStickyItemEmpty = function() {
        return  Preview.getItemDashboardSticky() === null;
    };

    // return true if current item in preview panel is the sticky item
    $scope.isStickyItem = function() {
        return Preview.isStickyItem();
    };

    $scope.clearSticky = function() {
        Preview.clearItemDashboardSticky();
    };

    // get label of a type from his uri
    $scope.getLabelType = function(uri) {
        return TypesHelper.getLabel(uri);
    };

    // open item url in a new window when click on More Info button in a preview
    $scope.openUrl = function(url){
        $window.open(url);
    };
});
