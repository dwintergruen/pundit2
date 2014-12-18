angular.module('Pundit2.Communication')
    .service('TemplatesExchange', function(BaseComponent) {

    var templatesExchange = new BaseComponent("TemplatesExchange");

    var tmplList = [],
        tmplListById = {},
        currentTmplID;

    templatesExchange.wipe = function() {
        templatesExchange.log('Wiping every loaded template.');
        tmplList = [];
        tmplListById = {};
    };

    templatesExchange.addTemplate = function(tmpl) {
        if (tmpl.id in tmplListById) {
            templatesExchange.log('Not adding template '+tmpl.id+': already present.');
        } else {
            tmplListById[tmpl.id] = tmpl;
            tmplList.push(tmpl);
        }
    };

    templatesExchange.removeTemplate = function(id) {
        if (id in tmplListById) {
            var index = tmplList.indexOf(tmplListById[id]);
            tmplList.splice(index, 1);
            delete tmplListById[id];
        } else {
            templatesExchange.log('Impossible to remove template '+id+': not exist.');
        }
    };

    templatesExchange.getTemplates = function() {
        return tmplList;
    };

    templatesExchange.getTemplateById = function(id) {
        if (id in tmplListById) {
            return tmplListById[id];
        }
        // If the template is not found, it will return undefined
    };

    templatesExchange.setFirstAsCurrent = function() {
        if (tmplList.length > 0) {
            currentTmplID = tmplList[0].id;
        }
    };

    templatesExchange.setCurrent = function(id) {
        currentTmplID = id;
    };

    templatesExchange.getCurrent = function() {
        return tmplListById[currentTmplID];
    };

    return templatesExchange;

});