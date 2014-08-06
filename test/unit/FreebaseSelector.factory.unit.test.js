describe('FreebaseSelector service', function() {

    var FreebaseSelector,
    $httpBackend,
    FREEBASESELECTORDEFAULTS,
    ItemsExchange;

    var url, mqlUrl, topicUrl;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_FREEBASESELECTORDEFAULTS_, _FreebaseSelector_, _$httpBackend_, _ItemsExchange_){
        FREEBASESELECTORDEFAULTS = _FREEBASESELECTORDEFAULTS_;
        FreebaseSelector = _FreebaseSelector_;
        $httpBackend = _$httpBackend_;
        ItemsExchange = _ItemsExchange_;

        url = new RegExp(FREEBASESELECTORDEFAULTS.freebaseSearchURL);
        mqlUrl = new RegExp(FREEBASESELECTORDEFAULTS.freebaseMQLReadURL);
        topicUrl = new RegExp(FREEBASESELECTORDEFAULTS.freebaseTopicURL);
    }));

    var emptyResult = {
        result: []
    };

    var itemInfo = {
        result: [
            {mid: "/m/02qtppz", name: "Pippo Baudo"}
        ]
    };

    var itemMqlInfo = {
        result: {
            mid: "/m/02qtppz",
            type: [{id: "/common/topic"}, {id: "/people/person"}, {id: "/film/actor"}]
        }
    };

    var itemTopicInfo = {
        property: {
            '/common/topic/description': {
                values: [ {value: "Giuseppe Baudo, known as Pippo Baudo, is one of the most..."} ]
            }
        }
    };

    it('should correctly initialize a selector instance', function(){
        var conf = FREEBASESELECTORDEFAULTS.instances[0],
            sel = new FreebaseSelector(conf);

        expect(sel.config.active).toBe(conf.active);
        expect(sel.config.container).toBe(conf.container);
        expect(sel.config.label).toBe(conf.label);
    });

    it('should resolve promise when get empty result', function(){
        var conf = FREEBASESELECTORDEFAULTS.instances[0],
            sel = new FreebaseSelector(conf),
            called = false;

        $httpBackend.whenGET(url).respond(emptyResult);
        sel.getItems('term').then(function(){
            called = true;
        });
        
        $httpBackend.flush();

        var all = ItemsExchange.getAll(),
            container = conf.container+'term';

        expect(all.itemListByContainer[container]).toBeUndefined();
        expect(called).toBe(true);
        
    });

    it('should correctly get items info', function(){
        var conf = FREEBASESELECTORDEFAULTS.instances[0],
            sel = new FreebaseSelector(conf),
            called = false;

        // get item generic info
        $httpBackend.whenGET(url).respond(itemInfo);
        // get item mql info
        $httpBackend.whenGET(mqlUrl).respond(itemMqlInfo);
        // get item topic info
        $httpBackend.whenGET(topicUrl).respond(itemTopicInfo);

        // this function get generic info
        // then get http mql and topic
        sel.getItems('term').then(function(){
            called = true;
        });
        $httpBackend.flush(1);
        // resolved only when all http request are completed
        expect(called).toBe(false);

        // get item mql info
        $httpBackend.flush(1);
        // resolved only when all http request are completed
        expect(called).toBe(false);

        // get item topic info
        $httpBackend.flush(1);
        // now all http request are completed
        expect(called).toBe(true);

        var all = ItemsExchange.getAll(),
            container = conf.container+"term",
            list = all.itemListByContainer[container];

        // check item properties
        expect(list).toBeDefined();
        expect(list.length).toBe(1);
        expect(list[0].uri).toBe(FREEBASESELECTORDEFAULTS.freebaseItemsBaseURL+itemMqlInfo.result.mid);
        expect(list[0].description).toBe(itemTopicInfo.property['/common/topic/description'].values[0].value);
        
    });

    it('should correctly resolve the promise if get http error on topic', function(){
        var conf = FREEBASESELECTORDEFAULTS.instances[0],
            sel = new FreebaseSelector(conf),
            called = false;

        // get item generic info
        $httpBackend.whenGET(url).respond(itemInfo);
        // get item mql info
        $httpBackend.whenGET(mqlUrl).respond(itemMqlInfo);
        // get item topic info (get an error)
        $httpBackend.whenGET(topicUrl).respond(500, '');

        // this function get generic info
        // then get http mql and topic
        sel.getItems('term').then(function(){
            called = true;
        });
        $httpBackend.flush();

        // resolved only when all http request are completed
        expect(called).toBe(true);
        
    });

    it('should correctly resolve the promise if get http error on mql and topic', function(){
        var conf = FREEBASESELECTORDEFAULTS.instances[0],
            sel = new FreebaseSelector(conf),
            called = false;

        // get item generic info
        $httpBackend.whenGET(url).respond(itemInfo);
        // get item mql info (get an error)
        $httpBackend.whenGET(mqlUrl).respond(500, '');
        // get item topic info (get an error)
        $httpBackend.whenGET(topicUrl).respond(500, '');

        // this function get generic info
        // then get http mql and topic
        sel.getItems('term').then(function(){
            called = true;
        });
        $httpBackend.flush();

        // resolved only when all http request are completed
        expect(called).toBe(true);
        
    });

    it('should correctly resolve the promise if get http error on first http', function(){
        var conf = FREEBASESELECTORDEFAULTS.instances[0],
            sel = new FreebaseSelector(conf),
            called = false;

        // get item generic info
        $httpBackend.whenGET(url).respond(500, '');

        // this function get generic info
        // then get http mql and topic
        sel.getItems('term').then(function(){
            called = true;
        });
        $httpBackend.flush();

        // resolved only when all http request are completed
        expect(called).toBe(true);
        
    });

});