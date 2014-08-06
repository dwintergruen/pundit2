// httpBackend mock to handle all http request in e2e test
// include this object in all e2e test that make an http request

var VocabHttpMock;
VocabHttpMock = function () {
    angular.module('httpBackendMock', ['ngMockE2E'])
        .run(function ($httpBackend, FREEBASESELECTORDEFAULTS, MURUCASELECTORDEFAULTS, KORBOBASKETSELECTORDEFAULTS) {

            // FREEBASE HTTP MOCK
            var freebaseItem = { result: [ {mid: "/m/02qtppz", name: "Pippo Baudo"} ] };
            var freebaseMqlItem = {
                result: {
                    mid: "/m/02qtppz",
                    type: [{id: "/common/topic"}, {id: "/people/person"}, {id: "/film/actor"}]
                }
            };
            var freebaseTopicItem = {
                property: { '/common/topic/description': {
                        values: [ {value: "Giuseppe Baudo, known as Pippo Baudo, is one of the most..."} ]
                    }
                }
            };
            var url = new RegExp(FREEBASESELECTORDEFAULTS.freebaseSearchURL),
                mqlUrl = new RegExp(FREEBASESELECTORDEFAULTS.freebaseMQLReadURL),
                topicUrl = new RegExp(FREEBASESELECTORDEFAULTS.freebaseTopicURL);

            $httpBackend.whenGET(url).respond(freebaseItem);
            $httpBackend.whenGET(mqlUrl).respond(freebaseMqlItem);
            $httpBackend.whenGET(topicUrl).respond(freebaseTopicItem);

            // MURUCA HTTP MOCK
            var murucaResult = {
                result: [
                    {
                        description: "ZOPPINO 1536, Canto VII",
                        id: "7",
                        match: false,
                        name: "ZOPPINO 1536, Canto VII",
                        resource_url: "http://purl.org/galassiariosto/resources/azione_illustrazione/7",
                        type: ["http://purl.org/galassiariosto/types/Azione"]
                    },
                    {
                        description: "GIOLITO 1542, Canto XIX",
                        id: "1149",
                        match: false,
                        name: "GIOLITO 1542, Canto XIX",
                        resource_url: "http://purl.org/galassiariosto/resources/azione_illustrazione/1149",
                        type: ["http://purl.org/galassiariosto/types/Azione"]
                    }
                ]
            };
            var murucaUrl = new RegExp(MURUCASELECTORDEFAULTS.murucaReconURL);
            $httpBackend.whenJSONP(murucaUrl).respond(murucaResult);

            //KORBO HTTP MOCK
            var korboEmptyResult = {
                result: []
            };
            var korboUrl = new RegExp(KORBOBASKETSELECTORDEFAULTS.korboBasketReconURL);
            $httpBackend.whenJSONP(korboUrl).respond(korboEmptyResult);

        });
 };