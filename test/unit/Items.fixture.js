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