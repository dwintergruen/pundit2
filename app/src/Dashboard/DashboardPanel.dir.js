angular.module('Pundit2.Dashboard')

.directive('dashboardPanel', function() {
    return {
        // require: "^dashboard",
        restrict: 'E',
        transclude: true,
        scope: {
            paneltitle: '@',
            hierarchystring: '@'
        },
        templateUrl: "src/Dashboard/DashboardPanel.dir.tmpl.html",
        controller: "DashboardPanelCtrl"
    };
});