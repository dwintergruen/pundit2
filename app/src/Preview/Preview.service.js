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
     * Configuration for Preview module.
     * Preview panel is that component where is possible to see a preview of some item's details(like label, descriptio, types,...) .
     * It is shown in a panel in the dashboard. As default, it is shown in 'details' panel, but it is possible to configure it.
     * When preview panel is empty, a welcome message will be shown.
     *
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
    welcomeHeaderMessage: "Welcome in Pundit",
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
    welcomeBodyMessage: "This is the preview area of Pundit. Just click on an element in a list to select it and see its details here. Enjoy using Pundit.",
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

/**
 * @ngdoc service
 * @name Preview
 * @module Pundit2.Preview
 * @description
 *
 * Handles the preview of an item: given an item, show/hide a preview of some details of the item.
 * It is possible set an item as sticky or not, and check if a given item is set as sticky or not.
 *
 */
.service('Preview', function(BaseComponent, PREVIEWDEFAULTS) {

    var preview = new BaseComponent('Preview', PREVIEWDEFAULTS);
    var state;
    state = {
        itemDashboardPreview: null,
        itemDashboardSticky: null,
        heigthTypesDiv: null,
        typesHidden: null
    };

    /**
     * @ngdoc method
     * @name Preview#getWelcomeHeaderMessage
     * @module Pundit2.Preview
     * @function
     *
     * @description
     * Return the welcome message that will be shown in the header of preview panel when no preview is shown.
     *
     * @return {string} header welcome message set in the configuration of Preview module. See {@link #!/api/punditConfig/object/modules#Preview.welcomeHeaderMessage here} for details
     *
     */
    preview.getWelcomeHeaderMessage = function() {
        return preview.options.welcomeHeaderMessage;
    };

    /**
     * @ngdoc method
     * @name Preview#getWelcomeBodyMessage
     * @module Pundit2.Preview
     * @function
     *
     * @description
     * Return the welcome message that will be shown in the body of preview panel when no preview is shown.
     *
     * @return {string} body welcome message set in the configuration of Preview module. See {@link #!/api/punditConfig/object/modules#Preview.welcomeBodyMessage here} for details
     *
     */
    preview.getWelcomeBodyMessage = function() {
        return preview.options.welcomeBodyMessage;
    };

    /**
     * @ngdoc method
     * @name Preview#showDashboardPreview
     * @module Pundit2.Preview
     * @function
     *
     * @description
     * Show a preview of the given item in the chosen panel. The panel where preview will be show is that set in configuration object. See {@link #!/api/punditConfig/object/modules#Preview.clientDashboardPanel here} for details
     * Preview will show the follow details of an item:
     * * label
     * * types
     * * description (if present)
     * * image (if present)
     *
     * @param {Object} Item to show in preview panel.
     *
     */
    preview.showDashboardPreview = function(item) {
        state.itemDashboardPreview = item;
    };


    /**
     * @ngdoc method
     * @name Preview#getItemDashboardPreview
     * @module Pundit2.Preview
     * @function
     *
     * @description
     * Get current item shown in preview preview
     *
     * @return {Object} Current item shown in preview panel
     *
     */
    preview.getItemDashboardPreview = function() {
        return state.itemDashboardPreview;
    };

    /**
     * @ngdoc method
     * @name Preview#setItemDashboardSticky
     * @module Pundit2.Preview
     * @function
     *
     * @description
     * Set an item as sticky.
     *
     * In this way, if there is not a current item shown in preview, the panel in dashboard will not be empty but the sticky item will be shown on it.
     *
     * @param {Object} Item to set as sticky.
     *
     */
    preview.setItemDashboardSticky = function(item) {
        state.itemDashboardSticky = item;
    };

    /**
     * @ngdoc method
     * @name Preview#getItemDashboardSticky
     * @module Pundit2.Preview
     * @function
     *
     * @description
     * Get the current stitky item
     *
     * @return {Object} Current item set as sticky
     *
     */
    preview.getItemDashboardSticky = function() {
        return state.itemDashboardSticky;
    };

    /**
     * @ngdoc method
     * @name Preview#clearItemDashboardSticky
     * @module Pundit2.Preview
     * @function
     *
     * @description
     * Reset dashboard preview, cleaning both item show in preview and sticky item.
     *
     * In this way, preview panel will be empty and will be shown welcome message
     *
     */
    preview.clearItemDashboardSticky = function() {
        state.itemDashboardSticky = null;
        state.itemDashboardPreview = null;
    };

    // if no item is sticky, show empty preview
    // otherwise show the sticky item
    /**
     * @ngdoc method
     * @name Preview#hideDashboardPreview
     * @module Pundit2.Preview
     * @function
     *
     * @description
     * Hide current item preview. If there is a sticky item, it will be shown in preview panel,
     * otherwise preview panel will be empty and will be shown welcome message
     *
     */
    preview.hideDashboardPreview = function() {

        if (state.itemDashboardSticky === null) {
            state.itemDashboardPreview = null;
        } else {
            state.itemDashboardPreview = state.itemDashboardSticky;
        }
    };

    // return true if an item is the sticky item
    // if no item is given, check if current item preview is the sticky item
    /**
     * @ngdoc method
     * @name Preview#isStickyItem
     * @module Pundit2.Preview
     * @function
     *
     * @description
     * Check if the passed item it's the current sticky item or not.
     *
     * In this way, if there is not a current item shown in preview, the panel in dashboard will not be empty but the sticky item will be shown on it.
     *
     * @param {Object} Item item to check if it is the sticky item.
     * @return {boolean} `true` if the passed item is the current sticky item, `false` otherwise
     *
     */
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