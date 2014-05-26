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
    limit: 5,

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
        this.pendingRequest = 0;
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

            // TODO need to cache item then wipe when all http calls ends ?
            ItemsExchange.wipeContainer(self.config.container);

            if (data.result.length === 0) {
                freebaseSelector.log('Empry result');
                promise.resolve();
                return;
            }

            self.pendingRequest = data.result.length;

            for (var i in data.result) {

                // The item borns as half empty, will get filled up
                // by later calls.
                var item = {
                    label: data.result[i].name,
                    mid: data.result[i].mid,
                    freebaseId: data.result[i].id,
                    // TODO this link is ok?
                    image: freebaseSelector.options.freebaseImagesBaseURL + data.result[i].mid,
                    description: -1,
                    uri: -1
                };

                self.getItemDetails(item, promise);

            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get items from freebase: ', msg);
            promise.resolve();
        });

        return promise.promise;

    };


    FreebaseFactory.prototype.getItemDetails = function(item, promise){

        var self = this;

        var error = 0;

        // get TOPIC
        $http({
            method: 'GET',
            url: freebaseSelector.options.freebaseMQLReadURL,
            params: {
                key: freebaseSelector.options.freebaseAPIKey,
                query: angular.toJson({
                    "id": null,
                    "mid": item.mid,
                    "type": [{}],
                })
            }    
        }).success(function(data) {

            item.uri = freebaseSelector.options.freebaseItemsBaseURL + data.result.mid;
            item.type = [];

            freebaseSelector.log('Http success, get TOPIC from freebase' + item.uri);

            // Take the types labels
            for (var l=data.result.type.length; l--;) {
                var o = data.result.type[l],
                    uri = freebaseSelector.options.freebaseSchemaBaseURL + o.id;
                item.type.push(uri);
                TypesHelper.add(uri, o.name);
            }

            // Value != -1: this call is the last one, we're done
            if (item.description !== -1) {
                freebaseSelector.log('TOPIC was last, complete for item ' + item.uri);
                var add = new Item(item.uri, item);
                ItemsExchange.addItemToContainer(add, self.config.container);
                self.checkEnd(promise);
            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get TOPIC from freebase: ', msg);
            if (item.description !== -1 || error>0) {
                self.checkEnd(promise);
            }
            error++;
        });

        // get MQL
        $http({
            method: 'GET',
            url: freebaseSelector.options.freebaseTopicURL + item.mid,
            params: {
                key: freebaseSelector.options.freebaseAPIKey,
                filter: '/common/topic/description'
            }    
        }).success(function(data) {

            freebaseSelector.log('Http success, get MQL from freebase' + item.uri);

            if (typeof(data.property) !== 'undefined' && data.property['/common/topic/description'].values.length > 0)
                item.description = data.property['/common/topic/description'].values[0].value;
            else
                item.description = item.label;

            // Description is not -1: this call is the last one, we're done
            if (item.uri !== -1) {
                freebaseSelector.log('MQL was last, complete http for item ' + item.uri);
                var add = new Item(item.uri, item);
                ItemsExchange.addItemToContainer(add, self.config.container);
                self.checkEnd(promise);
            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get MQL from freebase: ', msg);
            if (item.uri !== -1 || error>0) {
                self.checkEnd(promise);
            }
            error++;
        });

    };

    FreebaseFactory.prototype.checkEnd = function(promise){
        this.pendingRequest--;
        if (this.pendingRequest <= 0) {
            freebaseSelector.log('Complete item parsing');
            promise.resolve();
        }
        
    };

    freebaseSelector.log('Factory init');

    return FreebaseFactory;

});