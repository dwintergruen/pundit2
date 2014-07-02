
var KORBODEFAULTCONF;
KORBODEFAULTCONF = {

    endpoint: "http://demo-cloud.api.korbo.org/v1",

    basketID: 1,

    updateTime: 1000,


    labelMinLength: 3,


    copyToKorboBeforeUse: false,

    tafonyId: 'default_tafony_id',

    tafonyName: 'default_tafony_name',


    nameInputHiddenUri: 'default_korbo_uri',

    nameInputHiddenLabel: 'default_korbo_label',

    useTafonyCompatibility: false,

    useOnlyCallback: false, // default    

    globalObjectName: 'EE',

    onLoad: null,

    searchTypes: ['http://person.uri', 'http://philosopher.uri', 'http://place.uri'],

    limitSearchResult: 10,

    providers: {
        freebase: false,
        dbpedia: false
    },

    buttonLabel: "Default Search",

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

    useTranslation: false,

    //useAutocompleteWithSearch: false,

    //useAutocompleteWithNew: false,

    visualizeUseButton: ['freebase', 'korbo'],
    visualizeCopyButton: ['freebase', 'korbo'],
    visualizeEditButton: true,

    onReady: null,

    useAutoComplete: false,
    autoCompleteMode: '', // full | simple
    autoCompleteOptions: '' // search | new | all | none
};