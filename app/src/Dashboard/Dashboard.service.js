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

    // panel collapsed width
    panelCollapseWidth: 40,

    // separator
    separatorsWidth: 10,

    // footer height
    footerHeight: 20,

    fluidResize: true,
    debug: true
})
.service('Dashboard', function(BaseComponent, DASHBOARDDEFAULTS, $window, $rootScope) {

    var dashboard = new BaseComponent('Dashboard', DASHBOARDDEFAULTS);

    var containerMinWidth = dashboard.options.listsMinWidth + dashboard.options.toolsMinWidth + dashboard.options.detailsMinWidth + (2 * dashboard.options.separatorsWidth);
    
    var containerAvailableWidth = Math.max(angular.element($window).innerWidth(), containerMinWidth) - (2 * dashboard.options.separatorsWidth);
    
    // TODO add to default
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

    // ratios [listsRatio, toolsRatio, detailsRatio]
    // minWidths [listsMinWidth, toolsMinWidth, detailsMinWidth]
    // availableWidth (new container width)
    // @return widths [listsWidth, toolsWidth, detailsWidth]
    var resizePanelsWidthsOptimaized = function(ratios, minWidths, availableWidth){

        var delta = 0,
            widths = [],
            smaller = [],
            bigger = [],
            hundredRatio = 0;

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
                bigger.push(i);
                hundredRatio = hundredRatio + ratios[i];
            }
        }
        // any panels under minimum width
        if ( delta === 0){
            return widths;
        }

        // at least one panel under minimum widths
        
        // dispense delta
        var index, newDelta, newHundredRatio;
        while(delta < 0) {
            newDelta = 0;
            newHundredRatio = 0;
            // if bigger.length reaches to 0 the while end
            // and the sum of widths exceeds the availableWidths
            for (i=0; i<bigger.length; i++) {
                index = bigger[i];
                ratios[index] = ratios[index] / hundredRatio;
                newWidth = widths[index] + (ratios[index] * delta);
                // check minimum         
                if ( newWidth < minWidths[index] ) {
                    widths[index] = minWidths[index];
                    newDelta = newDelta + (newWidth - minWidths[index]);
                    bigger.splice(i, 1);
                } else {
                    widths[index] = newWidth;
                    newHundredRatio = newHundredRatio + ratios[index];
                }
            }
            delta = newDelta;
            hundredRatio = newHundredRatio;
        }

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

    dashboard.tryToSetContainerHeight = function(dy) {
        var newHeight = state.containerHeight + dy;
        if (newHeight >= dashboard.options.containerMinHeight && newHeight <= dashboard.options.containerMaxHeight) {
            state.containerHeight = newHeight;
            $rootScope.$apply();
            return true;
        } else {
            return false;
        }
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
                //panels[p].ratio = panels[p].width / containerMinWidth; 
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

        // Rather than using isLast, create a "isDraggable"
        // and update them after an add + collapse/expand
        // (if a panel has only collapsed panels at his right
        // is it draggable?)
        if (len > 0) {
            panels[len - 1].isLast = false;
        }
        panelScope.isLast = true;

        panelScope.index = len;
        panels.push(panelScope);

        if (panelScope.title === "lists") {
            panelScope.minWidth = dashboard.options.listsMinWidth + dashboard.options.separatorsWidth;
            panelScope.ratio = dashboard.options.listsRatio;
        } else if (panelScope.title === "tools") {
            panelScope.minWidth = dashboard.options.toolsMinWidth + dashboard.options.separatorsWidth;
            panelScope.ratio = dashboard.options.toolsRatio;
        } else if (panelScope.title === "details") {
            panelScope.minWidth = dashboard.options.detailsMinWidth;
            panelScope.ratio = dashboard.options.detailsRatio;
        }

        //dashboard.resetWidths();
        //dashboard.resizeAll();
        dashboard.setWidths();
        $rootScope.$$phase || $rootScope.$digest();
    };

    dashboard.setWidths = function(){
        var avail = angular.element($window).innerWidth(),
            left = 0;

        for (var p in panels) {
            panels[p].width = avail * panels[p].ratio;
            panels[p].left = left;
            left = left + panels[p].width;
        }
    };

    // Evens out the widths of all panels, expanding them if needed
    dashboard.resetWidths = function() {
        var avail = angular.element($window).innerWidth();

        for (var p in panels) {
            if (panels[p].isCollapsed) {
                panels[p].isCollapsed = false;
            }

            // TODO: check if min w, cycle again etc
            panels[p].width = avail / panels.length;
        }
    };

    dashboard.resizeAll = function(skip) {
        var avail = angular.element($window).innerWidth(),
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
        avail = avail - collapsed.length * 40;

        /*if (expanded.length > 0) {
            // TODO check if all at min width
        }*/

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
                panels[i].width = 50;
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

    dashboard.tryToResizeFluid = function(index, delta) {
        var panel = panels[index],
            skip = {};

        // If it is shrinking
        if (delta < 0) {
            panel.width = Math.max(panel.minWidth, panel.width + delta);
            skip[index] = panel.width;

        // If it's growing
        } else {
            panel.width = panel.width + delta;
            skip[index] = panel.width;
        }

        dashboard.resizeAll(skip);
        return true;
    };

    dashboard.tryToResizeCouples = function(index, delta) {
        dashboard.log('Resizing '+index+' of '+delta);
        var panel = panels[index];

        // TODO: next is not index+1 but we need to look for it
        // checking for a not collapsed one at its right:
        // there SHOULD be one, if we add the isResizable check
        // or something in place of the isLast to inhibit drag

        // If it is shrinking
        if (delta < 0) {

            var realDelta = panel.width - Math.max(panel.minWidth, panel.width + delta);
            panel.width = Math.max(panel.minWidth, panel.width + delta);

            var next;
            if (realDelta > 0) {
                next = panels[index+1],
                next.width = next.width + realDelta;
                next.left = panel.left + panel.width;
            }

            // If it's growing, check if there's space to grow
        } else if (panels.length > index+1) {
            var next = panels[index+1],
                realDelta = next.width - Math.max(next.minWidth, next.width - delta);

            next.width = Math.max(next.minWidth, next.width - delta);

            panel.width = panel.width + realDelta;
            next.left = panel.left + panel.width;
        }

        $rootScope.$$phase || $rootScope.$digest();

        if ( typeof(next) === 'undefined' || next.width === next.minWidth || panel.width === panel.minWidth) {
            return false;
        } else {
            return true;
        }
    };

    dashboard.log('Service run');
    
    return dashboard;
});