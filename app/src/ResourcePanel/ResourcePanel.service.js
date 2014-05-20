angular.module('Pundit2.ResourcePanel')
.constant('RESOURCEPANELDEFAULTS', {

})
.service('ResourcePanel', function(BaseComponent, RESOURCEPANELDEFAULTS, $rootScope, $popover, $q) {

    var selectors = ['freebase', 'dbpedia', 'korbo'];


    var resourcePanel = new BaseComponent('ResourcePanel', RESOURCEPANELDEFAULTS);
    var state = {};
    var literal = null;


    var options = {scope: $rootScope.$new()};

        // initialize literal text popover
    var initLiteral = function(element){
        // var options = {scope: $rootScope.$new()};

        options.scope.literalText = 'valore di default';

        // handle save a new literal
        options.scope.save = function(literalText) {
            resourcePanel.save(this.literalText);
            resourcePromise.resolve(this.literalText);
        };

        // close literal popover without saving
        options.scope.cancel = function() {
            resourcePanel.hide();
        };

        options.placement = 'bottom';
        options.animation = null;
        options.template = 'src/ResourcePanel/popoverLiteralText.tmpl.html';
        literal = $popover(element, options);
        return literal;
    };

    var resourcePromise;

    resourcePanel.showLiteral = function(element){

        if (literal === null){
            literal = initLiteral(element);
            literal.$promise.then(literal.show);
        } else {
            literal.hide;
            literal.destroy();
            literal = null;
        }
        resourcePromise = $q.defer();
        return resourcePromise.promise;
    };

    resourcePanel.hide = function(){
        literal.hide();
        literal.destroy();
        literal = null;
    };

    resourcePanel.save = function(text){
        state.literal = text;
        literal.hide();
        literal.destroy();
        literal = null;
    };

    resourcePanel.getLiteral = function() {
        return state.literal;
    };

    return resourcePanel;
});
