angular.module('Pundit2.Dashboard')
.constant('DASHBOARDDEFAULTS', {

    isDashboardVisible: false,

    // dashboard container
    containerMinHeight: 200,
    containerMaxHeight: 400,
    containerHeight: 250,

    // dashboard lists panels (left)
    initialListsRatio: 0.25,
    listsMinWidth: 245,

    // dashboard tools panels (center)
    initialToolsRatio: 0.50,
    toolsMinWidth: 480,

    // dashboard details panels (right)
    initialDetailsRatio: 0.25,
    detailsMinWidth: 235,

    // panel collapsed width
    panelCollapseWidth: 70,

    // footer height
    footerHeight: 20,

    // The Client will append the content of this template to the DOM to bootstrap
    // this component
    clientDomTemplate: "src/Dashboard/ClientDashboard.tmpl.html",

    debug: false
})
.service('Dashboard', function(BaseComponent, DASHBOARDDEFAULTS, $window, $rootScope) {

    var dashboard = new BaseComponent('Dashboard', DASHBOARDDEFAULTS);

    var containerMinWidth = dashboard.options.listsMinWidth + dashboard.options.toolsMinWidth + dashboard.options.detailsMinWidth;
    
    var state = {

        isDashboardVisible: dashboard.options.isDashboardVisible,

        containerWidth: Math.max(angular.element($window).innerWidth(), containerMinWidth),
        containerHeight: dashboard.options.containerHeight

    };

    dashboard.canCollapsePanel = function(){
        var collapsedNum = panels.filter(function(p){
                return p.isCollapsed;
            }).length;
        if ( collapsedNum < 2 ){
            return true;
        } else {
            return false;
        }
    };

    /**** DASHBOARD ****/
    dashboard.toggle = function(){
        state.isDashboardVisible = !state.isDashboardVisible;
    };

    dashboard.isDashboardVisible = function(){
        return state.isDashboardVisible;
    };

    /**** CONTAINER ****/
    dashboard.getContainerHeight = function() {
        return state.containerHeight;
    }

    dashboard.increaseContainerHeight = function(dy) {

        if ( state.containerHeight === dashboard.options.containerMaxHeight && dy>0){
            return false;
        }
        if ( state.containerHeight === dashboard.options.containerMinHeight && dy<0){
            return false;
        }

        var newHeight = state.containerHeight + dy;
        if ( newHeight < dashboard.options.containerMinHeight ){
            state.containerHeight = dashboard.options.containerMinHeight;
        } else if ( newHeight > dashboard.options.containerMaxHeight ) {
            state.containerHeight = dashboard.options.containerMaxHeight;
        } else {
            state.containerHeight = newHeight;
        }
        $rootScope.$apply();
        return true;
    };

    dashboard.getContainerWidth = function() {
        return state.containerWidth;
    };

    // set dashboard width then resize panels and mantain ratios and min-widths
    dashboard.setContainerWidth = function(width) {
        
        if (width <= containerMinWidth) {

            // container is set to min-width
            state.containerWidth = containerMinWidth;

            // resize panels to min-width
            var left = 0;
            for (var p in panels) {
                panels[p].width = panels[p].minWidth;
                panels[p].left = left;
                left = left + panels[p].width;
            }

            $rootScope.$apply();
            dashboard.log('Dashboard is at min-width');
            return;
        }
        // update state
        state.containerWidth = width;

        dashboard.resizeAll();

        $rootScope.$apply();
        return;
    };


    var panels = [];
    dashboard.addPanel = function(panelScope) {
        dashboard.log("Adding panel", panelScope.title);
        var len = panels.length;

        if (len > 0) {
            panels[len - 1].isLast = false;
        }
        panelScope.isLast = true;

        panelScope.index = len;
        panels.push(panelScope);

        if (panelScope.title === "lists") {
            panelScope.minWidth = dashboard.options.listsMinWidth;
        } else if (panelScope.title === "tools") {
            panelScope.minWidth = dashboard.options.toolsMinWidth;
        } else if (panelScope.title === "details") {
            panelScope.minWidth = dashboard.options.detailsMinWidth;
        }

        if ( panels.length === 3 ) {
            dashboard.resizeAll();    
        }
        
        $rootScope.$$phase || $rootScope.$digest();
    };

    dashboard.resizeAll = function(skip) {
        var avail = dashboard.getContainerWidth(),
            w, l, i,
            skipLength = 0;

        if (!angular.isObject(skip)) {
            skip = {};
        }

        // Take out skip widths from the available width
        for (i in skip) {
            skipLength++;
            avail = avail - skip[i];
        }

        var collapsed = panels.filter(function(p){
                return p.isCollapsed;
            }),
            expanded = panels.filter(function(p){
                return !p.isCollapsed;
            });

        // Take out collapsed widths from the available width
        avail = avail - collapsed.length * dashboard.options.panelCollapseWidth;

        // Cycle over all panels which will be interested in a change
        // of width and get their total sum, to calculate ratios
        var currentTotal = expanded.reduce(function(total, panel, index){

            // TODO: Getting back from a collapse, set to min width?
            if (panel.width < panel.minWidth)
                panel.width = panel.minWidth;

            if (panel.index in skip) {
                return total;
            }

            return total+panel.width;
        }, 0);

        // Ratios: panel current width / panels total widths
        for (l=expanded.length; l--;) {
            expanded[l].ratio = expanded[l].width/currentTotal;
        }

        // Go over the panels from left to right, accumulating the
        // current left coordinate, to position them properly
        var currentLeft = 0,
            resizable = [],
            delta = 0;
        for (l=panels.length, i=0; i<l; i++) {

            if (i in skip) {
                panels[i].width = skip[i];
            } else if (panels[i].isCollapsed) {
                panels[i].width = dashboard.options.panelCollapseWidth;
            } else {
                var newWidth = panels[i].ratio * avail;
                // check if after dispense delta the panel go under to min-width
                if (newWidth < panels[i].minWidth){
                    delta = delta + (newWidth - panels[i].minWidth);
                    panels[i].width = panels[i].minWidth;             
                } else {
                    panels[i].width = newWidth;
                    resizable.push(panels[i]);
                }
            }

            panels[i].left = currentLeft;
            currentLeft += panels[i].width;
        }

        // if any panel go at min-width the loop is skipped
        // if all panel go at min-width the loop is executed only one time
        var newDelta, newCurrentTotal;
        while ( delta < 0 ) {

            newDelta = 0;
            newCurrentTotal = 0;
            currentLeft = 0;

            for(i=0; i<resizable.length; i++) {
                newCurrentTotal = newCurrentTotal + resizable[i].width;
            }

            for(i=0; i<resizable.length; i++) {
                resizable[i].ratio = resizable[i].width / newCurrentTotal;
                var newWidth = resizable[i].width + (resizable[i].ratio * delta);
                // check if after dispense delta the panel go to min-width
                if (newWidth < resizable[i].minWidth){
                    newDelta = newDelta + (newWidth - resizable[i].minWidth);
                    resizable[i].width = resizable[i].minWidth;
                    resizable.splice(i, 1);               
                } else {
                    resizable[i].width = newWidth;
                }
            }

            for (i=0; i<panels.length; i++) {
                panels[i].left = currentLeft;
                currentLeft = currentLeft + panels[i].width;
            }

            delta = newDelta;
        }


        $rootScope.$$phase || $rootScope.$digest();
    };

    dashboard.tryToResizeCouples = function(index, delta) {
        
        var panel = panels[index], i;

        if ( panel.isCollapsed ) {
            // check if the next panel exist and is not collapsed
            if( index+1 < panels.length && !panels[index+1].isCollapsed ) {
                // find the first left not collapsed panel
                for (i=index-1; i>=0; i--) {
                    if ( !panels[i].isCollapsed ) {
                        panel = panels[i];
                        index = i;
                        break;
                    }
                }
                // if all collapsed
                if ( i < 0 ) {
                    return false;
                }                
            } else {
                return false;
            }
        }
        var allCollapsed = true;
        if ( index < panels.length-1 ) {
            // all panel after me is collapsed
            for ( i=index+1; i<panels.length; i++ ) {
                if( !panels[i].isCollapsed ){
                    allCollapsed = false;
                    break;
                }
            }
            if ( allCollapsed ){
                return false;
            }
        }

        // If it is shrinking
        if (delta < 0) {
            
            var realDelta = panel.width - Math.max(panel.minWidth, panel.width + delta);
            panel.width = Math.max(panel.minWidth, panel.width + delta);

            if (realDelta > 0) {

                var currentLeft = panel.left;
                for ( i=index+1; i<panels.length; i++ ) {
                    if ( !panels[i].isCollapsed ) {
                        panels[i].width = panels[i].width + realDelta;
                        panels[i].left =  panels[i-1].left + panels[i-1].width;
                        break;
                    } else {
                        panels[i].left = currentLeft + panels[i-1].width;
                    }
                    
                }

                $rootScope.$$phase || $rootScope.$digest();                
                return true;

            } else {
                $rootScope.$$phase || $rootScope.$digest();
                return false;
            }

            // If it's growing, check if there's space to grow
        } else if (panels.length > index+1) {
            
            var nextIndex;
            for (i=index+1; i<panels.length; i++) {
                if ( !panels[i].isCollapsed ) {
                    nextIndex = i;
                    break;
                }
            }

            var next = panels[nextIndex];

            var realDelta = next.width - Math.max(next.minWidth, next.width - delta);
            next.width = Math.max(next.minWidth, next.width - delta);

            if ( realDelta > 0 ) {
                panel.width = panel.width + realDelta;

                var currentLeft = panel.left + panel.width;
                for (i=index+1; i<nextIndex; i++) {
                    panels[i].left = currentLeft;
                    currentLeft = currentLeft + panels[i].width;
                }
                next.left = currentLeft;
                

                $rootScope.$$phase || $rootScope.$digest();
                return true;

            } else {

                $rootScope.$$phase || $rootScope.$digest();
                return false;
            }

        }

    };

    dashboard.log('Service run');
    
    return dashboard;
});