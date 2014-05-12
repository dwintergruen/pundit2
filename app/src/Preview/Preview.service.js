angular.module('Pundit2.Preview')
.constant('PREVIEWDEFAULTS', {
    welcomeHeaderMessage: "Welcome in Pundit 2",
    welcomeBodyMessage: "Enjoy it"
})

.service('Preview', function(BaseComponent, PREVIEWDEFAULTS, NameSpace) {

    var preview = new BaseComponent('Preview', PREVIEWDEFAULTS);
    var state;
    state = {
        itemDashboardPreview: null,
        itemDashboardSticky: null,
        isItemDashboardAnImage: false
        };

    preview.getWelcomeHeaderMessage = function() {
        return preview.options.welcomeHeaderMessage;
    };

    preview.getWelcomeBodyMessage = function() {
        return preview.options.welcomeBodyMessage;
    };

    // show item preview in dashboard panel
    preview.showDashboardPreview = function(item) {
        checkIfItemIsImage(item);
        state.itemDashboardPreview = item;
    };

    // get current item shown in preview
    preview.getItemDashboardPreview = function() {
        return state.itemDashboardPreview;
    };

    // return true if item is an image, false otherwise
    preview.isItemDashboardAnImage = function() {
        return state.isItemDashboardAnImage;
    };

    // set an item as sticky
    preview.setItemDashboardSticky = function(item) {
        state.itemDashboardSticky = item;
    };

    // return current sticky item
    preview.getItemDashboardSticky = function() {
        return state.itemDashboardSticky;
    };

    // reset dashboard preview
    // clear both item dashoboard and sticky item
    // in this way preview panel will be empty and will be shown welcome message
    preview.clearItemDashboardSticky = function() {
        state.itemDashboardSticky = null;
        state.itemDashboardPreview = null;
    };

    // if no item is sticky, show empty preview
    // otherwise show the sticky item
    preview.hideDashboardPreview = function(){

        if(state.itemDashboardSticky === null ) {
            state.itemDashboardPreview = null;
        } else {
            state.itemDashboardPreview = state.itemDashboardSticky;
        }
    };

    // check if item is an image or not
    // return true if is an image, false otherwise
    var checkIfItemIsImage = function(item){

        if(item === null || typeof(item.type) === 'undefined') {
            state.isItemDashboardAnImage = false;
        } else {
            // for each type, check if it is an image-type
            for (var i = 0; i < item.type.length; i++){

                // if item is an image
                if (item.type[i] === NameSpace.types.image || item.type[i] === NameSpace.fragments.imagePart) {
                    state.isItemDashboardAnImage = true;
                }
            }
            // item is not an image
            state.isItemDashboardAnImage = false;
        }
    };

    // return true if an item is the sticky item
    // if no item is given, check if current item preview is the sticky item
    preview.isStickyItem = function(item) {
        var itemToCheck;

        if(typeof(item) !== 'undefined') {
            itemToCheck = item;
        } else {
            itemToCheck = state.itemDashboardPreview;
        }

        if( state.itemDashboardSticky !== null && itemToCheck !== null) {
            return state.itemDashboardSticky.uri === itemToCheck.uri;
        } else {
            return false;
        }

    };

    return preview;
});