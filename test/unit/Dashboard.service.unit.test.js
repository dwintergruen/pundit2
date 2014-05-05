describe('Dashboard service', function() {
    
    var Dashboard,
        $window,
        $compile;
    
    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_$window_, _$compile_, _Dashboard_){
        $window = _$window_;
        $compile = _$compile_;
        Dashboard = _Dashboard_;
    }));

    it("should read default visible and toggle", function() {
        var vis = Dashboard.isDashboardVisible();
        expect(vis).toBe(Dashboard.options.isDashboardVisible);
        Dashboard.toggle();
        expect(vis).toBe(!Dashboard.isDashboardVisible());
    });

    it("should read default container height", function() {
        expect(Dashboard.getContainerHeight()).toBe(Dashboard.options.containerHeight);
    });

    it("should set container height", function() {
        var before = Dashboard.getContainerHeight();
        expect(Dashboard.increeseContainerHeight(1)).toBe(true);
        expect(Dashboard.getContainerHeight()).toBe(before+1);
    });

    it("should not set container height", function() {
        var before = Dashboard.getContainerHeight();
        expect(Dashboard.increeseContainerHeight(999)).toBe(false);
        expect(Dashboard.getContainerHeight()).toBe(before);
    });

    it("should read containerWidth as window innerWidth or minimum width", function() {
        var minWidth = Dashboard.options.listsMinWidth + Dashboard.options.toolsMinWidth + Dashboard.options.detailsMinWidth;
        var bw = Math.max(angular.element($window).innerWidth(), minWidth);
        expect(Dashboard.getContainerWidth()).toBe(bw);
    });

    it("should set containerWidth", function() {
        var minWidth = Dashboard.options.listsMinWidth + Dashboard.options.toolsMinWidth + Dashboard.options.detailsMinWidth;
        Dashboard.setContainerWidth(minWidth+43);
        expect(Dashboard.getContainerWidth()).toBe(minWidth+43);
    });

    it("should not set containerWidth under minWidth", function() {
        var minWidth = Dashboard.options.listsMinWidth + Dashboard.options.toolsMinWidth + Dashboard.options.detailsMinWidth;
        Dashboard.setContainerWidth(minWidth-43);
        expect(Dashboard.getContainerWidth()).not.toBe(minWidth-43);
        expect(Dashboard.getContainerWidth()).toBe(minWidth);
    });

    // TODO compile directive and check panel width
    // TODO compile directive and check panel left

});