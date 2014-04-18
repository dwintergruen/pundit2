angular.module('Pundit2.Core')
.service('NameSpace', function(BaseComponent, Config, $interpolate, $window) {
    var ns = new BaseComponent('NameSpace'),
        _rdf  = "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        _rdfs = "http://www.w3.org/2000/01/rdf-schema#",
        _dce  = "http://purl.org/dc/elements/1.1/",
        _dct  = "http://purl.org/dc/terms/",
        _pnd  = "http://purl.org/pundit/ont/ao#",
        _skos = "http://www.w3.org/2004/02/skos/core#";
        
    $window.PUNDIT.ns = ns;

    // RDF namespace uris
    ns.rdf = {};
    ns.rdf.type       = _rdf + "type";
    ns.rdf.value      = _rdf + "value";
    ns.rdf.property   = _rdf + "Property";
    ns.rdf.XMLLiteral = _rdf + "XMLLiteral";
    
    // RDFS namespace uris
    ns.rdfs = {};
    ns.rdfs.label    = _rdfs + "label";
    ns.rdfs.comment  = _rdfs + "comment";
    ns.rdfs.resource = _rdfs + "Resource";
    ns.rdfs.literal  = _rdfs + "Literal";
    ns.rdfs.seeAlso  = _rdfs + "seeAlso";


    // Item properties
    ns.item = {
        /** 
            Short label (usually 30-40 chars or so), see rdfs.label
            @const items.label 
        **/
        label: ns.rdfs.label,

        /** 
            Preferred label
            @const items.prefLabel 
        **/
        prefLabel: _skos + "prefLabel",

        /** 
            Alternative labels
            @const items.altLabel 
        **/
        altLabel: _skos + "altLabel",

        /** 
            Long description or content of a text fragment
            @const items.description 
        **/
        description: _dce + "description",

        /** 
            Image contained in the text fragment, or associated with the item
            @const items.image 
        **/
        image: "http://xmlns.com/foaf/0.1/depiction",

        // TODO: the items have an rdfType field which contains the types, call
        //       this rdfTypes as well?
        /** 
            Used for item types, see rdf.type
            @const items.type 
        **/
        type: ns.rdf.type,

        /** 
            Web URL where the item has been created
            @const items.pageContext 
        **/
        pageContext: _pnd + "hasPageContext",

        /** 
            Closest named content or container for this item
            @const items.isPartOf 
        **/
        isPartOf: _dct + "isPartOf",
        
        /** 
            TODO
            @const items.selector 
        **/
        selector: "http://www.w3.org/ns/openannotation/core/hasSelector",
        /** 
            TODO
            @const items.parentItemXP 
        **/
        parentItemXP: _pnd + "parentItemXP"
    };
    
    
    // Notebook properties
    ns.notebook = {
        /** 
            Name of the notebook
            @const notebooks.label
        **/
        label: ns.rdfs.label,

        /** 
            Can be public or private
            @const notebooks.visibility
        **/
        visibility: "http://open.vocab.org/terms/visibility",

        /** 
            TODO
            @const notebooks.created
        **/
        created: _dct + "created",

        /** 
            Creator and owner of the notebook
            @const notebooks.creator 
        **/
        creator: _dct + "creator",

        /** 
            Name of the creator and owner of the notebook
            @const notebooks.creatorName 
        **/
        creatorName: _dce + "creator",

        /** 
            Notebook's id
            @const notebooks.id
        **/
        id: _pnd + "id",

        /** 
            Annotations this notebook includes
            @const notebooks.includes
        **/
        includes: _pnd + "includes",

        /** 
            Rdf type of the notebook, see rdf_type
            @const notebooks.type
        **/
        type: ns.rdf.type
    };
    
    // Annotation server API
    ns.as              = Config.annotationServerBaseURL;
    ns.asUsers         = ns.as + "/users/";
    ns.asUsersCurrent  = ns.as + "/users/current";
    ns.asUsersLogout   = ns.as + "/users/logout";
    ns.asOpenNBMeta    = ns.as + "/open/notebooks/{{id}}/metadata";
    ns.asOpenNBAnnMeta = ns.as + "/open/notebooks/{{id}}/annotations/metadata";
    

    // Gets a key of the namespace, interpolating variables if needed
    ns.get = function(key, context) {
        
        // If it's not a string, it's nothing we can return (this
        // blocks the user from asking options or other weird stuff)
        if (typeof(ns[key]) !== "string") {
            ns.err('get() cant find key '+key);
            return;
        }

        // No context, use an empty one
        if (typeof(context) === "undefined") {
            context = {};
        }
        
        // Count how many variables are needed to interpolate this string
        var str = ns[key],
            variables = str.match(/{{([a-zA-Z0-9]*)}}/g),
            foo;
            
        if (variables !== null && variables.length > 0) {
            var contextVariables = 0;
            for (foo in context) { contextVariables++; }
            if (variables.length > contextVariables) {
                ns.err('Context variables mismatch! Expecting ' + variables.join(', ') + " instead got " + JSON.stringify(context));
                return;
            }
        }
        
        return $interpolate(str)(context);
    };
    
    ns.log('NameSpace up and running');
    return ns;
});