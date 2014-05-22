angular.module('Pundit2.Vocabularies')
.constant('VOCABULARIESCONTAINERDEFAULTS', {

    initialActiveTab: 0,

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDashboardTemplate: "src/Lists/Vocabularies/VocabulariesContainer/ClientVocabulariesContainer.tmpl.html",
    clientDashboardPanel: "lists",
    clientDashboardTabTitle: "Vocab",

    // items property used to compare
    order: 'label',
    // how order items (true ascending, false descending)
    reverse: false,

    // Icons shown in the search input when it's empty and when it has some content
    inputIconSearch: 'pnd-icon-search',
    inputIconClear: 'pnd-icon-times',

    debug: false
})
.service('VocabulariesContainer', function(VOCABULARIESCONTAINERDEFAULTS, BaseComponent) {

    var vocabulariesContainer = new BaseComponent('VocabulariesContainer', VOCABULARIESCONTAINERDEFAULTS);

    return vocabulariesContainer;

});