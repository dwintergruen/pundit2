angular.module('Pundit2.MyNotebooksContainer')
.constant('MYNOTEBOOKSCONTAINERDEFAULTS', {

    clientDashboardTemplate: "src/Lists/MyNotebooksContainer/ClientMyNotebooksContainer.tmpl.html",

    clientDashboardPanel: "lists",

    clientDashboardTabTitle: "My Notebooks",

    cMenuType: 'myNotebooks',

    container: 'myNotebooks',

    inputIconSearch: 'pnd-icon-search',

    inputIconClear: 'pnd-icon-times'
    
})
.service('MyNotebooksContainer', function(MYNOTEBOOKSCONTAINERDEFAULTS, BaseComponent) {

    var myNotebooksContainer = new BaseComponent('MyNotebooksContainer', MYNOTEBOOKSCONTAINERDEFAULTS);

    // used only to configuration, this service is injected inside client and controller
    // to read the passed configuration

    return myNotebooksContainer;

});