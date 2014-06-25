var testNotebooks = {};

testNotebooks.simple1 = {
    "http://purl.org/pundit/demo-cloud-server/notebook/simple1ID": {
        "http://open.vocab.org/terms/visibility": [{value: "private", type: "literal"}],
        "http://purl.org/dc/elements/1.1/creator": [{value: "Giacomo", type: "literal"}],
        "http://purl.org/pundit/ont/ao#id": [{value: "simple1ID", type: "literal"}],
        "http://purl.org/pundit/ont/ao#includes": [{
            value: "http://purl.org/pundit/demo-cloud-server/annotation/testannid99", 
            type: "uri"
        }],
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{
            value: "http://purl.org/pundit/ont/ao#Notebook",
            type: "uri"
        }],
        "http://www.w3.org/2000/01/rdf-schema#label": [{value: "Notebook Label", type: "literal"}]
    }
};

testNotebooks.myNotebook = {
    "http://purl.org/pundit/demo-cloud-server/notebook/simple1ID": {
        "http://open.vocab.org/terms/visibility": [{value: "public", type: "literal"}],
        "http://purl.org/dc/elements/1.1/creator": [{value: "Simone", type: "literal"}],
        "http://purl.org/pundit/ont/ao#id": [{value: "simple1ID", type: "literal"}],
        "http://purl.org/pundit/ont/ao#includes": [{
            value: "http://purl.org/pundit/demo-cloud-server/annotation/testannid99",
            type: "uri"
        }],
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{
            value: "http://purl.org/pundit/ont/ao#Notebook",
            type: "uri"
        }],
        "http://www.w3.org/2000/01/rdf-schema#label": [{value: "myNotebook", type: "literal"}]
    }
};