ddescribe('ContextualMenu service', function() {
    
    var ContextualMenu,
        $window,
        CONTEXTUALMENUDEFAULTS;

    beforeEach(module('Pundit2'));

    beforeEach(module('src/Toolbar/dropdown.tmpl.html'));

    beforeEach(function(){
        // used by service to append dropdown anchor
        // if not exist the service cannot pass element to $drodown serive
        // and cause "Cannot read property 'nodeName' of undefined"
        angular.element("body").append("<div data-ng-app='Pundit2'></div>");
    });    

    beforeEach(inject(function(_$window_, _CONTEXTUALMENUDEFAULTS_,  _ContextualMenu_){
        $window = _$window_;
        ContextualMenu = _ContextualMenu_;
        CONTEXTUALMENUDEFAULTS = _CONTEXTUALMENUDEFAULTS_;
    }));

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
            action: function(){
                
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
            name: 'action4',
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
    

    it('should expose expected API', function(){

        expect(ContextualMenu.show).toBeDefined();
        expect(ContextualMenu.hide).toBeDefined();
        expect(ContextualMenu.addAction).toBeDefined();
        expect(ContextualMenu.addSubMenu).toBeDefined();
        expect(ContextualMenu.addDivider).toBeDefined();

    });

    it('should add Action and not duplicate it', function(){

        expect(ContextualMenu.addAction(typeOneActions[0])).toBe(true);
        expect(ContextualMenu.addAction(typeOneActions[0])).toBe(false);

    });

    it('should add Actions and not duplicate it', function(){

        var state = ContextualMenu.getState();

        expect(state.menuElements.length).toBe(0);
        // add type1 actions
        addActions(true, false);
        expect(state.menuElements.length).toBe(typeOneActions.length);

    });

    it('should add subMenu and not duplicate it', function(){

        expect(ContextualMenu.addSubMenu(typeTwoActions[1])).toBe(true);
        expect(ContextualMenu.addSubMenu(typeTwoActions[1])).toBe(false);
        
    });

    it('should correctly build content', function(){

        var state = ContextualMenu.getState();

        addActions(true, true);

        ContextualMenu.show(10, 10, 'pippo-resource', 'type1');
        // show only 'pippo' action
        expect(state.content.length).toBe(2);
        expect(state.content[0].text).toEquals(typeOneActions[0].label);
        expect(state.content[1].text).toEquals(typeOneActions[1].label);

    });

    // TODO: addDivider? position()? show()? hide()? Hai testato che il sort funzioni a modo?
    // i tuoi oggetti type*Actions sono gia' ordinati :P
    // + il click su una voce di menu deve chiamare la action registrata
    // Altro?

});