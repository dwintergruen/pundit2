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
    "http://fake-url.it/release_bot/build/examples/dante-1.html#xpointer(start-point(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/B[1]/text()[1],'',0))/range-to(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/B[1]/text()[1],'',23)))": {
      "uri": "http://fake-url.it/release_bot/build/examples/dante-1.html#xpointer(start-point(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/B[1]/text()[1],'',0))/range-to(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/B[1]/text()[1],'',23)))",
      "type": [
        "http://purl.org/pundit/ont/ao#fragment-text"
      ],
      "label": "Durante degli Alighieri",
      "altLabel": "Durante degli Alighieri",
      "description": "Durante degli Alighieri",
      "pageContext": "http://172.20.0.64/pundit/examples/ee.html",
      "isPartOf": "http://fake-url.it/release_bot/build/examples/dante-1.html"
    },
    "http://purl.org/pundit/ont/oa#isWrittenIn": {
      "uri": "http://purl.org/pundit/ont/oa#isWrittenIn",
      "type": [
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"
      ],
      "label": "is written in",
      "altLabel": "is written in",
      "description": "The selected text fragment is written in the specified language (french, german, english etc)"
    },
    "http://www.freebase.com/m/02bjrlw": {
      "uri": "http://www.freebase.com/m/02bjrlw",
      "type": [
        "http://www.freebase.com/schema/common/topic",
        "http://www.freebase.com/schema/book/book_subject",
        "http://www.freebase.com/schema/user/alust/default_domain/processed_with_review_queue",
        "http://www.freebase.com/schema/base/schemastaging/context_name",
        "http://www.freebase.com/schema/base/rosetta/languoid",
        "http://www.freebase.com/schema/base/authors/topic",
        "http://www.freebase.com/schema/broadcast/genre",
        "http://www.freebase.com/schema/language/human_language",
        "http://www.freebase.com/schema/user/ktrueman/default_domain/official_language",
        "http://www.freebase.com/schema/education/field_of_study",
        "http://www.freebase.com/schema/base/authors/language_written_in",
        "http://www.freebase.com/schema/symbols/namesake",
        "http://www.freebase.com/schema/base/italianbooks/topic",
        "http://www.freebase.com/schema/media_common/netflix_genre",
        "http://www.freebase.com/schema/fictional_universe/fictional_language",
        "http://www.freebase.com/schema/base/allthingsnewyork/topic"
      ],
      "label": "Italian Language",
      "description": "Italian is a Romance language spoken mainly in Europe: Italy, Switzerland, San Marino, Vatican City, as a second language in Malta, Slovenia and Croatia, by minorities in Eritrea, France, Libya, Monaco, Montenegro, and Somalia, and by expatriate communities in the Americas and Australia. Many speakers are native bilinguals of both standardised Italian and other regional languages.\nAccording to the Bologna statistics of the European Union, Italian is spoken as a native language by 59 million people in the EU, mainly in Italy, and as a second language by 14 million. Including the Italian speakers in non-EU European countries and on other continents, the total number of speakers is around 85 million.\nIn Switzerland, Italian is one of four official languages; it is studied and learned in all the confederation schools and spoken, as a native language, in the Swiss cantons of Ticino and Grigioni and by the Italian immigrants that are present in large numbers in German- and French-speaking cantons. It is also the official language of San Marino, as well as the primary language of the Vatican City. It is co-official in Slovenian Istria and in Istria County in Croatia.",
      "image": "https://usercontent.googleapis.com/freebase/v1/image/m/02bjrlw"
    },
    "http://www.freebase.com/m/02h40lc": {
      "uri": "http://www.freebase.com/m/02h40lc",
      "type": [
        "http://www.freebase.com/schema/common/topic",
        "http://www.freebase.com/schema/book/book_subject",
        "http://www.freebase.com/schema/base/schemastaging/context_name",
        "http://www.freebase.com/schema/base/rosetta/languoid",
        "http://www.freebase.com/schema/base/authors/topic",
        "http://www.freebase.com/schema/language/human_language",
        "http://www.freebase.com/schema/user/ktrueman/default_domain/official_language",
        "http://www.freebase.com/schema/education/field_of_study",
        "http://www.freebase.com/schema/base/authors/language_written_in",
        "http://www.freebase.com/schema/symbols/namesake",
        "http://www.freebase.com/schema/fictional_universe/fictional_language",
        "http://www.freebase.com/schema/user/tsegaran/random/taxonomy_subject",
        "http://www.freebase.com/schema/base/todolists/topic",
        "http://www.freebase.com/schema/base/database/topic",
        "http://www.freebase.com/schema/base/database/database_topic",
        "http://www.freebase.com/schema/user/johm/carnegie_mellon_university/department",
        "http://www.freebase.com/schema/user/johm/carnegie_mellon_university/topic",
        "http://www.freebase.com/schema/base/ireland/topic",
        "http://www.freebase.com/schema/base/academia/topic",
        "http://www.freebase.com/schema/dataworld/information_source",
        "http://www.freebase.com/schema/book/school_or_movement",
        "http://www.freebase.com/schema/base/skosbase/topic",
        "http://www.freebase.com/schema/base/skosbase/vocabulary_equivalent_topic",
        "http://www.freebase.com/schema/base/schemastaging/contact_product",
        "http://www.freebase.com/schema/base/soundalike/topic"
      ],
      "label": "English Language",
      "description": "English is a West Germanic language that was first spoken in early medieval England and is now a global lingua franca. It is spoken as a first language by the majority populations of several sovereign states, including the United Kingdom, the United States, Canada, Australia, Ireland, New Zealand and a number of Caribbean nations; and it is an official language of almost 60 sovereign states. It is the third-most-common native language in the world, after Mandarin Chinese and Spanish. It is widely learned as a second language and is an official language of the European Union, many Commonwealth countries and the United Nations, as well as in many world organisations.\nEnglish arose in the Anglo-Saxon kingdoms of England and what is now southeast Scotland. Following the extensive influence of Great Britain and the United Kingdom from the 17th to mid-20th centuries through the British Empire, it has been widely propagated around the world. Through the spread of American-dominated media and technology, English has become the leading language of international discourse and the lingua franca in many regions.",
      "image": "https://usercontent.googleapis.com/freebase/v1/image/m/02h40lc"
    },
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
      "http://purl.org/pundit/ont/oa#isWrittenIn": [
        {
          "value": "http://www.freebase.com/m/02bjrlw",
          "type": "uri"
        },
        {
          "value": "http://www.freebase.com/m/02h40lc",
          "type": "uri"
        }
      ],
      "http://purl.org/spar/cito/cites": [
        {
          "value": "http://fake-url.it/release_bot/build/examples/dante-1.html#xpointer(start-point(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/text()[6],'',1))/range-to(string-range(//DIV[@about='http://fake-url.it/release_bot/build/examples/dante-1.html']/DIV[1]/P[2]/text()[6],'',12)))",
          "type": "uri"
        }
      ]
    }
  },
};
