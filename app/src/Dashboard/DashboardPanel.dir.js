angular.module('Pundit2.Dashboard')
.directive('dashboardPanel', function(Dashboard, $document) {
    return {
        // require: "^dashboard",
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@'
        },
        templateUrl: "src/Dashboard/DashboardPanel.dir.tmpl.html",
        controller: "DashboardPanelCtrl",
        link: function(scope, element, attrs) {
            
        }
    };
});