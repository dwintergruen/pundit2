describe('Template factory', function() {
    
    var Template, TemplatesExchange;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_Template_, _TemplatesExchange_){
        Template = _Template_;
        TemplatesExchange = _TemplatesExchange_;
    }));

    it('should not create a template without and id', function(){
        expect(new Template()).toEqual({});
        expect(TemplatesExchange.getTemplates().length).toBe(0);
    });

    it('should create a template', function(){
        var id = 'tmplID';
        var tmpl = new Template(id);
        expect(typeof(tmpl)).toBe('object');
        expect(TemplatesExchange.getTemplates().length).toBe(1);
        expect(TemplatesExchange.getTemplateById(tmpl.id)).toBe(tmpl);
    });

    it('should create and extend a template', function(){
        var id = 'tmplID';
        var values = {color: 'blue'};
        var tmpl = new Template(id, values);
        expect(typeof(tmpl)).toBe('object');
        expect(tmpl.color).toBe('blue');
        expect(TemplatesExchange.getTemplates().length).toBe(1);
        expect(TemplatesExchange.getTemplateById(tmpl.id)).toBe(tmpl);
    });

});