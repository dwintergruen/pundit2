describe('TemplatesExchange service', function() {
    
    var TemplatesExchange;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_TemplatesExchange_){
        TemplatesExchange = _TemplatesExchange_;
    }));

    it('should correctly init', function(){
        var tmpls = TemplatesExchange.getTemplates();
        expect(typeof(tmpls)).toBe('object');
        expect(tmpls.length).toBe(0);
    });

    it('should correctly add template', function(){
        var tmpl = {id: 'tmplID'};
        TemplatesExchange.addTemplate(tmpl);
        var tmplList = TemplatesExchange.getTemplates();
        expect(tmplList.length).toBe(1);
        expect(tmplList[0]).toBe(tmpl);
    });

    it('should correctly remove template', function(){
        var tmpl = {id: 'tmplID'};
        TemplatesExchange.addTemplate(tmpl);
        TemplatesExchange.removeTemplate(tmpl.id);
        var tmplList = TemplatesExchange.getTemplates();
        expect(tmplList.length).toBe(0);
    });

    it('should not remove not existing template', function(){
        var tmpl = {id: 'tmplID'};
        TemplatesExchange.addTemplate(tmpl);
        TemplatesExchange.removeTemplate('999zzz');
        var tmplList = TemplatesExchange.getTemplates();
        expect(tmplList.length).toBe(1);
    });

    it('should correctly wipe templates', function(){
        var tmpl = {id: 'tmplID'};
        TemplatesExchange.addTemplate(tmpl);
        TemplatesExchange.wipe();
        var tmplList = TemplatesExchange.getTemplates();
        expect(tmplList.length).toBe(0);
    });

    it('should not duplicate template', function(){
        var tmpl = {id: 'tmplID'};
        TemplatesExchange.addTemplate(tmpl);
        TemplatesExchange.addTemplate(tmpl);
        var tmplList = TemplatesExchange.getTemplates();
        expect(tmplList.length).toBe(1);
        expect(tmplList[0]).toBe(tmpl);
    });

    it('should correctly get template by id', function(){
        var value = {id: 'tmplID'};
        TemplatesExchange.addTemplate(value);
        var tmpl = TemplatesExchange.getTemplateById(value.id);
        expect(tmpl).toBe(value);
    });

    it('should return undefined if get not existing template', function(){
        var value = {id: 'tmplID'};
        TemplatesExchange.addTemplate(value);
        expect(TemplatesExchange.getTemplateById('999zzz')).toBeUndefined();
    });

    it('should correctly set current template', function(){
        var tmpl = {id: 'tmplID'};
        TemplatesExchange.addTemplate(tmpl);
        TemplatesExchange.setCurrent(tmpl.id);
        expect(TemplatesExchange.getCurrent()).toBe(tmpl);
    });

});