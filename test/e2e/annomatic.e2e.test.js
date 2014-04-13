describe("The annomatic module", function() {
    var p = protractor.getInstance();
    
    // TODO: mock the datatxt backend with those 25 annotations
    
    it('should load some 25 annotations from datatxt', function() {
        p.get('/app/examples/annomatic-module.html');

        p.findElement(protractor.By.css('header button')).click().then(function(){
            p.waitForAngular();
            p.findElements(protractor.By.css('.ann-auto')).then(function(elements) {
                expect(elements.length).toBe(25);
            });
        });
    });

    it('should accept an annotation clicking on accept and removing it by clicking on remove', function() {
        p.get('/app/examples/annomatic-module.html');

        // Get annotations
        p.findElement(protractor.By.css('header button')).click();
        
        // No accepted annotations
        p.findElements(protractor.By.css('.ann-ok')).then(function(elements) {
            expect(elements.length).toBe(0);
        });
        
        p.findElement(protractor.By.css('.ann-auto')).click();
        p.findElement(protractor.By.css('.popover-content button.btn-success')).click();

        // 1 accepted annotation
        p.findElements(protractor.By.css('.ann-ok')).then(function(elements) {
            expect(elements.length).toBe(1);
        });
        
        p.findElement(protractor.By.css('.ann-auto.ann-ok')).click();
        p.findElement(protractor.By.css('.popover-content button.btn-danger')).click();

        // No accepted annotations
        p.findElements(protractor.By.css('.ann-ok')).then(function(elements) {
            expect(elements.length).toBe(0);
        });

    });

});