// httpBackend mock to handle all http request in e2e test
// include this object in all e2e test that make an http request

var KorboEEHttpMock;
KorboEEHttpMock = function () {
    angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend) {
            var inputString = "Dante";
            var itemResponse = {
                data: [{available_languages:["en"],basket_id:1,id:114,label:"Label1",abstract:"Abstract1",type:["http:\/\/person.uri","http:\/\/scientist.uri"],"depiction":""},
                    {available_languages:["en"],basket_id:1,id:115,label:"Label2",abstract:"Abstract2",type:["http:\/\/person.uri","http:\/\/scientist.uri"],"depiction":""},
                    {available_languages:["en"],basket_id:1,id:116,label:"Label3",abstract:"Abstract3",type:["http:\/\/person.uri","http:\/\/scientist.uri"],"depiction":""}],
                metadata: { limit: 3, offset: 0, totalCount: 3, pageCount: 2 }
            };


            var resp = {
                data: itemResponse,
                status: 200
            };
            var lan = "en";
            var offset = 0;

            var url = "http://korbo2.local:80/v1/search/items?lang=en&limit=11&offset=0&p=korbo&q=Dante";


            $httpBackend.expectGET(url).respond(resp);


        });
};