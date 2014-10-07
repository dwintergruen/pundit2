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
 *
 * All the configurable properties of the modules are available within {@link #!/api/punditConfig/object/modules modules}. 
 **/
