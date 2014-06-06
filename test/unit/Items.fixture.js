var testItems = {};

// to obtain an item call new Item(uri, prop)
// each item need to have different uri (eg: 'http://item1-uri')
// prop can be any one of the properties of testItems object

testItems.propFragmentText = {
        label: "item fragment text",
        description: "item description",
        type: ["http://purl.org/pundit/ont/ao#fragment-text"]
};

testItems.propFragImage = {
    label: "item fragment image",
    description: "item description",
    type: ["http://purl.org/pundit/ont/ao#fragment-image"]
};

testItems.propImage = {
    label: "item image",
    description: "item description",
    type: ["http://xmlns.com/foaf/0.1/Image"]
};

testItems.propCommonTopic = {
    label: "item common topic",
    description: "item description",
    type: ["http://www.freebase.com/schema/common/topic", "http://www.freebase.com/schema/interests/collection_category", "http://www.freebase.com/schema/base/popstra/product"]
};

testItems.propWebPage = {
    label: "item web page",
    description: "item description",
    type: ["http://schema.org/WebPage"]
};

testItems.propProperty = {
    label: "item property",
    description: "item description",
    type: ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"]
};

testItems.allPropItem = {
    label: "item",
    altLabel: "item alt label",
    description: "item description",
    image: "http://img-uri",
    type: ["http://dbpedia.org/class/yago/ItalianSoldiers", "http://xmlns.com/foaf/0.1/Person"],
    pageContext: "http://page-context-uri",
    isPartOf: "http://part-of-uri"
};

testItems.completeFragmentTextItem = {
    uri: "completeFragmentTextItem",
    label: "item fragment text",
    description: "item description",
    type: ["http://purl.org/pundit/ont/ao#fragment-text"],
    isProperty: function() { return false; }
};

testItems.completeFragmentImageItem = {
    uri: "completeFragmentImageItem",
    label: "item fragment image",
    description: "item description",
    type: ["http://purl.org/pundit/ont/ao#fragment-image"],
    isProperty: function() { return false; }
};