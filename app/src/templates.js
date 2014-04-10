angular.module('templates-main', ['src/AnnomaticModule/annomatic-panel.dir.tmpl.html', 'src/AnnomaticModule/annotation-popover.tmpl.html']);

angular.module("src/AnnomaticModule/annomatic-panel.dir.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/AnnomaticModule/annomatic-panel.dir.tmpl.html",
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

angular.module("src/AnnomaticModule/annotation-popover.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/AnnomaticModule/annotation-popover.tmpl.html",
    "<div class=\"popover\" ng-controller=\"AnnotationPopoverCtrl\">\n" +
    "    <div class=\"arrow\"></div>\n" +
    "    <div class=\"popover-content\">\n" +
    "        ({{content}}: {{ann.byNum[num].state}}//{{ann.byNum[num].lastState}}) {{ann.byNum[num].title}} ( {{ann.byNum[num].id}} )<br>\n" +
    "        <div>\n" +
    "            <button class=\"btn btn-sm btn-info\" ng-click=\"setPreview(content)\">Preview</button>\n" +
    "            <button class=\"btn btn-sm btn-success\" ng-click=\"setOk(content)\">Accept</button>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <button class=\"btn btn-sm btn-danger bs-checkbox\" ng-click=\"setKo(content)\">Remove</button>\n" +
    "            <button class=\"btn btn-sm btn-warning bs-checkbox\" ng-click=\"goNext(content)\">Next</button>\n" +
    "        </div>\n" +
    "        \n" +
    "        <div ng-show=\"instances > 1\">\n" +
    "            <button class=\"btn btn-head\" \n" +
    "                ng-click=\"acceptAll(content)\"\n" +
    "                ng-mouseover=\"toggleSimilar(content)\" \n" +
    "                ng-mouseout=\"toggleSimilar(content)\">accept all {{instances}}</button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
