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
        // clear and copy buttons
        p.findElements(protractor.By.css("statement .pnd-statement-buttons button")).then(function(btn) {
            expect(btn.length).toBe(2);
        });
    });

    it("should correctly add item to triple composer", function(){

        // open resource panel
        var subject = p.findElement(protractor.By.css(".pnd-statement-subject input")).click();

        p.findElements(protractor.By.css(".pnd-resource-panel-popover")).then(function(popover) {
            expect(popover.length).toBe(1);
        });

        // add item by click on resource panel item
        var item = p.findElement(protractor.By.css(".pnd-resource-panel-popover item")).click();
        // label
        p.findElement(protractor.By.css(".pnd-statement-subject .pnd-statement-label")).then(function(label) {
            expect(label.getText()).toEqual("item1Label");
        });
        // button delete
        p.findElement(protractor.By.css(".pnd-statement-subject [ng-show='subjectFound'] .pnd-row-button-subject button")).then(function(btn) {
            expect(btn.getAttribute('title')).toEqual("delete");
        });       
    });

});