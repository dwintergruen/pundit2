var testAnnotations = {};

testAnnotations.empty1 = {};

testAnnotations.empty2 = {
    items: {},
    graph: {},
    metadata: {}
};

testAnnotations.simple1 = {
    metadata: {
        "http://test.url/annotation/simple/1": {}
    },
    items: {},
    graph: {}
};

testAnnotations.simple2 = {
    graph: {
        "http://fake-url.it/release_bot/build/examples/dante-1.html": {
          "http://purl.org/spar/cito/cites": [
            {
              value: "http://purl.org/pundit/ont/ao#fragment-text",
              type: "uri"
            }
          ]
        }
    },
    items: {
        "http://purl.org/pundit/ont/ao#fragment-text": {
            "http://www.w3.org/2000/01/rdf-schema#label":
                [{type: "literal", value: "Text fragment"}]
        },
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property": {
            "http://www.w3.org/2000/01/rdf-schema#label":
                [{type: "literal", value: "Property"}]
        },
        "http://fake-url.it/release_bot/build/examples/dante-1.html": {
          "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":
                [{type: "uri", value: "http://purl.org/pundit/ont/ao#fragment-text"}],
          "http://purl.org/dc/elements/1.1/description":
                [{type: "literal", value: "originally"}],
          "http://www.w3.org/2000/01/rdf-schema#label":
                [{type: "literal", value: "originally"}],
          "http://purl.org/pundit/ont/ao#hasPageContext":
                [{type: "uri", value: "http://localhost/pundit/examples/client-TEST.html"}],
          "http://purl.org/dc/terms/isPartOf":
                [{type: "uri", value: "http://fake-url.it/release_bot/build/examples/dante-1.html"}],
        },
        "http://purl.org/spar/cito/cites": {
            "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{type: "uri", value: 'Property'}]

        }
    },
    metadata: {
        "http://purl.org/pundit/demo-cloud-server/annotation/annid123": {
            "http://purl.org/pundit/ont/ao#hasPageContext":
                [{type: "uri", value: "http://localhost:9000/app/examples/client-TEST.html"}],
            "http://purl.org/pundit/ont/ao#isIncludedIn":
                [{type: "uri", value: "http://purl.org/pundit/demo-cloud-server/notebook/ntid123"}],
            "http://purl.org/dc/terms/creator":
                [{type: "uri", value: "http://purl.org/pundit/demo-cloud-server/user/userid123"}],
            "http://purl.org/dc/elements/1.1/creator":
                [{type: "literal", value: "Creator User Name"}],
            "http://www.openannotation.org/ns/hasTarget":
                [{type: 'uri', value: 'http://metasound.dibet.univpm.it/exmaple'}]

        }

    }
};