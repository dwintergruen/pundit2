angular.module('Pundit2.SimplifiedClient')

.service('ItemPopover', function(BaseComponent, $rootScope, $popover, AnnotationsExchange) {

    var ip = new BaseComponent('ItemPopover');

    // last popover reference
    var popover = null,
        // last item reference
        item = null,
        // last element reference (where is attached the popover)
        element = null,
        // fix popover position after the next show event
        fixPosition = true;

    // TODO fixed or check dinamically
    // var width = 330;

    var top, height;

    var defaultPlacement = 'bottom';

    var options = {
        scope: $rootScope.$new(),
        title: "Annotations Preview",
        template: 'src/SimplifiedClient/ItemPopover.tmpl.html',
        trigger: 'manual',
        container: "[data-ng-app='Pundit2']"
    };

    ip.show = function(el, obj, placement, repositioning) {

        if (popover !== null) {
            popover.hide();
            popover.destroy();
        }

        // update state variables
        if (typeof(obj) !== 'undefined') {
            item = obj;
        }
        if (typeof(el) !== 'undefined') {
            element = el;
        }
        if (typeof(repositioning) !== 'undefined') {
            fixPosition = repositioning;
        } else {
            fixPosition = true;
        }
        // check if need a custom placement
        if (typeof(placement) !== 'string') {
            options.placement = defaultPlacement;
        } else {
            options.placement = placement;
        }

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

    ip.update = function(el, pos) {
        var page = angular.element('html');

        if (pos.top + el.height() > page.height()) {
            ip.show(element, item, 'top', false);
        }
        if (pos.left < 0) {
            ip.show(element, item, 'right', false);
            return;
        }
        if (pos.left + el.width() > page.width()) {
            ip.show(element, item, 'left', false);
            return;
        }
    };

    ip.fix = function() {
        // position need to be fixed only in right, left, and top placement
        if (options.placement === 'bottom') {
            return;
        }
        var div = options.placement === 'top' ? 1 : 2;

        var el = angular.element('.pnd-item-popover'),
            newHeight = el.height(),
            newTop = top + (height - newHeight) / div;

        el.css('top', newTop);

        height = newHeight;
        top = newTop;

    };

    ip.getAnnotation = function() {
        if (item !== null) {
            return AnnotationsExchange.getAnnotationsByItem(item.uri);
        }
    };

    // check if popover content go out of the page
    // than update placement to show popover content
    // inside the page
    options.scope.$on('tooltip.show', function() {
        var el = angular.element('.pnd-item-popover'),
            pos = el.position();

        top = pos.top;
        height = el.height();

        if (!fixPosition) {
            return;
        }
        ip.update(el, pos);
    });

    ip.log('Up and running!');

    return ip;

});