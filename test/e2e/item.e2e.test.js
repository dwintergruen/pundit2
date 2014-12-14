describe("Item interaction", function() {
    var p = protractor.getInstance();

    beforeEach(function(){
        p.get('/app/examples/item.html');
    });

    it("should correctly show item", function(){

        p.findElement(protractor.By.css("[data-ng-app='Pundit2'] item")).then(function(item) {
            // directive attribute
            expect(item.getAttribute('uri')).toEqual("testItemUri");
            expect(item.getAttribute('menu-type')).toEqual("testMenuType");
        });

        p.findElements(protractor.By.css(".pnd-item-buttons button")).then(function(buttons) {
            expect(buttons.length).toBe(2);
        });

        p.findElements(protractor.By.css(".pnd-item-text span")).then(function(texts) {
            expect(texts.length).toBe(2);
        });

        p.findElement(protractor.By.css(".pnd-item-typeLabel")).then(function(label) {
            expect(label.getText()).toEqual("Text fragment");
        });

        p.findElement(protractor.By.css(".pnd-item-label")).then(function(label) {
            expect(label.getText()).toEqual("Item Label");
        });

    });

    it("should correctly set item to sticky", function(){

        var item = p.findElement(protractor.By.css("item")),
            head = p.findElement(protractor.By.css("item .pnd-item"));

        p.actions().mouseMove(item).perform();

        // wait animation
        p.sleep(500);

        p.findElements(protractor.By.css(".pnd-sticky-item")).then(function(items){
            expect(items.length).toBe(0);
        });

        p.actions().mouseMove(head).click().perform();

        p.findElements(protractor.By.css(".pnd-sticky-item")).then(function(items){
            expect(items.length).toBe(1);
        });

    });

    it("should correctly open item menu", function(){

        var item = p.findElement(protractor.By.css("item")),
            menuBtn = p.findElement(protractor.By.css("item .pnd-icon-bars"));

        p.actions().mouseMove(item).perform();

        // wait animation
        p.sleep(500);

        p.findElements(protractor.By.css(".dropdown-menu")).then(function(items){
            expect(items.length).toBe(0);
        });

        p.actions().mouseMove(menuBtn).click().perform();

        p.findElements(protractor.By.css(".dropdown-menu")).then(function(items){
            expect(items.length).toBe(1);
        });

    });

});