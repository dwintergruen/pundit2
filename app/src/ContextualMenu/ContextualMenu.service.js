angular.module('Pundit2.ContextualMenu')
.constant('CONTEXTUALMENUDEFAULT', {

    position: 'bottom-left',

    debug: true
})
.service('ContextualMenu', function($rootScope, BaseComponent, CONTEXTUALMENUDEFAULT, $dropdown, $timeout) {

    var contextualMenu = new BaseComponent('ContextualMenu', CONTEXTUALMENUDEFAULT);

    // all element that menu can display (defualt is action) (el.submenu | bool) (el.divider | bool)
    var menuElements = [];
    // actual menu resource
    var menuResource;

    // angular strap menu reference
    var menu = null;

    // build content to put inside menu
    var buildContent = function(type){
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

    // build options and scope
    var options = {scope: $rootScope.$new()};
    options.scope.$on('tooltip.hide', function(){
        contextualMenu.hide();
    });

    var init = function(element, type){
        // build options
        options.scope.content = buildContent(type);
        options.placement = contextualMenu.options.position;
        options.template = 'src/Toolbar/dropdown.tmpl.html';

        // build menu
        menu = $dropdown(element, options);
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
        if ( type instanceof Array ) {
            contextualMenu.err('Try to show menu with not legal type');
            return;
        }

        menuResource = resource;

        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-dropdown-contextual-menu' style='position: absolute; left: " + x + "px; top: " + y + "px;'><div>");

        init(angular.element('.pnd-dropdown-contextual-menu'), type);       
        menu.$promise.then(menu.show);
    };

    // hide and destroy the showed menu
    contextualMenu.hide = function(){
        if ( menu !== null ) {
            menu.hide();
            menu.destroy();
            angular.element('.pnd-dropdown-contextual-menu').remove();
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
        } else {
            contextualMenu.err('Try to add duplicated action');
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
        } else {
            contextualMenu.err('Try to add duplicated submenu element');
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

    contextualMenu.log('service run');
    return contextualMenu;

});