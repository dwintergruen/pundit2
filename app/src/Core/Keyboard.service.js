/**
Usage example:
Keyboard.registerHandler('ContextualMenu', {
    'autoUnregisterOnComplete': true,
    'stopPropagation': false,
    'keyCode': 27
}, function(eventKey, eventKeyConfig) {
    contextualMenu.hide();
});
*/
angular.module('Pundit2.Core')
.service('Keyboard', function($rootScope, $document, BaseComponent) {
    var keyboard = new BaseComponent('Keyboard');

    var keyHandlers = {};

    keyboard.log("Keyboard init");

    var debugKeyEvent = function(evt) {
        var output = "";
        output += '[' + (evt.altKey ? '(ALT)' : ' alt ') + '] ';
        output += '[' + (evt.ctrlKey ? '(CTRL)' : ' ctrl ') + '] ';
        output += '[' + (evt.shiftKey ? '(SHIFT)' : ' shift ') + '] ';
        output += '[' + evt.keyCode + '] ';
        return output;
    };

    var keyIdentifierFromConfig = function(eventKeyConfig) {
        if (angular.isString(eventKeyConfig)) {
            eventKeyConfig = {
                keyCode: eventKeyConfig
            };
        }

        var errorMessage = 'Invalid eventKeyConfig, it can be a string/number representing keyCode or anobject with following properties: keyCode, altKey(boolean:optional), ctrlKey(boolean:optional), shiftKey(boolean:optional)';

        if (typeof eventKeyConfig.keyCode === 'undefined') {
          keyboard.err(errorMessage);
          return null;
        }

        var result = "";
        result += (eventKeyConfig.altKey ? 'A' : 'a');
        result += (eventKeyConfig.ctrlKey ? 'C' : 'c');
        result += (eventKeyConfig.shiftKey ? 'S' : 's');
        result += eventKeyConfig.keyCode;

        return result;
    };

    var consumeEvent = function(evt) {
        var keyIdentifier = keyIdentifierFromConfig(eventKeyConfig);
        
    }

    $document.on('keypress', function(evt) {
        keyboard.log("keypress - " + debugKeyEvent(evt));
        consumeEvent(evt);
    });

    $document.on('keyup', function(evt) {
        switch (evt.keyCode) {
            case 27:
                keyboard.log("keyup - " + debugKeyEvent(evt));
                consumeEvent(evt);
                break;
            default:
                return;
        }
    });

    keyboard.registerHandler = function(module, eventKeyConfig, callback) {
        var keyIdentifier = keyIdentifierFromConfig(eventKeyConfig);
        if (null === keyIdentifier) {
            return;
        }

        var handlers = keyHandlers[keyIdentifier];
        if (typeof handlers === 'undefined') {
            keyHandlers[keyIdentifier] = handlers = [];
        }

        var handlerObject = {
            'module': module,
            'autoUnregisterOnComplete': (typeof eventKeyConfig.autoUnregisterOnComplete === 'undefined' ? false : eventKeyConfig.autoUnregisterOnComplete),
            'stopPropagation': (typeof eventKeyConfig.stopPropagation === 'undefined' ? false : eventKeyConfig.stopPropagation),
            'callback': callback
        };
        handlers.unshift(handlerObject);

        keyboard.log("keyHandlers");
        keyboard.log(keyHandlers);
    }

    return keyboard;
});