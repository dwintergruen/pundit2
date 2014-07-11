angular.module('Pundit2.Toolbar')
.constant('TOOLBARDEFAULTS', {
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Toolbar
     *
     * @description
     * `object`
     *
     * Configuration for Toolbar module.
     * Toolbar is always visible and positioned at the top of the page
     * and push content of the page down by the CSS bodyClass. It is possible to configure the link to Ask Page.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Toolbar.askLinkDefault
     *
     * @description
     * `string`
     *
     * URL to Ask the Pundit shown when user is not logged in
     *
     * Default value:
     * <pre> askLinkDefault: "http://demo-cloud.ask.thepund.it/" </pre>
     */
    askLinkDefault: "http://demo-cloud.ask.thepund.it/",
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Toolbar.askLinkUser
     *
     *
     * @description
     * `string`
     *
     * URL to Ask the Pundit shown where user is logged in. By default it link to myAsk user's page
     *
     * Default value:
     * <pre> askLinkUser: "http://demo-cloud.ask.thepund.it/#/myAsk/" </pre>
     */
    askLinkUser: "http://demo-cloud.ask.thepund.it/#/myAsk/",
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Toolbar.bodyClass
     *
     * @description
     * `string`
     *
     * Class added to the body element as soon as the directive is rendered. It will push down body of the current web page.
     * In this way pundit toolbar and his components are always visibile.
     *
     * Default value:
     * <pre> bodyClass: "pnd-toolbar-active" </pre>
     */
    bodyClass: "pnd-toolbar-active",
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Toolbar.clientDomTemplate
     *
     * @description
     * `string`
     *
     * Path of template containing toolbar directive
     * The Client will append the content of this template to the DOM to bootstrap this component
     *
     * Default value:
     * <pre> clientDomTemplate: "src/Toolbar/ClientToolbar.tmpl.html" </pre>
     */
    clientDomTemplate: "src/Toolbar/ClientToolbar.tmpl.html",
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Toolbar.debug
     *
     * @description
     * `boolean`
     *
     * Active debug log
     *
     * Default value:
     * <pre> debug: false </pre>
     */
    debug: false
})

    .service('Toolbar', function(BaseComponent, TOOLBARDEFAULTS, MyPundit, TripleComposer) {

    var toolbar = new BaseComponent('Toolbar', TOOLBARDEFAULTS);
    
    var errorID = 0,
        loadingOperation = 0,
        isLoadingShown = false,
        isErrorShown = false,
        errorMessageDropdown = [],
        // tell to other components if is active the template mode
        templateMode = false;

    toolbar.getErrorShown = function() {
        return isErrorShown;
    };

    toolbar.isLoading = function() {
        return isLoadingShown;
    };

    toolbar.setLoading = function(v) {
        toolbar.log('Setting loading to '+ v);
        if (v) {
            loadingOperation++;
            isLoadingShown = true;
        } else {
            loadingOperation--;
            if (loadingOperation <= 0) {
                isLoadingShown = false;
                loadingOperation = 0;
            }
        }
    };
    
    // Send error to show in the toolbar
    // @param message = Custom error message according with user action
    // @param callback = is a function user can click to resolve error
    toolbar.addError = function(message, callback) {
        var errID = errorID;

        // remove error from array and execute callback function
        var removeErrorAndGetCallback = function() {
            toolbar.removeError(errID);
            if (typeof(callback) === 'function' && callback !== '') {
                callback();
            }
        };
        
        var error = { text: message, click: removeErrorAndGetCallback, id: errID };
        errorID++;
        errorMessageDropdown.push(error);
        isErrorShown = true;

        // trigger toolbar error dropdown
        if (angular.element('.pnd-toolbar-error-button ul').length === 0) {
            var button = angular.element('.pnd-toolbar-error-button a');
            button.trigger('click');
        }
        
        return errID;
    };
    
    // Remove error from toolbar
    toolbar.removeError = function(errorID) {
        for (var i=0; i<errorMessageDropdown.length; i++) {
            if (errorMessageDropdown[i].id === errorID) {
               errorMessageDropdown.splice(i, 1);
               break;
            }
        }
           
        if (errorMessageDropdown.length === 0) {
            isErrorShown = false;
        }
    };

    // get error messages and callbacks
    toolbar.getErrorMessageDropdown = function() {
        return errorMessageDropdown;
    };
    
    toolbar.getAskLink = function() {
        if (MyPundit.isUserLogged()) {
            return toolbar.options.askLinkUser;
        } else {
            return toolbar.options.askLinkDefault;
        }
    };

    toolbar.isActiveTemplateMode = function() {
        return templateMode;
    };

    toolbar.toggleTemplateMode = function() {
        TripleComposer.reset();
        templateMode = !templateMode;
        if (templateMode) {
            TripleComposer.showCurrentTemplate();            
        } else {
            // disable save btn
            angular.element('.pnd-triplecomposer-save').addClass('disabled');
        }
    };
    
    return toolbar;

});