angular.module('Pundit2.ContextualMenu')
.constant('CONTEXTUALMENUDEFAULTS', {

    position: 'bottom-left',

    debug: true
})
.service('ContextualMenu', function($rootScope, BaseComponent, CONTEXTUALMENUDEFAULTS, $dropdown, $window) {

    var contextualMenu = new BaseComponent('ContextualMenu', CONTEXTUALMENUDEFAULTS);

    // all elements that menu can display
    var menuElements = [];
    // actual menu anchor position
    var lastX, lastY;
    // actual menu anchor element
    var anchor = null;

    // angular strap menu reference - TODO: will be null if the menu is not shown? .. scriviamolo
    var menu = null;


    // build menu options and scope
    var realOptions = {scope: $rootScope.$new()};
    realOptions.scope.$on('tooltip.hide', function(){
        contextualMenu.hide();
    });

    // build mock options (used to positioning)
    // TODO: used to positioning WHAT, HOW, WHEN, spiega del fake menu ecc ecc
    var mockOptions = {scope: $rootScope.$new()};
    mockOptions.scope.$on('tooltip.show', function(){

        var place = position(angular.element('.pnd-context-menu'), lastX, lastY);

        // move anchor to correct position
        // TODO: non e' piu' facile avere due anchor? Uno sempre fuori dalle balle, uno
        // sempre a portata? Non semplifica anche il css?
        anchor.css({
            left: lastX,
            top: lastY
        });

        // remove mock menu
        angular.element('.pnd-context-menu').remove();

        // create real menu
        menu = modeInit({element: anchor, content: mockOptions.scope.content, placement:place}, realOptions);
        if ( menu !== null ) {
            menu.$promise.then(menu.show);
        } else {
            anchor.remove();
            anchor = null;
        }

    });

    // TODO: what's this for? Who's using this?
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
        // add css class in template
        options.scope.contextMenu = true;

        if ( options.scope.content.length > 0 ) {
            return $dropdown(element, options);
        } else {
            return null;
        }
        
    };

    var modeInit = function(obj, options){

        if ( typeof(obj.content) !== 'undefined' ) {
            // TODO need a copy?
            options.scope.content = obj.content;
        } else {
            options.scope.content = contextualMenu.buildContent(obj.type, obj.resource);
        }
        if ( typeof(obj.placement) !== 'undefined' ) {
            options.placement = obj.placement;
        } else {
            options.placement = contextualMenu.options.position;
        }        
        options.template = 'src/Toolbar/dropdown.tmpl.html';
        // add css class in teamplate
        options.scope.contextMenu = true;

        if ( options.scope.content.length > 0 ) {
            return $dropdown(obj.element, options);
        } else {
            return null;
        }
        
    };

    // build content to put inside menu
    // TODO: Che vuol dire? spiega meglio, tipo .. filters by type, checks showIf() ... etc etc
    // TODO: menuResource? lo spostiamo tra i parametri? typeElement? menuElementType?
    // Tutto globale!! :(
    contextualMenu.buildContent = function(type, resource){
        var content = [];

        // TODO: perche' passi piu' di un tipo come parametro? La show accetta piu' di un tipo?
        // Ha senso chiedere di mostrare un menu contestuale per piu' di un tipo? Non credo .. vedi pundit1

        // TODO: ti garba .some eh?! Ma almeno elimina i parametri che non usi, jshint FTW
        // filter by type
        var filterAction = menuElements.filter(function(menuElement){

            // foreach passed type
            return type.some(function(typeElement){

                // foreach element type
                return menuElement.type.some(function(menuElementType){

                    return angular.equals(typeElement, menuElementType);

                }); 

            });
            
        });

        // ordering by action priority descending (big > small)
        filterAction.sort(function(a, b){
            return b.priority - a.priority;
        });

        for ( var i in filterAction ) {
            
            // display only if showIf return true            
            if ( !filterAction[i].showIf(resource) ) {
                return;
            }

            // submenu content
            if ( filterAction[i].submenu ) {
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
                    // TODO need to close resource?
                    click: function(i, res){
                        return function(){
                            filterAction[i].action(res);                                
                        }
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
        if ( y + height > angular.element($window).innerHeight() /*&& y - height > 0*/ ) {
            placement = 'top';
        } else {
            placement = 'bottom';
        }
        if ( x + width > angular.element($window).innerWidth() /*&& x - width > 0*/ ) {
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
            // TODO: sta roba viene chiamata quando viene nascosto .. perche'? :|
            contextualMenu.err('Contextual menu already shown?!');
            return;
        }

        if ( menuElements.length === 0 ) {
            contextualMenu.err('Cannot show a contextual menu without any element!!');
            return;
        }

        // need resource
        if ( typeof(resource) === 'undefined' ) {
            contextualMenu.err('Try to show menu without resource');
            return;
        }

        // need type array
        // TODO: angular.isArray()
        // if ( !(type instanceof Array) ) {
        //    contextualMenu.err('Try to show menu with illegal type');
        //    return;
        //}

        // TODO: workaround per farlo anda' ..
        if (!angular.isArray(type))
            type = [type];


        contextualMenu.log('Showing menu for type='+type+' at '+x+','+y);

        // state var
        lastX = x;
        lastY = y;

        // create div anchor
        // TODO: mockMenu e' quello che usi per posizionare? Perche' non facciamo una classe
        // e definiamo il css nel .less?
        // Perche' prepend()? Elimini anche l'anchor quando fai hide? Perche' rimuovi l'anchor?
        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-dropdown-contextual-menu-anchor' style='position: absolute; left: -500px; top: -500px;'><div>");

        // store anchor
        anchor = angular.element('.pnd-dropdown-contextual-menu-anchor');

        //mockMenu = init(anchor, mockOptions, type);
        mockMenu = modeInit({element: anchor, type: type, resource: resource}, mockOptions);
        if ( mockMenu !== null) {
            mockMenu.$promise.then(mockMenu.show);            
        } else {
            anchor.remove();
            anchor = null;
        }
        // TODO: il workflow continua con la on(hide) di riga 35? La spostiamo qua sotto cosi' da
        // rendere chiaro come funziona?
    };

    // hides and destroys the shown menu
    contextualMenu.hide = function(){
        if ( menu === null ) {
            return;
        }

        menu.hide();
        menu.destroy();
        anchor.remove();
        anchor = null;
        menu = null;
    };

    // add passed action (use name as key to avoid duplicates)
    contextualMenu.addAction = function(actionObj){

        var found = menuElements.some(function(el){
            // TODO: equals? non sono stringhe?
            return angular.equals(actionObj.name, el.name);
        });

        if ( found ) {
            contextualMenu.err('Not adding duplicated action '+actionObj.name);
            return false;
        }

        menuElements.push(angular.copy(actionObj));
        contextualMenu.log('Added action '+actionObj.name+' for types '+actionObj.type);
        return true;
    };

    // add submenu element to menu
    // TODO: where's the priority?
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
    // TODO: where's the priority?
    contextualMenu.addDivider = function(dividerObj){
        var e = angular.copy(dividerObj);
        e.divider = true;
        e.showIf = function(){
            return true;
        };
        menuElements.push(e);
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