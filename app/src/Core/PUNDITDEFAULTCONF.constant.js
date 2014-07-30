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
        korbo : {
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
         * All propeties are optional. By default a triple is not mandatory.
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
         *        askLinkDefault: "http://ask.thepund.it/",
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
                active: false
            },

            Dashboard: {
                /**
                 * @ngdoc property
                 * @name modules#Dashboard.active
                 *
                 * @description
                 * `boolean`
                 *
                 * Default state of the dashboard module, if it is set to true 
                 * the client adds to the DOM the dashboard directive in the boot phase.
                 *
                 * Default value:
                 * <pre> active: true </pre>
                 */
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
                /**
                 * @ngdoc property
                 * @name modules#PageItemsContainer.active
                 *
                 * @description
                 * `boolean`
                 *
                 * Default state of the PageItemsContainer module, if it is set to true 
                 * the client adds to the DOM (inside dashboard) the PageItemsContainer directive in the boot phase.
                 *
                 * Default value:
                 * <pre> active: true </pre>
                 */
                active: true
            },
            MyNotebooksContainer: {
                active: true
            },
            MyItemsContainer: {
                /**
                 * @ngdoc property
                 * @name modules#MyItemsContainer.active
                 *
                 * @description
                 * `boolean`
                 *
                 * Default state of the MyItemsContainer module, if it is set to true 
                 * the client adds to the DOM (inside dashboard) the MyItemsContainer directive in the boot phase.
                 *
                 * Default value:
                 * <pre> active: true </pre>
                 */
                active: true
            },
            SelectorsManager: {
                /**
                 * @ngdoc property
                 * @name modules#SelectorsManager.active
                 *
                 * @description
                 * `boolean`
                 *
                 * Default state of the SelectorsManager module, if it is set to true 
                 * the client adds to the DOM (inside dashboard) the VocabulariesContainer directive in the boot phase.
                 *
                 * When selector manager is activated by default all selectors are active (Freebase, Korbo, ...),
                 * to turn off a specific selector is necessary to set to false the active property
                 * in the configuration object of the specific selector.
                 *
                 * Default value:
                 * <pre> active: true </pre>
                 */
                active: true
            },
            TripleComposer: {
                /**
                 * @ngdoc property
                 * @name modules#TripleComposer.active
                 *
                 * @description
                 * `boolean`
                 *
                 * Default state of the TripleComposer module, if it is set to true 
                 * the client adds to the DOM (inside dashboard) the TripleComposer directive in the boot phase.
                 *
                 * Default value:
                 * <pre> active: true </pre>
                 */
                active: true
            },
            NotebookComposer: {
                active: true
            }
      }

    });