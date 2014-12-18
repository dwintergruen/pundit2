angular.module('Pundit2.Preview')
.controller('PreviewCtrl', function($scope, Preview, TypesHelper, $window, Config) {

    $scope.itemDashboardPreview = null;


    // check where a new item is selected to get a preview
    $scope.$watch(function() { return Preview.getItemDashboardPreview(); }, function(newItem) {

        $scope.itemDashboardPreview = newItem;
        // check if item has an image to show
        if(newItem === null) {

            $scope.hasImage = false;
            $scope.itemIsAnImage = false;

        } else {
            if(TypesHelper.getLabel(newItem.type[0]) === 'Notebook'){
                $scope.hasImage = false;
                $scope.itemIsAnImage = false;
            } else {
                $scope.hasImage = (typeof(newItem.image) !== 'undefined');
                $scope.itemIsAnImage = $scope.itemDashboardPreview.isImage() || $scope.itemDashboardPreview.isImageFragment();
            }


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

    // return true if dashboard preview is empty
    $scope.isNotebook = function() {
        // TODO: Use namespace
        if($scope.itemDashboardPreview !== null && $scope.itemDashboardPreview.type[0] === "http://purl.org/pundit/ont/ao#Notebook"){
            return true;
        } else {
            return false;
        }

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

    $scope.openNotebookUrl = function(id){
        var url = Config.askBaseURL + '#/myNotebooks/'+id;
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

});