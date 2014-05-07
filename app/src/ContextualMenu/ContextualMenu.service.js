angular.module('Pundit2.ContextualMenu')
.constant('CONTEXTUALMENUDEFAULT', {

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

    var menuContent = defaultContent;

    var menu;

    var addNewContent = function(label, action){
        menuContent.push({
            "text": label,
            "click": action
        });
    };

    var init = function(element){
        // build scope
        var options = {scope: $rootScope.$new()};
        options.scope.content = menuContent;
        // build menu
        menu = $dropdown(angular.element(element), options);
    };

    contextualMenu.show = function(element){
        init(element);       
        menu.$promise.then(menu.show);
    };

    contextualMenu.hide = function(){
        menu.hide();
        menu.destroy();
    };

    contextualMenu.addAction = function(label, showIf, action){
        if( showIf() ) {
            addNewContent(label, action);            
        }
    };

    contextualMenu.log('service run');
    return contextualMenu;

});