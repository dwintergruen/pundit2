angular.module('Pundit2.Dashboard')
    .directive('pndTabs', function() {

        return {
            restrict: 'EAC',
            scope: {
                tabs: "=pndTabs"
            },
            require: '?ngModel',
            templateUrl: 'src/Dashboard/pndTabs.dir.tmpl.html',
            controller: 'pndTabsCtrl'
        };

    });