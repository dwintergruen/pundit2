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
    // valid fragment. If it is, returns the fragment type.
    // This method must be implemented by every Annotator
    orch.isConsolidable = function(item) {
        for (var a in annotators) {
            if (annotators[a].isConsolidable(item)) {
                return a;
            }
        }
        return false;
    };

    // Gets the available targets or resources on the current page. They will most likely
    // be passed to the server looking for annotations.
    // This method must be implemented by every Annotator
    orch.getAvailableTargets = function() {
        var ret = [];
        for (var a in annotators) {
            ret = ret.concat(annotators[a].getAvailableTargets());
        }
        return ret;
    };

    orch.log("Component up and running");
    return orch;
});