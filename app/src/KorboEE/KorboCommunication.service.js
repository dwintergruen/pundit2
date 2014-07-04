angular.module('KorboEE')
    .service('KorboCommunication', function($q, $http, KorboEEBaseComponent){

        var korboCommunication = new KorboEEBaseComponent("KorboCommunication");

        var isAutocompleteLoading = false;

        korboCommunication.setAutocompleteLoading = function(val){
            isAutocompleteLoading = val;
        };

        korboCommunication.isAutocompleteLoading = function(){
            return isAutocompleteLoading;
        };


        korboCommunication.search = function(val, endpoint, prov, limit, offset, lang) {
            isAutocompleteLoading = true;

            return $http({
                //headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                url: endpoint + "/search/items",
                cache: false,
                params: {
                    q: val,
                    p: prov,
                    limit: limit,
                    offset: offset,
                    lang: lang
                }
            }).then(function(res) {

                if(res.data.metadata.totalCount === "0"){
                    var noFound = [{label:"no found", noResult:true}];
                    isAutocompleteLoading = false;
                    return noFound;
                } else {
                    isAutocompleteLoading = false;
                    return res.data.data;
                }

            },
            function(msg){
                var errorServer = [{label:"error", errorServer:true}];
                return errorServer;
            });


        };

        return korboCommunication;
    });