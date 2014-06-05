var testPredicates = {};

// HAS COMMENT
testPredicates.hasComment = {
    "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "label": "has comment (free text)",
    "description": "Any comment related to the selected fragment of text or image",
    "domain": [
        "http://purl.org/pundit/ont/ao#fragment-image",
        "http://purl.org/pundit/ont/ao#fragment-text",
        "http://xmlns.com/foaf/0.1/Image"
    ],
    "range": ["http://www.w3.org/2000/01/rdf-schema#Literal"],
    "uri": "http://schema.org/comment"
};

// IS SIMILAR TO
testPredicates.similarTo = {
    "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "label": "is similar to",
    "description": "The selected fragment (text or image fragment) is similar to another fragment (of the same or of different types)",
    "domain": [
        "http://purl.org/pundit/ont/ao#fragment-text",
        "http://purl.org/pundit/ont/ao#fragment-image",
        "http://xmlns.com/foaf/0.1/Image"
    ],
    "range": [
        "http://purl.org/pundit/ont/ao#fragment-text",
        "http://purl.org/pundit/ont/ao#fragment-image",
        "http://xmlns.com/foaf/0.1/Image"
    ],
    "uri": "http://purl.org/pundit/vocab#similarTo"
};

// DEPICTS
testPredicates.depicts = {
    "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "label": "depicts",
    "description": "An image or part of an image depicts something",
    "domain": [
        "http://xmlns.com/foaf/0.1/Image",
        "http://purl.org/pundit/ont/ao#fragment-image"
    ],
    "range": [],
    "uri": "http://xmlns.com/foaf/0.1/depicts"

};

// DATES
testPredicates.dates = {
    "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "label": "period of dates ends at",
    "description": "The selected text fragment corresponds to the specified date period which ends at the specified Date",
    "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
    "range": ["http://www.w3.org/2001/XMLSchema#dateTime"],
    "uri": "http://purl.org/pundit/ont/oa#periodEndDate"
};

// TALKS ABOUT
testPredicates.talksAbout = {
    "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
    "label": "talks about",
    "description": "The selected text fragment talks about some other text, Entity, Person or any other kind of concept",
    "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
    "range": [],
    "uri": "http://purl.org/pundit/ont/oa#talksAbout"
};