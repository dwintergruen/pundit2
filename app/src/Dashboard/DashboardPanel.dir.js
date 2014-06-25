angular.module('Pundit2.Dashboard')
.directive('dashboardPanel', function() {
    return {
        // require: "^dashboard",
        restrict: 'E',
        transclude: true,
        scope: {
            paneltitle: '@'
        },
        templateUrl: "src/Dashboard/DashboardPanel.dir.tmpl.html",
        controller: "DashboardPanelCtrl"
    };
});