angular.module('Pundit2.ItemsContainer')
.controller('ItemsContainerCtrl', function($scope) {

    $scope.tabs = [
        {
            title: 'first title',
            template: 'src/ItemsContainer/items.tmpl.html'
        },
        {
            title: 'second title',
            template: 'src/ItemsContainer/items.tmpl.html'
        },
        {
            title: 'third title',
            template: 'src/ItemsContainer/items.tmpl.html'
        }
    ];

    $scope.filteredItems = ['item1', 'item2', 'item3', 'item4'];

    console.log('items run');

});