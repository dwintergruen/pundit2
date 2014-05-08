angular.module('Pundit2.ItemPreview')
.service('ItemPreview', function(BaseComponent) {

        var preview = new BaseComponent('ItemPreview');

        var itemDashboardPreview = "";

        preview.setDashboardPreview = function(item){
            itemDashboardPreview = item;
        };

        preview.getDashboardPreview = function(){
            return itemDashboardPreview;
        };

        return preview;
    });