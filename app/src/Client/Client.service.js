/**
 * @ngdoc module
 * @name Pundit2
 * @module Pundit2.Client
 * @description Something ..
**/
angular.module('Pundit2.Client')

    .run(function(Config, Client) {
        if (Config.isModuleActive('Client')) {
            Client.boot();
        }
    })

    .constant('CLIENTDEFAULTS', {
        debug: false,
        bootModules: ['Toolbar', 'Dashboard', 'AnnotationSidebar', 'Preview', 'PageItemsContainer', 'MyItemsContainer']
    })

    .service('Client', function(BaseComponent, Config, MyPundit,
                                ImageFragmentAnnotator, TextFragmentAnnotator, Consolidation,
                                AnnotationsExchange,
                                ItemsExchange, Annotation, CLIENTDEFAULTS, MyItems,
                                $injector, $templateCache, $rootScope) {

        var client = new BaseComponent('Client', CLIENTDEFAULTS),

            // Node which will contain every other component
            root;

        // Verifies that the root node has the wrap class
        client.fixRootNode = function() {
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
        client.addComponents = function() {
            for (var i= 0, l=client.options.bootModules.length; i<l; i++) {
                var name = client.options.bootModules[i];

                // If the module is not active, we do NOT bootstrap it
                if (!Config.isModuleActive(name)) {
                    client.log("Not bootstrapping "+name+": not active.");
                    continue;
                }

                // A reference to the module we need to read .options from
                var mod = $injector.get(name);

                // First case: append to Pundit2's root node
                if ("clientDomTemplate" in mod.options) {
                    var tmpl = $templateCache.get(mod.options.clientDomTemplate);

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

                    var tmpl = $templateCache.get(mod.options.clientDashboardTemplate);

                    if (typeof(tmpl) === "undefined") {
                        client.err('Can not bootstrap module '+mod.name+', template not found: '+mod.options.clientDashboardTemplate);
                    } else {
                        // TODO: FIX MEEE .. dashboard is not ready yet :|
                        $injector.get("Dashboard")
                            .addContent(mod.options.clientDashboardPanel,
                            mod.options.clientDashboardTabTitle,
                            mod.options.clientDashboardTemplate);
                        client.log('Adding to Dashboard: '+ mod.name +' to panel '+mod.options.clientDashboardPanel);
                    }
                    continue;
                }

                // Third case: some option is missing somewhere! Throw an error ..
                client.err("Did not bootstrap module "+name+": .options parameters missing.");

            } // for l=client.options.bootModules.length

        }; // client.addComponents()

        // Retrieves the annotations for this page and consolidates them
        client.getAnnotations = function() {

            var uris = Consolidation.getAvailableTargets(),
                annPromise = AnnotationsExchange.searchByUri(uris);

            client.log('Getting annotations for available targets', uris);

            annPromise.then(function(ids) {
                client.log('Found '+ids.length+' annotations on the current page.');

                var annPromises = [],
                    settled = 0;
                for (var i=0; i<ids.length; i++) {

                    var a = new Annotation(ids[i]);
                    a.then(function(){
                        // The annotation got loaded, it is already available
                        // in the AnnotationsExchange
                    }, function(error) {
                        client.log("Could not retrieve annotation: "+ error);
                        // TODO: can we try again? Let the user try again with an error on
                        // the toolbar?
                    }).finally().then(function() {
                        settled++;
                        client.log('Received annotation '+settled+'/'+annPromises.length);
                        if (settled === annPromises.length) {
                            client.log('All promises settled, consolidating');
                            Consolidation.consolidate(ItemsExchange.getItems());
                        }
                    });
                    annPromises.push(a);
                }

            }, function(msg) {
                client.err("Could not search for annotations, error from the server: "+msg);
            });

        }; // client.getAnnotations()

        // Reads the conf and initializes the active components, bootstrap what needs to be
        // bootstrapped (gets annotations, check if the user is logged in, etc)
        client.boot = function() {

            client.fixRootNode();

            // Check if we're logged in, other components should $watch MyPundit
            // and get notified automatically when logged in, if needed
            MyPundit.checkLoggedIn().then(function(value) {

                // Now that we know if we're logged in or not, we can download the right
                // annotations: auth or non-auth form the server
                client.getAnnotations();

                $rootScope.$watch(function() {
                    return MyPundit.getUserLogged();
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

                MyItems.getMyItems();
            });

            client.addComponents();

            // TODO:
            // * Lists (My, page?, vocabs?, selectors?)
            // * TextFragmentHandler (TextAnnotator?)
            // * Selectors
            // * MyItems
            // ? Annotators
            // LATERS: image annotator handler, named content handler, page handler
            //         entity editor helper
            //         Notebook Manager
            //         Tool: comment tag, triple composer

        };

        // Called when the user completed the login process with the modal etc, NOT if the user
        // was already logged in on boot etc
        var onLogin = function() {

            // TODO: consolidation wipe! YAYYYYYY
            ItemsExchange.wipe();
            AnnotationsExchange.wipe();

            // There could be private annotations we want to show, get them again
            client.getAnnotations();

            MyItems.getMyItems();
        };

        // Called when the user completed the logout process, clicking on logout
        var onLogout = function() {

            // TODO: consolidation wipe! YAYYYYYY
            ItemsExchange.wipe();
            AnnotationsExchange.wipe();

            // There might have been private annotations we dont want to show anymore
            client.getAnnotations();
        };

        client.log("Component up and running");
        return client;
    });