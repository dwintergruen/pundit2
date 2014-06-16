angular.module('Pundit2.ResourcePanel')
    .controller('ResourcePanelCtrl', function($rootScope, $scope, MyItems, PageItemsContainer, ItemsExchange) {

        var myItemsContainer = MyItems.options.container;
        var pageItemsContainer = PageItemsContainer.options.container;

        $scope.showMyItems = true;
        $scope.showMyItems = false;

        $scope.toggleMyItems = function(){
            $scope.caretMyItems = !$scope.caretMyItems;
            $('#collapseMyItems').toggle();
        };

        $scope.togglePageItems = function(){
            $scope.caretPageItems = !$scope.caretPageItems;
            $('#collapsePageItems').toggle();
        };

        $scope.toggleVocab = function(v){

            var elem = angular.element('span.pnd-vocab-'+v+' i');
            if(elem.hasClass('pnd-icon-caret-right')){
                elem.addClass('pnd-icon-caret-down').removeClass('pnd-icon-caret-right');
            } else {
                elem.addClass('pnd-icon-caret-right').removeClass('pnd-icon-caret-down');
            }

            $('#'+v).toggle();
        };



    });
