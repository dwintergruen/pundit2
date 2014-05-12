describe('ContextualMenu service', function() {
    
    var ContextualMenu,
        $window,
        CONTEXTUALMENUDEFAULTS;

    beforeEach(module('Pundit2'));

    beforeEach(module('src/Toolbar/dropdown.tmpl.html'));

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
            priority: 1,
            showIf: function(){
                return true;
            },
            action: function(){
                
            }            
        },
        {
            name: 'action2',
            type: ['type1'],
            label: "Action2Label",
            priority: 99,
            showIf: function(){
                return true;
            },
            action: function(){
                
            }            
        },
        {
            name: 'action3',
            type: ['type1'],
            label: "Action2Label",
            priority: 100,
            showIf: function(){
                return false;
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

    it('should add Actions as expected', function(){

        expect(ContextualMenu.addAction(typeOneActions[0])).toBe(true);
        expect(ContextualMenu.addAction(typeOneActions[1])).toBe(true);
        // not duplicate action
        expect(ContextualMenu.addAction(typeOneActions[0])).toBe(false);

    });

    it('should add subMenu as expected', function(){

        expect(ContextualMenu.addSubMenu(typeTwoActions[1])).toBe(true);
        // not duplicate submenu
        expect(ContextualMenu.addSubMenu(typeTwoActions[1])).toBe(false);
        
    });

    it('should show', function(){

        addActions(true, true);

        ContextualMenu.show(10, 10, {name:'pippo'}, 'type1');

    });

    // TODO: addDivider? position()? show()? hide()? Hai testato che il sort funzioni a modo?
    // i tuoi oggetti type*Actions sono gia' ordinati :P
    // + il click su una voce di menu deve chiamare la action registrata
    // Altro?

});