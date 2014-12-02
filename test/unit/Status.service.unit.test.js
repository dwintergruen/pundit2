describe('Status service', function() {

    var Status,
        EventDispatcher,
        $rootScope;

    beforeEach(function() {
        module('Pundit2');
        inject(function($injector, _$window_, _$rootScope_) {
            $rootScope = _$rootScope_;
            Status = $injector.get('Status');
            EventDispatcher = $injector.get('EventDispatcher');
        });
    });

    it("should correctly support multiple loading operation", function() {
        // add two loading operation
        EventDispatcher.sendEvent('AnnotationsCommunication.loading', true);
        EventDispatcher.sendEvent('NotebookCommunication.loading', true);

        expect(Status.getLoading()).toBe(true);

        // abort one operation
        EventDispatcher.sendEvent('AnnotationsCommunication.loading', false);
        // loading end when all operation end
        expect(Status.getLoading()).toBe(true);
        // still an ongoing operation
        EventDispatcher.sendEvent('AnnotationsCommunication.loading', false);
        expect(Status.getLoading()).toBe(true);
        // now all operation is finished
        EventDispatcher.sendEvent('NotebookCommunication.loading', false);
        expect(Status.getLoading()).toBe(false);
    });

});