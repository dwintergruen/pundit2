angular.module('Pundit2.Vocabularies')
.constant('FREEBASESELECTORDEFAULTS', {

    freebaseSearchURL: 'https://www.googleapis.com/freebase/v1/search',
    freebaseSchemaBaseURL: 'http://www.freebase.com/schema',
    freebaseImagesBaseURL: 'https://usercontent.googleapis.com/freebase/v1/image',
    freebaseTopicURL: 'https://www.googleapis.com/freebase/v1/topic',
    freebaseMQLReadURL: 'https://www.googleapis.com/freebase/v1/mqlread',
    freebaseItemsBaseURL: 'http://www.freebase.com',
    freebaseAPIKey: 'AIzaSyCJjAj7Nd2wKsZ8d7XQ9ZvUwN5SF0tZBsE',

    limit: 1,

    debug: true

})
.service('FreebaseSelector', function(BaseComponent, FREEBASESELECTORDEFAULTS, $http) {

    var freebaseSelector = new BaseComponent('FreebaseSelector', FREEBASESELECTORDEFAULTS);

    var exampleQuery = "Jimi Hendrix";

    var output = null;

    freebaseSelector.getItems = function(el){

        output = el;

        $http({
            method: 'GET',
            url: freebaseSelector.options.freebaseSearchURL,
            params: {
                key: freebaseSelector.options.freebaseAPIKey,
                query: exampleQuery,
                limit: freebaseSelector.options.limit
            }    
        }).success(function(data) {

            freebaseSelector.log('Http success, get items from freebase', data);

            for (var i in data.result) {

                // TODO need to add image property ?

                // The item borns as half empty, will get filled up
                // by later calls.
                var item = {
                    type: ['subject'],
                    label: data.result[i].name,
                    mid: data.result[i].mid,
                    freebaseId: data.result[i].id,
                    image: freebaseSelector.options.freebaseImagesBaseURL + data.result[i].mid,
                    description: -1,
                    value: -1
                };

                freebaseSelector.getItemDetails(item);

            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get items from freebase: ', msg);
        });

    };


    freebaseSelector.getItemDetails = function(item){

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

            freebaseSelector.log('Http success, get TOPIC from freebase', data);

            item.value = freebaseSelector.options.freebaseItemsBaseURL + data.result.mid;
            // TODO need to add type labels ?
            // item.typeLabels = [];
            item.type = [];

            // Take the types labels
            for (var l=data.result.type.length; l--;) {
                var o = data.result.type[l],
                    uri = freebaseSelector.options.freebaseSchemaBaseURL + o.id;
                item.type.push(uri);
                // item.typeLabels.push({uri: uri, label: o.name });
            }

            // Value != -1: this call is the last one, we're done
            if (item.value !== -1) {
                freebaseSelector.log('TOPIC was last, complete for item ', item);
                // put output inside element (test)
                output.html(JSON.stringify(item, null, "  "));
            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get TOPIC from freebase: ', msg);
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

            freebaseSelector.log('Http success, get MQL from freebase', data);

            if (typeof(data.property) !== 'undefined' && data.property['/common/topic/description'].values.length > 0)
                item.description = data.property['/common/topic/description'].values[0].value;
            else
                item.description = item.label;

            // Description is not -1: this call is the last one, we're done
            if (item.description !== -1) {
                freebaseSelector.log('MQL was last, complete http for item ', item);
                // put output inside element (test)
                output.html(JSON.stringify(item, null, "  "));
            }

        }).error(function(msg) {
            freebaseSelector.err('Cant get MQL from freebase: ', msg);
        });

    };

    freebaseSelector.log('service init');

    return freebaseSelector;

});