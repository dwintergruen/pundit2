describe("Preview interaction", function() {
    var p = protractor.getInstance();

    it('should show empty panel preview with welcome message and disabled buttons', function() {

        p.driver.manage().window().setSize(1200, 960);
        p.get('/app/examples/preview.html');

        // should be shown the welcome message in panel header
        p.findElements(protractor.By.css('.pnd-dashboard-preview-panel-heading')).then(function(welcomeHeader) {
            expect(welcomeHeader.length).toBe(1);
            expect(welcomeHeader[0].getText()).toBe('Welcome in Pundit 2');
        });

        // should be shown the welcome message in panel body
        p.findElements(protractor.By.css('.pnd-dashboard-welcome')).then(function(welcomeBody) {
            expect(welcomeBody.length).toBe(1);
            expect(welcomeBody[0].getText()).toBe('Enjoy it');
        });

        // 'More Info' should be visible and disabled
        p.findElements(protractor.By.css('.pnd-dashboard-preview-more-info-button.disabled')).then(function(moreInfoButton) {
            expect(moreInfoButton.length).toBe(1);
        });

        // 'Clear Isticky' should be visible and disabled
        p.findElements(protractor.By.css('.pnd-dashboard-preview-clear-sticky-button.disabled')).then(function(clearStickyButton) {
            expect(clearStickyButton.length).toBe(1);
        });

        // 'Open Image' should not be visible
        p.findElements(protractor.By.css('.pnd-dashboard-preview-external-modal-button')).then(function(openImageButton) {
            expect(openImageButton.length).toBe(0);
        });

    });

    it('should show item preview on mouseover', function() {

        p.driver.manage().window().setSize(1200, 960);
        p.get('/app/examples/preview.html');

        p.findElements(protractor.By.css('.pnd-example-ul li')).then(function(items) {
            p.actions().mouseMove(items[1]).perform();
            //p.sleep(500);

            p.findElements(protractor.By.css('.pnd-dashboard-preview-panel-label')).then(function(elem) {
                expect(elem.length).toBe(1);
                expect(elem[0].getText()).toBe('Item Label2');
            });

            p.findElements(protractor.By.css('.pnd-preview-item-description')).then(function(elem) {
                expect(elem.length).toBe(1);
                expect(elem[0].getText()).toBe('item description2');
            });

            //pnd-preview-item-types-ul
            p.findElements(protractor.By.css('.pnd-preview-item-types-ul li')).then(function(elem) {
                expect(elem.length).toBe(5);
            });

            // 'More Info' should be visible and disabled
            p.findElements(protractor.By.css('.pnd-dashboard-preview-more-info-button.disabled')).then(function(moreInfoButton) {
                expect(moreInfoButton.length).toBe(1);
            });

            // 'Clear Isticky' should be visible and disabled
            p.findElements(protractor.By.css('.pnd-dashboard-preview-clear-sticky-button.disabled')).then(function(clearStickyButton) {
                expect(clearStickyButton.length).toBe(1);
            });

            p.actions().mouseMove(items[0]).perform();
            //p.sleep(500);

            p.findElements(protractor.By.css('.pnd-dashboard-preview-panel-label')).then(function(elem) {
                expect(elem.length).toBe(1);
                expect(elem[0].getText()).toBe('Item Label');
            });
        });

    });

    it('should show predicate preview on mouseover', function() {

        p.driver.manage().window().setSize(1200, 960);
        p.get('/app/examples/preview.html');

        p.findElements(protractor.By.css('.pnd-example-ul li')).then(function(items) {
            p.actions().mouseMove(items[3]).perform();

            p.findElements(protractor.By.css('.pnd-dashboard-preview-panel-label')).then(function(elem) {
                expect(elem.length).toBe(1);
                expect(elem[0].getText()).toBe('has comment (free text)');
            });

            p.findElements(protractor.By.css('.pnd-preview-item-description')).then(function(elem) {
                expect(elem.length).toBe(1);
                expect(elem[0].getText()).toBe('Any comment related to the selected fragment of text or image');
            });

            //pnd-preview-item-types-ul
            p.findElement(protractor.By.css('.pnd-preview-item-types-ul li.pnd-preview-single-type')).then(function(type) {
                expect(type.getText()).toBe('Property');
            });

            p.findElements(protractor.By.css('.pnd-preview-item-predicate')).then(function(elem) {
                expect(elem.length).toBe(1);
            });

            
        });

    });

    it('should show predicate advanced option preview on mouseover', function() {

        p.driver.manage().window().setSize(1200, 960);
        p.get('/app/examples/preview.html');

        p.findElements(protractor.By.css('.pnd-example-ul li')).then(function(items) {
            p.actions().mouseMove(items[4]).perform();

            p.findElements(protractor.By.css('.pnd-preview-item-predicate > ul > li > span')).then(function(elem) {
                expect(elem.length).toBe(2);
                expect(elem[0].getText()).toBe("Free Domain");
                expect(elem[1].getText()).toBe("Free Range");
            });

            p.findElements(protractor.By.css('.pnd-preview-item-allLables > span')).then(function(elem) {
                expect(elem[0].getText()).toBe("all free, completely free");
            });

            
        });

    });

});