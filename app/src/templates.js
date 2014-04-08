angular.module('templates-main', ['src/AnnomaticModule/annotation-popover.tmpl.html']);

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
