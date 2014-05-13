angular.module('Pundit2.Toolbar')
.constant('TOOLBARDEFAULTS', {
    askLinkDefault: "http://ask.thepund.it/",
    askLinkUser: "http://ask.thepund.it/#/myAsk/",

    // Class added to the body element as soon as the directive is rendered. It will
    // push down body with some css magic
    bodyClass: "pnd-toolbar-active",

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDomTemplate: "src/Toolbar/ClientToolbar.tmpl.html",

    debug: false
})
.service('Toolbar', function(BaseComponent, TOOLBARDEFAULTS, MyPundit) {

    var toolbar = new BaseComponent('Toolbar', TOOLBARDEFAULTS);
    
    var errorID = 0,
        isErrorShown = false,
        errorMessageDropdown = [];

    toolbar.getErrorShown = function() {
        return isErrorShown;
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
    
    toolbar.setNotebooks = function() {
        //TODO
    };
    
    toolbar.setTemplates = function() {
        //TODO
    };
    
    toolbar.getAskLink = function() {
        if (MyPundit.getUserLogged()) {
            return toolbar.options.askLinkUser;
        } else {
            return toolbar.options.askLinkDefault;
        }
    };
    
    return toolbar;

});