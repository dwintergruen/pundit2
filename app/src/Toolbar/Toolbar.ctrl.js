angular.module('Pundit2.Toolbar')
.controller('ToolbarCtrl', function($scope, $rootScope, $modal, $http, NameSpace, Config, Toolbar, SelectorsManager, Fp3,
    MyPundit, Dashboard, TripleComposer, AnnotationSidebar, ResourcePanel, NotebookExchange, NotebookCommunication, TemplatesExchange) {

    $scope.dropdownTemplate = "src/ContextualMenu/dropdown.tmpl.html";
    $scope.dropdownTemplateMyNotebook = "src/Toolbar/myNotebooksDropdown.tmpl.html";
    $scope.dropdownTemplateTemplates = "src/Toolbar/templatesDropdown.tmpl.html";
    
    $scope.login = function() {
        ResourcePanel.hide();
        MyPundit.login();
    };


    
    var logout = function() {
        ResourcePanel.hide();
        MyPundit.logout();
    };

    // modal
    var infoModalScope = $rootScope.$new(),
        sendModalScope = $rootScope.$new();

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

    infoModalScope.titleMessage = "About Pundit";
    infoModalScope.info = [
        {label: "Pundit Version: ", value: PUNDITVERSION.version},
        {label: "Annotation server URL: ", value: NameSpace.as},
        {label: "Korbo basket: ", value: "-"}, // is always defined? read from korbo selector instance? if i have more than one instance}?
        {label: "Contact the Pundit team:", value: "punditdev@netseven.it"},
        {label: "License: ", value: "http://url3.com"},
        {label: "Developed by: ", value: " Net7 Srl"},
        {label: "Credits: ", value: "-"}
    ];

    infoModalScope.links = [];
    if (Config.confURL !== 'local') {
        infoModalScope.links.push({
            label: 'Configuration file',
            ref: Config.confURL
        });
    }

    if (Config.vocabularies.length > 0) {
        infoModalScope.info.push({label: "Predicates vocabularies: ", value: Config.vocabularies.toString()});
    } else if (Config.useBasicRelations) {
        infoModalScope.info.push({label: "Predicates vocabularies: ", value: "Pundit default basic relations"});   
    }

    var str = "", providers = SelectorsManager.getActiveSelectors();
    for (var p in providers) {
        str += " "+providers[p].config.label;
    }
    infoModalScope.info.push({label: "Providers:", value: str});

    sendModalScope.titleMessage = "Found a bug? tell us!";
    sendModalScope.text = {msg: "", subject: ""};

    var sendMail = function(subject, body) {
        var user = MyPundit.getUserData();
        var link = "mailto:punditbug@netseven.it"
            + "?cc="
            + "&subject=" + escape(subject)
            + "&body=" + escape(body)
            + "%0A%0A" + "Pundit Version: "+ PUNDITVERSION.version
            + "%0A%0A" + "Configuration file: "+ Config.confURL
            + "%0A" + "Broswer info: " + window.navigator.userAgent
            + "%0A%0A" + "User openid: " + user.openid
            + "%0A" + "User uri: " + user.uri
            + "%0A" + "User name: " + user.fullName
            + "%0A" + "User mail: " + user.email;

        window.location.href = link;
    };

    sendModalScope.send = function() {
        // send a mail
        sendMail(sendModalScope.text.subject, sendModalScope.text.msg)
        sendModal.hide();
    };

    sendModalScope.cancel = function() {
        sendModal.hide();
    };

    // found bug btn
    var removeWatch;
    infoModalScope.send = function() {
        // open a second modal to report a bug
        sendModal.$promise.then(function(){

            sendModalScope.text.msg = "";
            sendModalScope.text.subject = "";
            sendModal.show();
            
            var sendBtn = angular.element('.pnd-send-modal-send');
            $scope.$watch(function() {
                return sendModalScope.text.subject;
            }, function(text) {
                if (text.length > 2) {
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

    // open info modal
    var showInfo = function() {
        infoModal.$promise.then(infoModal.show);
    };

    // open bug modal
    var showBug = function() {
        infoModalScope.send();
    };
    
    $scope.errorMessageDropdown = Toolbar.getErrorMessageDropdown();

    $scope.userNotLoggedDropdown = [
        { text: 'Please sign in to use Pundit', header: true },
        { text: 'Sign in', click: $scope.login }
    ];

    $scope.infoDropdown = [
        { text: 'About Pundit', click: showInfo },
        { text: 'Report a bug', click: showBug },
    ];
    if (Fp3.options.active) {
        $scope.infoDropdown.push({ text: Fp3.options.label, click: Fp3.post });
    }
    
    $scope.userLoggedInDropdown = [
        { text: 'Log out', click: logout }
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

    $scope.currentNotebookLabel = "Loading...";
    $scope.$watch(function() {
        return NotebookExchange.getCurrentNotebooks();
    }, function(newCurr) {
        if (typeof(newCurr) !== "undefined") {
            updateMyNotebooks();
            $scope.currentNotebookLabel = newCurr.label;
        }
    });
    
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

    // check configuration object to see if templates are enabled
    $scope.useTemplates = Config.useTemplates;

    // configured templates are empty then we remove the relative buttons
    if (Config.templates.length === 0) {
        $scope.useTemplates = false;
    }

    if ($scope.useTemplates) {

        $scope.userTemplateDropdown = [{text: 'Select the template you wish to use', header: true }];
        $scope.currentTemplateLabel = "Loading...";

        $scope.$watch(function() {
            return TemplatesExchange.getTemplates().length;
        }, function() {
            updateTemplates();
        });

        $scope.$watch(function() {
            return TemplatesExchange.getCurrent();
        }, function(newCurr) {
            if (typeof(newCurr) !== "undefined") {
                updateTemplates();
                $scope.currentTemplateLabel = newCurr.label;
                $scope.currentTemplateColor = newCurr.color;
            }
        });

        // TODO if the template mode can change only by click on the toolbar btn
        // remove this watch and do this action inside the toggleTemplateMode function
        var templateModeSpan = angular.element('.pnd-toolbar-template-mode-button span'),
            templateSwitchSpan = angular.element('.pnd-toolbar-template-menu-button span');
        $scope.$watch(function() {
            return Toolbar.isActiveTemplateMode();
        }, function(val) {
            if (val) {
                templateModeSpan.removeClass('pnd-toolbar-not-active-element');
                templateSwitchSpan.removeClass('pnd-toolbar-not-active-element');
            } else {
                templateModeSpan.addClass('pnd-toolbar-not-active-element');
                templateSwitchSpan.addClass('pnd-toolbar-not-active-element');
            }
        });
        
        var updateTemplates = function(){
            var templates = TemplatesExchange.getTemplates();
            var j = 1;
            for (var i = 0; i<templates.length; i++){
                $scope.userTemplateDropdown[j] = {
                    text: templates[i].label,
                    color: templates[i].color,
                    currentTemplate: function(){
                        var current = TemplatesExchange.getCurrent();
                        if (typeof(current)!== "undefined" && templates[i].id === current.id) {
                            return true;
                        } else {
                            return false;
                        }                    
                    }(),
                    click: function(_i){
                        return function(){
                            TemplatesExchange.setCurrent(templates[_i].id);
                            if (Toolbar.isActiveTemplateMode()) {
                                TripleComposer.showCurrentTemplate();
                                // disable save btn
                                angular.element('.pnd-triplecomposer-save').addClass('disabled');
                            }
                        };
                    }(i)
                }
                j++;
            }
        };

    } // end-if-use-templates

    $scope.userData = {};
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

    $scope.toggleTemplateMode = function() {
        ResourcePanel.hide();
        Toolbar.toggleTemplateMode();
    };

    $scope.onClickTemplateDropdown = function() {
        ResourcePanel.hide();
    };
    
    // return true if user is logged in --> template menu is active
    $scope.isTemplateMenuActive = function() {
        return $scope.isUserLogged === true;
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