angular.module('Pundit2.ResourcePanel')
    .controller('ResourcePanelCtrl', function($rootScope, $scope, MyItems, PageItemsContainer, ItemsExchange, MyPundit) {

        var myItemsContainer = MyItems.options.container;
        var pageItemsContainer = PageItemsContainer.options.container;

        $scope.caretMyItems = true;
        $scope.caretPageItems = false;
        $scope.caretProperties = false;

        $scope.toggleMyItems = function(){
            $scope.caretMyItems = !$scope.caretMyItems;
            $('#collapseMyItems').toggle();
        };

        $scope.togglePageItems = function(){
            $scope.caretProperties = !$scope.caretProperties;
            $('#collapsePageItems').toggle();
        };

        /*$scope.toggleProperties = function(){
            $scope.caretPageItems = !$scope.caretPageItems;
            $('#collapseProperties').toggle();
        };*/

        $scope.toggleObjVocab = function(v){

            var elem = angular.element('span.pnd-vocab-'+v+' i');
            if(elem.hasClass('pnd-icon-caret-right')){
                elem.addClass('pnd-icon-caret-down').removeClass('pnd-icon-caret-right');
            } else {
                elem.addClass('pnd-icon-caret-right').removeClass('pnd-icon-caret-down');
            }

            $('#obj-'+v).toggle();
        };

        $scope.toggleSubVocab = function(v){

            var elem = angular.element('span.pnd-sub-vocab-'+v+' i');
            if(elem.hasClass('pnd-icon-caret-right')){
                elem.addClass('pnd-icon-caret-down').removeClass('pnd-icon-caret-right');
            } else {
                elem.addClass('pnd-icon-caret-right').removeClass('pnd-icon-caret-down');
            }

            $('#sub-'+v).toggle();
        };

        $rootScope.$watch(function() {
            return MyPundit.isUserLogged();
        }, function(newStatus, oldStatus) {
            $scope.userLoggedIn = newStatus;
        });

        var removeSpace = function(str){
            return str.replace(/ /g,'');
        };

        // getter function used inside template to order items
        // return the items property value used to order
        $scope.getOrderProperty = function(item){
            return removeSpace(item.label);
        };



    });
