describe("AnnotationSidebar interaction", function() {

    // Constant
    // TODO: read from service
    var isAnnotationSidebarExpanded = false,
        isFiltersShowed = false,
        annotationsRefresh = 300,
        annotationsPanelActive = true,
        suggestionsPanelActive = false,
        annotationHeigth = 25,
        startTop = 55
        sidebarExpandedWidth = 300;

    var firstAnnotation = "annid123",
        secondAnnotation = "annid124";

    var fs = require('fs'),
        myHttpMock;

    fs.readFile('test/e2e/annHttpMock.e2e.js', 'utf8', function(err, data) {
        if (err) {
            console.log('You need an annHttpMock.e2e.js in test/e2e/');
            return console.log(err);
        }
        /* jshint -W061 */
        eval(data);
        /* jshint +W061 */
        myHttpMock = annHttpMock;
    });


    var p = protractor.getInstance();

    beforeEach(function(){
        p.addMockModule('httpBackendMock', myHttpMock);
        p.get('/app/examples/client-TEST.html');
    });

    afterEach(function() {
        p.removeMockModule('httpBackendMock');
    });

    it('should toggle the sidebar', function() {
        p.findElements(protractor.By.css('.pnd-annotation-sidebar-container')).then(function(elements) {       
            expect(elements.length).toBe(1);
        });
        p.findElement(protractor.By.css('.pnd-toolbar-annotations-button')).click();

        var container = p.findElement(protractor.By.css('.pnd-annotation-sidebar-container'));
        container.getSize().then(function(size){
            expect(size.width).toBe(sidebarExpandedWidth);
        });

    });

    it('should toggle the filers list', function() {
        p.findElement(protractor.By.css('.pnd-toolbar-annotations-button')).click();
        p.findElements(protractor.By.css('.pnd-annotation-sidebar-filters-list.ng-hide')).then(function(elements) {       
            expect(elements.length).toBe(1);
        });
        p.findElement(protractor.By.css('.pnd-annotation-sidebar-btn-show-filter')).click();
        p.findElements(protractor.By.css('.pnd-annotation-sidebar-filters-list.ng-hide')).then(function(elements) {       
            expect(elements.length).toBe(0);
        });
    });

    it('should create annotation details', function() {
        p.findElements(protractor.By.css('#'+firstAnnotation)).then(function(elements) {       
            expect(elements.length).toBe(1);
        });
    });

    it('should open the sidebar and details after click on annotation', function() {
        p.findElements(protractor.By.css('#'+firstAnnotation)).then(function(elements) {       
            expect(elements.length).toBe(1);
        });

        p.findElement(protractor.By.css('#'+firstAnnotation+' .pnd-annotation-details-header')).click();

        var container = p.findElement(protractor.By.css('.pnd-annotation-sidebar-container'));
        container.getSize().then(function(size){
            expect(size.width).toBe(sidebarExpandedWidth);
        });

        p.findElements(protractor.By.css('#'+firstAnnotation+' .pnd-annotation-details-container')).then(function(elements) {       
            expect(elements.length).toBe(1);
        });
    });

    it('should close annotation details after the close of the sidebar', function() {
        p.findElement(protractor.By.css('.pnd-toolbar-annotations-button')).click();
        p.findElement(protractor.By.css('#'+firstAnnotation+' .pnd-annotation-details-header')).click();

        p.findElements(protractor.By.css('#'+firstAnnotation+' .pnd-annotation-details-container')).then(function(elements) {       
            expect(elements.length).toBe(1);
        });

        p.findElement(protractor.By.css('.pnd-toolbar-annotations-button')).click();

        p.findElements(protractor.By.css('#'+firstAnnotation+' .pnd-annotation-details-container')).then(function(elements) {       
            expect(elements.length).toBe(0);
        });
    });    

    it('should toggle annotation details', function() {
        p.findElement(protractor.By.css('.pnd-toolbar-annotations-button')).click();
        p.findElement(protractor.By.css('#'+firstAnnotation+' .pnd-annotation-details-header')).click();

        p.findElements(protractor.By.css('#'+firstAnnotation+' .pnd-annotation-details-container')).then(function(elements) {       
            expect(elements.length).toBe(1);
        });
    });

    it('should hide broken annotations', function() {
        p.findElements(protractor.By.css('#'+firstAnnotation)).then(function(elements) {       
            expect(elements.length).toBe(1);
        });
        p.findElement(protractor.By.css('.pnd-toolbar-annotations-button')).click();
        p.findElement(protractor.By.css('.pnd-annotation-sidebar-btn-show-filter')).click();
        p.findElement(protractor.By.css('.pnd-annotation-sidebar-btn-toggle-broken')).click();
        
        p.findElements(protractor.By.css('#'+firstAnnotation)).then(function(elements) {       
            expect(elements.length).toBe(0);
        });
    });

    it('should remove all filters', function() {
        p.findElement(protractor.By.css('.pnd-toolbar-annotations-button')).click();
        p.findElement(protractor.By.css('.pnd-annotation-sidebar-btn-show-filter')).click();
        p.findElement(protractor.By.css('.pnd-annotation-sidebar-btn-toggle-broken')).click();
        
        p.findElements(protractor.By.css('#'+firstAnnotation)).then(function(elements) {       
            expect(elements.length).toBe(0);
        });

        p.findElement(protractor.By.css('.pnd-annotation-sidebar-btn-close-filters')).click();
        p.findElement(protractor.By.css('.pnd-annotation-sidebar-btn-remove-filters')).click();

        p.findElements(protractor.By.css('#'+firstAnnotation)).then(function(elements) {       
            expect(elements.length).toBe(1);
        });
    });

    it('should sidebar top be dependent from toolbar height and dashboard height', function() {
        var toolbarHeight;
        var dashboardHeight;
        var globalHeight;

        var sidebarContainer = p.findElement(protractor.By.css('.pnd-annotation-sidebar-container'));
        var dashboardContainer = p.findElement(protractor.By.css('.pnd-dashboard-container'));
        var toolbarContainer = p.findElement(protractor.By.css('.pnd-toolbar-navbar-container'));

        var dashboardFooter = p.findElement(protractor.By.css('.pnd-dashboard-container .pnd-dashboard-footer'));

        // p.findElement(protractor.By.css('.pnd-toolbar-annotations-button')).click();

        toolbarContainer.getSize().then(function(size){
            toolbarHeight = size.height;
            sidebarContainer.getCssValue('top').then(function(sidebarTop){
                expect(toolbarHeight + "px").toEqual(sidebarTop);
            });

            p.findElement(protractor.By.css('.pnd-toolbar-dashboard-button')).click();

            dashboardContainer.getSize().then(function(size){
                dashboardHeight = size.height;
                globalHeight = toolbarHeight + dashboardHeight;
                sidebarContainer.getCssValue('top').then(function(sidebarTop){
                    expect(globalHeight + "px").toEqual(sidebarTop);
                });
            });

            p.findElement(protractor.By.css('.pnd-toolbar-dashboard-button')).click();

            sidebarContainer.getCssValue('top').then(function(sidebarTop){
                expect(toolbarHeight + "px").toEqual(sidebarTop);
            });

            p.findElement(protractor.By.css('.pnd-toolbar-dashboard-button')).click();
            p.actions().dragAndDrop(dashboardFooter, {x:0, y:100}).perform();

            dashboardContainer.getSize().then(function(size){
                dashboardHeight = size.height;
                globalHeight = toolbarHeight + dashboardHeight;
                sidebarContainer.getCssValue('top').then(function(sidebarTop){
                    expect(globalHeight + "px").toEqual(sidebarTop);
                });
            });
        });
    });

});