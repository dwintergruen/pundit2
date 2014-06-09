angular.module('Pundit2.Preview')
.controller('PreviewCtrl', function($scope, Preview, TypesHelper, $window, $element) {

    $scope.itemDashboardPreview = null;


        $scope.$watch('itemDashboardPreview', function() {

            // get <li> elements
            var liList = angular.element($element).find('li.pnd-preview-single-type');
            // get height (with margin) of single <li> element
            var heightLiSingle = angular.element(liList[0]).outerHeight(true);
            var div = angular.element('div.pnd-preview-item-types');
            div.css({
                'height' : 40
            });
            Preview.setheigthTypesDiv(40);
        });

    // check where a new item is selected to get a preview
    $scope.$watch(function() { return Preview.getItemDashboardPreview(); }, function(newItem) {

        $scope.itemDashboardPreview = newItem;
        // check if item has an image to show
        if(newItem === null) {
            $scope.hasImage = false;
            $scope.itemIsAnImage = false;

        } else {

            $scope.hasImage = (typeof(newItem.image) !== 'undefined');
            $scope.itemIsAnImage = $scope.itemDashboardPreview.isImage() || $scope.itemDashboardPreview.isImageFragment();

        }
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
        //var labelType = TypesHelper.getLabel(uri);
        return TypesHelper.getLabel(uri);
    };

    // open item url in a new window when click on More Info button in a preview
    $scope.openUrl = function(url) {
        $window.open(url);
    };

    $scope.getItemIcon = function() {
        if (!$scope.isItemEmpty()){
            return $scope.itemDashboardPreview.getIcon();
        }
    };

    $scope.getItemClass = function() {
        if (!$scope.isItemEmpty()){
            return $scope.itemDashboardPreview.getClass();
        }
    };
//console.log((angular.element.find('.pnd-preview-item-types-ul')).css('width'));


});