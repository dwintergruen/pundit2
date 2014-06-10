angular.module('Pundit2.Preview')
.constant('PREVIEWDEFAULTS', {
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Preview
     *
     * @description
     * `object`
     *
     * Configuration for Preview module
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Preview.welcomeHeaderMessage
     *
     * @description
     * `string`
     *
     * A welcome message visible in the header of preview panel when it is empty
     *
     * Default value:
     * <pre> welcomeHeaderMessage: "Welcome in Pundit 2" </pre>
     */
    welcomeHeaderMessage: "Welcome in Pundit 2",
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Preview.welcomeBodyMessage
     *
     * @description
     * `string`
     *
     * A welcome message visible in the body of preview panel when it is empty
     *
     * Default value:
     * <pre> welcomeBodyMessage: "Enjoy it" </pre>
     */
    welcomeBodyMessage: "Enjoy it",
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Preview.clientDashboardTemplate
     *
     * @description
     * `string`
     *
     * Path of template containing preview directive
     * The Client will append the content of this template to the DOM to bootstrap this component
     *
     * Default value:
     * <pre> clientDashboardTemplate: "src/Preview/ClientDashboardPreview.tmpl.html" </pre>
     */
    clientDashboardTemplate: "src/Preview/ClientDashboardPreview.tmpl.html",
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Preview.clientDashboardPanel
     *
     * @description
     * `string`
     *
     * Dashboard panel where preview will be shown
     *
     * Default value:
     * <pre> clientDashboardPanel: "details" </pre>
     */
    clientDashboardPanel: "details",
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Preview.clientDashboardTabTitle
     *
     * @description
     * `string`
     *
     * Title of the panel where preview will be shown
     *
     * Default value:
     * <pre> clientDashboardTabTitle: "Preview" </pre>
     */
    clientDashboardTabTitle: "Preview"

})
.service('Preview', function(BaseComponent, PREVIEWDEFAULTS, NameSpace) {

    var preview = new BaseComponent('Preview', PREVIEWDEFAULTS);
    var state;
    state = {
        itemDashboardPreview: null,
        itemDashboardSticky: null,
        heigthTypesDiv: null,
        typesHidden: null
        };

    preview.setTypeHiddenPresent = function(val) {
        return preview.options.typesHidden = val;
    };

    preview.getTypeHiddenPresent = function() {
        return preview.options.typesHidden;
    };

    preview.setheigthTypesDiv = function(height) {
        return preview.options.heigthTypesDiv = height;
    };

    preview.getheigthTypesDiv = function() {
        return preview.options.heigthTypesDiv;
    };

    preview.getWelcomeHeaderMessage = function() {
        return preview.options.welcomeHeaderMessage;
    };

    preview.getWelcomeBodyMessage = function() {
        return preview.options.welcomeBodyMessage;
    };

    // show item preview in dashboard panel
    preview.showDashboardPreview = function(item) {
        state.itemDashboardPreview = item;
    };

    // get current item shown in preview
    preview.getItemDashboardPreview = function() {
        return state.itemDashboardPreview;
    };

    // set an item as sticky
    preview.setItemDashboardSticky = function(item) {
        state.itemDashboardSticky = item;
    };

    // return current sticky item
    preview.getItemDashboardSticky = function() {
        return state.itemDashboardSticky;
    };

    // reset dashboard preview
    // clear both item dashoboard and sticky item
    // in this way preview panel will be empty and will be shown welcome message
    preview.clearItemDashboardSticky = function() {
        state.itemDashboardSticky = null;
        state.itemDashboardPreview = null;
    };

    // if no item is sticky, show empty preview
    // otherwise show the sticky item
    preview.hideDashboardPreview = function(){

        if(state.itemDashboardSticky === null ) {
            state.itemDashboardPreview = null;
        } else {
            state.itemDashboardPreview = state.itemDashboardSticky;
        }
    };

    // return true if an item is the sticky item
    // if no item is given, check if current item preview is the sticky item
    preview.isStickyItem = function(item) {
        var itemToCheck;

        if (typeof(item) !== 'undefined') {
            itemToCheck = item;
        } else {
            itemToCheck = state.itemDashboardPreview;
        }

        if (state.itemDashboardSticky !== null && itemToCheck !== null) {
            return state.itemDashboardSticky.uri === itemToCheck.uri;
        } else {
            return false;
        }
    };

    return preview;
});