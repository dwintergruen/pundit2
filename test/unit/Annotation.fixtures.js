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

// TODO items properties name is rdf name
// TODO add types to items
testAnnotations.simple2 = {
    metadata: {
        "http://test.url/annotation/simple/2": {
            "http://purl.org/pundit/ont/ao#isIncludedIn": [{type: 'uri', value: 'http://purl.org/pundit/demo-cloud-server/notebook/e39af478'}],
            "http://www.openannotation.org/ns/hasTarget": [{type: 'uri', value: 'http://metasound.dibet.univpm.it/exmaple'}]
        }
    },
    items: {
    "http://purl.org/spar/cito/cites": {
      "uri": "http://purl.org/spar/cito/cites",
      "type": [
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      ],
      "label": "cites",
      "altLabel": "cites",
      "description": "The selected text fragment cites another text fragment, or a Work or a Person"
    },
    "http://fake-url.it/release_bot/build/examples/dante-1.html": {
      "uri": "http://fake-url.it/release_bot/build/examples/dante-1.html",
      "type": [
        "http://purl.org/pundit/ont/ao#fragment-text"
      ],
      "label": " originally",
      "altLabel": " originally",
      "description": " originally",
      "pageContext": "http://localhost/pundit/examples/ee.html",
      "isPartOf": "http://fake-url.it/release_bot/build/examples/dante-1.html"
    },
    "http://fake-url.it/anotherTextFragment": {
      "uri": "http://fake-url.it/anotherTextFragment",
      "type": [
        "http://purl.org/pundit/ont/ao#fragment-text"
      ],
      "label": "text text text",
      "altLabel": "text text text",
      "description": "text text text",
      "pageContext": "http://localhost/pundit/examples/index.html",
      "isPartOf": "http://fake-url.it/anotherTextFragment"
    }
  },
    graph: {
    "http://fake-url.it/release_bot/build/examples/dante-1.html": {
      "http://purl.org/spar/cito/cites": [
        {
          "value": "http://fake-url.it/anotherTextFragment",
          "type": "uri"
        }
      ]
    }
  }
};
