angular.module('Pundit2.ContextualMenu')
.constant('CONTEXTUALMENUDEFAULTS', {

    position: 'bottom-right',

    debug: true
})
.service('ContextualMenu', function($rootScope, BaseComponent, CONTEXTUALMENUDEFAULTS, $dropdown, $window) {

    var contextualMenu = new BaseComponent('ContextualMenu', CONTEXTUALMENUDEFAULTS);

    var state = {
        // all elements that menu can display
        menuElements: [],
        // menu resource
        menuResource: null,
        // menu type
        menuType: null,
        // actual menu anchor position
        lastX: 0, lastY: 0,
        // store anchor
        anchor: null,
        // menu content
        content: null
    };
    

    // angular strap menu reference - TODO: will be null if the menu is not shown? .. scriviamolo
    var menu = null;


    // create div anchor
    // TODO: mockMenu e' quello che usi per posizionare? Perche' non facciamo una classe
    // e definiamo il css nel .less?
    angular.element("[data-ng-app='Pundit2']")
        .prepend("<div class='pnd-dropdown-contextual-menu-anchor' style='position: absolute; left: -500px; top: -500px;'><div>");

    // store anchor
    state.anchor = angular.element('.pnd-dropdown-contextual-menu-anchor');


    // build menu options and scope
    var realOptions = {scope: $rootScope.$new()};
    /*realOptions.scope.$on('tooltip.hide', function(){
        contextualMenu.hide();
    });*/

    // build mock options (used to positioning)
    // showed outside screen to calculate the menu placement 
    // for the show x, y
    var mockOptions = {scope: $rootScope.$new()};
    mockOptions.scope.$on('tooltip.show', function(){

        var place = position(angular.element('.pnd-context-menu'), state.lastX, state.lastY);

        // move anchor to correct position
        // TODO: non e' piu' facile avere due anchor? Uno sempre fuori dalle balle, uno
        // sempre a portata? Non semplifica anche il css?
        state.anchor.css({
            left: state.lastX,
            top: state.lastY
        });

        // remove mock menu
        angular.element('.pnd-context-menu').remove();

        // create real menu
        menu = init(realOptions, place);
        if ( menu !== null ) {
            menu.$promise.then(menu.show);
        }

    });

    var init = function(options, placement){

        options.scope.content = state.content;
        if ( typeof(placement) !== 'undefined' ) {
            options.placement = placement;
        } else {
            options.placement = contextualMenu.options.position;
        }        
        options.template = 'src/Toolbar/dropdown.tmpl.html';
        // add css class in teamplate
        options.scope.contextMenu = true;

        return $dropdown(state.anchor, options);        
    };

    // build content to put inside menu
    // TODO: Che vuol dire? spiega meglio, tipo .. filters by type, checks showIf() ... etc etc
    // TODO: menuResource? lo spostiamo tra i parametri? typeElement? menuElementType?
    // Tutto globale!! :(
    contextualMenu.buildContent = function(type, resource){
        var content = [];

        // filter by type
        var filteredActions = state.menuElements.filter(function(element){
            return element.type.indexOf(type) > -1; 
        });

        // ordering by action priority descending (big > small)
        filteredActions.sort(function(a, b){
            return b.priority - a.priority;
        });

        for ( var i in filteredActions ) {
            
            // display only if showIf return true            
            if ( !filteredActions[i].showIf(resource) ) {
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
                    // TODO need to close resource?
                    click: function(_i, _resource){
                        return function(){
                            filteredActions[_i].action(_resource);
                        };
                    }(i, resource)
                });
            }
            
        }

        contextualMenu.log('buildContent built '+content.length+' elements for type='+type);
        return content;
    };

    var position = function(element, x, y){

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


    // initialize the menu and show when it is ready
    contextualMenu.show = function(x, y, resource, type){

        // show only one menu
        if ( menu !== null ) {
            menu.hide();
            menu.destroy();
            contextualMenu.err('Contextual menu already shown?!');
            //return;
        }

        if ( state.menuElements.length === 0 ) {
            contextualMenu.err('Cannot show a contextual menu without any element!!');
            return;
        }

        // need resource
        if ( typeof(resource) === 'undefined' ) {
            contextualMenu.err('Try to show menu without resource');
            return;
        }

        // build content and store
        state.content = contextualMenu.buildContent(type, resource);

        if ( state.content.length === 0 ) {
            contextualMenu.err('Try to show menu without any content (buildContent fail)');
            return;
        }

        // TODO: workaround per farlo anda' ..
        if (!angular.isArray(type))
            type = [type];

        contextualMenu.log('Showing menu for type='+type+' at '+x+','+y);

        // state var
        state.lastX = x;
        state.lastY = y;
        state.menuResource = resource;
        state.menuType = type;


        mockMenu = init(mockOptions);
        if ( mockMenu !== null) {
            mockMenu.$promise.then(mockMenu.show);            
        }
        // TODO: il workflow continua con la on(show) di riga 52
        // La spostiamo qua sotto cosi' da rendere chiaro come funziona?
    };

    // hides and destroys the shown menu
    contextualMenu.hide = function(){
        if ( menu === null ) {
            return;
        }

        menu.hide();
        menu.destroy();
        menu = null;
    };

    // add passed action (use name as key to avoid duplicates)
    contextualMenu.addAction = function(actionObj){

        var found = state.menuElements.some(function(el){
            // TODO: equals? non sono stringhe?
            return angular.equals(actionObj.name, el.name);
        });

        if ( found ) {
            contextualMenu.err('Not adding duplicated action '+actionObj.name);
            return false;
        }

        state.menuElements.push(angular.copy(actionObj));
        contextualMenu.log('Added action '+actionObj.name+' for types '+actionObj.type);
        return true;
    };

    // add submenu element to menu
    // TODO: where's the priority?
    contextualMenu.addSubMenu = function(subMenuObj){

        var found = state.menuElements.some(function(el, index, array){
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

    // TODO: what's this for? Who's using this?
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