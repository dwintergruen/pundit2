describe('Dashboard service', function() {
    
    var Dashboard,
        $window,
        $compile;
    
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

    it("should not set container height", function() {
        var before = Dashboard.getContainerHeight();
        expect(Dashboard.increaseContainerHeight(999)).toBe(true);
        expect(Dashboard.getContainerHeight()).toBe(DASHBOARDDEFAULTS.containerMaxHeight);
    });

    it("should read containerWidth as window innerWidth or minimum width", function() {
        var minWidth = DASHBOARDDEFAULTS.listsMinWidth + DASHBOARDDEFAULTS.toolsMinWidth + DASHBOARDDEFAULTS.detailsMinWidth;
        var bw = Math.max(angular.element($window).innerWidth(), minWidth);
        expect(Dashboard.getContainerWidth()).toBe(bw);
    });

    it("should set containerWidth", function() {
        var minWidth = DASHBOARDDEFAULTS.listsMinWidth + DASHBOARDDEFAULTS.toolsMinWidth + DASHBOARDDEFAULTS.detailsMinWidth;
        Dashboard.setContainerWidth(minWidth+43);
        expect(Dashboard.getContainerWidth()).toBe(minWidth+43);
    });

    it("should not set containerWidth under minWidth", function() {
        var minWidth = DASHBOARDDEFAULTS.listsMinWidth + DASHBOARDDEFAULTS.toolsMinWidth + DASHBOARDDEFAULTS.detailsMinWidth;
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
        
        var totalWidth = 0;
        for ( var i in panels ) {
            totalWidth = totalWidth + angular.element(panels[i]).isolateScope().width;   
        }

        expect(totalWidth).toBe(Dashboard.getContainerWidth());        
    });

    it("should initialize total panels width to containerWidth when container is at minWidth", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();

        var minWidth = DASHBOARDDEFAULTS.listsMinWidth + DASHBOARDDEFAULTS.toolsMinWidth + DASHBOARDDEFAULTS.detailsMinWidth;
        Dashboard.setContainerWidth(minWidth);
        
        var totalWidth = 0;
        for ( var i in panels ) {
            totalWidth = totalWidth + angular.element(panels[i]).isolateScope().width;   
        }

        expect(totalWidth).toBe(minWidth);        
    });

    it("should update total panels width to containerWidth when resizing", function(){
        var el = compileDirective();
        var panels = angular.element(el).find('dashboard-panel').toArray();

        var preTotalWidth = 0;
        for ( var i in panels ) {
            preTotalWidth = preTotalWidth + angular.element(panels[i]).isolateScope().width;   
        }

        var newWidth = Dashboard.getContainerWidth() - 15;
        Dashboard.setContainerWidth(newWidth);
        
        var totalWidth = 0;
        for ( var i in panels ) {
            totalWidth = totalWidth + angular.element(panels[i]).isolateScope().width;   
        }

        expect(Dashboard.getContainerWidth()).toBe(newWidth);
        expect(totalWidth).toBe(newWidth);
        expect(preTotalWidth).not.toBe(totalWidth);
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

        expect(Dashboard.getContainerWidth()).toBe(newWidth);
        expect(totalWidth).toBe(newWidth);
    });

});