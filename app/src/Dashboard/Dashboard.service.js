angular.module('Pundit2.Dashboard')
.constant('DASHBOARDDEFAULTS', {

    isDashboardVisible: true,

    // dashboard container
    containerMinHeight: 200,
    containerMaxHeight: 500,
    containerHeight: 250,

    // dashboard lists panels (left)
    listsWidth: 235,
    listsRatio: 0.25,
    listsMinWidth: 235,

    // dashboard tools panels (center)
    toolsWidth: 470,
    toolsRatio: 0.50,
    toolsMinWidth: 470,

    // dashboard details panels (right)
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

    var containerMinWidth = dashboard.options.listsMinWidth + dashboard.options.toolsMinWidth + dashboard.options.detailsMinWidth + (2 * dashboard.options.separatorsWidth);
    
    var containerAvailableWidth = Math.max(angular.element($window).width(), containerMinWidth) - (2 * dashboard.options.separatorsWidth);
    
    var state = {

        isDashboardVisible : dashboard.options.isDashboardVisible,

        listsWidth: dashboard.options.listsRatio * containerAvailableWidth,
        listsRatio: dashboard.options.listsRatio,

        toolsWidth: dashboard.options.toolsRatio * containerAvailableWidth,
        toolsRatio: dashboard.options.toolsRatio,

        detailsWidth: dashboard.options.detailsRatio * containerAvailableWidth,
        detailsRatio: dashboard.options.detailsRatio, 

        containerWidth: containerAvailableWidth + (2 * dashboard.options.separatorsWidth),
        containerHeight: dashboard.options.containerHeight

    };

    // reset lists width to default and update ratio
    var resetListsWidth = function(){
        state.listsWidth = dashboard.options.listsMinWidth;
        state.listsRatio = state.listsWidth / containerAvailableWidth;
    };
    // sum offset to lists width and update ratio
    var sumOffsetToListsWidth = function(of){
        state.listsWidth = Math.max(state.listsWidth + of, dashboard.options.listsMinWidth);
        state.listsRatio = state.listsWidth / containerAvailableWidth;
    };

    // reset tools width to default and update ratio
    var resetToolsWidth = function(){
        state.toolsWidth = dashboard.options.toolsMinWidth;
        state.toolsRatio = state.toolsWidth / containerAvailableWidth;
    };
    // sum offset to tools width and update ratio
    var sumOffsetToToolsWidth = function(of){
        state.toolsWidth = Math.max(state.toolsWidth + of, dashboard.options.toolsMinWidth);
        state.toolsRatio = state.toolsWidth / containerAvailableWidth;
    };

    // reset details width to default and update ratio
    var resetDetailsWidth = function(){
        state.detailsWidth = dashboard.options.detailsMinWidth;
        state.detailsRatio = state.detailsWidth / containerAvailableWidth;
    };
    // sum offset to details width and update ratio
    var sumOffsetToDetailsWidth = function(of){
        state.detailsWidth = Math.max(state.detailsWidth + of, dashboard.options.detailsMinWidth);
        state.detailsRatio = state.detailsWidth / containerAvailableWidth;
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

    // set dashboard width then resize panels and mantain ratios and min-widths
    dashboard.setContainerWidth = function(width) {
        
        if (width <= containerMinWidth) {

            dashboard.log('Dashboard is min-width');
            // container is set to min-width
            state.containerWidth = containerMinWidth;
            containerAvailableWidth = state.containerWidth - (2 * dashboard.options.separatorsWidth);

            // resize panel to min-width
            resetListsWidth();
            resetToolsWidth();
            resetDetailsWidth();

            $rootScope.$apply();
            return;
        }
        // update state
        state.containerWidth = width;
        containerAvailableWidth = state.containerWidth - (2 * dashboard.options.separatorsWidth);

        // index of the smaller than minimum panels (from left to right 0,1,2) (lists, tools, details)
        var smaller = [];
        // delta (negative) of the smaller panels: candidate width - minwidth
        var smallerDelta = [];
        // index of the bigger than minimum panels (from left to right 0,1,2) (lists, tools, details)
        var bigger = [];
        
        // TODO : use two parallel array to store widths and ratios
        // widths of the panels (from left to right 0,1,2) (lists, tools, details)
        // var panelsWidth = [];
        // ratios of the panels (from left to right 0,1,2) (lists, tools, details)
        // var panelsRatio = [];


        // resize lists panel
        state.listsWidth = state.listsRatio * containerAvailableWidth;
        state.listsRatio = state.listsWidth / containerAvailableWidth;        
        // check lists min-width
        if ( state.listsWidth < dashboard.options.listsMinWidth ) {
            smaller.push(0);
            smallerDelta.push(state.listsWidth - dashboard.options.listsMinWidth);
            resetListsWidth();
        } else {
            bigger.push(0);
        }

        // resize tools panel
        state.toolsWidth = state.toolsRatio * containerAvailableWidth;
        state.toolsRatio = state.toolsWidth / containerAvailableWidth;
        // check tools min-width
        if ( state.toolsWidth < dashboard.options.toolsMinWidth ) {
            smaller.push(1);
            smallerDelta.push(state.toolsWidth - dashboard.options.toolsMinWidth);
            resetToolsWidth();
        } else {
            bigger.push(1);
        }

        // resize details panel
        state.detailsWidth = state.detailsRatio * containerAvailableWidth;
        state.detailsRatio = state.detailsWidth / containerAvailableWidth;
        // check details min-width
        if ( state.detailsWidth < dashboard.options.detailsMinWidth ) {
            smaller.push(2);
            smallerDelta.push(state.detailsWidth - dashboard.options.detailsMinWidth);
            resetDetailsWidth();
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
                    sumOffsetToToolsWidth(smallerDelta[0] * (state.toolsRatio/perc));
                    sumOffsetToDetailsWidth(smallerDelta[0] * (state.detailsRatio/perc));

                    // check if one of two panel is now under minimum
                    if ( state.toolsWidth < dashboard.options.toolsMinWidth ) {
                        var dx = state.toolsWidth - dashboard.options.toolsMinWidth;
                        resetToolsWidth();
                        sumOffsetToDetailsWidth(dx);
                        dashboard.log('Lists update produce tools under minimum');
                        $rootScope.$apply();
                        return;
                    } else if ( state.detailsWidth < dashboard.options.detailsMinWidth) {
                        var dx = state.detailsWidth - dashboard.options.detailsMinWidth;
                        resetDetailsWidth();
                        sumOffsetToToolsWidth(dx);
                        dashboard.log('Lists update produce details under minimum');
                        $rootScope.$apply();
                        return;
                    } else {
                        // zero panels is under minimum width
                        dashboard.log('Lists update not produce panels under minimun');
                        $rootScope.$apply();
                        return;
                    }
                    break;

                // tools
                case 1:
                    var perc = state.listsRatio + state.detailsRatio;
                    // update widths to fix expansion
                    sumOffsetToListsWidth(smallerDelta[0] * (state.listsRatio/perc));
                    sumOffsetToDetailsWidth(smallerDelta[0] * (state.detailsRatio/perc));
                    // check if one of two panel is now under minimum
                    if ( state.listsWidth < dashboard.options.listsMinWidth ) {
                        var dx = state.listsWidth - dashboard.options.listsMinWidth;
                        resetListsWidth();
                        sumOffsetToDetailsWidth(dx);
                        dashboard.log('Tools update produce lists under minimun');
                        $rootScope.$apply();
                        return;
                    } else if ( state.detailsWidth < dashboard.options.detailsMinWidth) {
                        var dx = state.detailsWidth - dashboard.options.detailsMinWidth;
                        resetDetailsWidth();
                        sumOffsetToListsWidth(dx);
                        dashboard.log('Tools update produce details under minimun');
                        $rootScope.$apply();
                        return;
                    } else {
                        // zero panels is under minimum width
                        dashboard.log('Tools update not produce panels under minimun');
                        $rootScope.$apply();
                        return;
                    }
                    break;

                // details
                case 2:
                    var perc = state.listsRatio + state.toolsRatio;
                    // update widths to fix expansion
                    sumOffsetToListsWidth(smallerDelta[0] * (state.listsRatio/perc));
                    sumOffsetToToolsWidth(smallerDelta[0] * (state.toolsRatio/perc));
                    // check if one of two panel is now under minimum
                    if ( state.listsWidth < dashboard.options.listsMinWidth ) {
                        var dx = state.listsWidth - dashboard.options.listsMinWidth;
                        resetListsWidth();
                        sumOffsetToToolsWidth(dx);
                        dashboard.log('Details update produce lists under minimun');
                        $rootScope.$apply();
                        return;
                    } else if ( state.toolsWidth < dashboard.options.toolsMinWidth) {
                        var dx = state.toolsWidth - dashboard.options.toolsMinWidth;
                        resetToolsWidth();
                        sumOffsetToListsWidth(dx);
                        dashboard.log('Details update produce tools under minimun');
                        $rootScope.$apply();
                        return;
                    } else {
                        // zero panels is under minimum width
                        dashboard.log('Details update not produce panels under minimun');
                        $rootScope.$apply();
                        return;
                    }
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
                    state.listsRatio = state.listsWidth / containerAvailableWidth;
                    break;

                case 1:
                    state.toolsWidth = state.toolsWidth + totalDx;
                    state.toolsRatio = state.toolsWidth / containerAvailableWidth;
                    break;

                case 2:
                    state.detailsWidth = state.detailsWidth + totalDx;
                    state.detailsRatio = state.detailsWidth / containerAvailableWidth;
                    break;
            }

            $rootScope.$apply();
            return;
        }

        // error
        dashboard.log('Resize width error, probably the panels are not correctly resized');
        return;
    };

    /**** PANEL LISTS ****/
    dashboard.getListsPanelWidth = function(){
        return state.listsWidth;
    };
    // set lists panel width (check minimum value)
    dashboard.setListsPanelWidth = function(width){
        if (width >= dashboard.options.listsMinWidth) {
            state.listsWidth = width;
            state.listsRatio = width / containerAvailableWidth;
            $rootScope.$apply();
        }
    };

    /**** PANEL TOOLS ****/
    dashboard.getToolsPanelWidth = function(){
        return state.toolsWidth;
    };
    // set tools panel width (check minimun value)
    dashboard.setToolsPanelWidth = function(width){
        if (width >= dashboard.options.toolsMinWidth) {
            state.toolsWidth = width;
            state.toolsRatio = width / containerAvailableWidth;
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
    // set details panels width (check minimun value)
    dashboard.setDetailsPanelWidth = function(width){
        if (width >= dashboard.options.detailsMinWidth) {
            state.detailsWidth = width;
            state.detailsRatio = width / containerAvailableWidth;
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

    // update the widths of lists and tools panels (stopped at minimun values)
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
    // update the widths of tools and details panels (stopped at minimun values)
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

    dashboard.log('Service run');
    
    return dashboard;
});