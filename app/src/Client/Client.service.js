/*jshint -W051 */ //Only properties should be deleted

angular.module('Pundit2.Client')

    .run(function($injector, Config) {
        if(Config.isValid()){
            if (Config.isModuleActive('Client')) {
                var client = $injector.get('Client');
                client.boot();
            }
        }
    })

    .constant('CLIENTDEFAULTS', {

        /**
         * @module punditConfig
         * @ngdoc property
         * @name modules#Client
         *
         * @description
         * `object`
         *
         * Configuration object for Client module. Client service has the task of managing the boot process:
         * loading the basic relationships (from "basicRelations"), downloading from the server user annotations and
         * adding to the DOM modules configured "bootModules".
         */

        /**
         * @ngdoc property
         * @name modules#Client.debug
         *
         * @description
         * `boolean`
         *
         * Active debug log
         *
         * Default value:
         * <pre> debug: false </pre>
         */
        debug: false,

        /**
         * @module punditConfig
         * @ngdoc property
         * @name modules#Client.relationsContainer
         *
         * @description
         * `string`
         *
         * Name of the container used to store the usable relations in the itemsExchange.
         *
         * Default value:
         * <pre> relationsContainer: "usableRelations" </pre>
         */
        relationsContainer: "usableRelations",

        /**
         * @module punditConfig
         * @ngdoc property
         * @name modules#Client.bootModules
         *
         * @description
         * `Array`
         *
         * Boot Modules name list. 
         *
         * Default value:
         * <pre> bootModules: [
         *      'Toolbar', 'Dashboard', 'AnnotationSidebar',
         *      'Preview', 'SelectorsManager', 'PageItemsContainer',
         *      'MyItemsContainer','TripleComposer'
         * ] </pre>
         */
        bootModules: [
            'Toolbar', 'Dashboard', 'AnnotationSidebar', 'Preview',
            'MyNotebooksContainer', 'SelectorsManager', 'PredicatesContainer' ,'PageItemsContainer', 'MyItemsContainer',
            'NotebookComposer', 'TripleComposer'
        ],

        /**
         * @module punditConfig
         * @ngdoc property
         * @name modules#Client.basicRelations
         *
         * @description
         * `Array`
         *
         * Basic Relations list, this items are loaded at boot
         * and are used as predicates in the construction of the annotations.
         * If you want to use only your predicates you can set {@link #!/api/punditConfig/object/useBasicRelations useBasicRelations} as false
         * and load your data from the {@link #!/api/punditConfig/object/vocabularies vocabularies} property.
         *
         * Default value:
         *
         * <pre>
         *  basicRelations: [
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "has comment (free text)",
         *       "description": "Any comment related to the selected fragment of text or image",
         *       "domain": [
         *           "http://purl.org/pundit/ont/ao#fragment-image",
         *           "http://purl.org/pundit/ont/ao#fragment-text",
         *           "http://xmlns.com/foaf/0.1/Image"
         *       ],
         *       "range": ["http://www.w3.org/2000/01/rdf-schema#Literal"],
         *       "uri": "http://schema.org/comment"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "depicts",
         *       "description": "An image or part of an image depicts something",
         *       "domain": [
         *           "http://xmlns.com/foaf/0.1/Image",
         *           "http://purl.org/pundit/ont/ao#fragment-image"
         *       ],
         *       "range": [],
         *       "uri": "http://xmlns.com/foaf/0.1/depicts"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "is similar to",
         *       "description": "The selected fragment (text or image fragment) is similar to another fragment (of the same or of different types)",
         *       "domain": [
         *           "http://purl.org/pundit/ont/ao#fragment-text",
         *           "http://purl.org/pundit/ont/ao#fragment-image",
         *           "http://xmlns.com/foaf/0.1/Image"
         *       ],
         *       "range": [
         *           "http://purl.org/pundit/ont/ao#fragment-text",
         *           "http://purl.org/pundit/ont/ao#fragment-image",
         *           "http://xmlns.com/foaf/0.1/Image"
         *       ],
         *       "uri": "http://purl.org/pundit/vocab#similarTo"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *      "label": "has creator",
         *       "description": "The selected text fragment has been created by a specific Person",
         *       "domain": [
         *           "http://purl.org/pundit/ont/ao#fragment-text",
         *           "http://purl.org/pundit/ont/ao#fragment-image",
         *           "http://xmlns.com/foaf/0.1/Image"
         *       ],
         *       "range": [
         *           "http://www.freebase.com/schema/people/person",
         *           "http://xmlns.com/foaf/0.1/Person",
         *           "http://dbpedia.org/ontology/Person"
         *       ],
         *       "uri": "http://purl.org/dc/terms/creator"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "cites",
         *       "description": "The selected text fragment cites another text fragment, or a Work or a Person",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": [
         *           "http://purl.org/pundit/ont/ao#fragment-text",
         *           "http://www.freebase.com/schema/people/person",
         *           "http://xmlns.com/foaf/0.1/Person",
         *           "http://dbpedia.org/ontology/Person",
         *           "http://www.freebase.com/schema/book/written_work",
         *           "http://www.freebase.com/schema/book/book"
         *       ],
         *       "uri": "http://purl.org/spar/cito/cites"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "quotes",
         *       "description": "The selected text fragment is a sentence from a Person or a Work, usually enclosed by quotations (eg: '')",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": [
         *           "http://www.freebase.com/schema/people/person",
         *           "http://xmlns.com/foaf/0.1/Person",
         *           "http://dbpedia.org/ontology/Person",
         *           "http://www.freebase.com/schema/book/written_work",
         *           "http://www.freebase.com/schema/book/book"
         *       ],
         *       "uri": "http://purl.org/spar/cito/includesQuotationFrom"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "talks about",
         *       "description": "The selected text fragment talks about some other text, Entity, Person or any other kind of concept",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": [],
         *       "uri": "http://purl.org/pundit/ont/oa#talksAbout"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "is related to",
         *       "description": "The selected text fragment is someway related to another text, Entity, Person or any other kind of concept",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": [],
         *       "uri": "http://purl.org/pundit/ont/oa#isRelatedTo"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "identifies",
         *       "description": "The selected text fragment is a Person, a Work, a Place or a well defined Entity",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": [
         *           "http://www.freebase.com/schema/location/location",
         *           "http://dbpedia.org/ontology/Place",
         *           "http://schema.org/Place",
         *           "http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing",
         *           "http://www.freebase.com/schema/people/person",
         *           "http://dbpedia.org/ontology/Person",
         *           "http://xmlns.com/foaf/0.1/Person",
         *           "http://www.freebase.com/schema/book/written_work",
         *           "http://www.freebase.com/schema/book/book"
         *       ],
         *       "uri": "http://purl.org/pundit/ont/oa#identifies"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "is date",
         *       "description": "The selected text fragment corresponds to the specified Date",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": ["http://www.w3.org/2001/XMLSchema#dateTime"],
         *       "uri": "http://purl.org/pundit/ont/oa#isDate"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "period of dates starts at",
         *       "description": "The selected text fragment corresponds to the specified date period which starts at the specified Date",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": ["http://www.w3.org/2001/XMLSchema#dateTime"],
         *       "uri": "http://purl.org/pundit/ont/oa#periodStartDate"
         *  },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "period of dates ends at",
         *       "description": "The selected text fragment corresponds to the specified date period which ends at the specified Date",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": ["http://www.w3.org/2001/XMLSchema#dateTime"],
         *       "uri": "http://purl.org/pundit/ont/oa#periodEndDate"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "translates to",
         *       "description": "The selected text fragment translation is given as free text",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": ["http://www.w3.org/2000/01/rdf-schema#Literal"],
         *       "uri": "http://purl.org/pundit/ont/oa#translatesTo"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "is translation of",
         *       "description": "The selected text fragment is the translation of another text fragment",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "uri": "http://purl.org/pundit/ont/oa#isTranslationOf"
         *   },
         *   {
         *       "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
         *       "label": "is written in",
         *       "description": "The selected text fragment is written in the specified language (french, german, english etc)",
         *       "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
         *       "range": ["http://www.freebase.com/schema/language/human_language"],
         *       "uri": "http://purl.org/pundit/ont/oa#isWrittenIn"
         *   }
         * ]
         * </pre>
         */
        basicRelations: [
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "has comment (free text)",
                "description": "Any comment related to the selected fragment of text or image",
                "domain": [
                    "http://purl.org/pundit/ont/ao#fragment-image",
                    "http://purl.org/pundit/ont/ao#fragment-text",
                    "http://xmlns.com/foaf/0.1/Image"
                ],
                "range": ["http://www.w3.org/2000/01/rdf-schema#Literal"],
                "vocabulary": "Basic Relation",
                "uri": "http://schema.org/comment"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "depicts",
                "description": "An image or part of an image depicts something",
                "domain": [
                    "http://xmlns.com/foaf/0.1/Image",
                    "http://purl.org/pundit/ont/ao#fragment-image"
                ],
                "range": [],
                "vocabulary": "Basic Relation",
                "uri": "http://xmlns.com/foaf/0.1/depicts"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "is similar to",
                "description": "The selected fragment (text or image fragment) is similar to another fragment (of the same or of different types)",
                "domain": [
                    "http://purl.org/pundit/ont/ao#fragment-text",
                    "http://purl.org/pundit/ont/ao#fragment-image",
                    "http://xmlns.com/foaf/0.1/Image"
                ],
                "range": [
                    "http://purl.org/pundit/ont/ao#fragment-text",
                    "http://purl.org/pundit/ont/ao#fragment-image",
                    "http://xmlns.com/foaf/0.1/Image"
                ],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/pundit/vocab#similarTo"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "has creator",
                "description": "The selected text fragment has been created by a specific Person",
                "domain": [
                    "http://purl.org/pundit/ont/ao#fragment-text",
                    "http://purl.org/pundit/ont/ao#fragment-image",
                    "http://xmlns.com/foaf/0.1/Image"
                ],
                "range": [
                    "http://www.freebase.com/schema/people/person",
                    "http://xmlns.com/foaf/0.1/Person",
                    "http://dbpedia.org/ontology/Person"
                ],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/dc/terms/creator"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "cites",
                "description": "The selected text fragment cites another text fragment, or a Work or a Person",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": [
                    "http://purl.org/pundit/ont/ao#fragment-text",
                    "http://www.freebase.com/schema/people/person",
                    "http://xmlns.com/foaf/0.1/Person",
                    "http://dbpedia.org/ontology/Person",
                    "http://www.freebase.com/schema/book/written_work",
                    "http://www.freebase.com/schema/book/book"
                ],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/spar/cito/cites"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "quotes",
                "description": "The selected text fragment is a sentence from a Person or a Work, usually enclosed by quotations (eg: '')",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": [
                    "http://www.freebase.com/schema/people/person",
                    "http://xmlns.com/foaf/0.1/Person",
                    "http://dbpedia.org/ontology/Person",
                    "http://www.freebase.com/schema/book/written_work",
                    "http://www.freebase.com/schema/book/book"
                ],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/spar/cito/includesQuotationFrom"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "talks about",
                "description": "The selected text fragment talks about some other text, Entity, Person or any other kind of concept",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": [],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/pundit/ont/oa#talksAbout"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "is related to",
                "description": "The selected text fragment is someway related to another text, Entity, Person or any other kind of concept",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": [],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/pundit/ont/oa#isRelatedTo"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "identifies",
                "description": "The selected text fragment is a Person, a Work, a Place or a well defined Entity",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": [
                    "http://www.freebase.com/schema/location/location",
                    "http://dbpedia.org/ontology/Place",
                    "http://schema.org/Place",
                    "http://www.w3.org/2003/01/geo/wgs84_pos#SpatialThing",
                    "http://www.freebase.com/schema/people/person",
                    "http://dbpedia.org/ontology/Person",
                    "http://xmlns.com/foaf/0.1/Person",
                    "http://www.freebase.com/schema/book/written_work",
                    "http://www.freebase.com/schema/book/book"
                ],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/pundit/ont/oa#identifies"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "is date",
                "description": "The selected text fragment corresponds to the specified Date",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": ["http://www.w3.org/2001/XMLSchema#dateTime"],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/pundit/ont/oa#isDate"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "period of dates starts at",
                "description": "The selected text fragment corresponds to the specified date period which starts at the specified Date",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": ["http://www.w3.org/2001/XMLSchema#dateTime"],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/pundit/ont/oa#periodStartDate"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "period of dates ends at",
                "description": "The selected text fragment corresponds to the specified date period which ends at the specified Date",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": ["http://www.w3.org/2001/XMLSchema#dateTime"],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/pundit/ont/oa#periodEndDate"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "translates to",
                "description": "The selected text fragment translation is given as free text",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": ["http://www.w3.org/2000/01/rdf-schema#Literal"],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/pundit/ont/oa#translatesTo"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "is translation of",
                "description": "The selected text fragment is the translation of another text fragment",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/pundit/ont/oa#isTranslationOf"
            },
            {
                "type": ["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"],
                "label": "is written in",
                "description": "The selected text fragment is written in the specified language (french, german, english etc)",
                "domain": ["http://purl.org/pundit/ont/ao#fragment-text"],
                "range": ["http://www.freebase.com/schema/language/human_language"],
                "vocabulary": "Basic Relation",
                "uri": "http://purl.org/pundit/ont/oa#isWrittenIn"
            }
        ]
    })

    // ImageAnnotator service MUST be injected before TextFragmentAnnotator
    // otherwise the image consolidation may BREAK!!!
    .service('Client', function(CLIENTDEFAULTS, BaseComponent, Config, MyPundit,
                                ImageAnnotator, TextFragmentAnnotator, AnnotationsCommunication,
                                AnnotationsExchange, Item, ItemsExchange, MyItems,
                                TextFragmentHandler, ImageHandler, PageAnnotator,
                                Toolbar, Annomatic, NotebookCommunication, NotebookExchange,
                                SelectorsManager, FreebaseSelector, MurucaSelector, KorboBasketSelector, Korbo2Selector, PredicateSelector,
                                TemplatesSelector, TripleComposer, ImageFragmentAnnotatorHelper,
                                $injector, $templateCache, $rootScope, $compile, $window) {

        var client = new BaseComponent('Client', CLIENTDEFAULTS),

            // Node which will contain every other component
            root;

        // Verifies that the root node has the wrap class
        var fixRootNode = function() {
            root = angular.element("[data-ng-app='Pundit2']");
            if (!root.hasClass('pnd-wrp')) {
                root.addClass('pnd-wrp');
            }
        };

        // Reads the list of components which needs to be bootstrapped.. and bootstrap
        // them as specified in their .options.
        // .clientDomTemplate: path to a template which will get appended to Pundit2 root node
        //                     (eg: Dashboard, Toolbar .. )
        // .clientDashboardTemplate: path to a template which will get appended to a
        //                           dashboard panel, specified in clientDashboardPanel
        //                           (eg: Preview, MyItems, ...)
        // .clientDashboardPanel: name of the panel the template will get appended to. See
        //                        Dashboard configuration for the list of legal panel names
        // .clientDashboardTabTitle: title of the tab shown inside the panel
        var addComponents = function() {
            for (var i= 0, l=client.options.bootModules.length; i<l; i++) {
                var name = client.options.bootModules[i];

                // If the module is not active, we do NOT bootstrap it
                if (!Config.isModuleActive(name)) {
                    client.log("Not bootstrapping "+name+": not active.");
                    continue;
                }

                // A reference to the module we need to read .options from
                var tmpl,
                    mod = $injector.get(name);

                // First case: append to Pundit2's root node
                if ("clientDomTemplate" in mod.options) {
                    tmpl = $templateCache.get(mod.options.clientDomTemplate);

                    if (typeof(tmpl) === "undefined") {
                        client.err('Can not bootstrap module '+mod.name+', template not found: '+mod.options.clientDomTemplate);
                    } else {
                        // DEBUG: Not compiling the templates, or stuff gets initialized twice
                        root.append(tmpl);
                        client.log('Appending to DOM ' + mod.name, tmpl);
                    }
                    continue;
                }

                // Second case: add to some Dashboard panel
                if ("clientDashboardTemplate" in mod.options &&
                    "clientDashboardPanel" in mod.options &&
                    "clientDashboardTabTitle" in mod.options &&
                    Config.isModuleActive("Dashboard")) {

                    tmpl = $templateCache.get(mod.options.clientDashboardTemplate);

                    if (typeof(tmpl) === "undefined") {
                        client.err('Can not bootstrap module '+mod.name+', template not found: '+mod.options.clientDashboardTemplate);
                    } else {

                        $injector.get("Dashboard")
                            .addContent(
                                mod.options.clientDashboardPanel,
                                mod.options.clientDashboardTabTitle,
                                mod.options.clientDashboardTemplate
                            );
                        client.log('Adding to Dashboard: '+ mod.name +' to panel '+mod.options.clientDashboardPanel);
                    }
                    continue;
                }

                // Third case: some option is missing somewhere! Throw an error ..
                client.err("Did not bootstrap module "+name+": .options parameters missing.");

            } // for l=client.options.bootModules.length

        }; // addComponents()

        var addKorbo = function(dir){
            root.append(dir);
        };

        // Loads the basic relations into some special ItemsExchange container
        var loadBasicRelations = function() {
            var num = 0,
                relations = client.options.basicRelations;
            for (var p in relations) {
                // property is automatically added to ItemsExchange default container
                new Item(relations[p].uri, relations[p]);
            }
            client.log('Loaded '+num+' basic relations');
        };

        // Loads configured relations into some special ItemsExchange container
        var loadConfiguredRelations = function() {
            PredicateSelector.getAllVocabularies().then(function(res){

                for (var p in res) {
                    // property is automatically added to ItemsExchange default container
                    new Item(res[p].uri, res[p]);
                }

                client.log('Loaded '+res.length+' relations from extern vocabularies');
            });
        };

        // Reads the conf and initializes the active components, bootstrap what needs to be
        // bootstrapped (gets annotations, check if the user is logged in, etc)
        client.boot = function() {

            fixRootNode();

            if (Config.useBasicRelations) {
                loadBasicRelations();
            }
            loadConfiguredRelations();

            if (Config.useTemplates) {
                TemplatesSelector.getAll().then(function(){
                    // show immediatly the first template
                    if (Config.useOnlyTemplateMode) {
                        TripleComposer.showCurrentTemplate();
                    }
                });
            }

            // Check if we're logged in, other components should $watch MyPundit
            // and get notified automatically when logged in, if needed
            MyPundit.checkLoggedIn().then(function(value) {

                if (value === true) {
                    MyItems.getAllItems();
                    NotebookCommunication.getMyNotebooks();
                    NotebookCommunication.getCurrent();
                }

                // Now that we know if we're logged in or not, we can download the right
                // annotations: auth or non-auth form the server
                AnnotationsCommunication.getAnnotations();

                $rootScope.$watch(function() {
                    return MyPundit.isUserLogged();
                }, function(newStatus, oldStatus) {
                    if (newStatus === oldStatus) {
                        return;
                    }
                    if (newStatus === true) {
                        client.log("User just logged in");
                        onLogin();
                    } else {
                        client.log("User just logged out");
                        onLogout();
                    }
                });
                
            });

            // to add a selector must to inject it in the dependency
            // otherwise the SelectorsManager.addSelector() is never called
            // and the selector manager can't show the selector
            // es: FreebaseSelector, MurucaSelector, KorboBasketSelector

            // IF KORBO.ACTIVE IS TRUE, ADD KORBO DIRECTIVE
            if(typeof(Config.korbo) !== 'undefined' && Config.korbo.active){
                var dir = "<korbo-entity-editor conf-name='"+Config.korbo.confName+"'></korbo-entity-editor>";
                addKorbo(dir);
            }

            addKorboEESelector();
            SelectorsManager.init();

            addComponents();


            client.log('Boot is completed, emitting pundit-boot-done event');
            $rootScope.$emit('pundit-boot-done');

            // TODO:
            // * Lists (My, page?, vocabs?, selectors?)
            // * Selectors
            // LATERS: image annotator handler, named content handler, page handler
            //         entity editor helper
            //         Notebook Manager
            //         Tool: comment tag, triple composer

        };

        // Called when the user completed the login process with the modal etc, NOT if the user
        // was already logged in on boot etc
        var onLogin = function() {

            NotebookExchange.wipe();
            ItemsExchange.wipe();
            AnnotationsExchange.wipe();

            NotebookCommunication.getMyNotebooks();
            NotebookCommunication.getCurrent();

            // There could be private annotations we want to show, get them again
            AnnotationsCommunication.getAnnotations();

            MyItems.getAllItems();
            if (Config.useBasicRelations) {
                loadBasicRelations();
            }
            loadConfiguredRelations();
        };

        // Called when the user completed the logout process, clicking on logout
        var onLogout = function() {

            NotebookExchange.wipe();
            ItemsExchange.wipe();
            AnnotationsExchange.wipe();

            // There might have been private annotations we dont want to show anymore
            AnnotationsCommunication.getAnnotations();
            if (Config.useBasicRelations) {
                loadBasicRelations();
            }
            loadConfiguredRelations();
        };

        var addKorboEESelector = function(){

            if(!Config.korbo.active){
                return;
            }

            var korboEEconfig = $window[Config.korbo.confName];
            // set default language

            var lang = korboEEconfig.languages[0];
            for (var j in korboEEconfig.languages){
                if(korboEEconfig.languages[j].state === true) {
                    lang = korboEEconfig.languages[j];
                    break;
                } // end if
            }
            var config = {
                container: 'kee-korbo2',
                // instance label tab title
                label: 'Korbo',
                // enable or disable the instance
                active: true,

                basketID: korboEEconfig.basketID,
                url: korboEEconfig.endpoint,
                language: lang.value
            };

            var keeSelector = new Korbo2Selector(config);
            keeSelector.push(config);
            delete keeSelector;

        };

        client.log("Component up and running");
        return client;
    });