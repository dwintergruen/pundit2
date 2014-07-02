angular.module('KorboEE')
    .service('KorboCommunication', function(BaseComponent, $q, $http, korboConf){

        var korboCommunication = new BaseComponent("KorboCommunication");

        var isAutocompleteLoading = false;

        korboCommunication.setAutocompleteLoading = function(val){
            isAutocompleteLoading = val;
        };

        korboCommunication.isAutocompleteLoading = function(){
            return isAutocompleteLoading;
        };


        korboCommunication.search = function(val) {
            isAutocompleteLoading = true;
            korboCommunication.log('Searching entity in korbo...');
            var endpoint = korboConf.getEndpoint();
            var lang = korboConf.getDefaultLanguage();

            return $http({
                //headers: { 'Content-Type': 'application/json' },
                method: 'GET',
                url: endpoint + "/search/items",
                cache: false,
                params: {
                    q: val,
                    limit: 12,
                    offset: 0,
                    lang: lang.value
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

            });


        };

        return korboCommunication;
    });