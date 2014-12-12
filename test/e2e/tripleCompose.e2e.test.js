describe("TripleComposer interaction", function() {
    var p = protractor.getInstance();

    beforeEach(function(){
        p.get('/app/examples/tripleComposer.html');
    });

    it("should correctly load triple composer", function(){
        // triple composer born with one empty statement
        
        // statement directive
        p.findElements(protractor.By.css(".pnd-triplecomposer-statements-container statement")).then(function(s) {
            expect(s.length).toBe(1);
        });
        // statement containers div
        p.findElements(protractor.By.css("statement .pnd-statement-subject")).then(function(sub) {
            expect(sub.length).toBe(1);
        });
        p.findElements(protractor.By.css("statement .pnd-statement-predicate")).then(function(pred) {
            expect(pred.length).toBe(1);
        });
        p.findElements(protractor.By.css("statement .pnd-statement-object")).then(function(obj) {
            expect(obj.length).toBe(1);
        });
        // advanced menu buttons
        p.findElements(protractor.By.css("statement .pnd-statement-buttons button")).then(function(btn) {
            expect(btn.length).toBe(1);
        });
    });

    it("should correctly add item", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open resource panel
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).click();

        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });

        // add item by click on resource panel item and use btn
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-item")).click();
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-footer-content .pnd-resource-panel-use-button")).click();

        // label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("item1Label");
        });
        // delete button
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object button")).then(function(btn) {
            expect(btn.getAttribute('title')).toEqual("delete");
        });
    });

    it("should correctly show predicate when object is already present", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open resource panel on object
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).click();
        // check if is opened
        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });
        // add item (image) by click on resource panel item and use btn
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-item")).then(function(items){
            items[2].click();
        });
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-footer-content .pnd-resource-panel-use-button")).click();

        // open resource panel on predicate
        p.findElement(protractor.By.css(".pnd-statement-predicate .pnd-statement-label")).click();
        // check if is opened
        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });
        // check propeties number
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tabs > li > a span")).then(function(spans) {
            expect(spans[0].getText()).toBe('0');
        });
        p.findElements(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-content item")).then(function(items) {
            expect(items.length).toBe(0);
        });

    });

    it("should correctly add literal item", function(){

        // open literal resource panel
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object [title='text']")).click();
        // check if popover exist
        p.findElements(protractor.By.css(".pnd-popover-literal")).then(function(popover) {
            expect(popover.length).toBe(1);        
        });

        // add text to popover
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content textarea")).sendKeys('testo');

        // click save
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-footer .btn-success")).click();

        // item label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("testo");
        });
        // delete button
        p.findElements(protractor.By.css(".pnd-statement-object .pnd-row-button-object button")).then(function(btn) {
            expect(btn.length).toBe(1);
        });
    });

    it("should correctly edit literal item", function(){

        // open literal resource panel
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object [title='text']")).click();
        // check if popover exist
        p.findElements(protractor.By.css(".pnd-popover-literal")).then(function(popover) {
            expect(popover.length).toBe(1);
        });
        // add text to popover
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content textarea")).sendKeys('testo');

        // click save
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-footer .btn-success")).click();
        // first item label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("testo");
        });

        // open literal resource panel (second times)
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).click();
        // add second text to popover
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content textarea")).then(function(textarea){
            expect(textarea.getAttribute('value')).toBe('testo');
            textarea.sendKeys(' altro testo...');
        });
            
        // click save TODO add class to save btn
        p.findElement(protractor.By.css(".pnd-popover-literal .popover-content button")).click();
        // second item label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("testo altro testo...");
        });
    });

    it("should correctly remove item", function(){

        p.driver.manage().window().setSize(1200, 960);

        // open resource panel
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).click();

        // add item by click on resource panel item and use btn
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-item")).click();
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-footer-content .pnd-resource-panel-use-button")).click();

        // check label
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("item1Label");
        });

        // click delete button
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object button")).click();
        // check input
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("Add an object");
        });
    });

    it("should correctly duplicate statement", function(){

        // open resource panel
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-statement-label")).click();

        // add item by click on resource panel item and use btn
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-item")).click();
        p.findElement(protractor.By.css(".pnd-resource-panel-popover .pnd-vertical-tab-footer-content .pnd-resource-panel-use-button")).click();
     
        // duplicate statement
        p.findElement(protractor.By.css("statement[id='1'] .pnd-statement-buttons button")).click();
        p.findElements(protractor.By.css('.dropdown-menu')).then(function(elements) {
            expect(elements.length).toBe(1);
        });
        p.findElements(protractor.By.css('.dropdown-menu > li')).then(function(elements) {
            expect(elements.length).toBe(3);
            elements[1].click();
        });
        

        // check if have the same label
        p.findElement(protractor.By.css("statement[id='2'] .pnd-statement-object .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("item1Label");
        });
        // check if have the delete button
        p.findElement(protractor.By.css("statement[id='2'] .pnd-statement-object .pnd-row-button-object button")).then(function(btn) {
            expect(btn.getAttribute('title')).toEqual("delete");
        });
    });

    it("should correctly remove statement", function(){

        // add blank statement
        p.findElement(protractor.By.css("statement[id='1'] .pnd-statement-buttons button")).click();
        p.findElements(protractor.By.css('.dropdown-menu')).then(function(elements) {
            expect(elements.length).toBe(1);
        });
        p.findElements(protractor.By.css('.dropdown-menu > li')).then(function(elements) {
            expect(elements.length).toBe(3);
            elements[0].click();
        });

        // chek new statement number
        p.findElements(protractor.By.css(".pnd-triplecomposer-statements-container statement")).then(function(s) {
            expect(s.length).toBe(2);
        });

        // remove statement
        p.findElement(protractor.By.css("statement[id='1'] .pnd-statement-buttons button")).click();
        p.findElements(protractor.By.css('.dropdown-menu')).then(function(elements) {
            expect(elements.length).toBe(1);
        });
        p.findElements(protractor.By.css('.dropdown-menu > li')).then(function(elements) {
            expect(elements.length).toBe(3);
            elements[2].click();
        });

        // chek new statement number
        p.findElements(protractor.By.css(".pnd-triplecomposer-statements-container statement")).then(function(s) {
            expect(s.length).toBe(1);
        });
           
    });

    it("should correctly open resource panel date popover", function(){

        // open literal resource panel
        p.findElement(protractor.By.css(".pnd-statement-object .pnd-row-button-object [title='calendar']")).click();
        // check if popover exist
        p.findElements(protractor.By.css(".pnd-popover-calendar")).then(function(popover) {
            expect(popover.length).toBe(1);
        });

        var date = new Date();

        // check day
        p.findElement(protractor.By.css(".popover-datepicker .pnd-date-picker tbody .btn-primary span")).getText().then(function(text) {
            if (date.getDate() < 10) {
                expect(text).toBe('0'+date.getDate());
            } else {
                expect(text).toBe(date.getDate().toString());
            }
        });

        // check month and year
        p.findElement(protractor.By.css(".popover-datepicker .pnd-date-picker thead .ng-binding")).getText().then(function(text) {
            expect(text.indexOf(date.getFullYear())).not.toBe(-1);
        });

    });

    // TODO: test vocab and items search

});