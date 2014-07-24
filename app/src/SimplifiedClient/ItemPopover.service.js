angular.module('Pundit2.SimplifiedClient')

.service('ItemPopover', function(BaseComponent, $rootScope, $popover){

    var ip = new BaseComponent('ItemPopover');

    // last popover reference
    var popover = null,
        // last item reference
        item = null,
        // last element reference (where is attached the popover)
        element = null;

    // TODO fixed or check dinamically
    var width = 330;

    var defaultPlacement = 'bottom';

    var options = {
        scope: $rootScope.$new(),
        title: "Annotations Preview",
        template: 'src/SimplifiedClient/ItemPopover.tmpl.html',
        trigger: 'manual',
        container: "[data-ng-app='Pundit2']"
    };

    ip.show = function(el, obj, placement) {

        if (popover !== null) {
            popover.hide();
            popover.destroy();
        }

        // update state variables
        item = obj;
        element = el;

        // check if need a custom placement
        if (typeof(placement) !== 'string') {
            options.placement = defaultPlacement;
        } else {
            options.placement = placement;
        }

        popover = $popover(el, options);
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

    ip.getAnnotation = function() {
        if (item !== null) {
            return item.getAnnotations();            
        }
    };

    // check if popover content go out of the page
    // than update placement to show popover content
    // inside the page
    options.scope.$on('tooltip.show', function(){
        var el = angular.element('.pnd-item-popover'),
            // check html or window ?
            page = angular.element('html'),
            pos = el.position();

        if (pos.top + el.height() > page.height()) {
            ip.show(element, item, 'top');
        }
        if (pos.left < 0) {
            ip.show(element, item, 'right');
            return;
        }
        if (pos.left + el.width() > page.width()) {
            ip.show(element, item, 'left');
            return;
        }
    });

    ip.log('Up and running!');

    return ip;

});