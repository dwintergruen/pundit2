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

    var errorLog = [],
        loadingCount = 0;

    var updateLoading = function() {
        EventDispatcher.sendEvent('Pundit.loading', state.Pundit.loading);
    };

    var setLoading = function(currentState) {
        if (currentState) {
            loadingCount++;
            state.Pundit.loading = true;
            updateLoading();
        } else {
            loadingCount--;
            if (loadingCount <= 0) {
                state.Pundit.loading = false;
                updateLoading();
                loadingCount = 0;
            }
        }
    }

    // Loading
    EventDispatcher.addListeners(['NotebookComposerCtrl.loading', 'MyItems.loading', 
        'NotebookCommunication.loading', 'AnnotationsCommunication.loading', 'Annomatic.loading'], 
        function (e) {
            setLoading(e.args);
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