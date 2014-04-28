angular.module('Pundit2.Dashboard')
.controller('DashboardCtrl', function($document, $window, $scope, Dashboard) {

    var jqElement = {

        // dashboard container
        container : angular.element('.pnd-dashboard-container'),

        // dashboard footer
        footer : angular.element('.pnd-dashboard-footer'),

        //dashboard separtors
        firstSeparator : angular.element('.pnd-dashboard-separator-1'),
        secondSeparator : angular.element('.pnd-dashboard-separator-2'),

        // panels
        panelLists : angular.element('.pnd-dashboard-panel-lists'),
        panelTools : angular.element('.pnd-dashboard-panel-tools'),
        panelDetails : angular.element('.pnd-dashboard-panel-details')

    };

    angular.element($window).resize(function(){
        Dashboard.setContainerWidth(angular.element($window).width());
    });

    var footerMouseUpHandler = function() {
        // remove handlers
        $document.off('mousemove', footerMouseMoveHandler);
        $document.off('mouseup', footerMouseUpHandler);

        Dashboard.log('Footer mouseup: removing handlers');
    }

    var footerMouseMoveHandler = function(event) {
        var h = event.pageY - jqElement.container.offset().top;
        Dashboard.setContainerHeight(h);
    }

    $scope.footerMouseDownHandler = function(event) {
        if ( event.which === 1 ) {
            event.preventDefault();        
            $document.on('mouseup', footerMouseUpHandler);
            $document.on('mousemove', footerMouseMoveHandler);

            Dashboard.log('Footer mousedown: adding drag/drop handlers');
        }
    };

    $scope.$watch(function() {
        return Dashboard.getContainerHeight();
    }, function(newHeight, oldHeight) {
        jqElement.container.css({
            'height' : newHeight
        });
        jqElement.firstSeparator.css({
            'height' : newHeight - Dashboard.getFooterHeight()
        });
        jqElement.secondSeparator.css({
            'height' : newHeight - Dashboard.getFooterHeight()
        });
    });

    $scope.$watch(function() {
        return Dashboard.getContainerWidth();
    }, function(newWidth, oldWidth) {
        jqElement.container.css({
            'width' : parseInt(newWidth, 10)
        });
    });

    $scope.$watch(function() {
        return Dashboard.getListsPanelWidth();
    }, function(newWidth, oldWidth) {
        jqElement.panelLists.css({
            'width' : newWidth
        });
        jqElement.firstSeparator.css({
            'left' : newWidth
        });
    });

    $scope.$watch(function() {
        return Dashboard.getToolsPanelWidth();
    }, function(newWidth, oldWidth) {
        jqElement.panelTools.css({
            'width' : newWidth,
            'left' : Dashboard.getListsPanelWidth() + Dashboard.getSeparatorWidth()
        });
    });

    $scope.$watch(function() {
        return Dashboard.getDetailsPanelWidth();
    }, function(newWidth, oldWidth) {
        var left = Dashboard.getListsPanelWidth() + Dashboard.getToolsPanelWidth() + (Dashboard.getSeparatorWidth()*2);
        jqElement.panelDetails.css({
            'width' : newWidth,
            'left' : left
        });
        jqElement.secondSeparator.css({
            'left' : left - Dashboard.getSeparatorWidth()
        });
    });

    $scope.$watch(function() {
        return Dashboard.isDashboardVisible();
    }, function(newVis, oldVis) {
        if ( newVis ){
            angular.element('.pnd-dashboard-container').show();
        } else {
            angular.element('.pnd-dashboard-container').hide();
        }
    });


    var firstSeparatorMouseUpHandler = function(){
        $document.off('mousemove', firstSeparatorMouseMoveHandler);
        $document.off('mouseup', firstSeparatorMouseUpHandler);

        Dashboard.log('mouseup first separator');
    };

    var initX, listsInitWidth, toolsInitWidth;
    var firstSeparatorMouseMoveHandler = function(){
        var d = (initX - event.pageX),
            lw = listsInitWidth - d,
            tw = toolsInitWidth + d;
        
        Dashboard.setListPanelWidth(lw);
        Dashboard.setToolsPanelWidth(tw);
    };

    $scope.firstSeparatorMouseDownHandler = function(event){
        if ( event.which === 1 ) {
            event.preventDefault();        
            $document.on('mouseup', firstSeparatorMouseUpHandler);
            $document.on('mousemove', firstSeparatorMouseMoveHandler);

            initX = event.pageX;
            listsInitWidth = Dashboard.getListsPanelWidth();
            toolsInitWidth = Dashboard.getToolsPanelWidth();

            Dashboard.log('First Separator mousedown: adding drag/drop handlers');
        }
    };

    var secondSeparatorMouseUpHandler = function(){
        $document.off('mousemove', secondSeparatorMouseMoveHandler);
        $document.off('mouseup', secondSeparatorMouseUpHandler);

        Dashboard.log('mouseup second separator');
    };

    var initX, toolsInitWidth, detailsInitWidth;
    var secondSeparatorMouseMoveHandler = function(){
        var d = (initX - event.pageX),
            dw = detailsInitWidth + d,
            tw = toolsInitWidth - d;
        
        Dashboard.setToolsPanelWidth(tw);
        Dashboard.setDetailsPanelWidth(dw);
    };

    $scope.secondSeparatorMouseDownHandler = function(event){
        if ( event.which === 1 ) {
            event.preventDefault();        
            $document.on('mouseup', secondSeparatorMouseUpHandler);
            $document.on('mousemove', secondSeparatorMouseMoveHandler);

            initX = event.pageX;
            detailsInitWidth = Dashboard.getDetailsPanelWidth();
            toolsInitWidth = Dashboard.getToolsPanelWidth();

            Dashboard.log('Second Separator mousedown: adding drag/drop handlers');
        }
    };

});