angular.module('Pundit2.Core')

.constant("STATUSDEFAULTS", {
    debug: false
})

.service('Status', function(BaseComponent, EventDispatcher, STATUSDEFAULTS) {

    var status = new BaseComponent('Status', STATUSDEFAULTS);

    var state = {
        AnnotationSidebar: {},
        Dashboard: {},
        Toolbar: {},
        Pundit: {
            clientBoot: false,
            userLogged: false,
            loading: false,
            templateMode: false
        }
    };

    var errorLog = [],
        loadingCount = {};

    var updateLoading = function(currentState) {
        EventDispatcher.sendEvent('Pundit.loading', currentState);
    };

    var setLoading = function(eventName, currentState)  {
        var loadingState = [];

        if (typeof(loadingCount[eventName]) === 'undefined') {
            loadingCount[eventName] = 0;
        }

        if (currentState) {
            state.Pundit.loading = true;
            updateLoading(true);

            loadingCount[eventName] ++;
        } else {
            loadingCount[eventName] --;
            loadingState = Object.keys(loadingCount).filter(
                function(index) {
                    return loadingCount[index] > 0;
                }
            );

            if (loadingState.length === 0) {
                state.Pundit.loading = false;
                updateLoading(false);
                loadingCount[eventName] = 0;
            }
        }
    };

    // Loading
    EventDispatcher.addListeners(
        [
            'AnnotationsCommunication.loading',
            'NotebookCommunication.loading',
            'NotebookComposerCtrl.loading',
            'Annomatic.loading',
            'MyItems.loading'

        ],
        function(e) {
            setLoading(e.name, e.args);
        }
    );

    // Client
    EventDispatcher.addListener('Client.boot', function() {
        state.Pundit.clientBoot = true;
    });

    // MyPundit
    EventDispatcher.addListener('MyPundit.isUserLogged', function(e) {
        state.Pundit.userLogged = e.args;
    });

    // AnnotationSidebar
    EventDispatcher.addListener('AnnotationSidebar.toggle', function(e) {
        state.AnnotationSidebar.isExpanded = e.args;
    });
    EventDispatcher.addListener('AnnotationSidebar.toggleFiltersContent', function(e) {
        state.AnnotationSidebar.isFiltersContentExpanded = e.args;
    });

    // Template mode
    EventDispatcher.addListener('Pundit.templateMode', function(e) {
        state.Pundit.templateMode = e.args;

        // Reset selection when template state change
        EventDispatcher.sendEvent('Pundit.changeSelection');
    });

    // Error
    EventDispatcher.addListener('Pundit.error', function(e) {
        errorLog.push(e.args);
    });

    status.getState = function(component) {
        return state[component];
    };

    status.getClientBoot = function() {
        return state.Pundit.clientBoot;
    };

    status.getLoading = function() {
        return state.Pundit.loading;
    };

    status.getUserStatus = function() {
        return state.Pundit.userLogged;
    };

    status.getTemplateModeStatus = function() {
        return state.Pundit.templateMode;
    };

    status.getLog = function() {
        return errorLog;
    };

    return status;
});