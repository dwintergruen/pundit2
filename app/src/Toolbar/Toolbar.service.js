angular.module('Pundit2.Toolbar')
.constant('TOOLBARDEFAULTS', {
    askLinkDefault: "http://ask.thepund.it/",
    askLinkUser: "http://ask.thepund.it/#/myAsk/"
})
.service('Toolbar', function(BaseComponent, TOOLBARDEFAULTS) {


    // TODO SIMO: in generale devi fare ancora molta attenzione alla pulizia del codice
    // - ogni tanto e' indentato con meno di 4 spazi o cmq male
    // - gli spazi da mettere sempre:
    //    dopo le () e prima di { ---> function() {
    //    dopo i : nelle dichiarazioni di oggetti ---> { prop: valore }
    //    dopo if e prima di {} ---> if ()
    //    attorno agli else ---> } else {
    // .... insomma, un po' piu' di precisione!


    var toolbar = new BaseComponent('Toolbar', TOOLBARDEFAULTS);
    
    var errorID = 0;
    
    var isUserLogged = false;
    var isErrorShown = false;
    var errorMessageDropdown = [];

    // TODO SIMO: rinominiamo in setUserLogged e getUserLogged?
    toolbar.setUserStatus = function(status) {
        isUserLogged = status;
    };
    
    toolbar.getUserStatus = function() {
        return isUserLogged;
    };
    
    toolbar.setErrorShown = function(status) {
        isErrorShown = status;
    };
    
    toolbar.getErrorShown = function() {
        return isErrorShown;
    };
    
    // Send error to show in the toolbar
    // @param message = Custom error message according with user action
    // @param callback = is a function user can click to resolve error
    toolbar.addError = function(message, callback) {
        var errID = errorID;

        // TODO SIMO: get callback? ma che vuol dire? ExecuteCallback ? RunCallback ?

        // TODO: verifichiamo che callback sia una funzione prima di invocarla

        // remove error from array and get call callback() function
        var removeErrorAndGetCallback = function() {
            toolbar.removeError(errID);
            callback();
        };
        
        var error = {text: message, click: removeErrorAndGetCallback, id: errID};
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

    // TODO SIMO: getError? A che serve? A chi serve? se restituisce la error message dropdown
    // chiamiamola getErrorMessageDropdown

    // get error messages and callbacks
    toolbar.getError = function() {
        return errorMessageDropdown;
    };
    
    toolbar.setNotebooks = function() {
        //TODO
    };
    
    toolbar.setTemplates = function() {
        //TODO
    };
    
    toolbar.getAskLink = function() {
        if (isUserLogged) {
            return toolbar.options.askLinkUser;
        } else {
            return toolbar.options.askLinkDefault;
        }
    };
    
    return toolbar;

});