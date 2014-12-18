angular.module('Pundit2.Dashboard')

.constant('DASHBOARDDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard
     *
     * @description
     * `object`
     *
     * Configuration object for Dashboard module. By default, Dashboard directive is located below the toolbar,
     * is composed of three panels that can be resized and collapsed.
     * Each panel has its own minimum width and its contents are added dynamically by the client service.
     */

    /**
     * @ngdoc property
     * @name modules#Dashboard.active
     *
     * @description
     * `boolean`
     *
     * Default state of the dashboard module, if it is set to true
     * the client adds to the DOM the dashboard directive in the boot phase.
     *
     * Default value:
     * <pre> active: true </pre>
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.clientDomTemplate
     *
     * @description
     * `string`
     *
     * Path of template containing dashboard directive, client will append the content of this template
     * to the DOM to bootstrap this component
     *
     * Default value:
     * <pre> clientDomTemplate: "src/Dashboard/ClientDashboard.tmpl.html" </pre>
     */
    clientDomTemplate: "src/Dashboard/ClientDashboard.tmpl.html",

    /**
     * @ngdoc property
     * @name modules#Dashboard.debug
     *
     * @description
     * `boolean`
     *
     * Active debug log
     *
     * Default value:
     * <pre> debug: false </pre>
     */
    debug: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.isDashboardVisible
     *
     * @description
     * `boolean`
     *
     * True to automatically open the dashboard after initialization, false otherwise
     *
     * Default value:
     * <pre> isDashboardVisible: false </pre>
     */
    isDashboardVisible: false,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.containerMinHeight
     *
     * @description
     * `number`
     *
     * Dashboard minimum height
     *
     * Default value:
     * <pre> containerMinHeight: 200 </pre>
     */
    containerMinHeight: 200,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.containerMaxHeight
     *
     * @description
     * `number`
     *
     * Dashboard maximum height
     *
     * Default value:
     * <pre> containerMaxHeight: 800 </pre>
     */
    containerMaxHeight: 800,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.containerHeight
     *
     * @description
     * `number`
     *
     * Dashboard default height
     *
     * Default value:
     * <pre> containerHeight: 300 </pre>
     */
    containerHeight: 300,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.footerHeight
     *
     * @description
     * `number`
     *
     * Dashboard footer height
     *
     * Default value:
     * <pre> footerHeight: 20 </pre>
     */
    footerHeight: 20,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.separatorWidth
     *
     * @description
     * `number`
     *
     * Width in px of the separators (draggable columns between panels),
     * must be kept in sync with the defined css
     *
     * Default value:
     * <pre> separatorWidth: 8 </pre>
     */
    separatorWidth: 8,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.panels
     *
     * @description
     * `object`
     *
     * Panels minimum width, from left to right lists, tools and details.
     *
     * Default value:
     * <pre> panels: {
     *      lists: { minWidth: 243 },
     *      tools: { minWidth: 478 },
     *      details: { minWidth: 239 }
     * } </pre>
     */
    // TODO: if you need to configure at least three panels this object must be an array
    panels: {
        lists: {
            minWidth: 243
        },
        tools: {
            minWidth: 478
        },
        details: {
            minWidth: 239
        }
    },

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.panelCollapsedWidth
     *
     * @description
     * `number`
     *
     * Panels width when are collapsed (include separetor width)
     *
     * Default value:
     * <pre> panelCollapsedWidth: 28 </pre>
     */
    panelCollapsedWidth: 28,

    // Panels elements heights: used to fix scrollable elements height inside
    // panels controllers. In pixels, included margins, borders and everything!
    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.panelTabsHeight
     *
     * @description
     * `number`
     *
     * Panel paneltitle tabs height
     *
     * Default value:
     * <pre> panelTabsHeight: 27 </pre>
     */
    panelTabsHeight: 27,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.panelContentHeaderHeight
     *
     * @description
     * `number`
     *
     * Panel content header height
     *
     * Default value:
     * <pre> panelContentHeaderHeight: 43 </pre>
     */
    panelContentHeaderHeight: 43,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.panelInnerTabsHeight
     *
     * @description
     * `number`
     *
     * Panel inner tabs height
     *
     * Default value:
     * <pre> panelInnerTabsHeight: 31 </pre>
     */
    panelInnerTabsHeight: 31,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#Dashboard.panelFooterHeight
     *
     * @description
     * `number`
     *
     * Panel footer height
     *
     * Default value:
     * <pre> panelFooterHeight: 40 </pre>
     */
    panelFooterHeight: 40

})

.service('Dashboard', function(BaseComponent, DASHBOARDDEFAULTS, $window, $rootScope) {

    var dashboard = new BaseComponent('Dashboard', DASHBOARDDEFAULTS);

    var containerMinWidth = 0;
    for (var i in dashboard.options.panels) {
        containerMinWidth += dashboard.options.panels[i].minWidth;
    }

    var state = {

        isDashboardVisible: dashboard.options.isDashboardVisible,

        containerWidth: Math.max(angular.element('body').innerWidth(), containerMinWidth),
        containerHeight: dashboard.options.containerHeight,

        // If the .addContent() is called on some non-existing panel, they might get
        // added later on. We save tabName and tabTemplate and add them when the
        // panels call addPanel()
        panelsContent: {}
    };

    dashboard.getConfiguredPanels = function() {
        return dashboard.options.panels;
    };

    dashboard.canCollapsePanel = function() {
        var collapsedNum = panels.filter(function(p) {
            return p.isCollapsed;
        }).length;

        return collapsedNum < panels.length - 1;
    };

    /**** DASHBOARD ****/
    dashboard.toggle = function() {
        state.isDashboardVisible = !state.isDashboardVisible;

        // If we are expanded, help the panels setting their height properly
        if (state.isDashboardVisible) {
            for (var p in panels) {
                panels[p].setTabContentHeight();
            }
        }
    };

    dashboard.isDashboardVisible = function() {
        return state.isDashboardVisible;
    };

    /**** CONTAINER ****/
    dashboard.getContainerHeight = function() {
        return state.containerHeight;
    };

    dashboard.increaseContainerHeight = function(dy) {

        if (state.containerHeight === dashboard.options.containerMaxHeight && dy > 0) {
            return false;
        }
        if (state.containerHeight === dashboard.options.containerMinHeight && dy < 0) {
            return false;
        }

        var newHeight = state.containerHeight + dy;
        if (newHeight < dashboard.options.containerMinHeight) {
            state.containerHeight = dashboard.options.containerMinHeight;
        } else if (newHeight > dashboard.options.containerMaxHeight) {
            state.containerHeight = dashboard.options.containerMaxHeight;
        } else {
            state.containerHeight = newHeight;
        }

        // TODO: why without this the view not update right
        $rootScope.$$phase || $rootScope.$digest();

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
            dashboard.resizeAll();

            dashboard.log('Dashboard is at min-width');
            return;
        }
        // update state
        state.containerWidth = width;

        dashboard.resizeAll();
    };


    var panels = [];
    dashboard.addPanel = function(panelScope) {
        dashboard.log("Adding panel", panelScope.paneltitle);
        var len = panels.length;

        // Last panel is slighty different: its collapsedWidth must NOT include
        // The separatorWidth, since it's not displayed
        if (len > 0) {
            panels[len - 1].isLast = false;
            panels[len - 1].collapsedWidth = dashboard.options.panelCollapsedWidth;
        }
        panelScope.isLast = true;
        panelScope.collapsedWidth = dashboard.options.panelCollapsedWidth - dashboard.options.separatorWidth;
        panelScope.minWidth = dashboard.options.panels[panelScope.paneltitle].minWidth;
        panelScope.index = len;

        panels.push(panelScope);

        // If there's any previously saved panel content for this panel, add it
        if (panelScope.paneltitle in state.panelsContent) {
            var contents = state.panelsContent[panelScope.paneltitle];
            for (var l = contents.length; l--;) {
                dashboard.log('Adding tab ' + contents[l].tabName + ' to existing panel ' + panelScope.paneltitle);
                panelScope.addContent(contents[l].tabName, contents[l].tabTemplate);
            }
        }

        // When the last panel is added, resize them all
        var configuredPanelsLen = 0;
        var p;
        for (p in dashboard.options.panels) {
            configuredPanelsLen++;
        }
        if (panels.length === configuredPanelsLen) {
            dashboard.resizeAll();
        }

    };

    dashboard.resizeAll = function(skip) {
        var avail = dashboard.getContainerWidth(),
            // w,
            l,
            i,
            skipLength = 0;

        if (!angular.isObject(skip)) {
            skip = {};
        }

        // Take out skip widths from the available width
        for (i in skip) {
            skipLength++;
            avail = avail - skip[i];
        }

        var collapsed = panels.filter(function(p) {
                return p.isCollapsed;
            }),
            expanded = panels.filter(function(p) {
                return !p.isCollapsed;
            });

        // Take out collapsed widths from the available width
        //avail = avail - collapsed.length * dashboard.options.panelCollapsedWidth;
        avail = avail - collapsed.reduce(function(total, panel) {
            return total + panel.collapsedWidth;
        }, 0);

        // Cycle over all panels which will be interested in a change
        // of width and get their total sum, to calculate ratios
        var currentTotal = expanded.reduce(function(total, panel) {

            // TODO: Getting back from a collapse, set to min width?
            if (panel.width < panel.minWidth) {
                panel.width = panel.minWidth;
            }

            if (panel.index in skip) {
                return total;
            }

            return total + panel.width;
        }, 0);

        // Ratios: panel current width / panels total widths
        for (l = expanded.length; l--;) {
            expanded[l].ratio = expanded[l].width / currentTotal;
        }

        // Go over the panels from left to right, accumulating the
        // current left coordinate, to position them properly
        var currentLeft = 0,
            resizable = [],
            delta = 0;
        for (l = panels.length, i = 0; i < l; i++) {

            if (i in skip) {
                panels[i].width = skip[i];
            } else if (panels[i].isCollapsed) {
                panels[i].width = panels[i].collapsedWidth;
            } else {
                var newWidth = panels[i].ratio * avail;
                // check if after dispense delta the panel go under to min-width
                if (newWidth < panels[i].minWidth) {
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
        while (delta < 0) {

            newDelta = 0;
            newCurrentTotal = 0;
            currentLeft = 0;

            for (i = 0; i < resizable.length; i++) {
                newCurrentTotal = newCurrentTotal + resizable[i].width;
            }

            resizable = resizable.filter(function(el) {
                el.ratio = el.width / newCurrentTotal;
                var newWidth = el.width + (el.ratio * delta);
                // check if after dispense delta the panel go to min-width
                if (newWidth < el.minWidth) {
                    newDelta = newDelta + (newWidth - el.minWidth);
                    el.width = el.minWidth;
                    return false;
                } else {
                    el.width = newWidth;
                    return true;
                }
            });

            for (i = 0; i < panels.length; i++) {
                panels[i].left = currentLeft;
                currentLeft = currentLeft + panels[i].width;
            }

            delta = newDelta;
        }

        if (!$rootScope.$$phase) {
            for (i = 0; i < panels.length; i++) {
                panels[i].$digest();
            }
        }
    };

    dashboard.tryToResizeCouples = function(index, delta) {

        var panel = panels[index],
            i;
        var realDelta;
        var currentLeft;

        if (panel.isCollapsed) {
            // check if the next panel exist and is not collapsed
            if (index + 1 < panels.length && !panels[index + 1].isCollapsed) {
                // find the first left not collapsed panel
                for (i = index - 1; i >= 0; i--) {
                    if (!panels[i].isCollapsed) {
                        panel = panels[i];
                        index = i;
                        break;
                    }
                }
                // all left panels are collapsed
                if (i < 0) {
                    return false;
                }
            } else {
                return false;
            }
        }
        var allCollapsed = true;
        if (index < panels.length - 1) {
            // all panel after me is collapsed
            for (i = index + 1; i < panels.length; i++) {
                if (!panels[i].isCollapsed) {
                    allCollapsed = false;
                    break;
                }
            }
            if (allCollapsed) {
                return false;
            }
        }

        // If it is shrinking
        if (delta < 0) {

            realDelta = panel.width - Math.max(panel.minWidth, panel.width + delta);
            panel.width = Math.max(panel.minWidth, panel.width + delta);

            if (realDelta > 0) {

                currentLeft = panel.left;
                for (i = index + 1; i < panels.length; i++) {
                    if (!panels[i].isCollapsed) {
                        panels[i].width = panels[i].width + realDelta;
                        panels[i].left = panels[i - 1].left + panels[i - 1].width;
                        break;
                    } else {
                        panels[i].left = currentLeft + panels[i - 1].width;
                    }

                }

                if (!$rootScope.$$phase) {
                    for (i = 0; i < panels.length; i++) {
                        panels[i].$digest();
                    }
                }
                return true;

            } else {
                if (!$rootScope.$$phase) {
                    for (i = 0; i < panels.length; i++) {
                        panels[i].$digest();
                    }
                }
                return false;
            }

            // If it's growing, check if there's space to grow
        } else if (panels.length > index + 1) {

            var nextIndex;
            for (i = index + 1; i < panels.length; i++) {
                if (!panels[i].isCollapsed) {
                    nextIndex = i;
                    break;
                }
            }

            var next = panels[nextIndex];

            realDelta = next.width - Math.max(next.minWidth, next.width - delta);
            next.width = Math.max(next.minWidth, next.width - delta);

            if (realDelta > 0) {
                panel.width = panel.width + realDelta;

                currentLeft = panel.left + panel.width;
                for (i = index + 1; i < nextIndex; i++) {
                    panels[i].left = currentLeft;
                    currentLeft = currentLeft + panels[i].width;
                }
                next.left = currentLeft;

                if (!$rootScope.$$phase) {
                    for (i = 0; i < panels.length; i++) {
                        panels[i].$digest();
                    }
                }
                return true;

            } else {

                if (!$rootScope.$$phase) {
                    for (i = 0; i < panels.length; i++) {
                        panels[i].$digest();
                    }
                }
                return false;
            }

        }

    };

    // Will render the specified template inside specified panel.
    // panelTitle can be one of the Dashboard configured panel names.
    // If the panels has not been added yet, it will save the contents and add them
    // as soon as the panel is added
    dashboard.addContent = function(panelTitle, tabName, tabTemplate) {
        for (var i in panels) {
            if (panels[i].paneltitle === panelTitle) {
                dashboard.log('Adding tab ' + tabName + ' to existing panel ' + panelTitle);
                panels[i].addContent(tabName, tabTemplate, 'dashboard--' + panelTitle + '--' + tabName);
                return;
            }
        }

        // Panels are not ready yet: save the content and add them when addPanel() is
        // called by individual panels
        var content = {
            tabName: tabName,
            tabTemplate: tabTemplate
        };
        if (panelTitle in state.panelsContent) {
            state.panelsContent[panelTitle].push(content);
        } else {
            state.panelsContent[panelTitle] = [content];
        }

        //dashboard.log("Added tab " + tabName + " to non-existing panel " + panelTitle + ": for later use." + ' [hierarchyString: ' + hierarchyString + ']');
        dashboard.log("Added tab " + tabName + " to non-existing panel " + panelTitle + ": for later use.");
    };

    dashboard.log('Service run');

    return dashboard;
});