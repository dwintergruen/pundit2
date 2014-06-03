describe('FreebaseSelector service', function() {

    var FreebaseSelector,
    $httpBackend,
    SelectorsManager,
    FREEBASESELECTORDEFAULTS,
    ItemsExchange;

    beforeEach(module('Pundit2'));

    beforeEach(inject(function(_SelectorsManager_, _FREEBASESELECTORDEFAULTS_, _FreebaseSelector_, _$httpBackend_, _ItemsExchange_){
        SelectorsManager = _SelectorsManager_;
        FREEBASESELECTORDEFAULTS = _FREEBASESELECTORDEFAULTS_;
        FreebaseSelector = _FreebaseSelector_;
        $httpBackend = _$httpBackend_;
        ItemsExchange = _ItemsExchange_;
    }));

    var url = "https://www.googleapis.com/freebase/v1/search?key=AIzaSyCJjAj7Nd2wKsZ8d7XQ9ZvUwN5SF0tZBsE&limit=5&query=term",
        mqlUrl = "https://www.googleapis.com/freebase/v1/mqlread?key=AIzaSyCJjAj7Nd2wKsZ8d7XQ9ZvUwN5SF0tZBsE&query=%7B%22id%22:null,%22mid%22:%22%2Fm%2F02qtppz%22,%22type%22:%5B%7B%7D%5D%7D",
        topicUrl = "https://www.googleapis.com/freebase/v1/topic/m/02qtppz?filter=%2Fcommon%2Ftopic%2Fdescription&key=AIzaSyCJjAj7Nd2wKsZ8d7XQ9ZvUwN5SF0tZBsE";

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

    it('should be added to the selectorsManager when injected', function(){
        SelectorsManager.init();
        expect(SelectorsManager.getActiveSelectors().length).toBe(1);
    });

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
            container = conf.container;

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
        expect(sel.pendingRequest).toBe(1);

        // get item mql info
        $httpBackend.flush(1);
        // resolved only when all http request are completed
        expect(called).toBe(false);
        expect(sel.pendingRequest).toBe(1);

        // get item topic info
        $httpBackend.flush(1);
        // now all http request are completed
        expect(called).toBe(true);
        expect(sel.pendingRequest).toBe(0);

        var all = ItemsExchange.getAll(),
            container = conf.container,
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
        expect(sel.pendingRequest).toBe(0);
        
    });

    it('should correctly resolve the promise if get http error on topic', function(){
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
        expect(sel.pendingRequest).toBe(0);
        
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
        expect(sel.pendingRequest).toBe(0);
        
    });

});