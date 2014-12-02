angular.module('Pundit2.Core')
.constant("STATUSDEFAULTS", {
    debug: false
})
.service('Status', function (BaseComponent, EventDispatcher, STATUSDEFAULTS) {

    var status = new BaseComponent('Status');

    var state = {
            AnnotationSidebar: {},
            Dashboard: {},
            Toolbar: {},
            Pundit: {
                clientBoot: false,
                userLogged: false,
                loading: false
            }
    };

    var errorLog = [];

    // Pundit
    EventDispatcher.addListener('Pundit.loading', function (e) {
        state.Pundit.loading = e.args;
    });    

    // Client
    EventDispatcher.addListener('Client.boot', function () {
        state.Pundit.clientBoot = true;
    });

    // MyPundit
    EventDispatcher.addListener('MyPundit.isUserLogged', function (e) {
        state.Pundit.userLogged = e.args;
    });

    // AnnotationSidebar
    EventDispatcher.addListener('AnnotationSidebar.toggle', function (e) {
        state.AnnotationSidebar.isExpanded = e.args;
    });

    // Error
    EventDispatcher.addListener('Pundit.error', function (e) {
        errorLog.push(e.args);
    });

    status.getState = function (component) {
        return state[component];
    };

    status.getClientBoot = function () {
        return state.Pundit.clientBoot;
    };

    status.getLoading = function () {
        return state.Pundit.loading;
    };    

    status.getUserStatus = function () {
        return state.Pundit.userLogged;
    };

    status.getLog = function () {
        return errorLog;
    };

    return status;
});