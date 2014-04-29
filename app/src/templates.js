angular.module('templates-main', ['src/Annomatic/AnnomaticPanel.dir.tmpl.html', 'src/Annomatic/AnnotationPopover.tmpl.html', 'src/Dashboard/Dashboard.dir.tmpl.html', 'src/Toolbar/Toolbar.dir.tmpl.html']);

angular.module("src/Annomatic/AnnomaticPanel.dir.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/Annomatic/AnnomaticPanel.dir.tmpl.html",
    "<header class=\"panel panel-danger\" ng-controller=\"AnnomaticPanelCtrl\">\n" +
    "    <div class=\"panel-heading\">\n" +
    "        <button class=\"btn\" ng-click=\"getAnnotations()\">Get annotations</button>\n" +
    "        <button class=\"btn\" ng-click=\"startReview()\">Start review ({{Annotate.currAnn}}/{{Annotate.annotationNumber}})</button>\n" +
    "\n" +
    "        <div>\n" +
    "            <label>Filter types:&nbsp;</label>\n" +
    "            <button type=\"button\" class=\"btn btn-default\" ng-model=\"filteredTypes\" data-html=\"1\" data-multiple=\"1\" data-animation=\"am-flip-x\" ng-options=\"type.value as type.label for type in Annotate.ann.typesOptions\" bs-select>\n" +
    "              Action <span class=\"caret\"></span>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"panel-header\">\n" +
    "        Accepted: {{Annotate.ann.byState['accepted'].join(', ')}}\n" +
    "    </div>\n" +
    "    <div class=\"panel-header\">\n" +
    "        Removed: {{Annotate.ann.byState['removed'].join(', ')}}\n" +
    "    </div>\n" +
    "    <div class=\"panel-header\">\n" +
    "        filteredTypes: {{Annotate.filteredTypes}}\n" +
    "    </div>\n" +
    "</header>");
}]);

angular.module("src/Annomatic/AnnotationPopover.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/Annomatic/AnnotationPopover.tmpl.html",
    "<div class=\"popover\" ng-controller=\"AnnotationPopoverCtrl\">\n" +
    "    <div class=\"arrow\"></div>\n" +
    "    <div class=\"popover-content\">\n" +
    "        ({{num}}) {{ann.byNum[num].title}}\n" +
    "        <br>\n" +
    "\n" +
    "        <div>\n" +
    "            <button class=\"btn btn-sm btn-success\" ng-click=\"setOk(content)\">Accept</button>\n" +
    "            <button class=\"btn btn-sm btn-danger\" ng-click=\"setKo(content)\">Remove</button>\n" +
    "        </div>\n" +
    "\n" +
    "        <div>\n" +
    "            <button class=\"btn btn-sm btn-warning\" ng-click=\"goNext(content)\">Next</button>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div ng-show=\"instances > 1\">\n" +
    "            <button class=\"btn btn-head\" \n" +
    "                ng-click=\"acceptAll(content)\"\n" +
    "                ng-mouseover=\"toggleSimilar(content)\" \n" +
    "                ng-mouseout=\"toggleSimilar(content)\">accept all {{instances}}</button>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("src/Dashboard/Dashboard.dir.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/Dashboard/Dashboard.dir.tmpl.html",
    "<div class=\"pnd-dashboard-container\" ng-controller=\"DashboardCtrl\">\n" +
    "\n" +
    "    <!-- panel list -->\n" +
    "    <div class=\"pnd-dashboard-panel pnd-dashboard-panel-lists\">\n" +
    "        <div class=\"pnd-dashboard-panel-cards\"></div>\n" +
    "        <div class=\"pnd-dashboard-panel-content\">\n" +
    "            <!-- the content comes from outside-->\n" +
    "        </div>\n" +
    "        <button type=\"button\" class=\"btn btn-default pnd-dashboard-panel-collapse-button\">X</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- panel tools -->\n" +
    "    <div class=\"pnd-dashboard-panel pnd-dashboard-panel-tools\">\n" +
    "        <div class=\"pnd-dashboard-panel-cards\"></div>\n" +
    "        <div class=\"pnd-dashboard-panel-content\">\n" +
    "            <!-- the content comes from outside-->\n" +
    "        </div>\n" +
    "        <button type=\"button\" class=\"btn btn-default pnd-dashboard-panel-collapse-button\">X</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- panel details -->\n" +
    "    <div class=\"pnd-dashboard-panel pnd-dashboard-panel-details\">\n" +
    "        <div class=\"pnd-dashboard-panel-cards\"></div>\n" +
    "        <div class=\"pnd-dashboard-panel-content\">\n" +
    "            <!-- the content comes from outside-->\n" +
    "        </div>\n" +
    "        <button type=\"button\" class=\"btn btn-default pnd-dashboard-panel-collapse-button\">X</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--separator-->\n" +
    "    <div class=\"pnd-dashboard-separator pnd-dashboard-separator-1\" ng-mousedown=\"firstSeparatorMouseDownHandler($event)\"></div>\n" +
    "    <div class=\"pnd-dashboard-separator pnd-dashboard-separator-2\" ng-mousedown=\"secondSeparatorMouseDownHandler($event)\"></div>\n" +
    "\n" +
    "    <div class=\"pnd-dashboard-footer\" ng-mousedown=\"footerMouseDownHandler($event)\"></div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("src/Toolbar/Toolbar.dir.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/Toolbar/Toolbar.dir.tmpl.html",
    "<nav class=\"navbar navbar-inverse navbar-fixed-top pnd-toolbar-navbar\" role=\"navigation\" ng-controller=\"ToolbarCtrl\">\n" +
    "    <div class=\"container-fluid pnd-toolbar-navbar-container\" >\n" +
    "    \n" +
    "        <div class=\"pnd-toolbar-navbar-collapse\">\n" +
    "            <ul class=\"nav navbar-nav pnd-toolbar-navbar-left\">\n" +
    "                \n" +
    "                <!-- Error button -->\n" +
    "                <li ng-show=\"showStatusButtonError()\" class=\"pnd-toolbar-error-button\">\n" +
    "                    <a href=\"javascript:void(0)\" bs-dropdown=\"errorMessageDropdown\"><span class=\"glyphicon glyphicon-exclamation-sign pnd-toolbar-error-icon\"></span></a>\n" +
    "                </li>\n" +
    "                \n" +
    "                <!-- OK button -->\n" +
    "                <li ng-show=\"showStatusButtonOk()\" class=\"pnd-toolbar-status-button-ok\">\n" +
    "                    <a href=\"javascript:void(0)\"><span class=\"glyphicon glyphicon-ok pnd-toolbar-status-ok-icon\"></span></a>\n" +
    "                </li>\n" +
    "                \n" +
    "                <!-- Login button -->\n" +
    "                <li ng-show=\"showLogin()\" class=\"pnd-toolbar-login-button\">\n" +
    "                    <a href=\"javascript:void(0)\" bs-dropdown=\"userNotLoggedDropdown\"><span>Login</span></a>\n" +
    "                </li>\n" +
    "                \n" +
    "                <!-- User button -->\n" +
    "                <li ng-show=\"showUserButton()\" class=\"pnd-toolbar-user-button\">\n" +
    "                    <a href=\"javascript:void(0)\" bs-dropdown=\"userLoggedInDropdown\"><span>My name</span></a>\n" +
    "                </li>\n" +
    "                \n" +
    "                <!-- Ask the Pundit button-->\n" +
    "                <li ng-class=\"{true: 'pnd-toolbar-ask-button-active', false: 'pnd-toolbar-ask-button-not-active'}[isAskActive()]\" class=\"pnd-toolbar-ask-button\">\n" +
    "                    <a href=\"{{getAskLink()}}\">Ask the Pundit</a>\n" +
    "                </li>\n" +
    "                \n" +
    "                <!-- Dashboard button -->\n" +
    "                <li class=\"pnd-toolbar-dashboard-button\">\n" +
    "                    <a href=\"javascript:void(0)\">\n" +
    "                        <span ng-class=\"{true: 'pnd-toolbar-active-element', false: 'pnd-toolbar-not-active-element'}[isDashboardActive()] \">Dashboard</span>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "\n" +
    "            </ul> <!-- pnd-navbar-left -->\n" +
    "\n" +
    "            <ul class=\"nav navbar-nav navbar-right pnd-toolbar-navbar-right\">\n" +
    "                \n" +
    "                <!-- Template mode button -->\n" +
    "                <li class=\"pnd-toolbar-template-mode-button\">\n" +
    "                    <a href=\"javascript:void(0)\">\n" +
    "                        <span ng-class=\"{true: 'pnd-toolbar-active-element', false: 'pnd-toolbar-not-active-element disabled'}[isTemplateModeActive()]\" class=\"glyphicon glyphicon-pencil\"></span>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                \n" +
    "                <!-- Template menu -->\n" +
    "                <li class=\"pnd-toolbar-template-menu-button\">\n" +
    "                    <a ng-show=\"isTemplateMenuActive()\" href=\"javascript:void(0)\" bs-dropdown=\"userTemplateDropdown\"><span class=\"pnd-toolbar-active-element\">Current template</span></a>\n" +
    "                    <a ng-show=\"!isTemplateMenuActive()\" href=\"javascript:void(0)\" bs-dropdown=\"userNotLoggedDropdown\"><span class=\"pnd-toolbar-not-active-element\">Current template</span></a>\n" +
    "                </li>\n" +
    "                \n" +
    "                <!-- Notebooks menu -->\n" +
    "                <li class=\"pnd-toolbar-notebook-menu-button\">\n" +
    "                    <a ng-show=\"isNotebookMenuActive()\" href=\"javascript:void(0)\" bs-dropdown=\"userNotebooksDropdown\"><span class=\"pnd-toolbar-active-element\">My Notebooks</span></a>\n" +
    "                    <a ng-show=\"!isNotebookMenuActive()\" href=\"javascript:void(0)\" bs-dropdown=\"userNotLoggedDropdown\"><span class=\"pnd-toolbar-not-active-element\">My Notebooks</span></a>\n" +
    "                </li>\n" +
    "                \n" +
    "                <!-- Annotations menu -->\n" +
    "                <li class=\"pnd-toolbar-annotations-button\"><a href=\"javascript:void(0)\"><span class=\"pnd-toolbar-active-element\">Annotations</span></a></li>\n" +
    "\n" +
    "            </ul> <!-- pnd-toolbar-navbar-right -->\n" +
    "    \n" +
    "        </div><!-- pnd-toolbar-navbar-collapse -->\n" +
    "    </div><!-- pnd-toolbar-navbar-container -->\n" +
    "</nav>\n" +
    "\n" +
    "\n" +
    "\n" +
    "              \n" +
    "");
}]);
