angular.module('Pundit2.Dashboard')
    .directive('pndTabs', function() {

        return {
            restrict: 'EAC',
            scope: true,
            templateUrl: 'src/Dashboard/pndTabs.dir.tmpl.html',
            controller: 'pndTabsCtrl'
        };

    });