angular.module('Pundit2.Core')

.constant('PUNDITDEFAULTCONF', {

    /**
     * @module punditConfig
     * @ngdoc object
     * @name korbo
     * @description
     * `object`
     *
     * Define is use korbo Entity Editor widget in pundit. Object has the follow fields:
     *
     * * `active`: true to active korbo in pundit, false otherwise
     * * `confName`: name of korboEE configuration object
     *
     * Default:
     * <pre>
     *
     * {
        active: false,
        confName: 'KORBODEFAULTCONF'
        }

     * </pre>
     */
    korbo: {
        active: false,
        confName: 'KORBODEFAULTCONF'
    },

    /**
     * @module punditConfig
     * @ngdoc object
     * @name imageFragmentAnnotator
     * @description
     * `object`
     *
     * Define if is use image fragment annotator widget in pundit.
     * The widget is opened in a new tab by contextual menu of the images.
     *
     * Default:
     * <pre>
     * imageFragmentAnnotator: {
     *   active: false
     * }
     * </pre>
     */
    imageFragmentAnnotator: {
        active: false,
        baseUrl: 'http://dev.thepund.it/download/ia/last-beta/index.php?u='
    },

    /**
     * @module punditConfig
     * @ngdoc object
     * @name postSave
     * @description
     * `object`
     *
     * Define if is use post save callbacks
     *
     * Default:
     * <pre>
     * postSave: {
     *   active: false,
     *   callbacks: []
     * }
     * </pre>
     */
    postSave: {
        active: false,
        callbacks: []
    },

    /**
     * @module punditConfig
     * @ngdoc object
     * @name annotationServerBaseURL
     * @description
     * `string`
     * Pundit server base URL.
     *
     * Default:
     * <pre>
     * annotationServerBaseURL: 'http://demo-cloud.as.thepund.it:8080/annotationserver/'
     * </pre>
     */
    annotationServerBaseURL: 'http://demo-cloud.as.thepund.it:8080/annotationserver/',

    /**
     * @module punditConfig
     * @ngdoc property
     * @name askBaseURL
     *
     * @description
     * `string`
     *
     * URL of Ask the Pundit
     *
     * Default value:
     * <pre> askBaseURL: "http://demo-cloud.ask.thepund.it/" </pre>
     */
    askBaseURL: "http://demo-cloud.ask.thepund.it/",

    /**
     * @module punditConfig
     * @ngdoc object
     * @name pndPurl
     * @description
     * `string`
     * Base purl of pundit server (i.e. http://purl.org/pundit/as/)
     *
     * Default:
     * <pre>
     * pndPurl: 'http://purl.org/pundit/demo-cloud-server/'
     * </pre>
     */
    pndPurl: 'http://purl.org/pundit/demo-cloud-server/',

    /**
     * @module punditConfig
     * @ngdoc object
     * @name confURL
     * @description
     * `string`
     * Pundit configuration file URL if exist, otherwise tha value is 'local'.
     * The configuration file is always available at run time inside 'PUNDIT' global variable.
     * Inside 'PUNDIT.config' is visible the actual configuration of the client instantiated.
     * Default:
     * <pre>
     * confURL: 'local'
     * </pre>
     */
    confURL: 'local',

    /**
     * @module punditConfig
     * @ngdoc object
     * @name debugAllModules
     * @description
     * `boolean`
     * Active debug log for all modules.
     *
     * Default:
     * <pre> debugAllModules: false </pre>
     */
    debugAllModules: false,

    /**
     * @module punditConfig
     * @ngdoc object
     * @name vocabularies
     * @description
     * `Array of url`
     * Specifies relations vocaularies that will be available to Pundit users
     * (defines a list of relations with domain and ranges).
     * Each vocabulary definition is a JSONP file available on the Web and is loaded by resolving an absolute URL.
     *
     * Default:
     * <pre> vocabularies: [] </pre>
     *
     * URL Response Example:
     * <pre> {
     *      result: {
     *          items: [
     *              "value": "http://purl.org/dc/terms/creator",
     *              "rdftype":["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
     *              "label":"has creator",
     *              "description":"The selected text fragment has been created by a specific Person",
     *              "domain":[
     *                  "http://xmlns.com/foaf/0.1/Image",
     *                  "http://purl.org/pundit/ont/ao#fragment-image",
     *                  "http://purl.org/pundit/ont/ao#fragment-text"
     *               ],
     *               "range":[
     *                  "http://dbpedia.org/ontology/Person",
     *                  "http://xmlns.com/foaf/0.1/Person",
     *                  "http://www.freebase.com/schema/people/person"
     *               ],
     *          ...other items...
     *          ]
     *      }
     * }</pre>
     */
    vocabularies: [],

    /**
     * @module punditConfig
     * @ngdoc object
     * @name templates
     * @description
     * `Array of url`
     * Specifies templates that will be available to Pundit users
     * Each template definition is a JSONP file available on the Web and is loaded by resolving an absolute URL.
     * The template to be used initially as a current must be first on the list.
     *
     * Default:
     * <pre> templates: [
     *   "http://conf.thepund.it/V2/templates/tagFree",
     *   "http://conf.thepund.it/V2/templates/comment",
     *   "http://conf.thepund.it/V2/templates/tagFixedMarx",
     *   "http://conf.thepund.it/V2/templates/timeline",
     *   "http://conf.thepund.it/V2/templates/peopleGraph"
     * ] </pre>
     *
     * Where a template is defined by:
     * <pre>
     * {
     *  "label": "Template label",
     *  "description": "Template long description"
     *  "triples" :
     *      [
     *          { triple 1 details },
     *          { triple 2 details },
     *          ....
     *          { triple N details }
     *      ]
     * }
     * </pre>
     *
     * Where a triple is defined by:
     * <pre>
     * {
     *      "mandatory":  true | false,
     *      "subject" : {
     *         "value" : ....,
     *         "type": "uri|literal"
     *       }
     *      "predicate" : {
     *              "uri": ...,
     *              "label": ...,
     *              "domain": [...],
     *              "range": [...],
     *       },
     *       "object" : {
     *         "value" : ....,
     *         "type": "uri|literal"
     *       }
     * }
     * </pre>
     * All propeties are optional. By default a triple is mandatory.
     */
    templates: [
        "http://conf.thepund.it/V2/templates/tagFree",
        "http://conf.thepund.it/V2/templates/comment",
        "http://conf.thepund.it/V2/templates/tagFixedMarx",
        "http://conf.thepund.it/V2/templates/timeline",
        "http://conf.thepund.it/V2/templates/peopleGraph"
    ],

    /**
     * @module punditConfig
     * @ngdoc object
     * @name useTemplates
     * @description
     * `boolean`
     * Load configured templates.
     *
     * Default:
     * <pre> useTemplates: true </pre>
     */
    useTemplates: true,

    /**
     * @module punditConfig
     * @ngdoc object
     * @name disableImageAnnotation
     * @description
     * `boolean`
     * Enable/Disable the annotation of images
     *
     * Default:
     * <pre> disableImageAnnotation: false </pre>
     */
    disableImageAnnotation: false,    

    /**
     * @module punditConfig
     * @ngdoc object
     * @name forceEditAndDelete
     * @description
     * `boolean`
     * Enables authorized users to edit and delete annotations of other authors
     *
     * Default:
     * <pre> forceEditAndDelete: false </pre>
     */
    forceEditAndDelete: false,

    /**
     * @module punditConfig
     * @ngdoc object
     * @name forceTemplateEdit
     * @description
     * `boolean`
     * Force editing of the annotations created with templates
     *
     * Default:
     * <pre> forceTemplateEdit: false </pre>
     */
    forceTemplateEdit: false,

    /**
     * @module punditConfig
     * @ngdoc object
     * @name useOnlyTemplateMode
     * @description
     * `boolean`
     * Use only template mode. In this mode pundit allows you to make annotations using only the templates.
     *
     * Default:
     * <pre> useOnlyTemplateMode: false </pre>
     */
    useOnlyTemplateMode: false,

    /**
     * @module punditConfig
     * @ngdoc object
     * @name useBasicRelations
     * @description
     * `boolean`
     * Load basic relations configured in Client {@link #!/api/punditConfig/object/modules#Client modules}
     *
     * Default:
     * <pre> useBasicRelations: true </pre>
     */
    useBasicRelations: true,

    // Modules active by default are activated here with active=true
    /**
     *
     * @module punditConfig
     * @ngdoc object
     * @name modules
     *
     * @description
     * `object`
     * List of all modules available in Pundit2 and their default configuration.
     *
     * Each "modules" properties is the name of a Pundit2 module and contain the default configuration of the module.
     * This configuration can be extended and/or overwritten,
     * the defined properties override the default values while the properties that are not defined assume the default values.
     *
     * Modules configuration example:
     *
     * <pre>modules: {
     *     Annomatic: {
     *        container: 'annomaticConfiguredContainer'
     *     },
     *     Toolbar: {
     *        debug: false
     *     },
     *     Preview: {
     *         welcomeHeaderMessage: "Welcome in Pundit 2",
     *         welcomeBodyMessage: "Enjoy it"
     *     },
     *     Dashboard: {
     *         isDashboardVisible: false,
     *         debug: false
     *     }
     * }</pre>
     *
     * For a complete example go {@link #!/api/punditConfig here}.
     *
     */
    modules: {

        // Modules which requires to be bootstrapped (add stuff to Pundit2's root node or
        // to some Dashboard panel) by the client are listed as .bootModules inside the
        // modules.Client conf object. See CLIENTDEFAULTS
        Client: {
            // Client by default MUST NOT BE ACTIVE, or components will not be usable
            // individually: the client will bootstrap itself in its run() and screw
            // things up .. :|
            active: false
        },

        // Simplified version of pundit client, do only consolidation
        // and show the annotations on the page
        SimplifiedClient: {
            // SimplifiedClient by default MUST NOT BE ACTIVE
            // ngdoc inside SimplifiedClient.service.js
            active: false
        },

        Annomatic: {
            active: false
        },

        Dashboard: {
            // ngdoc inside Dashboard.service.js
            active: true
        },
        Toolbar: {
            active: true
        },
        AnnotationSidebar: {
            active: true
        },
        Preview: {
            active: true
        },
        PageItemsContainer: {
            // ngdoc in PageItemsContainer.service.js
            active: true
        },
        PredicatesContainer: {
            // ngdoc in PredicatesContainer.service.js
            active: true
        },
        MyNotebooksContainer: {
            active: true
        },
        MyItemsContainer: {
            // ngdoc in MyItemsContainer.service.js
            active: true
        },
        SelectorsManager: {
            // ngdoc in SelectorsManager.service.js
            active: true
        },
        TripleComposer: {
            // ngdoc in TripleComposer.service.js
            active: true
        },
        NotebookComposer: {
            active: true
        }
    },

    /**
     * @module punditConfig
     * @ngdoc object
     * @name lodLive
     * @description
     * `object`
     *
     * Define if is active lodLive link in Pundit. Object has the follow fields:
     *
     * * `active`: true to active lodLive link, false otherwise
     * * `baseUrl`: base url of lodlive service
     *
     * Default:
     * <pre>
     *
     * lodLive: {
     *   active: false,
     *   baseUrl: 'http://demo-lodlive.thepund.it/?'
     * }
     * </pre>
     */
    lodLive: {
        active: false,
        baseUrl: 'http://demo-lodlive.thepund.it/?'
    },

    /**
     * @module punditConfig
     * @ngdoc object
     * @name timeline
     * @description
     * `object`
     *
     * Define if is active timeline link in Pundit. Object has the follow fields:
     *
     * * `active`: true to active timeline link, false otherwise
     * * `baseUrl`: base url of timeline service
     *
     * Default:
     * <pre>
     *
     * timeline: {
     *  active: false,
     *  baseUrl: 'http://metasound.dibet.univpm.it/timelinejs/examples/pundit.html?'
     * }
     * </pre>
     */
    timeline: {
        active: false,
        baseUrl: 'http://metasound.dibet.univpm.it/timelinejs/examples/pundit.html?'
    }

});