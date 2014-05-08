angular.module('Pundit2.Preview')
.service('Preview', function(BaseComponent) {

        var preview = new BaseComponent('Preview');

        var itemDashboardPreview = "";
        var itemDashboardSticky = "";

        preview.setDashboardPreview = function(item){
            itemDashboardPreview = item;
        };

        preview.getDashboardPreview = function(){
            return itemDashboardPreview;
        };

        preview.setItemDashboardSticky = function(item){
            itemDashboardSticky = item;
        };

        preview.getItemDashboardSticky = function(item){
            return itemDashboardSticky;
        };

        preview.clearItemDashboardSticky = function(item){
            itemDashboardSticky = "";
            itemDashboardPreview = "";
        };

        preview.hideDashboardPreview = function(){

            if(itemDashboardSticky === '' && typeof(itemDashboardSticky) === 'undefined') {
                itemDashboardPreview = "";
            } else {
                itemDashboardPreview = itemDashboardSticky;
            }

        };

        return preview;
    });