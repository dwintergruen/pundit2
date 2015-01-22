describe('ContextualMenu service', function() {
    
    var ContextualMenu,
        $window,
        $rootScope,
        $animate,
        CONTEXTUALMENUDEFAULTS,
        state,
        $log,
        $document;

    beforeEach(module('Pundit2'));

    beforeEach(module('src/ContextualMenu/dropdown.tmpl.html'));

    beforeEach(function(){
        // used by service to append dropdown anchor
        // if not exist the service cannot pass element to $drodown serive
        // and cause "Cannot read property 'nodeName' of undefined"
        angular.element("body").append("<div data-ng-app='Pundit2'></div>");
    });

    beforeEach(inject(function(_$rootScope_, _$window_, _$animate_, _CONTEXTUALMENUDEFAULTS_,  _ContextualMenu_, _$log_, _$document_){
        $rootScope = _$rootScope_;
        $window = _$window_;
        $log = _$log_;
        $animate = _$animate_;
        ContextualMenu = _ContextualMenu_;
        CONTEXTUALMENUDEFAULTS = _CONTEXTUALMENUDEFAULTS_;
        // reset state
        state = ContextualMenu.getState();
        state.menuElements = [];
        state.content = null;
        ContextualMenu.hide();
        $document = _$document_;
    }));

    afterEach(function(){
        var body = $document.find('body');
        body.find("[data-ng-app='Pundit2']").remove();
        $rootScope.$digest();
    });

    var clickTest = false;

    var typeOneActions = [
        {
            name: 'action1',
            type: ['type1'],
            label: "Action1Label",
            priority: 5,
            showIf: function(resource){
                return resource === 'pippo-resource';
            },
            action: function(){
                
            }
        },
        {
            name: 'action2',
            type: ['type1'],
            label: "Action2Label",
            priority: 3,
            showIf: function(resource){
                return resource === 'pippo-resource';
            },
            action: function(resource){
                if ( resource === 'pippo-resource' ) {
                    clickTest = true;
                }
            }
        },
        {
            name: 'action3',
            type: ['type1'],
            label: "Action3Label",
            priority: 7,
            showIf: function(){
                return false;
            },
            action: function(){
                
            }
        },
        {
            name: 'action4',
            type: ['type1'],
            label: "Action4Label",
            priority: 9,
            showIf: function(resource){
                return resource !== 'pippo-resource';
            },
            action: function(){
                
            }
        }
    ];

    var typeTwoActions = [
        {
            name: 'action5',
            type: ['type2'],
            label: "Action4Label",
            priority: 2,
            showIf: function(){
                return true;
            },
            action: function(){
                
            }
        },
        {
            name: "submenu",
            label: "SubMenu",
            type: ['type2'],
            priority: 999,
            showIf: function(){
                return true;
            },
            hover: function(){

            },
            leave: function(){

            }
        }
    ];

    var addActions = function(one, two){
        if ( one ) {
            for ( var i in typeOneActions ) {
                ContextualMenu.addAction(typeOneActions[i]);
            }
        }
        if ( two ) {
            ContextualMenu.addAction(typeTwoActions[0]);
            ContextualMenu.addSubMenu(typeTwoActions[1]);
        }
    };
    

    iit('should expose expected API', function(){
        expect(ContextualMenu.show).toBeDefined();
        expect(ContextualMenu.hide).toBeDefined();
        expect(ContextualMenu.addAction).toBeDefined();
        expect(ContextualMenu.addSubMenu).toBeDefined();
        expect(ContextualMenu.addDivider).toBeDefined();
        expect(ContextualMenu.modifyDisabled).toBeDefined();
    });

    it('should add Action and not duplicate it', function(){
        expect(ContextualMenu.addAction(typeOneActions[0])).toBe(true);
        expect(ContextualMenu.addAction(typeOneActions[0])).toBe(false);
        expect(state.menuElements.length).toBe(1);
    });

    it('should add Actions and not duplicate it', function(){
        // add type1 actions
        addActions(true, false);
        expect(state.menuElements.length).toBe(typeOneActions.length);
    });

    it('should add subMenu and not duplicate it', function(){
        expect(ContextualMenu.addSubMenu(typeTwoActions[1])).toBe(true);
        expect(ContextualMenu.addSubMenu(typeTwoActions[1])).toBe(false);
        expect(state.menuElements.length).toBe(1);
    });

    it('should correctly build actions content filtered by showIf on passed resource', function(){

        addActions(true, true);

        ContextualMenu.show(10, 10, 'pippo-resource', 'type1');
        // show only 'pippo' action
        expect(state.content.length).toBe(2);
        expect(state.content[0].text).toEqual(typeOneActions[0].label);
        expect(state.content[0].click).toBeDefined();
        expect(state.content[1].text).toEqual(typeOneActions[1].label);
        expect(state.content[0].click).toBeDefined();
    });

    it('should correctly build action and submenu content ordered', function(){

        ContextualMenu.addAction(typeTwoActions[0]);
        ContextualMenu.addSubMenu(typeTwoActions[1]);

        ContextualMenu.show(10, 10, {}, 'type2');

        expect(state.content.length).toBe(2);
        expect(state.content[0].text).toEqual(typeTwoActions[1].label);
        expect(state.content[0].hover).toBeDefined();
        expect(state.content[0].leave).toBeDefined();
        expect(state.content[0].submenu).toBe(true);
        expect(state.content[1].text).toEqual(typeTwoActions[0].label);
        expect(state.content[1].click).toBeDefined();
    });

    it('should correctly build diver content', function(){

        addActions(false, true);

        var divider = { priority: 5, type: ['type2'] };
        ContextualMenu.addDivider(divider);

        ContextualMenu.show(10, 10, {}, 'type2');
        
        expect(state.content[1].divider).toBe(true);
    });

    it('should correctly call action on passed resource', function(){

        ContextualMenu.addAction(typeOneActions[1]);
        ContextualMenu.show(10, 10, 'pippo-resource', 'type1');
        
        expect(state.content.length).toBe(1);
        state.content[0].click();
        expect(clickTest).toBe(true);
    });

    it('should not show without element', function(){
        ContextualMenu.show(10, 10, {}, 'type99');
        expect($log.error.logs.length).toBe(1);
        $log.reset();
    });

    it('should not show without resource', function(){
        ContextualMenu.addSubMenu(typeTwoActions[1]);
        ContextualMenu.show(10, 10, undefined, 'type99');
        expect($log.error.logs.length).toBe(1);
        $log.reset();
    });

    it('should not show without content', function(){
        ContextualMenu.addSubMenu(typeTwoActions[1]);
        ContextualMenu.show(10, 10, {}, 'type99');
        expect($log.error.logs.length).toBe(1); 
        $log.reset();
    });

    it('should corectly disable and enable items', function(){
        // add type1 actions
        addActions(true, false);

        var result = ContextualMenu.modifyDisabled('action2', true);
        expect(result).toBe(true);
        expect(state.menuElements[1].disable).toBe(true);
        
        result = ContextualMenu.modifyDisabled('action2', false);
        expect(result).toBe(true);
        expect(state.menuElements[1].disable).toBe(false);
    });

    it('should correctly position menu to place inside window', function(){
        var element = {
            outerWidth: function(){
                return 250;
            },
            outerHeight: function(){
                return 340;
            }
        };

        var w = angular.element($window);
        expect(ContextualMenu.position(element, 55, 55)).toBe(CONTEXTUALMENUDEFAULTS.position);
        expect(ContextualMenu.position(element, w.innerWidth() - 10, 55)).toBe('bottom-right');
        expect(ContextualMenu.position(element, 55, w.innerHeight() - 10)).toBe('top-left');
        expect(ContextualMenu.position(element, w.innerWidth() - 10, w.innerHeight() - 10)).toBe('top-right');

    });


});