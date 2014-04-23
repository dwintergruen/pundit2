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
    "    </div>\n" +
    "\n" +
    "    <!-- panel tools -->\n" +
    "    <div class=\"pnd-dashboard-panel pnd-dashboard-panel-tools\">\n" +
    "        <div class=\"pnd-dashboard-panel-cards\"></div>\n" +
    "        <div class=\"pnd-dashboard-panel-content\">\n" +
    "            <!-- the content comes from outside-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- panel details -->\n" +
    "    <div class=\"pnd-dashboard-panel pnd-dashboard-panel-details\">\n" +
    "        <div class=\"pnd-dashboard-panel-cards\"></div>\n" +
    "        <div class=\"pnd-dashboard-panel-content\">\n" +
    "            <!-- the content comes from outside-->\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <!--separator-->\n" +
    "    <div class=\"pnd-dashboard-separator\"></div>\n" +
    "    <div class=\"pnd-dashboard-separator\"></div>\n" +
    "\n" +
    "    <div class=\"pnd-dashboard-footer\"></div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("src/Toolbar/Toolbar.dir.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/Toolbar/Toolbar.dir.tmpl.html",
    "<nav class=\"navbar navbar-inverse navbar-fixed-top pnd-toolbar-navbar\" role=\"navigation\" ng-controller=\"ToolbarCtrl\">\n" +
    "    <div class=\"container-fluid pnd-toolbar-navbar-container\" >\n" +
    "    \n" +
    "        <div class=\"collapse navbar-collapse\">\n" +
    "            <ul class=\"nav navbar-nav\">\n" +
    "                \n" +
    "                <li><a href=\"#\" bs-dropdown=\"errorMessageDropdown\"><span class=\"glyphicon glyphicon-exclamation-sign\"></span></a></li>\n" +
    "                <li><a href=\"#\" bs-dropdown=\"userNotLoggedDropdown\"><span>Login</span></a></li>\n" +
    "                <li><a href=\"#\" bs-dropdown=\"userLoggedInDropdown\"><span>My name</span></a></li>\n" +
    "                <li><a href=\"#\">Ask the Pundit</a></li>\n" +
    "                <li><a href=\"#\">Dashboard</a></li>\n" +
    "\n" +
    "            </ul> <!-- nav navbar-nav -->\n" +
    "\n" +
    "            <ul class=\"nav navbar-nav navbar-right\">\n" +
    "\n" +
    "                <li><a href=\"#\"><span class=\"glyphicon glyphicon-pencil\"></span></a></li>\n" +
    "\n" +
    "                <li class=\"dropdown\">\n" +
    "                    <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">Current template</a>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li><a href=\"#\">My Template 1</a></li>\n" +
    "                        <li><a href=\"#\">My Template 2</a></li>\n" +
    "                        <li><a href=\"#\">My Template 3</a></li>\n" +
    "                    </ul>\n" +
    "                </li> <!-- end dropdown-->\n" +
    "\n" +
    "                <li class=\"dropdown\">\n" +
    "                    <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">My Notebooks</a>\n" +
    "                    <ul class=\"dropdown-menu\">\n" +
    "                        <li><a href=\"#\">Current Notebooks 1</a></li>\n" +
    "                        <li><a href=\"#\">My Notebooks 1</a></li>\n" +
    "                        <li><a href=\"#\">My Notebooks 2</a></li>\n" +
    "                        <li><a href=\"#\">My Notebooks 3</a></li>\n" +
    "                    </ul>\n" +
    "                </li> <!-- end dropdown-->\n" +
    "\n" +
    "                <li><a href=\"#\">Annotations</a></li>\n" +
    "\n" +
    "            </ul> <!-- nav navbar-right -->\n" +
    "    \n" +
    "        </div><!-- /.navbar-collapse -->\n" +
    "    </div><!-- /.container-fluid -->\n" +
    "</nav>\n" +
    "\n" +
    "\n" +
    "\n" +
    "              \n" +
    "");
}]);
