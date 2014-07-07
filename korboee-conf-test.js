var confTest1 = {
    endpoint: "http://korbo2.local:80/v1",
    basketID: 1,
    globalObjectName : 'KK',
    limitSearchResult: 11,
    useOnlyCallback: false,
    useTafonyCompatibility: true,
    labelMinLength: 5

};

var confTest2 = {
    endpoint: "http://korbo2.local:80/v1",
    limitSearchResult: 3,
    globalObjectName : 'FF',
    useTafonyCompatibility: true,
    onReady: function(){
        console.log("widget is ready to use2");
    },

    autoCompleteMode: 'full',
    autoCompleteOptions: 'search'
}

var confTest3 = {
    endpoint: "http://korbo2.local:80/v1",
    limitSearchResult: 20,
    //labelMinLength: 6,
    globalObjectName : 'GG',
    useTafonyCompatibility: true,

    autoCompleteMode: 'simple',
    autoCompleteOptions: 'all'
}