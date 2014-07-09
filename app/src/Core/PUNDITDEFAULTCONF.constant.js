angular.module('Pundit2.Core')
    .constant('PUNDITDEFAULTCONF', {
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
         * @name useBasicRelations
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
         * @name useBasicRelations
         * @description
         * `boolean`
         * Load basic relations configured in Client module.
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