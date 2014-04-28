angular.module('Pundit2.Dashboard')
.constant('DASHBOARDDEFAULTS', {

    isDashboardVisible: true,

    // dashboard container
    containerMinHeight: 200,
    containerMaxHeight: 500,
    containerMinWidth: 960,
    containerHeight: 250,

    // dashboard panels
    listsWidth: 0,
    listsRatio: 0.25,
    listsMinWidth: 235,

    toolsWidth: 0,
    toolsRatio: 0.50,
    toolsMinWidth: 470,

    detailsWidth: 0,
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

    var choiceWidth = Math.max(angular.element($window).width(), dashboard.options.containerMinWidth) - (2 * dashboard.options.separatorsWidth);
    var state = {

        isDashboardVisible : dashboard.options.isDashboardVisible,

        listsWidth: dashboard.options.listsRatio * choiceWidth,
        listsRatio: dashboard.options.listsRatio,

        toolsWidth: dashboard.options.toolsRatio * choiceWidth,
        toolsRatio: dashboard.options.toolsRatio,

        detailsWidth: dashboard.options.detailsRatio * choiceWidth,
        detailsRatio: dashboard.options.detailsRatio, 

        containerWidth: choiceWidth + (2 * dashboard.options.separatorsWidth),
        containerHeight: dashboard.options.containerHeight,
        containerUtilsWidth : choiceWidth 

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
        if (width > dashboard.options.containerMinWidth) {
            state.containerWidth = width;
        } else {
            state.containerWidth = dashboard.options.containerMinWidth;
        }
        state.containerUtilsWidth = state.containerWidth  - (2 * dashboard.options.separatorsWidth);

        state.listsWidth = state.listsRatio * state.containerUtilsWidth;
        state.toolsWidth = state.toolsRatio * state.containerUtilsWidth;
        state.detailsWidth = state.detailsRatio * state.containerUtilsWidth;

        console.log(state.listsRatio, state.containerWidth, state.containerUtilsWidth);
        
        $rootScope.$apply();
    };

    /**** PANEL LISTS ****/
    dashboard.getListsPanelWidth = function(){
        return state.listsWidth;
    };

    dashboard.setListPanelWidth = function(width){
        if (width > dashboard.options.listsMinWidth) {
            state.listsWidth = width;
            state.listsRatio = width / state.containerUtilsWidth;
            $rootScope.$apply();
            return true;
        }
    };

    /**** PANEL TOOLS ****/
    dashboard.getToolsPanelWidth = function(){
        return state.toolsWidth;
    };

    dashboard.setToolsPanelWidth = function(width){
        if (width > dashboard.options.toolsMinWidth) {
            state.toolsWidth = width;
            state.toolsRatio = width / state.containerUtilsWidth;
            $rootScope.$apply();
            return true;
        }
    };

    /**** PANEL DETAILS ****/
    dashboard.getDetailsPanelWidth = function(){
        return state.detailsWidth;
    };

    dashboard.setDetailsPanelWidth = function(width){
        if (width > dashboard.options.detailsMinWidth) {
            state.detailsWidth = width;
            state.detailsRatio = width / state.containerUtilsWidth;
            $rootScope.$apply();
            return true;
        }
    };

    /**** FOOTER ****/
    dashboard.getFooterHeight = function(){
        return dashboard.options.footerHeight;
    };

    /**** SEPARATOR ****/
    dashboard.getSeparatorWidth = function(){
        return dashboard.options.separatorsWidth;
    };

    dashboard.log('dashboard service run');
    
    return dashboard;
});