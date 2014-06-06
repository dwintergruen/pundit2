describe("Vocabularies interaction", function() {
    var p = protractor.getInstance();

    it('should load template and compile directive', function() {
        var panelNum = 3;

        p.get('/app/examples/vocabularies.html');

        // check tabs number (vocab)
        p.findElements(protractor.By.css('.pnd-tab-header > li')).then(function(tabs) {
            expect(tabs.length).toBe(5);
        });

        // check tab content (welcome messagge)
        p.findElements(protractor.By.css('.pnd-tab-content .tab-pane.active li')).then(function(items){
            expect(items.length).toBe(1);
            expect(items[0].getText()).toEqual("I'm a welcome message");
        });

    });

    it('should correctly show items after search', function() {
        var panelNum = 3;

        p.get('/app/examples/vocabularies.html');

        p.findElement(protractor.By.css('.pnd-panel-tab-content-header input')).sendKeys('cavallo');

        // TODO mock freebase http response
        p.sleep(1000);

        p.findElements(protractor.By.css('.pnd-tab-content .tab-pane.active li')).then(function(items){
            expect(items.length).toBe(4);
        });

    });

    it('should correctly show no found messagge after a failed search', function() {
        var panelNum = 3;

        p.get('/app/examples/vocabularies.html');

        p.findElement(protractor.By.css('.pnd-panel-tab-content-header input')).sendKeys('StringaImpossibileDaTrovare');

        // TODO mock freebase http response
        p.sleep(1000);

        // check tab content (welcome messagge)
        p.findElements(protractor.By.css('.pnd-tab-content .tab-pane.active li')).then(function(items){
            expect(items.length).toBe(1);
            expect(items[0].getText()).toEqual("No item found to: StringaImpossibileDaTrovare");
        });

    });

});