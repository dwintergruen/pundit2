describe('Notebook Composer service', function() {

    var NotebookComposer,
        $rootScope,
        $httpBackend,
        NameSpace,
        $compile,
        Notebook;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function($injector, _$rootScope_, _$httpBackend_, _$compile_, _Notebook_){
        NotebookComposer = $injector.get('NotebookComposer');
        NameSpace = $injector.get('NameSpace');
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        $compile = _$compile_;
        Notebook = _Notebook_;

    }));

    it("should get an empty notebook to edit as default", function() {
        expect(NotebookComposer.getNotebookToEdit()).toBeNull();
    });

    it("should set a notebook as notebook to edit", function() {

        // at this time no notebook is set as notebook to edit
        expect(NotebookComposer.getNotebookToEdit()).toBeNull();

        var testId = 'simple1ID';

        $httpBackend
            .when('GET', NameSpace.get('asOpenNBMeta', {id: testId}))
            .respond(testNotebooks.simple1);

        // create a new notebook
        var promise = new Notebook(testId);

        promise.then(function(newNotebook){

            // when item is created, will be set as notebook to edit
            NotebookComposer.setNotebookToEdit(newNotebook);

            // get notebook to edit
            var nbToEdit = NotebookComposer.getNotebookToEdit();

            // notebook to edit should not be null at this time...
            expect(nbToEdit).not.toBeNull();

            // ... and should be the same just created
            expect(nbToEdit.id).toBe(newNotebook.id);
        });

        $httpBackend.flush();

    });

});