angular.module('Pundit2.Preview')
    .service('Preview', function(BaseComponent) {

        // TODO: defaults col welcome message

        var preview = new BaseComponent('Preview');


        // TODO: invece di usare "" usa null che e' fatto apposta ;)
        var itemDashboardPreview = "";
        var itemDashboardSticky = "";

        // show item preview in dashboard panel
        preview.showDashboardPreview = function(item) {
            itemDashboardPreview = item;
        };

        // get current item shown in preview
        preview.getItemDashboardPreview = function() {
            return itemDashboardPreview;
        };

        // set an item as sticky
        preview.setItemDashboardSticky = function(item) {
            itemDashboardSticky = item;
        };

        // return current sticky item
        preview.getItemDashboardSticky = function() {
            return itemDashboardSticky;
        };

        // reset dashboard preview
        // clear both item dashoboard and sticky item
        // in this way preview panel will be empty and will be shown welcome message
        preview.clearItemDashboardSticky = function() {
            itemDashboardSticky = "";
            itemDashboardPreview = "";
        };

        // if no item is sticky, show empty preview
        // otherwise show the sticky item
        preview.hideDashboardPreview = function(){

            if(itemDashboardSticky === '' && typeof(itemDashboardSticky) === 'undefined') {
                itemDashboardPreview = "";
            } else {
                itemDashboardPreview = itemDashboardSticky;
            }
        };

        return preview;
    });