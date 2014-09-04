angular.module('Pundit2.PredicatesContainer')
.constant('PREDICATESCONTAINERDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PredicatesContainer
     *
     * @description
     * `object`
     *
     * Configuration object for PredicatesContainer module. By default, PredicatesContainer directive is located
     * in the first panel of the dashboard (lists) and allows you to display the list of available predicates.
     */

    /**
     * @ngdoc property
     * @name modules#PredicatesContainer.active
     *
     * @description
     * `boolean`
     *
     * Default state of the PredicatesContainer module, if it is set to true 
     * the client adds to the DOM (inside dashboard) the PredicatesContainer directive in the boot phase.
     *
     * Default value:
     * <pre> active: true </pre>
     */

     /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PredicatesContainer.clientDashboardTemplate
     *
     * @description
     * `string`
     *
     * Path of template containing myItemsContainer directive, client will append the content of this template 
     * to the DOM (inside dashboard directive) to bootstrap this component
     *
     * Default value:
     * <pre> clientDashboardTemplate: "src/Lists/PredicatesContainer/ClientPredicatesContainer.tmpl.html" </pre>
     */
    clientDashboardTemplate: "src/Lists/PredicatesContainer/ClientPredicatesContainer.tmpl.html",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PredicatesContainer.clientDashboardPanel
     *
     * @description
     * `string`
     *
     * Name of the panel where append the directive (legal value to default are: 'lists', 'tools' and 'details')
     *
     * Default value:
     * <pre> clientDashboardPanel: "lists" </pre>
     */
    clientDashboardPanel: "lists",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PredicatesContainer.clientDashboardTabTitle
     *
     * @description
     * `string`
     *
     * Tab title inside panel dashboard tabs
     *
     * Default value:
     * <pre> clientDashboardTabTitle: "Predicates" </pre>
     */
    clientDashboardTabTitle: "Predicates",

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#PredicatesContainer.cMenuType
     *
     * @description
     * `string`
     *
     * Contextual menu type showed by items contained inside directive
     *
     * Default value:
     * <pre> cMenuType: 'predicates' </pre>
     */
    cMenuType: 'predicates'
    
})
.service('PredicatesContainer', function(PREDICATESCONTAINERDEFAULTS, BaseComponent) {

    // empty service only used inside Client.service.js to read the default configuration
    // and build the expected interface inside list panel

    return new BaseComponent('PredicatesContainer', PREDICATESCONTAINERDEFAULTS);

});