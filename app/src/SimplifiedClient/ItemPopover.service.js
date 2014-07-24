angular.module('Pundit2.SimplifiedClient')

.service('ItemPopover', function(BaseComponent, $rootScope, $popover){

    var ip = new BaseComponent('ItemPopover');

    var popover = null,
        item = null;

    var options = {
        title: "Annotations Preview",
        placement: 'bottom',
        template: 'src/SimplifiedClient/ItemPopover.tmpl.html',
        trigger: 'manual',
        container: "[data-ng-app='Pundit2']"
    };

    ip.show = function(element, obj) {

        if (popover !== null) {
            popover.hide();
            popover.destroy();
        }

        item = obj;

        popover = $popover(element, options);
        popover.$promise.then(popover.show);        
        
    };

    ip.hide = function() {
        if (popover === null || popover.$isShown === false) {
            return;
        }
        popover.hide();
        popover.destroy();
        popover = null;
    };

    ip.getItem = function() {
        return item;
    };

    ip.log('Up and running!');

    return ip;

});