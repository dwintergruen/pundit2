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
    
    var listsCollapsed = false,
        toolsCollapsed = false,
        detailsCollapsed = false;

    var panelsMinWidths = [
        dashboard.options.listsMinWidth,
        dashboard.options.toolsMinWidth,
        dashboard.options.detailsMinWidth
    ];

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

    // ratios [listsRatio, toolsRatio, detailsRatio]
    // minWidths [listsMinWidth, toolsMinWidth, detailsMinWidth]
    // availableWidth (new container width)
    // @return widths [listsWidth, toolsWidth, detailsWidth]
    var resizePanelsWidths = function(ratios, minWidths, availableWidth){

        var delta = 0,
            widths = [];

        var i, newWidth;
        // update widths
        for ( i=0; i<ratios.length; i++ ) {
            newWidth = ratios[i] * availableWidth;
            // check minimum         
            if ( newWidth < minWidths[i] ) {
                widths.push(minWidths[i]);
                delta = delta + (newWidth - minWidths[i]);
            } else {
                widths.push(newWidth);
            }
        }

        // any panels under minimum width
        if ( delta === 0){
            return widths;
        }

        // at least one panel under minimum widths
        var reducibleIndex, hundred;
        while ( delta < 0 ) {
            // this widths can be reduced
            reducibleIndex = [];
            hundred = 0;
            for (i=0; i<widths.length; i++) {
                if ( widths[i] > minWidths[i] ) {
                    reducibleIndex.push(i);
                    hundred = hundred + ratios[i];
                }
            }
            // compute new ratios and dispense delta
            var index;
            for (i=0; i<reducibleIndex.length; i++) {
                index = reducibleIndex[i];
                ratios[index] = ratios[index] / hundred;
                widths[index] = widths[index] + (ratios[index]* delta);
            }
            // check if after dispense delta others panels are under minimum
            delta = 0;
            for (i=0; i<reducibleIndex.length; i++) {
                index = reducibleIndex[i];
                if ( widths[index] < minWidths[index]) {
                    delta = delta + (widths[index] - minWidths[index]);
                    widths[index] = minWidths[index];
                }
            }

        }// end while

        return widths;

    };

    // widths [listsWidth, toolsWidth, detailsWidth]
    var updateRatios = function(widths, availableWidth){
        state.listsRatio = widths[0] / availableWidth;
        state.toolsRatio = widths[1] / availableWidth;
        state.detailsRatio = widths[2] / availableWidth;
    };

    // widths [listsWidth, toolsWidth, detailsWidth]
    var setPanelsWidth = function(widths){
        state.listsWidth = widths[0];
        state.toolsWidth = widths[1];
        state.detailsWidth = widths[2];
    };

    // return new copy of ratios array [listsRatio, toolsRatio, detailsRatio]
    var makeRatiosArray = function(){
        return [state.listsRatio, state.toolsRatio, state.detailsRatio];
    }

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

        // resize panels respecting minimum widths
        var newWidths = resizePanelsWidths(makeRatiosArray(), panelsMinWidths, containerAvailableWidth);
        // update state widths
        setPanelsWidth(newWidths);
        // update state ratios
        updateRatios(newWidths, containerAvailableWidth);

        $rootScope.$apply();
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