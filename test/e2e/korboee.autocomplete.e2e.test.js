/*global KorboEEHttpMock*/

describe("KorboEE autocomplete", function() {


    var p = protractor.getInstance();

    var fs = require('fs'),
        myHttpMock;

    fs.readFile('test/e2e/korboeeMock.e2e.js', 'utf8', function(err, data) {
        if (err) {
            console.log('You need an korboeeMock.e2e.js in test/e2e/');
            return console.log(err);
        }
        /* jshint -W061 */
        eval(data);
        /* jshint +W061 */
        myHttpMock = KorboEEHttpMock;
    });

    beforeEach(function(){
        p.addMockModule('httpBackendMock', myHttpMock);

    });

    afterEach(function() {
        p.removeMockModule('httpBackendMock');
    });

    it('should compile directive and show the input field', function() {

        p.get('/app/examples/korboee-autocomplete-test.html');

        // should be visible 3 input fields
        p.findElements(protractor.By.css('.kee-input-elem-to-search.kee-input-ok')).then(function(inputType) {
            expect(inputType.length).toBe(3);
        });

    });

});