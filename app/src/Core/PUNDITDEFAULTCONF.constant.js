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
         * Pundit server base URL.
         *
         * Default:
         * <pre> debugAllModules: false </pre>
         */
        debugAllModules: false,
        vocabularies: [],
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
         * Each "modules" properties is the name of a Pundit2 module and contain the default relative configuration object.
         * This configuration can be extended and / or overwritten, 
         * the specified properties override the default values while the properties that are not defined assume the default values.
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
                active: true
            },
            MyItemsContainer: {
                active: true
            },
            SelectorsManager: {
                // when selector manager is activated by default all selectors are active
                // to turn off each selector is necessary to add an object with the active property to false
                // in the same way to configure multiple instances of the same selector
                // you need to add an object here (see vocabularies.html example)
                active: true
            },
            TripleComposer: {
                active: true
            }
      }

    });