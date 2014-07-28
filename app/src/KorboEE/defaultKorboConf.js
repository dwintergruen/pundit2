/**
 *
 * @ngdoc object
 * @name KORBODEFAULTCONF
 *
 * @module KorboEE
 *
 * @description
 * This is the object configuration in which is possible to set
 * values of its properties.
 *
 * Each properties has a default value.
 * You can see an example of configuration object here {@link #!/example Example}
 * It is possible to make a different configuration, depending on the usage you want.
 * To see possible usage and its configuration, see {@link #!/tafony-compatibility Tafony Compatibility} and {@link #!/only-callback Use Only Callback}
 */
var KORBODEFAULTCONF;
KORBODEFAULTCONF = {

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#endpoint
     *
     * @description
     * `string`
     *
     * URL where Korbo server is installed
     *
     * Default value:
     * <pre> endpoint: "http://demo-cloud.api.korbo.org/v1/" </pre>
     */

    //endpoint: "http://demo-cloud.api.korbo.org/v1",
    endpoint: "http://korbo2.local:80/v1",

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#basketID
     *
     * @description
     * `integer`
     *
     * Korbo basket ID where a new entity is saved
     *
     * Default value:
     * <pre> basketID: 1 </pre>
     */
    basketID: 1,

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#updateTime
     *
     * @description
     * `integer`
     *
     * Minimal wait time after last character typed before search starting
     *
     * Default value:
     * <pre> updateTime: 1000 </pre>
     */
    updateTime: 1000,

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#labelMinLength
     *
     * @description
     * `integer`
     *
     * Minimal number of characters that needs to be entered before search starting
     *
     * Minimal length of label of new entity: to create a new entity, the label must have labelMinLength
     *
     * Default value:
     * <pre> labelMinLength: 3 </pre>
     */
    labelMinLength: 3,

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#copyToKorboBeforeUse
     *
     * @description
     * `boolean`
     *
     * Set to true if want to copy an entity in Korbo and use it. False otherwise.
     *
     * Default value:
     * <pre> copyToKorboBeforeUse: false </pre>
     */
    copyToKorboBeforeUse: false,

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#tafonyId
     *
     * @description
     * `string`
     *
     * Id of the HTML input text
     * Must be set only to use widget in Tafony Compatibility
     * For more details see {@link #!/tafony-compatibility Tafony Compatibility}
     *
     * Default value:
     * <pre> tafonyId: 'default_tafony_id' </pre>
     */
    tafonyId: 'default_tafony_id',

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#tafonyName
     *
     * @description
     * `string`
     *
     * Name of the HTML input text
     *
     *
     * Must be set only to use widget in Tafony Compatibility
     * For more details see {@link #!/tafony-compatibility Tafony Compatibility}
     *
     * Default value:
     * <pre> tafonyName: 'default_tafony_name' </pre>
     */
    tafonyName: 'default_tafony_name',

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#nameInputHiddenUri
     *
     * @description
     * `string`
     *
     * Hidden input name containing entity location
     *
     * For more details see {@link #!/tafony-compatibility Tafony Compatibility}
     *
     * Default value:
     * <pre> nameInputHiddenUri: 'default_korbo_uri' </pre>
     */
    nameInputHiddenUri: 'default_korbo_uri',

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#nameInputHiddenLabel
     *
     * @description
     * `string`
     *
     * Hidden input name containing entity label
     *
     * For more details see {@link #!/tafony-compatibility Tafony Compatibility}
     *
     * Default value:
     * <pre> nameInputHiddenLabel: 'default_korbo_label' </pre>
     */
    nameInputHiddenLabel: 'default_korbo_label',

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#useTafonyCompatibility
     *
     * @description
     * `boolean`
     *
     * Set to true to use widget in Tafony Compatibility
     *
     * For more details see {@link #!/tafony-compatibility Tafony Compatibility}
     *
     * Default value:
     * <pre> useTafonyCompatibility: false </pre>
     */
    useTafonyCompatibility: false,

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#useOnlyCallback
     *
     * @description
     * `boolean`
     *
     * Set to true to use widget only with callback
     *
     * See {@link #!/only-callback Use Only Callback} for details
     *
     * Default value:
     * <pre> useOnlyCallback: false </pre>
     */
    useOnlyCallback: false, // default

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#globalObjectName
     *
     * @description
     * `string`
     *
     * Name for exposed global object. This object is used to call API callback and to register
     * callbacks to get called when some events are fired.
     *
     * For details about API Callbacks and events see {@link #!/api/KorboEE/object/EE EE}
     *
     * Default value:
     * <pre> globalObjectName: 'EE' </pre>
     */
    globalObjectName: 'EE',

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#onLoad
     *
     * @description
     * `function`
     *
     * This function has to be defined when mode to use the widget is useOnlyCallback.
     *
     * The function will be get called when widget is ready to use.
     *
     * For details about useOnlyCallback usage see {@link #!/only-callback Use Only Callback}
     *
     * Default value:
     * <pre> onLoad: null </pre>
     */
    onLoad: null,

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#searchTypes
     *
     * @description
     * `array`
     *
     * The array has to contain URI of types to use for searching an entity
     *
     * Default value:
     * <pre> searchTypes: ['http://person.uri', 'http://philosopher.uri', 'http://place.uri'] </pre>
     */
    searchTypes: ['http://person.uri', 'http://philosopher.uri', 'http://place.uri'],

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#limitSearchResult
     *
     * @description
     * `integer`
     *
     * Number or result per page
     *
     * Default value:
     * <pre> limitSearchResult: 10 </pre>
     */
    limitSearchResult: 10,

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#providers
     *
     * @description
     * `object` {`provider_name`: `true/false`}
     *
     * List of available provider where to search in. Object must contain the name of provider and a state for each one: true if you want to use
     * that provider to searchin, false otherwise
     *
     * Default value:
     * <pre>providers: {
     *     freebase: false,
     *     dbpedia: false
     * }</pre>
     */
    providers: {
        freebase: false,
        dbpedia: false
    },

    // TODO rimuovere? non viene più utilizzato
    buttonLabel: "Default Search",

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#type
     *
     * @description
     * `array of object`
     *
     * Types available to select when you want create a new entity
     *
     * Each object should represent a type and has to contain
     ** `label`: label shown in widget
     ** `state`: true if you want to show type selected yet, false otherwise
     ** `URI`: URI of the type
     *
     *
     * Default value:
     * <pre> type: [
     *    {
     *     label: 'Schema.org place',
     *     state: true,
     *     URI:'http://schema.org/Place'
     *    },
     *    {
     *     label: 'FOAF person',
     *     state: false,
     *     URI:'http://xmlns.com/foaf/0.1/Person'
     *    },
     *    {
     *     label: 'W3 Spatial thing',
     *     state: true,
     *     URI:'http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing'
     *    }
     *  ]
     * </pre>
     */
    type: [
        {
            label: 'Schema.org place',
            state: true,
            URI:'http://schema.org/Place'
        },
        {
            label: 'FOAF person',
            state: false,
            URI:'http://xmlns.com/foaf/0.1/Person'
        },
        {
            label: 'W3 Spatial thing',
            state: true,
            URI:'http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing'
        }
    ],

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#languages
     *
     * @description
     * `array of object`
     *
     * Language available to select when you want create a new entity
     *
     * Each object should represent a type and has to contain
     ** `name`: language name, show in select input
     ** `value`: value to send in the http request
     ** `state`: true to set this language as default, false otherwise
     *
     *
     * Default value:
     * <pre> languages: [
     *    {
     *     name:'Italian',
     *     value:'it',
     *     state: false
     *    },
     *    {
     *     name:'English',
     *     value:'en',
     *     state: true
     *    },
     *    {
     *     name:'German',
     *     value:'de',
     *     state: false
     *    }
     *  ]
     * </pre>
     */
    languages: [
        {
            name:'Italian',
            value:'it',
            state: false
        },
        {
            name:'English',
            value:'en',
            state: true
        },
        {
            name:'German',
            value:'de',
            state: false
        }
    ],

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#visualizeCopyButton
     *
     * @description
     * `array of string`
     *
     * Language available to select when you want create a new entity
     * List of providers from which copy and modify an entity, to create a new one in korbo.
     *
     * Each object should represent a type and has to contain
     ** `name`: language name, show in select input
     ** `value`: value to send in the http request
     ** `state`: true to set this language as default, false otherwise
     *
     *
     * Default value:
     * <pre>
     *     visualizeCopyButton: ['freebase']
     * </pre>
     */
    visualizeCopyButton: ['freebase'],

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#onReady
     *
     * @description
     * `function`
     *
     * The function will be get called when widget is ready to use.
     *
     * Default value:
     * <pre> onReady: null </pre>
     */
    onReady: null,

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#autoCompleteMode
     *
     * @description
     * `string`
     *
     * Define wich mode of autocomplete use. Each mode differs on how the results are shown.
     *
     * * `simple` mode visualize only label of found entities
     * * `full` mode visualize the label, the depiction and the first type of found entities
     *
     * Default value:
     * <pre> autoCompleteMode: 'simple' </pre>
     */
    autoCompleteMode: 'simple', // full | simple

    /**
     * @ngdoc property
     * @name KORBODEFAULTCONF#autoCompleteOptions
     *
     * @description
     * `string`
     *
     * Define which buttons to show in autocomplete visualization.
     *
     * * `none` no buttons are shown
     * * `search` will be show a Search on LOD button, that will open widget in Search window to find entity in other LOD providers
     * * `new` will be show a Create New button, that will open widget in New window,  where is possible to create a new entity in Korbo
     * * `all` display both buttons, the 'Create New' and the 'Search on LOD'
     *
     * Default value:
     * <pre> autoCompleteOptions: 'none' </pre>
     */
    autoCompleteOptions: 'none' // search | new | all | none
};