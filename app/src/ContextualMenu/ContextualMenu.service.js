angular.module('Pundit2.ContextualMenu')
.constant('CONTEXTUALMENUDEFAULT', {

    position: 'bottom-left',

    debug: true
})
.service('ContextualMenu', function($rootScope, BaseComponent, CONTEXTUALMENUDEFAULT, $dropdown, $timeout) {

    var contextualMenu = new BaseComponent('ContextualMenu', CONTEXTUALMENUDEFAULT);

    // all action that menu can display
    var menuActions = [];
    // actual showed actions
    var menuType;
    // actual menu resource
    var menuResource;

    // angular strap menu reference
    var menu = null;

    // build content to put inside menu
    var buildContent = function(){
        var content = [];

        for ( var i in menuActions ) {
            // display only if showIf return true
            if ( menuActions[i].showIf() ) {

                if ( menuActions[i].submenu ) {
                    content.push({
                        "text": menuActions[i].label,
                        submenu: true,
                        "hover": menuActions[i].hover,
                        "leave": menuActions[i].leave
                    });

                } else {
                    content.push({
                        "text": menuActions[i].label,
                        "click": function(i){
                            return function(){
                                menuActions[i].action(menuResource);                                
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

    var init = function(element){
        // build options
        options.scope.content = buildContent();
        options.placement = contextualMenu.options.position;
        options.template = 'src/Toolbar/dropdown.tmpl.html';

        // build menu
        menu = $dropdown(element, options);
    };

    // initialize the menu and show when it is ready
    contextualMenu.show = function(x, y, resource, type){

        // show only one menu
        if ( menu !== null || menuActions.length === 0 ) {
            return;
        }

        menuResource = resource;

        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-dropdown-contextual-menu' style='position: absolute; left: " + x + "px; top: " + y + "px;'><div>");

        init(angular.element('.pnd-dropdown-contextual-menu'));       
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

        var find = menuActions.some(function(el, index, array){
            return angular.equals(actionObj.name, el.name);
        });

        if ( !find ) {
            menuActions.push(angular.copy(actionObj));        
        } else {
            contextualMenu.err('Try to add duplicated action');
        }

    };

    // add submenu element to menu
    contextualMenu.addSubMenu = function(subMenuObj){

        var find = menuActions.some(function(el, index, array){
            return angular.equals(subMenuObj.name, el.name);
        });

        if ( !find ) {
            var e = angular.copy(subMenuObj);
            e.submenu = true;
            menuActions.push(e);          
        } else {
            contextualMenu.err('Try to add duplicated submenu element');
        }

    };

    contextualMenu.log('service run');
    return contextualMenu;

});