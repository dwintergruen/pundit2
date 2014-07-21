angular.module('KorboEE')
/**
 *
 *
 * korbo Entity Editor directive will be rendered in two different way, in according to usage defined in configuration object.
 *
 * In case of Tafony Compatibility usage, it will be rendered with an input text and a button.
 *
 * In case of Use Only Callback usage, no GUI elements are rendered, but will get called function onLoad() defined in configuration object when
 * component is ready to use with callback.
 *
 * param {string} conf-name Object configuration name.
 **/
.directive('korboEntityEditor', function(korboConf, APIService, $window){
        return {

            restrict: 'E',

            templateUrl: function(element, attrs) {
                var confName = attrs.confName || '';
                var conf = korboConf.setConfiguration(confName);

                // APIService is initialized only if globalObjectName doesn't exist yet in $window
                // if it exists, show error template and set error attribute to true

                if(typeof($window[conf.globalObjectName]) !== "undefined" ){
                    attrs.error = true;
                    attrs.errorType = 'globalObject';
                    return 'src/KorboEE/Korboee-error-config.tmpl.html';
                }

                //TODO: ricontrollare i parametri di configurazione per l'utilizzo con autocomplete
                if(conf.useAutocompleteWithSearch && conf.useAutocompleteWithNew){
                    attrs.error = true;
                    attrs.errorType = 'autoComplete';
                    return 'src/KorboEE/Korboee-error-config.tmpl.html';
                }

                // if it doesn't exist, set error attribute to false
                // and APIService is initialized

                attrs.error = false;

                // Initialize API, registering features and events.
                var api = APIService.init(conf),
                    features = ['OpenSearch', 'OpenNew', 'Cancel', 'ClearForm', 'Edit'],
                    events = ['Open','Cancel','Save'];

                /**
                 * method
                 * onCancel

                 * Register a callback function on the Cancel event. When the modal is closed, Cancel event is fired and
                 * registered function will get called
                 *
                 * param {function} callback The callback function gets called when the Cancel event is fired
                 */

                /**
                 * method
                 * onOpen
                 *
                 * Register a function on the Open event. When the modal is opened, the Open event is fired and
                 * registered function will get called
                 *
                 * param {function} callback The callback function gets called when the Open event is fired
                 *
                 */

                /**
                 * method
                 * onSave
                 *
                 * description
                 * Register a callback function on the Save event.
                 * A Save event is fired when a new entity is saved, or copied or just used.
                 * To the registered function will be passed the use/saved entity with the `entity` parameter.
                 *
                 * param {function} callback The callback function gets called when the Save event is fired,
                 * passing the `entity` object which is the saved/used semantic entity having the following properties:
                 *
                 ** `value`: entity URL
                 ** `label`: entity label
                 ** `type`: array of types
                 ** `image`: entity depiction URL
                 ** `description`: entity abstract
                 ** `language`: entity language
                 *
                 */
                api.addEvent(events);
                api.addFeature(features);

                // Now that features and events are set up, we can call the onload
                // and let the world subscribe and interact with them
                if (conf.onLoad !== null && typeof(conf.onLoad) === 'function' && conf.useOnlyCallback){
                    conf.onLoad();
                }

                if(conf.useOnlyCallback || (!conf.useTafonyCompatibility && !conf.useOnlyCallback)){
                    return 'src/KorboEE/Korboee-callback.tmpl.html';
                }

                if(conf.useTafonyCompatibility) {
                    return 'src/KorboEE/korboee-entity.tmpl.html';
                }

            },

            scope: {

            },
            link: function($scope, element, attrs) {
                var confName = attrs.confName || '';
                // Saving this conf into this directive scope, when .open()
                // gets called $rootScope.conf will be set to this object
                $scope.conf = korboConf.setConfiguration(confName);
                $scope.abstract = '';
                $scope.location = '';
                $scope.errorGlobalObjName = attrs.error;
                $scope.errorType = attrs.errorType;
                korboConf.setIsOpenModal(false);

            },
            controller: 'EEDirectiveCtrl'
        }
    });