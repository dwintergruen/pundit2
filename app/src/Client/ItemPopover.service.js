angular.module('Pundit2.SimplifiedClient')

.service('ItemPopover', function(BaseComponent, $rootScope, $popover){

    var ip = new BaseComponent('ItemPopover');

    var popover;
    ip.show = function(element, label) {
        popover = $popover(element, {
            title: label,
            placement: 'bottom',
            template: 'src/Client/ItemPopover.tmpl.html',
            trigger: 'manual',
            container: "[data-ng-app='Pundit2']"
        });
        popover.$promise.then(popover.show);
    };

    ip.hide = function() {
        popover.hide();
    }

    return ip;

});