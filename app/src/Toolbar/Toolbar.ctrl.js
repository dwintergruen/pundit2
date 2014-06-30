angular.module('Pundit2.Toolbar')
.controller('ToolbarCtrl', function($scope, $rootScope, $modal, Toolbar,
    MyPundit, Dashboard, AnnotationSidebar, ResourcePanel, NotebookExchange, NotebookCommunication) {

    $scope.dropdownTemplate = "src/ContextualMenu/dropdown.tmpl.html";
    $scope.dropdownTemplateMyNotebook = "src/Toolbar/myNotebooksDropdown.tmpl.html";
    
    var login = function() {
        ResourcePanel.hide();
        MyPundit.login();
    };
    
    var logout = function() {
        ResourcePanel.hide();
        MyPundit.logout();
    };

    // confirm modal
    var infoModalScope = $rootScope.$new(),
        sendModalScope = $rootScope.$new();

    infoModalScope.titleMessage = "About Pundit";
    infoModalScope.info = [
        "Pundit Version 2.X.XXX-2014-06-25:18:25",
        "Annotation server URL: http://as.thepund.it",
        "Korbo basket: http://url.com",
        "Providers: Freebase, DBPedia",
        "Predicates vocabularies: http://url1.com, http://url2.com, http://url3.com",
        "Contact the Pundit team pundit@netseven.it",
        "License: http://url3.com",
        "Developed by Net7 Srl",
        "Credits"
    ];

    sendModalScope.titleMessage = "Found a bug? tell us!";
    sendModalScope.text = {msg: "", subject: ""};

    var sendMail = function(subject, body) {
        var link = "mailto:donatigiacomo91@gmail.com"
                + "?cc="
                 + "&subject=" + escape(subject)
                 + "&body=" + escape(body);

        window.location.href = link;
    }

    sendModalScope.send = function() {
        // send a mail
        sendMail(sendModalScope.text.subject, sendModalScope.text.msg)
        sendModal.hide();
    };

    // found bug btn
    var removeWatch;
    infoModalScope.send = function() {
        // open a second modal to report a bug
        sendModal.$promise.then(function(){

            sendModal.show();
            
            var sendBtn = angular.element('.pnd-send-modal-send');
            $scope.$watch(function() {
                return sendModalScope.text.subject;
            }, function(text) {
                if (text.length > 0) {
                    sendBtn.removeClass('disabled');
                } else {
                    sendBtn.addClass('disabled');
                }
            }, true);

        });
    };

    // close btn
    infoModalScope.close = function() {
        infoModal.hide();
    };

    var infoModal = $modal({
        container: "[data-ng-app='Pundit2']",
        template: 'src/Core/info.modal.tmpl.html',
        show: false,
        backdrop: 'static',
        scope: infoModalScope
    });

    var sendModal = $modal({
        container: "[data-ng-app='Pundit2']",
        template: 'src/Core/send.modal.tmpl.html',
        show: false,
        backdrop: 'static',
        scope: sendModalScope
    });

    // open info modal
    var showInfo = function() {
        infoModal.$promise.then(infoModal.show);
    };
    
    $scope.errorMessageDropdown = Toolbar.getErrorMessageDropdown();

    $scope.userNotLoggedDropdown = [
        { text: 'Please sign in to use Pundit', header: true },
        { text: 'Sign in', click: login }
    ];

    $scope.infoDropdown = [
        { text: 'About Pundit', click: showInfo }
    ];
    
    $scope.userLoggedInDropdown = [
        { text: 'Log out', click: logout }
    ];
    
    $scope.userTemplateDropdown = [
        { text: 'My template 1', href: '#' },
        { text: 'My template 2', href: '#' },
        { text: 'My template 3', href: '#' }
    ];

    var myNotebooks;

    // TODO add a function on click that add this watcher
    // when drodown is showed and remove when dropdown is closed
    $scope.$watch(function() {
        return NotebookExchange.getMyNotebooks();
    }, function(ns) {
        // update all notebooks array and display new notebook
        myNotebooks = ns;
        updateMyNotebooks();
    }, true);

    $scope.$watch(function() {
        return NotebookExchange.getCurrentNotebooks();
    }, function(newCurr) {
        if (typeof(newCurr) !== "undefined") {
            updateMyNotebooks();
        }
    });
    
    $scope.userData = {};
    $scope.userNotebooksDropdown = [{text: 'Please select notebook you want to use', header: true }];

    var updateMyNotebooks = function(){
        var notebooks = myNotebooks;
        var j = 1;
        for (var i = 0; i<notebooks.length; i++){
            $scope.userNotebooksDropdown[j] = {
                text: notebooks[i].label,
                currentNotebook: function(){
                    var current = NotebookExchange.getCurrentNotebooks();
                    if (typeof(current)!== "undefined" && notebooks[i].id === current.id) {
                        return true;
                    } else {
                        return false;
                    }                    
                }(),
                visibility: notebooks[i].visibility,
                click: function(_i){
                    return function(){
                        NotebookCommunication.setCurrent(notebooks[_i].id);
                    };
                }(i)
            }
            j++;
        }
    };

    // listener for user status
    // when user is logged in, set flag isUserLogged to true
    $scope.$watch(function() { return MyPundit.isUserLogged(); }, function(newStatus) {
        $scope.isUserLogged = newStatus;
        $scope.userData = MyPundit.getUserData();
    });

    // return true if no errors are occured --> status button ok must be visible
    $scope.showStatusButtonOk = function() {
        return !Toolbar.getErrorShown() && !Toolbar.isLoading();
    };
    
    // return true if an error is occured --> status button error must be visible
    $scope.showStatusButtonError = function() {
        return Toolbar.getErrorShown();
    };

    $scope.showStatusButtonLoading = function() {
        return Toolbar.isLoading() && !Toolbar.getErrorShown();
    };

    // return true if user is not logged in --> login button must be visible
    $scope.showLogin = function() {
        return $scope.isUserLogged === false;
    };
    
    // return true if user is logged in --> user button must be visible
    $scope.showUserButton = function() {
        return $scope.isUserLogged === true;
    };

    // return true if user is logged in --> dashboard button is active
    $scope.isDashboardActive = function() {
        return $scope.isUserLogged === true;
    };
    
    // return true if user is logged in --> get user ask link
    // return false if user is not logged in --> get default ask link
    $scope.isAskActive = function() {
        return $scope.isUserLogged === true;
    };
    
    // return true if user is logged in --> template button is active
    $scope.isTemplateModeActive = function() {
        //return $scope.isUserLogged === true;
        return false;
    };
    
    // return true if user is logged in --> template menu is active
    $scope.isTemplateMenuActive = function() {
        //return $scope.isUserLogged === true;
        return false;
    };
    
    // return true if user is logged in --> notebook menu is active
    $scope.isNotebookMenuActive = function() {
        return $scope.isUserLogged === true;
    };

    // get Ask the Pundit link
    $scope.getAskLink = function() {
        return Toolbar.getAskLink();
    };

    $scope.dashboardClickHandler = function() {
        ResourcePanel.hide();
        Dashboard.toggle();
    };

    $scope.annotationsClickHandler = function() {
        ResourcePanel.hide();
        AnnotationSidebar.toggle();
    };

});