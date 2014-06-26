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
    "http://purl.org/pundit/demo-cloud-server/notebook/myNbID": {
        "http://open.vocab.org/terms/visibility": [{value: "public", type: "literal"}],
        "http://purl.org/dc/elements/1.1/creator": [{value: "Simone", type: "literal"}],
        "http://purl.org/pundit/ont/ao#id": [{value: "myNbID", type: "literal"}],
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

testNotebooks.notebookPrivate = {
    "http://purl.org/pundit/demo-cloud-server/notebook/88e4c1e8": {
        "http://open.vocab.org/terms/visibility": [{value: "private", type: "literal"}],
        "http://purl.org/dc/elements/1.1/creator": [{value: "Mario Bros", type: "literal"}],
        "http://purl.org/pundit/ont/ao#id": [{value: "88e4c1e8", type: "literal"}],
        "http://purl.org/pundit/ont/ao#includes": [{
            value: "http://purl.org/pundit/demo-cloud-server/annotation/testannid99",
            type: "uri"
        }],
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{
            value: "http://purl.org/pundit/ont/ao#Notebook",
            type: "uri"
        }],
        "http://www.w3.org/2000/01/rdf-schema#label": [{value: "notebook1", type: "literal"}]
    }
};

/*testNotebooks.notebookPrivate = {
    created: "2014-06-24T10:53:09",
    creator: "http://purl.org/pundit/demo-cloud-server/user/111111",
    creatorName: "Mario Bros",
    id: "88e4c1e8",
    includes: ['ann01', 'ann02'],
    label: "notebook1",
    type: ['http://purl.org/pundit/ont/ao#Notebook'],
    uri: "http://purl.org/pundit/demo-cloud-server/notebook/88e4c1e8",
    visibility: "private"
};*/

testNotebooks.notebookPublic = {
    "http://purl.org/pundit/demo-cloud-server/notebook/123456789": {
        "http://open.vocab.org/terms/visibility": [{value: "public", type: "literal"}],
        "http://purl.org/dc/elements/1.1/creator": [{value: "Godzilla", type: "literal"}],
        "http://purl.org/pundit/ont/ao#id": [{value: "123456789", type: "literal"}],
        "http://purl.org/pundit/ont/ao#includes": [{
            value: "http://purl.org/pundit/demo-cloud-server/annotation/testannid98",
            type: "uri"
        }],
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{
            value: "http://purl.org/pundit/ont/ao#Notebook",
            type: "uri"
        }],
        "http://www.w3.org/2000/01/rdf-schema#label": [{value: "notebook2", type: "literal"}]
    }
};

/*
testNotebooks.notebookPublic = {
    created: "2014-06-24T10:53:09",
    creator: "http://purl.org/pundit/demo-cloud-server/user/111111",
    creatorName: "Godzilla",
    id: "123456789",
    includes: ['ann01', 'ann02'],
    label: "notebook1",
    type: ['http://purl.org/pundit/ont/ao#Notebook'],
    uri: "http://purl.org/pundit/demo-cloud-server/notebook/123456789",
    visibility: "public"
};*/