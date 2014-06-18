describe("Page Items interaction", function() {
    var p = protractor.getInstance();

    beforeEach(function(){
        p.get('/app/examples/pageItemsContainer.html');
    });

    it("should correctly load", function(){
        // check if exist search input
        p.findElements(protractor.By.css('.pnd-panel-tab-content-header input')).then(function(input) {
            expect(input.length).toBe(1);
        });
        // check if exist tabs header
        p.findElements(protractor.By.css('.pnd-panel-tab-content-content .pnd-tab-header')).then(function(th) {
            expect(th.length).toBe(1);
        });
        // check if exist tabs content
        p.findElements(protractor.By.css('.pnd-panel-tab-content-content .pnd-tab-content')).then(function(tc) {
            expect(tc.length).toBe(1);
        });
        // check if exist ordering dropdown
        p.findElements(protractor.By.css('.pnd-panel-tab-content-footer button')).then(function(btn) {
            expect(btn.length).toBe(1);
        });
        // check if exist items
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(2);
        });
    });

    it("should correctly filter by type when change active tab", function(){
        // check initial items number (all items tab)
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(2);
        });

        // got to text items tab
        p.findElement(protractor.By.css('.pnd-tab-header > li > a[data-index="1"]')).click();
        // check new items number (text items tab)
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(1);
            // check item uri
            expect(items[0].getAttribute('uri')).toEqual('textFragmentUri');
        });

        // got to image items tab
        p.findElement(protractor.By.css('.pnd-tab-header > li > a[data-index="2"]')).click();
        // check new items number (image items tab)
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(1);
            // check item uri
            expect(items[0].getAttribute('uri')).toEqual('imageFragmentUri');
        });

        // got to entities items tab
        p.findElement(protractor.By.css('.pnd-tab-header > li > a[data-index="3"]')).click();
        // check new items number (image items tab)
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(0);
        });
    });

    it("should correctly filter by label when input text", function(){
        // check initial items number
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(2);
        });
        // search text
        p.findElement(protractor.By.css('.pnd-panel-tab-content-header input')).sendKeys('text');
        // check new items number
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(1);
        });
    });

    it("should correctly clear filter when click input x icon", function(){
        // check initial items number
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(2);
        });
        // search text
        p.findElement(protractor.By.css('.pnd-panel-tab-content-header input')).sendKeys('text');
        // check new items number
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(1);
        });
        // click clear icon
        p.findElement(protractor.By.css('.pnd-panel-tab-content-header span')).click();
        // check new items number
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(2);
        });
    });

    it("should correctly show no found messagge", function(){
        // check initial items number
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(2);
        });
        // search text
        p.findElement(protractor.By.css('.pnd-panel-tab-content-header input')).sendKeys('testo impossibile da trovare');
        // check new items number
        p.findElements(protractor.By.css('.pnd-tab-content item')).then(function(items) {
            expect(items.length).toBe(0);
        });
        // check if is shown no found messagge
        p.findElement(protractor.By.css('.pnd-tab-content .pnd-dashboard-welcome')).then(function(msg) {
            msg.getText().then(function(str){
                expect(str.indexOf('testo impossibile da trovare')).toBeGreaterThan(-1);
            }); 
        });
    });

    it("should correctly open order dropdown", function(){
        // open dropdown menu
        p.findElement(protractor.By.css('.pnd-panel-tab-content-footer button')).click();
        // chek if dropdown exist
        p.findElements(protractor.By.css('.pnd-panel-tab-content-footer .dropdown-menu')).then(function(d) {
            expect(d.length).toBe(1);
        });
    });

});