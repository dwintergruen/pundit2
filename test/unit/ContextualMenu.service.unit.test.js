describe('ContextualMenu service', function() {
    
    var ContextualMenu,
        $window;

    var maxError = 1;
    
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
            action: function(resource){
                
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
            action: function(resource){
                
            }            
        },
        {
            name: 'action3',
            type: ['type1'],
            label: "Action2Label",
            priority: 100,
            showIf: function(resource){
                return false;
            },
            action: function(resource){
                
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
            action: function(resource){
                
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

    it('should build one type content as expected', function(){

        addActions(true, true);

        var content = ContextualMenu.buildContent(['type1']);

        // discard if showIf is false
        expect(content.length).toBe(typeOneActions.length-1);
        // build ordered
        expect(content[0].text).toBe(typeOneActions[1].label);
        expect(content[1].text).toBe(typeOneActions[0].label);

    });

    it('should build two types content as expected', function(){

        addActions(true, true);

        var content = ContextualMenu.buildContent(['type1', 'type2']);

        expect(content.length).toBe(typeOneActions.length-1+typeTwoActions.length);
        
        expect(content[0].submenu).toBe(true);

    });

    // TODO: addDivider? position()? show()? hide()? Hai testato che il sort funzioni a modo?
    // i tuoi oggetti type*Actions sono gia' ordinati :P
    // + il click su una voce di menu deve chiamare la action registrata
    // Altro?

});