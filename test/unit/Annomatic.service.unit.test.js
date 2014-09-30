describe('Annomatic service', function() {

    var Annomatic, $httpBackend, $compile, $rootScope, $document,
        testAnnotationsEmpty = {
            time: 0,
            annotations: []
        };

    beforeEach(module('Pundit2'));
    beforeEach(function() {
        inject(function($injector, _$httpBackend_, _$compile_, _$rootScope_, _$document_) {
            Annomatic = $injector.get('Annomatic');
            $httpBackend = _$httpBackend_;
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $document = _$document_;
        });
    });

    afterEach(function() {
        angular.element('div.test-content').remove();
    });

    // TODO All annomatic unit test

    it('should start with no annotation', function() {
        expect(Annomatic.annotationNumber).toBe(0);
        expect(Annomatic.ann.byNum.length).toBe(0);
    });

});