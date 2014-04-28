angular.module('Pundit2.Annotators')
.service('AnnotatorsOrchestrator', function(BaseComponent) {
    var orch = new BaseComponent('AnnotatorsOrchestrator', {debug: true});

    var annotableTypes = [],
        annotators = {};

    // Adds a new annotator to the orchestrator
    orch.addAnnotator = function(annotator) {
        orch.log("Adding annotable type ", annotator.label);
        annotableTypes.push(annotator.label);
        annotators[annotator.label] = annotator;
    };

    // Calls every annotator and ask them if the given item is a
    // valid fragment
    orch.isConsolidable = function(item) {
        for (var a in annotators) {
            if (annotators[a].isConsolidable(item)) {
                return a;
            }
        }
        return false;
    };

    orch.log("Component up and running");
    return orch;
});