describe('Dashboard service', function() {
    
    var Dashboard;
    
    beforeEach(module('Pundit2'));
    
    beforeEach(function() {
        inject(function($injector) {
            Dashboard = $injector.get('Dashboard');
        });
    });

    it("should run", function() {
        expect(true).toBe(true);
    });

});