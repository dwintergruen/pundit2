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
 *  - {@link punditConfig.modules#AnnotationDetails AnnotationDetails}
 *  - {@link punditConfig.modules#AnnotationSidebar AnnotationSidebar}
 *  - {@link punditConfig.modules#Analytics Analytics}
 *  - {@link punditConfig.modules#Dashboard Dashboard}
 *  - {@link punditConfig.modules#FreebaseSelector FreebaseSelector}
 *  - {@link punditConfig.modules#KorboBasketSelector KorboBasketSelector}
 *  - {@link punditConfig.modules#MyPundit MyPundit}
 *  - {@link punditConfig.modules#MyItems MyItems}
 *  - {@link punditConfig.modules#MyIyemsContainer MyIyemsContainer}
 *  - {@link punditConfig.modules#MurucaSelector MurucaSelector}
 *  - {@link punditConfig.modules#PageItemsContainer PageItemsContainer}
 *  - {@link punditConfig.modules#Preview Preview}
 *  - {@link punditConfig.modules#ResourcePanel ResourcePanel}
 *  - {@link punditConfig.modules#SelectorsManager SelectorsManager}
 *  - {@link punditConfig.modules#TextFragmentAnnotator TextFragmentAnnotator}
 *  - {@link punditConfig.modules#TextFragmentHandler TextFragmentHandler}
 *  - {@link punditConfig.modules#Toolbar Toolbar}
 *  - {@link punditConfig.modules#TripleComposer TripleComposer}
 *  - {@link punditConfig.modules#VocabulariesContainer VocabulariesContainer}
 *
 * All the configurable properties of the modules are available within {@link #!/api/punditConfig/object/modules modules}. 
 **/
