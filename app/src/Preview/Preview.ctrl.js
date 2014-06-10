angular.module('Pundit2.Preview')
.controller('PreviewCtrl', function($scope, Preview, TypesHelper, $window, $element) {

    $scope.itemDashboardPreview = null;


    $scope.$watch('itemDashboardPreview', function() {

        // get <li> elements
        var liList = angular.element($element).find('li.pnd-preview-single-type');

        var luWidth = parseInt(angular.element('.pnd-preview-item-types-ul').css('width'), 10);

        // get height (with margin) of single <li> element
        var heightLiSingle = angular.element(liList[0]).outerHeight(true);

        // check if there are types to hide or are all visibile
        checkFitTypes(liList, luWidth);

        // get div where types are shown
        var divTypes = angular.element('div.pnd-preview-item-types');

        // get padding div below type. It need to calculate the right height for div where types are shown
        var divPrev = parseInt(angular.element('.pnd-preview-item-image').css('padding-top'), 10);

        // set div types height
        var h = heightLiSingle + divPrev;
        divTypes.css({
            'height' : h
        });
        Preview.setheigthTypesDiv(h);
    });

        var checkFitTypes = function(typeList, ulWidth) {
            var tmpWidth = 0,
                offset = 30,
                widthToFit = ulWidth - offset,
                w;

            for(var i = 0; i < typeList.length; i++){
                w = parseInt(angular.element(typeList[i]).css('width'), 10) + tmpWidth;
                if(w > widthToFit){
                    Preview.setTypeHiddenPresent(true);
                    return true;
                } else {
                    tmpWidth = w;
                }
            }
            Preview.setTypeHiddenPresent(false);
            return false;
        };

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