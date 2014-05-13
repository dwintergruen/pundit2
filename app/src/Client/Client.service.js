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
        bootModules: ['Toolbar', 'Dashboard', 'AnnotationSidebar', 'Preview']
    })
    .service('Client', function(BaseComponent, Config, MyPundit, AnnotatorsOrchestrator,
                                TextFragmentAnnotator, AnnotationsExchange, Consolidation,
                                ItemsExchange, Annotation, CLIENTDEFAULTS,
                                $injector, $templateCache, $rootScope) {

        var client = new BaseComponent('Client', CLIENTDEFAULTS),
            // Node which will contain every other component
            root;

        // Verifies that the root node has the wrap class
        // TODO: if there is no node.. add it? Is Pundit2 bootstrapped if there's
        // no node? :P
        client.fixRootNode = function() {
            root = angular.element("[data-ng-app='Pundit2']");
            if (!root.hasClass('pnd-wrp')) {
                root.addClass('pnd-wrp');
            }
        };

        // Reads the conf and initializes the active components, bootstrap what needs to be
        // bootstrapped (gets annotations, check if the user is logged in, etc)
        client.boot = function() {

            client.fixRootNode();

            // Check if we're logged in, other components should $watch MyPundit
            // and get notified automatically when logged in
            MyPundit.checkLoggedIn().then(function(value) {
                // TODO: check if we're logged in and set something up?
            });

            // Read the list of components which needs to be bootstrapped.. and bootstrap
            // them as specified in their .options.
            // .clientDomTemplate: path to a template which will get appended to Pundit2 root node
            //                     (eg: Dashboard, Toolbar .. )
            // .clientDashboardTemplate: path to a template which will get appended to a
            //                           dashboard panel, specified in clientDashboardPanel
            //                           (eg: Preview, MyItems, ...)
            // .clientDashboardPanel: name of the panel the template will get appended to. See
            //                        Dashboard configuration for the list of legal panel names
            // .clientDashboardTabTitle: title of the tab shown inside the panel
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


            // TODO: some if, some option?
            var uris = AnnotatorsOrchestrator.getAvailableTargets();
            client.log('Available targets', uris);

            var annPromise = AnnotationsExchange.searchByUri(uris);
            annPromise.then(function(ids) {
                client.log('Found '+ids.length+' annotations on the current page.');

                ids.push('wrong-id');

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

            }, function() {
                // TODO: cant search for annotations? OUCH
            });

            // TODO:
            //       update sidebar (automatic?)
            //       update items (automatic?)

            // TODO:
            // * previewer
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

        client.log("Component up and running");
        return client;
    });