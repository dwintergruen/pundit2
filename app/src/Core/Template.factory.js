angular.module('Pundit2.Core')
.factory('Template', function(BaseComponent, Utils, TemplatesExchange) {

    var templateComponent = new BaseComponent('Template');

    var TemplateFactory = function(id, values) {
        // To create a new Template at least a id is needed
        if (typeof(id) === "undefined") {
            templateComponent.err("Can't create a template without an id");
            return;
        }
        this.id = id;

        if (angular.isObject(values)) {
            templateComponent.log('Extending new Template with values '+this.id, values);
            Utils.deepExtend(this, values);
        }

        // Add it to the exchange, ready to be .. whatever will be.
        TemplatesExchange.addTemplate(this);
    };

    return TemplateFactory;

});