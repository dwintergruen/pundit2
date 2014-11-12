angular.module('Pundit2.ContextualMenu')
.constant('CONTEXTUALMENUDEFAULTS', {

    position: 'bottom-left',

    overflowClass: 'pnd-contextual-menu-scroll',

    overflowContentClass: 'pnd-tab-content',

    debug: false
})
/**
 * @ngdoc service
 * @name ContextualMenu
 * @module Pundit2.ContextualMenu
 * @description
 *
 * Somethings...
 *
 */
.service('ContextualMenu', function($rootScope, BaseComponent, CONTEXTUALMENUDEFAULTS, $dropdown, $window) {

    var contextualMenu = new BaseComponent('ContextualMenu', CONTEXTUALMENUDEFAULTS);

    var state = {
        // angular strap menu reference
        menu: null,
        // all elements that menu can display (added by addActio, addSubmenu and addDiveder)
        menuElements: [],
        // showed menu resource
        menuResource: null,
        // showed menu type
        menuType: null,
        // actual menu anchor position
        lastX: 0, lastY: 0,
        // element bound to $dropdown menu instance
        anchor: null,
        // menu content array (object is in angular strap format)
        content: null,
        // mock Menu is showed outside screen to calculate the menu dimensions 
        // and to define the real menu placement to prevent window scrool
        mockMenu: null
    };

    var overflowContentClass = contextualMenu.options.overflowContentClass;


    // create div anchor (the element bound with angular strap menu reference)
    angular.element("[data-ng-app='Pundit2']")
        .prepend("<div class='pnd-dropdown-contextual-menu-anchor' style='position: absolute; left: -500px; top: -500px;'><div>");

    state.anchor = angular.element('.pnd-dropdown-contextual-menu-anchor');

    // build menu options and scope
    var realOptions = {scope: $rootScope.$new()};

    // build mock menu options (used only to positioning)
    var mockOptions = {scope: $rootScope.$new()};

    var init = function(options, placement){

        options.scope.content = state.content;
        if ( typeof(placement) !== 'undefined' ) {
            options.placement = placement;
        } else {
            options.placement = contextualMenu.options.position;
        }
        options.template = 'src/ContextualMenu/dropdown.tmpl.html';

        return $dropdown(state.anchor, options);
        
    };

    // return the state object
    // used in unit test to verify side effect
    contextualMenu.getState = function(){
        return state;
    };

    // build content (action/divider/submenu) to put inside menu in angular strap object format
    // filter element by showIf function
    // and order (from big to less) by element.priority property
    contextualMenu.buildContent = function(){
        var content = [];

        // filter by type
        var filteredActions = state.menuElements.filter(function(element){
            return element.type.indexOf(state.menuType) > -1;
        });

        // ordering by action priority descending (big > small)
        filteredActions.sort(function(a, b){
            return b.priority - a.priority;
        });

        for ( var i in filteredActions ) {
            
            // display only if showIf return true            
            if ( !filteredActions[i].showIf(state.menuResource) ) {
                continue;
            }

            // submenu content
            if ( filteredActions[i].submenu ) {
                content.push({
                    text: filteredActions[i].label,
                    submenu: true,
                    hover: filteredActions[i].hover,
                    leave: filteredActions[i].leave
                });

            } else if ( filteredActions[i].divider ){

                content.push({
                        divider: true
                    });

            } else {
                // standard content
                content.push({
                    text: filteredActions[i].label,
                    header: (filteredActions[i].header ? true : false),
                    click: function(_i){
                        return function(){
                            filteredActions[_i].action(state.menuResource);
                        };
                    }(i)
                });
            }
            
        }

        // TODO: verificare uso degli splice
        // remove divider in bad position
        // more than one in first position
        // or more than one in last position
        var lastIndex = 0;
        content.some(function(el, index){
            if (typeof(el.divider) === 'undefined') {
                lastIndex = index;
                return true;
            }
        });
        content.splice(0, lastIndex);

        for (var j=content.length-1; j>=0; j--) {
            if (typeof(content[j].divider) === 'undefined') {
                break;
            }
            content.pop();
        }

        contextualMenu.log('buildContent built '+content.length+' elements for type='+state.menuType);
        return content;
    };

    // determine the angular strap menu placement (right is left and left is right)
    contextualMenu.position = function(element, x, y){

        var width = element.outerWidth(),
            height = element.outerHeight();

        var placement;
        if ( y + height > angular.element($window).innerHeight() ) {
            placement = 'top';
        } else {
            placement = 'bottom';
        }
        if ( x + width > angular.element($window).innerWidth() ) {
            placement += '-right';
        } else {
            placement +='-left';
        }

        return placement;
        
    };

    /**
     * @ngdoc method
     * @name ContextualMenu#show
     * @module Pundit2.ContextualMenu
     * @function
     *
     * @description
     * Show contextual menu (asynchronous).
     *
     * @param {Number} x 
     * @param {Number} y
     * @param {Object} resource
     * @param {String} type
    */
    contextualMenu.show = function(x, y, resource, type){

        // show only one menu
        if ( state.menu !== null ) {
            state.menu.hide();
            state.menu.destroy();
            state.menu = null;
        }

        if ( state.menuElements.length === 0 ) {
            contextualMenu.err('Cannot show a contextual menu without any element!!');
            return;
        }

        // need resource
        if ( typeof(resource) === 'undefined' ) {
            contextualMenu.err('Try to show menu without resource for type '+ type);
            return;
        }

        // build content and store
        state.menuResource = resource;
        state.menuType = type;
        state.content = contextualMenu.buildContent();

        if (state.content.length === 0) {
            contextualMenu.err('Tried to show menu for type '+type+' without any content (buildContent fail)');
            return;
        }

        contextualMenu.log('Showing menu for type='+type+' at '+x+','+y);

        // state var
        state.lastX = x;
        state.lastY = y;

        state.mockMenu = init(mockOptions);
        state.mockMenu.$promise.then(state.mockMenu.show);

    };

    // when mock menu show the dimensions can be readed
    // and can calculate the proper placement for the real menu
    mockOptions.scope.$on('tooltip.show', function(){

        var place = contextualMenu.position(angular.element(state.mockMenu.$element), state.lastX, state.lastY);

        // move anchor to correct position
        state.anchor.css({
            left: state.lastX,
            top: state.lastY
        });

        // TODO check memory leaks ?
        //state.mockMenu.destroy();
        angular.element(state.mockMenu.$element).remove();

        // create real menu
        state.menu = init(realOptions, place);
        state.menu.$promise.then(state.menu.show);

        // Find current scroll positions
        var wTop = angular.element($window).scrollTop(),
            wLeft = angular.element($window).scrollLeft();
        // Force scroll back to original positions
        angular.element($window).bind("scroll", function(){
            $(this).scrollTop(wTop).scrollLeft(wLeft); 
        });
        angular.element('body').addClass(contextualMenu.options.overflowClass);
    });

    mockOptions.scope.$on('tooltip.hide', function(){
        angular.element($window).unbind("scroll");
        angular.element('body').removeClass(contextualMenu.options.overflowClass);
    });

    /**
     * @ngdoc method
     * @name ContextualMenu#hide
     * @module Pundit2.ContextualMenu
     * @function
     *
     * @description
     * Hide contextual menu.
    */
    contextualMenu.hide = function(){
        if ( state.menu === null ) {
            return;
        }

        state.menu.hide();
        state.menu.destroy();
        state.menu = null;
    };

    /**
     * @ngdoc method
     * @name ContextualMenu#addAction
     * @module Pundit2.ContextualMenu
     * @function
     *
     * @description
     * Add action to contextual menu.
     *
     * @param {Object} action Action to add to the menu.
     * * `name` - `{string}` : action name, used as key to not duplicate the menu actions.
     * * `label` - `{string}` : action label displayed inside menu.
     * * `type` - `{Array of string}` : types of menus in which the action is shown.
     * * `priority` - `{number}` : determines the order of the actions inside menu.
     * * `showIf` - `{function(res)}` : if returns true, the action is shown in the menu,
     * receives as a parameter the resource passed in the "show()".
     * * `action` - `{function(res)}` : function that is executed when you click on the action,
     * receives as a parameter the resource passed in the "show()".
     *
     * @return {boolean} true if the action was successfully added, false otherwise (duplicated action).
     *
    */
    contextualMenu.addAction = function(actionObj){
        var found = state.menuElements.some(function(el){
            return actionObj.name === el.name;
        });

        if ( found ) {
            contextualMenu.err('Not adding duplicated action '+actionObj.name);
            return false;
        }

        state.menuElements.push(angular.copy(actionObj));
        contextualMenu.log('Added action '+actionObj.name+' for types '+actionObj.type);
        return true;
    };

    contextualMenu.removeActionByName = function(name){
        var foundEl;
        var actionIndex;
        state.menuElements.some(function(el, index){
            if(name === el.name){
                foundEl = el;
                actionIndex = index;
            }
            return;
        });
        if ( typeof(foundEl) !== 'undefined' ) {
            state.menuElements.splice(actionIndex, 1);
            contextualMenu.log('Remove action '+foundEl.name+' for types '+foundEl.type);
            return true;
        }

        contextualMenu.err('Action '+name+' not found');
        return false;
    };

    contextualMenu.wipeActionsByType = function(type){
        state.menuElements = state.menuElements.filter(function(el, index){
            if (type === state.menuElements[index].type){
                return false;
            }
            return true;
        });
    };

    contextualMenu.modifyHeaderActionByName = function(name, header){
        var foundEl;
        var actionIndex;
        state.menuElements.some(function(el, index){
            if(name === el.name){
                foundEl = el;
                actionIndex = index;
            }
            return;
        });
        if ( typeof(foundEl) !== 'undefined' ) {
            state.menuElements[actionIndex].header = header;
            contextualMenu.log('Disactive '+foundEl.name);
            return true;
        }

        contextualMenu.err('Action '+name+' not found');
        return false;
    };

    // add submenu element to menu
    contextualMenu.addSubMenu = function(subMenuObj){

        var found = state.menuElements.some(function(el){
            return angular.equals(subMenuObj.name, el.name);
        });

        if ( !found ) {
            var e = angular.copy(subMenuObj);
            e.submenu = true;
            state.menuElements.push(e);
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
        };
        state.menuElements.push(e);
    };

    // used in example (define where to show the submenu)
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