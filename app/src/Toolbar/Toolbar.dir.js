angular.module('Pundit2.Toolbar')
.config(function($dropdownProvider) {
    angular.extend($dropdownProvider.defaults, {
        trigger: 'click',
        html: true
    });
})

.directive('toolbar', function(Toolbar) {
    return {
        restrict: 'E',
        scope: { },
        templateUrl: "src/Toolbar/Toolbar.dir.tmpl.html",
        link: function(/*scope, el  attrs, ctrl */) {
            // When the directive is rendered, this class will be added
            angular.element('body').addClass(Toolbar.options.bodyClass);
            Toolbar.log("Adding "+ Toolbar.options.bodyClass +" to body element");
        }
    };
});