describe('Dashboard service', function() {
    
    var Dashboard,
        $window,
        $compile,
        $rootScope,
        DASHBOARDDEFAULTS;

    var maxError = 1;
    
    beforeEach(module('Pundit2'));

    beforeEach(module(
        'src/Dashboard/Dashboard.dir.tmpl.html',
        'src/Dashboard/DashboardPanel.dir.tmpl.html'
    ));

    beforeEach(inject(function(_$window_, _$rootScope_, _$compile_, _DASHBOARDDEFAULTS_,  _Dashboard_){
        $window = _$window_;
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        Dashboard = _Dashboard_;
        DASHBOARDDEFAULTS = _DASHBOARDDEFAULTS_;
    }));

    var compileDirective = function(){
        var elem = $compile('<dashboard></dashboard>')($rootScope);
        $rootScope.$digest();
        return elem;
    };

    it("should read default visible and toggle", function() {
        var vis = Dashboard.isDashboardVisible();
        expect(vis).toBe(DASHBOARDDEFAULTS.isDashboardVisible);
        Dashboard.toggle();
        expect(vis).toBe(!Dashboard.isDashboardVisible());
    });

    it("should read default container height", function() {
        expect(Dashboard.getContainerHeight()).toBe(DASHBOARDDEFAULTS.containerHeight);
    });

    it("should set container height", function() {
        var before = Dashboard.getContainerHeight();
        expect(Dashboard.increaseContainerHeight(1)).toBe(true);
        expect(Dashboard.getContainerHeight()).toBe(before+1);
    });

    it("should not set container height over max", function() {
        var before = Dashboard.getContainerHeight();
        expect(Dashboard.increaseContainerHeight(999)).toBe(true);
        expect(Dashboard.getContainerHeight()).toBe(DASHBOARDDEFAULTS.containerMaxHeight);
    });

    it("should not set container height under min", function() {
        var before = Dashboard.getContainerHeight();
        expect(Dashboard.increaseContainerHeight(-999)).toBe(true);
        expect(Dashboard.getContainerHeight()).toBe(DASHBOARDDEFAULTS.containerMinHeight);
    });

    it("should read containerWidth as window innerWidth or minimum width", function() {
        var minWidth = 0;
        for (var i in DASHBOARDDEFAULTS.panels) {
            minWidth += DASHBOARDDEFAULTS.panels[i].minWidth;
        }
        var bw = Math.max(angular.element($window).innerWidth(), minWidth);
        expect(Dashboard.getContainerWidth()).toBe(bw);
    });

    it("should set containerWidth", function() {
        var minWidth = 0;
        for (var i in DASHBOARDDEFAULTS.panels) {
            minWidth += DASHBOARDDEFAULTS.panels[i].minWidth;
        }
        Dashboard.setContainerWidth(minWidth+43);
        expect(Dashboard.getContainerWidth()).toBe(minWidth+43);
    });

    it("should not set containerWidth under minWidth", function() {
        var minWidth = 0;
        for (var i in DASHBOARDDEFAULTS.panels) {
            minWidth += DASHBOARDDEFAULTS.panels[i].minWidth;
        }
        Dashboard.setContainerWidth(minWidth-43);
        expect(Dashboard.getContainerWidth()).not.toBe(minWidth-43);
        expect(Dashboard.getContainerWidth()).toBe(minWidth);
    });

    it("should correctly initialize panels scope", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();
        
        var scope;
        for ( var i in panels ) {
            scope = angular.element(panels[i]).isolateScope();

            expect(scope.index).toBeDefined();
            expect(scope.width).toBeDefined();
            expect(scope.left).toBeDefined();
            expect(scope.minWidth).toBeDefined();
            expect(scope.isCollapsed).toBeDefined();

        }

    });

    it("should initialize total panels width to containerWidth", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();
        var width = 1200;

        Dashboard.setContainerWidth(width);
        
        var totalWidth = 0;
        for ( var i in panels ) {
            totalWidth = totalWidth + angular.element(panels[i]).isolateScope().width;   
        }

        expect(width - totalWidth).toBeLessThan(maxError);        
    });

    it("should initialize total panels width to containerWidth when container is at minWidth", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();

        var minWidth = 0;
        for (var i in DASHBOARDDEFAULTS.panels) {
            minWidth += DASHBOARDDEFAULTS.panels[i].minWidth;
        }
        Dashboard.setContainerWidth(minWidth);
        
        var totalWidth = 0;
        for ( var i in panels ) {
            totalWidth = totalWidth + angular.element(panels[i]).isolateScope().width;   
        }

        expect(totalWidth - minWidth).toBeLessThan(maxError);
    });

    it("should update total panels width to containerWidth when resizing", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();
        var width = 1200;

        Dashboard.setContainerWidth(width);

        var preTotalWidth = 0;
        for ( var i in panels ) {
            preTotalWidth = preTotalWidth + angular.element(panels[i]).isolateScope().width;   
        }
        expect(preTotalWidth - width).toBeLessThan(maxError);

        var newWidth = width - 15;
        Dashboard.setContainerWidth(newWidth);
        
        var totalWidth = 0;
        for ( var i in panels ) {
            totalWidth = totalWidth + angular.element(panels[i]).isolateScope().width;   
        }
        expect(totalWidth - newWidth).toBeLessThan(maxError);

        expect(preTotalWidth).not.toBe(totalWidth);
    });

    // TODO select specific panel by css attribute selector
    it("should update total panels width to containerWidth when resizing when one panel is at minwidth", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();
        var width = 1200;

        Dashboard.setContainerWidth(width);

        var scope = angular.element(panels[0]).isolateScope();
        var diff = scope.width - DASHBOARDDEFAULTS.panels.lists.minWidth;

        scope.width -= diff;
        angular.element(panels[1]).isolateScope().width += diff;

        // resizeAll
        width -= 23;
        Dashboard.setContainerWidth(width);

        var totalWidth = 0;
        for ( var i in panels ) {
            totalWidth = totalWidth + angular.element(panels[i]).isolateScope().width;   
        }
        expect(totalWidth - width).toBeLessThan(maxError);
        
    });

    it("should update total panels width to containerWidth when expand", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();

        var newWidth = Dashboard.getContainerWidth() + 16;
        Dashboard.setContainerWidth(newWidth);
        
        var totalWidth = 0;
        for ( var i in panels ) {
            totalWidth = totalWidth + angular.element(panels[i]).isolateScope().width;   
        }
        expect(totalWidth - newWidth).toBeLessThan(maxError);

        expect(Dashboard.getContainerWidth()).toBe(newWidth);
    });

    it("should correctly collapse and expand one panel", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();

        var scope = angular.element(panels[0]).isolateScope();
        var width = Dashboard.getContainerWidth();

        expect(scope.isCollapsed).toBe(false);
        scope.toggleCollapse();        
        expect(scope.isCollapsed).toBe(true);
        expect(scope.width).toBe(DASHBOARDDEFAULTS.panelCollapsedWidth);
        // after collapse dashboard call resizeAll
        var totalWidth = 0;
        for ( var i in panels ) {
            totalWidth = totalWidth + angular.element(panels[i]).isolateScope().width;   
        }
        expect(totalWidth - width).toBeLessThan(maxError);

        scope.toggleCollapse();
        expect(scope.isCollapsed).toBe(false);
        expect(scope.width).not.toBe(DASHBOARDDEFAULTS.panelCollapsedWidth);
        // after collapse dashboard call resizeAll
        totalWidth = 0;
        for ( var i in panels ) {
            totalWidth = totalWidth + angular.element(panels[i]).isolateScope().width;   
        }
        expect(totalWidth - width).toBeLessThan(maxError);
        
    });

    it("should not collapse more then two panel", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();

        var scope = angular.element(panels[0]).isolateScope();

        // collapse
        expect(scope.isCollapsed).toBe(false);
        scope.toggleCollapse();        
        expect(scope.isCollapsed).toBe(true);
        expect(scope.width).toBe(DASHBOARDDEFAULTS.panelCollapsedWidth);

        // collapse
        scope = angular.element(panels[1]).isolateScope();
        expect(scope.isCollapsed).toBe(false);
        scope.toggleCollapse();        
        expect(scope.isCollapsed).toBe(true);
        expect(scope.width).toBe(DASHBOARDDEFAULTS.panelCollapsedWidth);

        // not collapse
        scope = angular.element(panels[2]).isolateScope();
        expect(scope.isCollapsed).toBe(false);
        scope.toggleCollapse();        
        expect(scope.isCollapsed).toBe(false);
        expect(scope.width).not.toBe(DASHBOARDDEFAULTS.panelCollapseWidth);        
        
    });

    it("should correctly resize first panel", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();
        
        Dashboard.setContainerWidth(1200);

        expect(Dashboard.tryToResizeCouples(0,-30)).toBe(true);

    });

    it("should correctly expand second panel", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();
        
        Dashboard.setContainerWidth(1200);

        expect(Dashboard.tryToResizeCouples(1,+30)).toBe(true);   
        
    });

});