angular.module('Pundit2.PageItemsContainer')
.constant('ITEMSCONTAINERDEFAULTS', {

    initialActiveTab: 0,

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDashboardTemplate: "src/PageItemsContainer/ClientPageItemsContainer.tmpl.html",
    clientDashboardPanel: "lists",
    clientDashboardTabTitle: "Page Items",

    debug: false
})
.service('PageItemsContainer', function(ITEMSCONTAINERDEFAULTS, BaseComponent) {

    var itemsContainer = new BaseComponent('PageItemsContainer', ITEMSCONTAINERDEFAULTS);


    return itemsContainer;

});