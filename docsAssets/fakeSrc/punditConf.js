angular.module('punditConfig');
/**
 * @ngdoc module
 * @name punditConfig
 * @module punditConfig
 *
 * @description
 *
 * To configure Pundit2 and modules that compose it is necessary to construct a configuration object 
 * and include it in the page before Pundit2 initialization.
 *
 * This object extends the default configuration,
 * the specified properties override the default values
 * while the properties that are not defined assume the default values.
 *
 * Include:
 * ```html
 * <script src="pundit-conf.js" type="text/javascript"></script>
 * ```
 *
 * Using javascript syntax create an object called "punditConfig" inside pundit-conf.js
 * and set the desired properties:
 *
 * <pre>
 * var punditConfig = {
 *      annotationServerBaseURL: 'http://demo-cloud.as.thepund.it:8080/annotationserver/',
 *      debugAllModules: false,
 *      useBasicRelations: true,
 *      modules: {
 *          Toolbar: {
 *              askLinkDefault: "http://ask.thepund.it/",
 *              debug: false
 *              },
 *          Dashboard: {
 *              isDashboardVisible: false,
 *              containerHeight: 300,
 *              debug: false
 *          }
 *      }
 * }
 * </pre>
 *
 * The "modules" property allows you to configure the various modules of Pundit2, 
 * a full list of modules is available here:
 *  - {@link #!/api/punditConfig/object/modules#AnnotationDetails AnnotationDetails}
 *  - {@link #!/api/punditConfig/object/modules#AnnotationSidebar AnnotationSidebar}
 *  - {@link #!/api/punditConfig/object/modules#Analytics Analytics}
 *  - {@link #!/api/punditConfig/object/modules#Client Client}
 *  - {@link #!/api/punditConfig/object/modules#Dashboard Dashboard}
 *  - {@link #!/api/punditConfig/object/modules#FreebaseSelector FreebaseSelector}
 *  - {@link #!/api/punditConfig/object/modules#Item Item}
 *  - {@link #!/api/punditConfig/object/modules#KorboBasketSelector KorboBasketSelector}
 *  - {@link #!/api/punditConfig/object/modules#MyPundit MyPundit}
 *  - {@link #!/api/punditConfig/object/modules#MyItems MyItems}
 *  - {@link #!/api/punditConfig/object/modules#MyIyemsContainer MyIyemsContainer}
 *  - {@link #!/api/punditConfig/object/modules#MurucaSelector MurucaSelector}
 *  - {@link #!/api/punditConfig/object/modules#PageItemsContainer PageItemsContainer}
 *  - {@link #!/api/punditConfig/object/modules#Preview Preview}
 *  - {@link #!/api/punditConfig/object/modules#ResourcePanel ResourcePanel}
 *  - {@link #!/api/punditConfig/object/modules#SelectorsManager SelectorsManager}
 *  - {@link #!/api/punditConfig/object/modules#TextFragmentAnnotator TextFragmentAnnotator}
 *  - {@link #!/api/punditConfig/object/modules#TextFragmentHandler TextFragmentHandler}
 *  - {@link #!/api/punditConfig/object/modules#Toolbar Toolbar}
 *  - {@link #!/api/punditConfig/object/modules#TripleComposer TripleComposer}
 *  - {@link #!/api/punditConfig/object/modules#SimplifiedClient SimplifiedClient}
 *
 * All the configurable properties of the modules are available within {@link #!/api/punditConfig/object/modules modules}. 
 **/
