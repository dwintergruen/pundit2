angular.module('Pundit2.Vocabularies')
.constant('FREEBASESELECTORDEFAULTS', {

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector
     *
     * @description
     * `object`
     *
     * Configuration object for FreebaseSelector module. This factory can be instantiate
     * more times and query items from Freebase.
     */

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.freebaseSearchURL
     *
     * @description
     * `string`
     *
     * Freebase search url, used in the first http call to get item list.
     *
     * Default value:
     * <pre> freebaseSearchURL: 'https://www.googleapis.com/freebase/v1/search' </pre>
     */
    freebaseSearchURL: 'https://www.googleapis.com/freebase/v1/search',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.freebaseSchemaBaseURL
     *
     * @description
     * `string`
     *
     * Freebase base type url, used to set item type property.
     *
     * Default value:
     * <pre> freebaseSchemaBaseURL: 'http://www.freebase.com/schema' </pre>
     */
    freebaseSchemaBaseURL: 'http://www.freebase.com/schema',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.freebaseImagesBaseURL
     *
     * @description
     * `string`
     *
     * Freebase base image url, used to set image property.
     *
     * Default value:
     * <pre> freebaseImagesBaseURL: 'https://usercontent.googleapis.com/freebase/v1/image' </pre>
     */
    freebaseImagesBaseURL: 'https://usercontent.googleapis.com/freebase/v1/image',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.freebaseTopicURL
     *
     * @description
     * `string`
     *
     * Freebase topic url, used in one of the details http calls as 'url' param to get item description info.
     *
     * Default value:
     * <pre> freebaseTopicURL: 'https://www.googleapis.com/freebase/v1/topic' </pre>
     */
    freebaseTopicURL: 'https://www.googleapis.com/freebase/v1/topic',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.freebaseMQLReadURL
     *
     * @description
     * `string`
     *
     * Freebase metadata url, used in one of the details http calls as 'url' param to get item type info.
     *
     * Default value:
     * <pre> freebaseMQLReadURL: 'https://www.googleapis.com/freebase/v1/mqlread' </pre>
     */
    freebaseMQLReadURL: 'https://www.googleapis.com/freebase/v1/mqlread',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.freebaseItemsBaseURL
     *
     * @description
     * `string`
     *
     * Freebase base uri url, used to set item uri property.
     *
     * Default value:
     * <pre> freebaseItemsBaseURL: 'http://www.freebase.com' </pre>
     */
    freebaseItemsBaseURL: 'http://www.freebase.com',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.freebaseAPIKey
     *
     * @description
     * `string`
     *
     * Freebase API key, used in all http call as params 'key'.
     *
     * Default value:
     * <pre> freebaseAPIKey: 'AIzaSyCJjAj7Nd2wKsZ8d7XQ9ZvUwN5SF0tZBsE' </pre>
     */
    freebaseAPIKey: 'AIzaSyCJjAj7Nd2wKsZ8d7XQ9ZvUwN5SF0tZBsE',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.active
     *
     * @description
     * `boolean`
     *
     * Enable or disable all freebase selectors instances. Only active vocabularies are added to selectorsManager
     * and can query the relative database (setting active to false vocabulary is also removed from the interface).
     *
     * Default value:
     * <pre> active: true </pre>
     */
    active: true,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.limit
     *
     * @description
     * `number`
     *
     * Maximum number of items taken from the vocabulary inside search http call.
     *
     * Default value:
     * <pre> limit: 15 </pre>
     */
    limit: 15,

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.instances
     *
     * @description
     * `Array of object`
     *
     * Array of freebase instances, each object in the array allows you to add and configure 
     * an instance of the vocabulary. By default, the vocabulary has only one instance.
     * Each instance has its own tab in the interface, with its list of items.
     * 
     *
     * Default value:
     * <pre> instances: [
     *   {
     *       // where items is stored inside itemsExchange service
     *       container: 'freebase',
     *       // instance label tab title
     *       label: 'Freebase',
     *       // enable or disable the instance
     *       active: true
     *   }
     * ] </pre>
     */
    instances: [
        {
            // where items is stored inside itemsExchange service
            container: 'freebase',
            // instance tab title
            label: 'Freebase',
            // enable or disable the instance
            active: true
        }
    ],

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.objectFilters
     *
     * @description
     * `Array of string`
     *
     * Array of filters we need for any object
     * 
     *
     * Default value:
     * <pre> objectFilters: [ 
     *          "/common/topic/description",
     *          "/common/topic/notable_types",
     *          "/common/topic/notable_for"
     *       ]
     * </pre>
     */
    objectFilters: [
        "/common/topic/description",
        "/common/topic/notable_types",
        "/common/topic/notable_for"
    ],

    /**
     * @module punditConfig
     * @ngdoc property
     * @name modules#FreebaseSelector.debug
     *
     * @description
     * `number`
     *
     * Active debug log for this module
     *
     * Default value:
     * <pre> debug: false </pre>
     */
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

    // if two search are launched in parallel on the same term then won the last one is completed
    // you can change this behavior
    // eg. removing the wipeContainer() to produce a union of two research results
    FreebaseFactory.prototype.getItems = function(term){

        var self = this,
            promise = $q.defer(),
            // use selector container + term (replace space with $)
            container = self.config.container + term.split(' ').join('$');

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
                ItemsExchange.wipeContainer(container);
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
                ItemsExchange.wipeContainer(container);
                for (i=0; i<itemsArr.length; i++) {
                    ItemsExchange.addItemToContainer(new Item(itemsArr[i].uri, itemsArr[i]), container);
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

        // var self = this;
        var error = 0;
        item.type = [];

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

            freebaseSelector.log('Http success, get MQL from freebase' + item.uri);

            // Take the types labels
            for (var l=data.result.type.length; l--;) {
                var o = data.result.type[l],
                    uri = freebaseSelector.options.freebaseSchemaBaseURL + o.id;
                if(item.type.indexOf(uri) == -1){
                    item.type.push(uri);
                    TypesHelper.add(uri, o.name);
                }
            }

            // Description != -1: this call is the last one, we're done
            if (item.description !== -1) {
                freebaseSelector.log('MQL was last, complete for item ' + item.uri);
                delete item.mid;
                itemPromise.resolve(item);
            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get MQL from freebase: ', msg);
            if (item.description !== -1 || error>0) {
                itemPromise.resolve(item);
            }
            error++;
        });

        // get TOPIC
        $http({
            method: 'GET',
            url: freebaseSelector.options.freebaseTopicURL + item.mid,
            params: {
                key: freebaseSelector.options.freebaseAPIKey,
                filter: freebaseSelector.options.objectFilters
            }
        }).success(function(data) {

            freebaseSelector.log('Http success, get TOPIC from freebase' + item.uri);

            if (typeof(data.property) !== 'undefined'){
                if (typeof(data.property['/common/topic/description']) !== 'undefined' && data.property['/common/topic/description'].values.length > 0){
                    item.description = data.property['/common/topic/description'].values[0].value;
                }
                else{
                    item.description = item.label;
                }

                if (typeof(data.property['/common/topic/notable_types']) !== 'undefined' && data.property['/common/topic/notable_types'].values.length > 0){
                    var o = data.property['/common/topic/notable_types'].values[0],
                        uri = freebaseSelector.options.freebaseSchemaBaseURL + o.id;

                    var index = item.type.indexOf(uri);

                    if (index > -1) {
                        item.type.splice(index, 1);
                    }
                    item.type.unshift(uri);
                    TypesHelper.add(uri, o.text);
                }
            } else{
                item.description = item.label;
            }

            // Uri != -1: this call is the last one, we're done
            if (item.uri !== -1) {
                freebaseSelector.log('TOPIC was last, complete http for item ' + item.uri);
                delete item.mid;
                itemPromise.resolve(item);
            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get TOPIC from freebase: ', msg);
            if (item.uri !== -1 || error>0) {
                itemPromise.resolve(item);
            }
            error++;
        });

    };

    freebaseSelector.log('Factory init');

    return FreebaseFactory;

});