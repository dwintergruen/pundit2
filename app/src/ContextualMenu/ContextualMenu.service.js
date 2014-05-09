angular.module('Pundit2.ContextualMenu')
.constant('CONTEXTUALMENUDEFAULTS', {

    position: 'bottom-left',

    debug: true
})
.service('ContextualMenu', function($rootScope, BaseComponent, CONTEXTUALMENUDEFAULTS, $dropdown, $window) {

    var contextualMenu = new BaseComponent('ContextualMenu', CONTEXTUALMENUDEFAULTS);

    // all element that menu can display (default is action) (el.submenu | bool) (el.divider | bool)
    var menuElements = [];
    // actual menu resource
    var menuResource;
    // actual menu anchor position
    var lastX, lastY;
    // actual menu anchor element
    var anchor = null;

    // angular strap menu reference
    var menu = null;


    // build menu options and scope
    var realOptions = {scope: $rootScope.$new()};
    realOptions.scope.$on('tooltip.hide', function(){
        contextualMenu.hide();
    });

    // build mock options (used to positioning)
    var mockOptions = {scope: $rootScope.$new()};
    mockOptions.scope.$on('tooltip.show', function(){

        var placement = position(angular.element('.pnd-context-menu'), lastX, lastY);

        // move anchor to correctly position
        anchor.css({
            left: lastX,
            top: lastY
        });

        // remove mock menu
        angular.element('.pnd-context-menu').remove();

        // create real menu
        menu = init(anchor, realOptions, undefined, mockOptions.scope.content, placement);       
        menu.$promise.then(menu.show);

    });

    var init = function(element, options, type, content, placement){

        if ( typeof(content) !== 'undefined' ) {
            // TODO need a copy?
            options.scope.content = content;
        } else {
            options.scope.content = contextualMenu.buildContent(type);
        }
        if ( typeof(placement) !== 'undefined' ) {
            options.placement = placement;
        } else {
            options.placement = contextualMenu.options.position;
        }        
        options.template = 'src/Toolbar/dropdown.tmpl.html';
        // add css class in teamplate
        options.scope.contextMenu = true;

        return $dropdown(element, options);
    };

    // build content to put inside menu
    contextualMenu.buildContent = function(type){
        var content = [];

        // filter by type
        var filterAction = menuElements.filter(function(menuElement, menuIndex, menuArray){

            // foreach passed type
            return type.some(function(typeElement, typeIndex, typeArray){

                // foreach element type
                return menuElement.type.some(function(menuElementType, menuElementIndex, menuElementArray){

                    return angular.equals(typeElement, menuElementType);

                }); 

            });
            
        });

        // ordering (before the greatest)
        filterAction.sort(function(a, b){
            return b.priority - a.priority;
        });

        for ( var i in filterAction ) {
            // display only if showIf return true            
            if ( filterAction[i].showIf(menuResource) ) {

                if ( filterAction[i].submenu ) {
                    // submenu content
                    content.push({
                        text: filterAction[i].label,
                        submenu: true,
                        hover: filterAction[i].hover,
                        leave: filterAction[i].leave
                    });

                } else if ( filterAction[i].divider ){
                    content.push({
                        divider: true
                    });
                } else {
                    // standard content
                    content.push({
                        text: filterAction[i].label,
                        click: function(i){
                            return function(){
                                filterAction[i].action(menuResource);                                
                            }
                        }(i)
                    });
                }

            }
        }

        return content;
    };

    var position = function(element, x, y){

        var width = element.outerWidth(),
            height = element.outerHeight();

        var placement;
        if ( y + height > angular.element($window).innerHeight() /* && y - height > 0 */) {
            placement = 'top';
        } else {
            placement = 'bottom';
        }
        if ( x + width > angular.element($window).innerWidth() /* && x - width > 0 */) {
            placement += '-right';
        } else {
            placement +='-left';
        }

        return placement;
        
    };


    // initialize the menu and show when it is ready
    contextualMenu.show = function(x, y, resource, type){

        // show only one menu
        if ( menu !== null || menuElements.length === 0 ) {
            return;
        }

        // need resource
        if ( typeof(resource) === 'undefined' ) {
            contextualMenu.err('Try to show menu without resource');
            return;
        }

        // need type array
        if ( !(type instanceof Array) ) {
            contextualMenu.err('Try to show menu with not legal type');
            return;
        }

        // state var
        menuResource = resource;
        lastX = x;
        lastY = y;

        // create div anchor
        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-dropdown-contextual-menu-anchor' style='position: absolute; left: -500px; top: -500px;'><div>");

        // store anchor
        anchor = angular.element('.pnd-dropdown-contextual-menu-anchor');

        mockMenu = init(anchor, mockOptions, type);       
        mockMenu.$promise.then(mockMenu.show);
    };

    // hide and destroy the showed menu
    contextualMenu.hide = function(){
        if ( menu !== null ) {
            menu.hide();
            menu.destroy();
            anchor.remove();
            anchor = null;
            menu = null;
        }
    };

    // add passed action (use name as key to not produce duplicates) 
    contextualMenu.addAction = function(actionObj){

        var find = menuElements.some(function(el, index, array){
            return angular.equals(actionObj.name, el.name);
        });

        if ( !find ) {
            menuElements.push(angular.copy(actionObj));
            return true;      
        } else {
            contextualMenu.err('Try to add duplicated action');
            return false;
        }

    };

    // add submenu element to menu
    contextualMenu.addSubMenu = function(subMenuObj){

        var find = menuElements.some(function(el, index, array){
            return angular.equals(subMenuObj.name, el.name);
        });

        if ( !find ) {
            var e = angular.copy(subMenuObj);
            e.submenu = true;
            menuElements.push(e);
            return true;     
        } else {
            contextualMenu.err('Try to add duplicated submenu element');
            return false;
        }

    };

    // add divider in a specified position
    contextualMenu.addDivider = function(dividerObj){
        var e = angular.copy(dividerObj);
        e.divider = true;
        e.showIf = function(){
            return true;
        }
        menuElements.push(e);
    };

    contextualMenu.getSubMenuPlacement = function(){
        var i = realOptions.placement.indexOf('-'),
            place = realOptions.placement.substring(i+1);

        if ( place === 'right') {
            return 'left';
        } else {
            return 'right';
        }
    };

    contextualMenu.log('service run');
    return contextualMenu;

});