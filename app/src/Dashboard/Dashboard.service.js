angular.module('Pundit2.Dashboard')
.constant('DASHBOARDDEFAULTS', {

    isDashboardVisible: true,

    // dashboard container
    containerMinHeight: 200,
    containerMaxHeight: 500,
    containerHeight: 250,

    // dashboard panels
    listsWidth: 235,
    listsRatio: 0.25,
    listsMinWidth: 235,

    toolsWidth: 470,
    toolsRatio: 0.50,
    toolsMinWidth: 470,

    detailsWidth: 235,
    detailsRatio: 0.25,
    detailsMinWidth: 235,

    // separator
    separatorsWidth: 10,

    // footer height
    footerHeight: 20,

    debug: true
})
.service('Dashboard', function(BaseComponent, DASHBOARDDEFAULTS, $window, $rootScope) {

    var dashboard = new BaseComponent('Dashboard', DASHBOARDDEFAULTS);

    var containerMinWidth = dashboard.options.listsMinWidth + dashboard.options.toolsMinWidth + dashboard.options.detailsMinWidth + (2 * dashboard.options.separatorsWidth),
        availableWidth = Math.max(angular.element($window).width(), containerMinWidth) - (2 * dashboard.options.separatorsWidth);
    
    var state = {

        isDashboardVisible : dashboard.options.isDashboardVisible,

        listsWidth: dashboard.options.listsRatio * availableWidth,
        listsRatio: dashboard.options.listsRatio,

        toolsWidth: dashboard.options.toolsRatio * availableWidth,
        toolsRatio: dashboard.options.toolsRatio,

        detailsWidth: dashboard.options.detailsRatio * availableWidth,
        detailsRatio: dashboard.options.detailsRatio, 

        containerWidth: availableWidth + (2 * dashboard.options.separatorsWidth),
        containerHeight: dashboard.options.containerHeight,
        containerUtilsWidth: availableWidth

    };

    var resetListToDefault = function(){
        state.listsWidth = dashboard.options.listsMinWidth;
        state.listsRatio = dashboard.options.listsRatio;
    };
    // set lists width and update ratio
    var setListWidth = function(of){
        state.listsWidth = Math.max(state.listsWidth + of, dashboard.options.listsMinWidth);
        state.listsRatio = state.listsWidth / state.containerUtilsWidth;
    };

    var resetToolsToDefault = function(){
        state.toolsWidth = dashboard.options.toolsMinWidth;
        state.toolsRatio = dashboard.options.toolsRatio;
    };
    // set tools width and update ratio
    var setToolsWidth = function(of){
        state.toolsWidth = Math.max(state.toolsWidth + of, dashboard.options.toolsMinWidth);
        state.toolsRatio = state.toolsWidth / state.containerUtilsWidth;
    };

    var resetDetailsToDefault = function(){
        state.detailsWidth = dashboard.options.detailsMinWidth;
        state.detailsRatio = dashboard.options.detailsRatio;
    };
    // set details width and update ratio
    var setDetailsWidth = function(of){
        state.detailsWidth = Math.max(state.detailsWidth + of, dashboard.options.detailsMinWidth);
        state.detailsRatio = state.detailsWidth / state.containerUtilsWidth;
    };

    /**** DASHBOARD ****/
    dashboard.toogle = function(bool){
        state.isDashboardVisible = bool;
    };

    dashboard.isDashboardVisible = function(){
        return state.isDashboardVisible;
    };

    /**** CONTAINER ****/
    dashboard.getContainerHeight = function() {
        return state.containerHeight;
    }

    dashboard.setContainerHeight = function(height) {
        if (height > dashboard.options.containerMinHeight && height < dashboard.options.containerMaxHeight) {
            state.containerHeight = height;
            $rootScope.$apply();
        }
    };

    dashboard.getContainerWidth = function() {
        return state.containerWidth;
    };

    dashboard.getContainerUtilsWidth = function() {
        return state.containerUtilsWidth;
    };

    dashboard.setContainerWidth = function(width) {
        
        if (width <= containerMinWidth) {

            dashboard.log('Dashboard is min-width');
            // container is set to min-width
            state.containerWidth = containerMinWidth;
            state.containerUtilsWidth = state.containerWidth - (2 * dashboard.options.separatorsWidth);

            // resize panel to min-width
            resetListToDefault();
            resetToolsToDefault();
            resetDetailsToDefault();

            $rootScope.$apply();

            return;
        }
        state.containerWidth = width;
        state.containerUtilsWidth = state.containerWidth - (2 * dashboard.options.separatorsWidth);

        // index of the smaller than minimum panels (from left to right 0,1,2) (lists, tools, details)
        var smaller = [];
        // delta (negative) of the smaller panels: candidate width - minwidth
        var smallerDelta = [];
        // index of the bigger than minimum panels (from left to right 0,1,2) (lists, tools, details)
        var bigger = [];

        // resize lists panel
        state.listsWidth = state.listsRatio * state.containerUtilsWidth;
        state.listsRatio = state.listsWidth / state.containerUtilsWidth;        
        // check min-width
        if ( state.listsWidth < dashboard.options.listsMinWidth ) {
            smaller.push(0);
            smallerDelta.push(state.listsWidth - dashboard.options.listsMinWidth);
            resetListToDefault();
        } else {
            bigger.push(0);
        }

        // resize tools panel
        state.toolsWidth = state.toolsRatio * state.containerUtilsWidth;
        state.toolsRatio = state.toolsWidth / state.containerUtilsWidth;
        // check min-width
        if ( state.toolsWidth < dashboard.options.toolsMinWidth ) {
            smaller.push(1);
            smallerDelta.push(state.toolsWidth - dashboard.options.toolsMinWidth);
            resetToolsToDefault();
        } else {
            bigger.push(1);
        }

        // resize details panel
        state.detailsWidth = state.detailsRatio * state.containerUtilsWidth;
        state.detailsRatio = state.detailsWidth / state.containerUtilsWidth;
        // check min-width
        if ( state.detailsWidth < dashboard.options.detailsMinWidth ) {
            smaller.push(2);
            smallerDelta.push(state.detailsWidth - dashboard.options.detailsMinWidth);
            resetDetailsToDefault();
        } else {
            bigger.push(2);
        }

        // zero panels are smaller than minimum
        if ( smaller.length === 0 ) {
            dashboard.log('Zero panels are smaller than minimum');
            $rootScope.$apply();
            return;
        }

        // one panel is smaller than min-width
        if ( smaller.length === 1 ) {
            dashboard.log('One panel is smaller than minimum', smaller);
            switch (smaller[0]) {
                // lists
                case 0:
                    var perc = state.toolsRatio + state.detailsRatio;
                    // update widths to fix expansion
                    setToolsWidth(smallerDelta[0] * (state.toolsRatio/perc));
                    setDetailsWidth(smallerDelta[0] * (state.detailsRatio/perc));
                    // TODO : check if one of two panel is now under minimum
                    break;

                // tools
                case 1:
                    var perc = state.listsRatio + state.detailsRatio;
                    // update widths to fix expansion
                    setListWidth(smallerDelta[0] * (state.listsRatio/perc));
                    setDetailsWidth(smallerDelta[0] * (state.detailsRatio/perc));
                    // TODO : check if one of two panel is now under minimum
                    break;

                // details
                case 2:
                    var perc = state.listsRatio + state.toolsRatio;
                    // update widths to fix expansion
                    setListWidth(smallerDelta[0] * (state.listsRatio/perc));
                    setToolsWidth(smallerDelta[0] * (state.toolsRatio/perc));
                    // TODO : check if one of two panel is now under minimum
                    break;

            }

            $rootScope.$apply();
            return;
        }

        // two panels are smaller than min-width
        if ( smaller.length === 2 ) {
            dashboard.log('Two panels are smaller than minimum', smaller);
            var totalDx = smallerDelta[0] + smallerDelta[1];

            switch (bigger[0]) {
                case 0:
                    state.listsWidth = state.listsWidth + totalDx;
                    state.listsRatio = state.listsWidth / state.containerUtilsWidth;
                    break;

                case 1:
                    state.toolsWidth = state.toolsWidth + totalDx;
                    state.toolsRatio = state.toolsWidth / state.containerUtilsWidth;
                    break;

                case 2:
                    state.detailsWidth = state.detailsWidth + totalDx;
                    state.detailsRatio = state.detailsWidth / state.containerUtilsWidth;
                    break;
            }

            $rootScope.$apply();
            return;
        }


        // error
        return;



        // check lists min width
        if ( state.listsWidth < dashboard.options.listsMinWidth ) {

            var dx = dashboard.options.listsMinWidth - state.listsWidth,
                perc = state.toolsRatio + state.detailsRatio;

            // update lists to min-width
            state.listsWidth = dashboard.options.listsMinWidth;
            state.listsRatio = state.listsWidth / state.containerUtilsWidth;            
            
            // update tools to fix lists min-width expansion
            state.toolsWidth = state.toolsWidth - dx * (state.toolsRatio/perc);
            state.toolsRatio = state.toolsWidth / state.containerUtilsWidth;

            // update details to fix lists min-width expansion
            state.detailsWidth = state.detailsWidth - dx * (state.detailsRatio/perc);
            state.detailsRatio = state.detailsWidth / state.containerUtilsWidth;
        }

        // check tools min width
        if ( state.toolsWidth < dashboard.options.toolsMinWidth ) {

            var dx = dashboard.options.toolsMinWidth - state.toolsWidth,
                perc = state.listsRatio + state.detailsRatio;

            // update tools to min-width
            state.toolsWidth = dashboard.options.toolsMinWidth;
            state.toolsRatio = state.toolsWidth / state.containerUtilsWidth;

            // update tools to fix lists min-width expansion
            state.toolsWidth = state.toolsWidth - dx * (state.toolsRatio/perc);
            state.toolsRatio = state.toolsWidth / state.containerUtilsWidth;

            // update details to fix lists min-width expansion
            state.detailsWidth = state.detailsWidth - dx * (state.detailsRatio/perc);
            state.detailsRatio = state.detailsWidth / state.containerUtilsWidth;
        }

        /*if ( state.detailsWidth < dashboard.options.detailsMinWidth){
            state.detailsWidth = dashboard.options.detailsMinWidth;
            state.detailsRatio = state.detailsWidth / state.containerUtilsWidth;
        }*/
        
        $rootScope.$apply();
    };

    /**** PANEL LISTS ****/
    dashboard.getListsPanelWidth = function(){
        return state.listsWidth;
    };

    dashboard.setListsPanelWidth = function(width){
        if (width >= dashboard.options.listsMinWidth) {
            state.listsWidth = width;
            state.listsRatio = width / state.containerUtilsWidth;
            $rootScope.$apply();
        }
    };

    /**** PANEL TOOLS ****/
    dashboard.getToolsPanelWidth = function(){
        return state.toolsWidth;
    };

    dashboard.setToolsPanelWidth = function(width){
        if (width >= dashboard.options.toolsMinWidth) {
            state.toolsWidth = width;
            state.toolsRatio = width / state.containerUtilsWidth;
            $rootScope.$apply();
        }
    };

    dashboard.getToolsPanelLeft = function(){
        return state.listsWidth + dashboard.options.separatorsWidth;
    };

    /**** PANEL DETAILS ****/
    dashboard.getDetailsPanelWidth = function(){
        return state.detailsWidth;
    };

    dashboard.setDetailsPanelWidth = function(width){
        if (width >= dashboard.options.detailsMinWidth) {
            state.detailsWidth = width;
            state.detailsRatio = width / state.containerUtilsWidth;
            $rootScope.$apply();
        }
    };

    dashboard.getDetailsPanelLeft = function(){
        return state.containerWidth - state.detailsWidth;
    };

    /**** FOOTER ****/
    dashboard.getFooterHeight = function(){
        return dashboard.options.footerHeight;
    };

    /**** SEPARATOR ****/
    dashboard.getSeparatorWidth = function(){
        return dashboard.options.separatorsWidth;
    };

    dashboard.setSeparatorHeight =

    dashboard.moveLeftSeparator = function(listsWidth, toolsWidth){

        if ( listsWidth <= dashboard.options.listsMinWidth ) {
            var dx = dashboard.options.listsMinWidth - listsWidth;
            dashboard.setListsPanelWidth(dashboard.options.listsMinWidth);
            dashboard.setToolsPanelWidth(toolsWidth - dx);
        } else if ( toolsWidth <= dashboard.options.toolsMinWidth ) {
            var dx = dashboard.options.toolsMinWidth - toolsWidth;
            dashboard.setListsPanelWidth(listsWidth - dx);
            dashboard.setToolsPanelWidth(dashboard.options.toolsMinWidth);
        } else {
            dashboard.setListsPanelWidth(listsWidth);
            dashboard.setToolsPanelWidth(toolsWidth);
        }

    };

    dashboard.moveRightSeparator = function(toolsWidth, detailsWidth){

        if ( detailsWidth <= dashboard.options.detailsMinWidth ) {
            var dx = dashboard.options.detailsMinWidth - detailsWidth;
            dashboard.setDetailsPanelWidth(dashboard.options.detailsMinWidth);
            dashboard.setToolsPanelWidth(toolsWidth - dx);
        } else if ( toolsWidth <= dashboard.options.toolsMinWidth ) {
            var dx = dashboard.options.toolsMinWidth - toolsWidth;
            dashboard.setDetailsPanelWidth(detailsWidth - dx);
            dashboard.setToolsPanelWidth(dashboard.options.toolsMinWidth);
        } else {
            dashboard.setDetailsPanelWidth(detailsWidth);
            dashboard.setToolsPanelWidth(toolsWidth);
        }

    };

    dashboard.log('dashboard service run');
    
    return dashboard;
});