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
    metadata: {
        "http://test.url/annotation/simple/2": {}
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
    "http://fake-url.it/release_bot/build/examples/dante-1.html#xpointer(start-point(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/text()[6],'',1))/range-to(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/text()[6],'',12)))": {
      "uri": "http://fake-url.it/release_bot/build/examples/dante-1.html#xpointer(start-point(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/text()[6],'',1))/range-to(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/text()[6],'',12)))",
      "type": [
        "http://purl.org/pundit/ont/ao#fragment-text"
      ],
      "label": " originally",
      "altLabel": " originally",
      "description": " originally",
      "pageContext": "http://localhost/pundit/examples/ee.html",
      "isPartOf": "http://fake-url.it/release_bot/build/examples/dante-1.html"
    }
  },
    graph: {
    "http://fake-url.it/release_bot/build/examples/dante-1.html#xpointer(start-point(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/B[1]/text()[1],'',0))/range-to(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/B[1]/text()[1],'',23)))": {
      "http://purl.org/spar/cito/cites": [
        {
          "value": "http://fake-url.it/release_bot/build/examples/dante-1.html#xpointer(start-point(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/text()[6],'',1))/range-to(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/text()[6],'',12)))",
          "type": "uri"
        }
      ]
    }
  }
};
