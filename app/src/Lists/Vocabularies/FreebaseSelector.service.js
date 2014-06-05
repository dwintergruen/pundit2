angular.module('Pundit2.Vocabularies')
.constant('FREEBASESELECTORDEFAULTS', {

    freebaseSearchURL: 'https://www.googleapis.com/freebase/v1/search',
    freebaseSchemaBaseURL: 'http://www.freebase.com/schema',
    freebaseImagesBaseURL: 'https://usercontent.googleapis.com/freebase/v1/image',
    freebaseTopicURL: 'https://www.googleapis.com/freebase/v1/topic',
    freebaseMQLReadURL: 'https://www.googleapis.com/freebase/v1/mqlread',
    freebaseItemsBaseURL: 'http://www.freebase.com',
    freebaseAPIKey: 'AIzaSyCJjAj7Nd2wKsZ8d7XQ9ZvUwN5SF0tZBsE',

    // enable or disable all selectors instances
    active: true,
    // max number of items
    limit: 15,

    instances: [
        {
            // where put items inside items exchange
            container: 'freebase',
            // used how tab title
            label: 'Freebase',
            // true if this instace do the query
            active: true
        }

    ],

    debug: false

})
.factory('FreebaseSelector', function(BaseComponent, FREEBASESELECTORDEFAULTS, TypesHelper, SelectorsManager, Item, ItemsExchange, 
                                        $http, $q) {

    var freebaseSelector = new BaseComponent('FreebaseSelector', FREEBASESELECTORDEFAULTS);
    freebaseSelector.name = 'FreebaseSelector';

    // add this selector to selector manager
    // then the configured instances are read an instantiated
    if (freebaseSelector.options.active) {
        SelectorsManager.addSelector(freebaseSelector);        
    }

    // selector instance constructor
    var FreebaseFactory = function(config){
        this.config = config;
    };

    FreebaseFactory.prototype.getItems = function(term){

        var self = this,
            promise = $q.defer();

        $http({
            method: 'GET',
            url: freebaseSelector.options.freebaseSearchURL,
            params: {
                key: freebaseSelector.options.freebaseAPIKey,
                query: term,
                limit: freebaseSelector.options.limit
            }    
        }).success(function(data) {

            freebaseSelector.log('Http success, get items from freebase', data);

            if (data.result.length === 0) {
                freebaseSelector.log('Http success, but get empty result');
                ItemsExchange.wipeContainer(self.config.container);
                promise.resolve();
                return;
            }

            var promiseArr = [],
                deferArr = [],
                itemsArr = [];
            for (var i in data.result) {

                // The item borns as half empty, will get filled up
                // by later calls.
                var item = {
                    label: data.result[i].name,
                    mid: data.result[i].mid,
                    image: freebaseSelector.options.freebaseImagesBaseURL + data.result[i].mid,
                    description: -1,
                    uri: -1
                };
                itemsArr.push(item);

                var itemPromise = $q.defer();
                promiseArr.push(itemPromise.promise);
                deferArr.push(itemPromise);

            }

            $q.all(promiseArr).then(function(){
                freebaseSelector.log('Completed all items http request (topic and mql)');
                // when all http request are completed we can wipe itemsExchange
                // and put new items inside relative container
                ItemsExchange.wipeContainer(self.config.container);
                for (i=0; i<itemsArr.length; i++) {
                    ItemsExchange.addItemToContainer(new Item(itemsArr[i].uri, itemsArr[i]), self.config.container);
                }
                promise.resolve();
            });

            for (i=0; i<itemsArr.length; i++) {
                self.getItemDetails(itemsArr[i], deferArr[i]);
            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get items from freebase: ', msg);
            promise.resolve();
        });

        return promise.promise;

    };


    FreebaseFactory.prototype.getItemDetails = function(item, itemPromise){

        var self = this,
            error = 0;

        // get MQL
        $http({
            method: 'GET',
            url: freebaseSelector.options.freebaseMQLReadURL,
            params: {
                key: freebaseSelector.options.freebaseAPIKey,
                query: {
                    "id": null,
                    "mid": item.mid,
                    "type": [{}],
                }
            }    
        }).success(function(data) {

            item.uri = freebaseSelector.options.freebaseItemsBaseURL + data.result.mid;
            item.type = [];

            freebaseSelector.log('Http success, get MQL from freebase' + item.uri);

            // Take the types labels
            for (var l=data.result.type.length; l--;) {
                var o = data.result.type[l],
                    uri = freebaseSelector.options.freebaseSchemaBaseURL + o.id;
                item.type.push(uri);
                TypesHelper.add(uri, o.name);
            }

            // Description != -1: this call is the last one, we're done
            if (item.description !== -1) {
                freebaseSelector.log('MQL was last, complete for item ' + item.uri);
                delete item.mid;
                itemPromise.resolve();
            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get MQL from freebase: ', msg);
            if (item.description !== -1 || error>0) {
                itemPromise.resolve();
            }
            error++;
        });

        // get TOPIC
        $http({
            method: 'GET',
            url: freebaseSelector.options.freebaseTopicURL + item.mid,
            params: {
                key: freebaseSelector.options.freebaseAPIKey,
                filter: '/common/topic/description'
            }    
        }).success(function(data) {

            freebaseSelector.log('Http success, get TOPIC from freebase' + item.uri);

            if (typeof(data.property) !== 'undefined' && data.property['/common/topic/description'].values.length > 0)
                item.description = data.property['/common/topic/description'].values[0].value;
            else
                item.description = item.label;

            // Uri != -1: this call is the last one, we're done
            if (item.uri !== -1) {
                freebaseSelector.log('TOPIC was last, complete http for item ' + item.uri);
                delete item.mid;
                itemPromise.resolve();
            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get TOPIC from freebase: ', msg);
            if (item.uri !== -1 || error>0) {
                itemPromise.resolve();
            }
            error++;
        });

    };

    freebaseSelector.log('Factory init');

    return FreebaseFactory;

});