angular.module('Pundit2.ContextualMenu')
.constant('CONTEXTUALMENUDEFAULT', {

    position: 'bottom-left',

    debug: true
})
.service('ContextualMenu', function($rootScope, BaseComponent, CONTEXTUALMENUDEFAULT, $dropdown) {

    contextualMenu = new BaseComponent('ContextualMenu', CONTEXTUALMENUDEFAULT);

    // TODO only to example (need to remove)
    var submenu;
    // TODO put in CONTEXTUALMENUDEFAULT
    var defaultContent = [
        { "text": "Action1", "href": "dashboard.html"},
        { "text": "Action2", "click": function(){
            console.log('exe action 2');
        }},
        { "text": "This is submenu", 
            submenu: true, 
            "hover": function(){
                console.log('exe hover');
                var options = {scope: $rootScope.$new()};
                options.scope.content = buildContent();
                options.placement = 'bottom-left';
                options.template = 'src/Toolbar/dropdown.tmpl.html';
                // build menu
                submenu = $dropdown(angular.element('.dropdown-submenu'), options);
                submenu.$promise.then(submenu.show);
            },
            "leave": function(){
                console.log('exe leave');
                if ( submenu ) {
                    submenu.hide();
                    submenu.destroy();
                }
            }
        }
    ];

    var menuActions = [];

    // angular strap menu reference
    var menu = null;

    // build content to put inside menu
    var buildContent = function(){
        var content = angular.copy(defaultContent);

        for ( var i in menuActions ) {
            // display only if showIf return true
            if ( menuActions[i].showIf() ) {
                content.push({
                    "text": menuActions[i].label,
                    "click": menuActions[i].action
                });
            }
        }

        return content;
    };

    var init = function(element, position){
        // build scope and options
        var options = {scope: $rootScope.$new()};
        options.scope.content = buildContent();
        options.placement = ( typeof(position)!== 'undefined' ) ? position : contextualMenu.options.position;

        options.template = 'src/Toolbar/dropdown.tmpl.html';

        options.scope.$on('tooltip.hide', function(){
            contextualMenu.hide();
        });

        // build menu
        menu = $dropdown(element, options);
    };

    // initialize the menu and show when it is ready
    contextualMenu.show = function(position, x, y){

        // show only one menu
        if ( menu !== null ) {
            return;
        }

        angular.element("[data-ng-app='Pundit2']")
            .prepend("<div class='pnd-dropdown' style='position: absolute; left: " + x + "px; top: " + y + "px;'><div>");

        init(angular.element('.pnd-dropdown'), position);       
        menu.$promise.then(menu.show);
    };

    // hide and destroy the showed menu
    contextualMenu.hide = function(){
        if ( menu !== null) {
            menu.hide();
            menu.destroy();
            angular.element('.pnd-dropdown').remove();
            menu = null;
        }
    };

    // add passed action (use name as key to not produce duplicates) 
    contextualMenu.addAction = function(name, label, type, showIf, action){

        var find = menuActions.some(function(el, index, array){
            return angular.equals(name, el.name);
        });

        if ( !find ) {
            menuActions.push({
                name: name,
                label: label,
                type: type,
                showIf: showIf,
                action: action
            });            
        }

    };

    contextualMenu.log('service run');
    return contextualMenu;

});