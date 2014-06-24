describe('Notebook Communication service', function() {

    var NotebookCommunication,
        $rootScope,
        $httpBackend,
        NameSpace,
        $compile,
        Notebook;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$compile_, _Notebook_){
        NotebookCommunication = $injector.get('NotebookCommunication');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        Notebook = _Notebook_;

    }));

    iit("should set a ", function() {
        expect(true).toBe(true);
    });


});