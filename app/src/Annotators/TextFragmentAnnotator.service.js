angular.module('Pundit2.Annotators')
.service('TextFragmentAnnotator', function(NameSpace, BaseComponent, AnnotatorsOrchestrator, XpointersHelper) {

    // Create the component and declare what we deal with: text
    var tfa = new BaseComponent('TextFragmentAnnotator');
    tfa.label = "text",
    tfa.type = NameSpace.fragments[tfa.label];

    AnnotatorsOrchestrator.addAnnotator(tfa);
    
    tfa.isConsolidable = function(item) {
        if (!angular.isArray(item.type)) {
            tfa.log("Item not valid: malformed");
            return false;
        } else if (item.type.length === 0) {
            tfa.log("Item not valid: types len 0");
            return false;
        } else if (item.type.indexOf(tfa.type) === -1) {
            tfa.log("Item not valid: not a "+ tfa.type);
            return false;
        } else if (!XpointersHelper.isValidXpointerURI(item.uri)) {
            tfa.log("Item not valid: not a valid xpointer uri"+ item.uri);
            return false;
        }

        // TODO: it's a valid text fragment if:
        // - one of its types is the fragment-text type
        // - has a part of
        // - has a page context
        // - .uri is an xpointer

        // TODO: check if it is consolidable ON THIS PAGE

        tfa.log("Item not valid: not recognized as a consolidable "+ tfa.label);
        return true;
    };

    tfa.log("Component up and running");
    return tfa;
});