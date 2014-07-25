describe("The annomatic module", function() {
    var p = protractor.getInstance();
    
    // TODO: mock the datatxt backend with those 25 annotations
    
    it('should load some 25 annotations from datatxt', function() {
        p.get('/app/examples/annomatic.html');

        p.findElement(protractor.By.css('.pnd-button-suggestion')).click().then(function(){
            p.waitForAngular();
            p.findElements(protractor.By.css('.ann-auto')).then(function(elements) {
                expect(elements.length).toBe(88);
            });
        });
    });

    it('should accept an annotation clicking on accept and removing it by clicking on remove', function() {
        p.get('/app/examples/annomatic.html');
        p.driver.manage().window().setSize(1200, 960);

        // Get annotations
        p.findElement(protractor.By.css('.pnd-button-suggestion')).click();
        
        // At this time there are no accepted annotations
        p.findElements(protractor.By.css('.ann-ok')).then(function(elements) {
            expect(elements.length).toBe(0);
        });

        // find all suggested annotation, should be 88
        p.findElements(protractor.By.css('.pnd-text-fragment-icon')).then(function(elements) {
            expect(elements.length).toBe(88);

            // click first icon to open preview and menu suggested annotation
            elements[0].click();
            // accept the suggested annotation
            p.findElement(protractor.By.css('.popover-content .pnd-button-set-ok')).click();
            // now there is 1 accepted annonation
            p.findElements(protractor.By.css('.ann-ok')).then(function(elements) {
                expect(elements.length).toBe(1);
            });
            // click again first icon to open preview and menu suggested annotation
            elements[0].click();
            // remove accepted annotation
            p.findElement(protractor.By.css('.popover-content .pnd-button-set-ko')).click();
            // now there are none accepted annotation
            p.findElements(protractor.By.css('.ann-ok')).then(function(elements) {
                expect(elements.length).toBe(0);
            });

        });


    });

});