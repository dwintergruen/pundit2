angular.module('KorboEE')
    .factory('korboConf', function(){

        var ret = angular.copy(KORBODEFAULTCONF);

        var setConfiguration = function(myConfig) {

            // If there's not a valid object with this config name, use the defaults
            // and just pass them back
            if (typeof(myConfig) === 'undefined' || typeof (window[myConfig]) === 'undefined' || myConfig === '') {
                return angular.copy(KORBODEFAULTCONF);
            }

            ret = angular.copy(KORBODEFAULTCONF);
            angular.extend(ret, window[myConfig]);

            return ret;
        };

        ret.setConfiguration = setConfiguration;

        ret.setIsOpenModal = function(flag) {
            ret.modalOpen = flag;
        };

        ret.getIsOpenModal = function(){
            return ret.modalOpen;
        };

        ret.getEndpoint = function(){
            return ret.endpoint;
        };


        ret.getDefaultLanguage = function(){
            // set default language
            var defaultLan = ret.languages[0];
            for (var j in ret.languages){
                if(ret.languages[j].state === true) {
                    defaultLan = ret.languages[j];
                    break;
                } // end if
            } // end for
            return defaultLan;
        };


        return ret;
    });
