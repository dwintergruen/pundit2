angular.module('Pundit2.ContextualMenu')
.constant('CONTEXTUALMENUDEFAULT', {

    position: 'bottom-left',

    debug: true
})
.service('ContextualMenu', function($rootScope, BaseComponent, CONTEXTUALMENUDEFAULT, $dropdown) {

    contextualMenu = new BaseComponent('ContextualMenu', CONTEXTUALMENUDEFAULT);

    var defaultContent = [
        { "text": "Action1", "href": "dashboard.html"},
        { "text": "Action2", "click": function(){
            console.log('exe action 2');
        }}
    ];

    var menuActions = [];

    var menu;

    var buildContent = function(){
        var content = angular.copy(defaultContent);

        for ( var i in menuActions ) {
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
        // build menu
        menu = $dropdown(angular.element(element), options);
    };

    contextualMenu.show = function(element, position){
        init(element, position);       
        menu.$promise.then(menu.show);
    };

    contextualMenu.hide = function(){
        menu.hide();
        menu.destroy();
    };

    contextualMenu.addAction = function(name, label, type, showIf, action){
        menuActions.push({
            name: name,
            label: label,
            type: type,
            showIf: showIf,
            action: action
        });
    };

    contextualMenu.log('service run');
    return contextualMenu;

});