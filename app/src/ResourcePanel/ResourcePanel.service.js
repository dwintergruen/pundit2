angular.module('Pundit2.ResourcePanel')
.constant('RESOURCEPANELDEFAULTS', {

})
.service('ResourcePanel', function(BaseComponent, RESOURCEPANELDEFAULTS, NameSpace) {
    var resourcePanel = new BaseComponent('ResourcePanel', PREVIEWDEFAULTS);

    return resourcePanel;
});