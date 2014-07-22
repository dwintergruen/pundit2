
var korboeeConfig;
korboeeConfig = {

    endpoint: "http://dev.korbo2.org/v1",
    basketID: 1,
    updateTime: 1000,
    useOnlyCallback: true,
    globalObjectName: 'EE',
    onLoad: null,
    providers: {
        freebase: true,
        dbpedia: false
    },

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


    languages: [{ name:'English', value:'en', state: true }],
    onReady: null
};