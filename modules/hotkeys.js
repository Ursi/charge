const handler = {
    setPrototypeOf(targ, proto) {

    }
}
const up = {};
const down = {};
const hotkeys = Object.create(new Proxy({}, {
    get(targ, prop, rec) {
        if (down.hasOwnProperty(prop)) {
            return down[prop];
        } else if (up.hasOwnProperty(prop)) {
            return up[prop];
        }
    },
}));

Object.defineProperties(hotkeys, {
    actionToEvent: {
        value: function(action) {
            switch (action) {
                case 'down':
                    return 'keydown';
                case 'up':
                    return 'keyup';
            }
        },
    },
    active: {
        value: true,
        writable: true,
    },
    add: {
        value: function(hotkey, func, options = {}) {
            options = Object.assign({
                active: true,
                context: ()=> true,
                defaultPrevented: true,
                action: 'down',
                scope: window,
            }, options)

            hotkey = String(hotkey);
            let {action, scope, context} = options;
            if (hotkey.length === 1 || this.specialKeys.includes(hotkey)) {
                if (this.listeners.findIndex(l => l.elem == scope && l.event == this.actionToEvent(action)) < 0) {
                    this.listeners.add(scope, action);
                }
            }
            //experiementing
            Object.defineProperty(options, 'action', {value: action, enumerable: true});
            /*Object.defineProperties(options, {
                actions: {
                    value: action,
                    enumerable: true,
                },
                context: {
                    get: options.context(),
                    enumerable: true,
                },
            });*/


            options.func = func;
            this[action][hotkey] = options;
            return options;
        },
    },
    addWith: {
        value: function(options, ...hotkeyList) {
            for (let hotkey of hotkeyList) {
                if (hotkey[2]) {
                    Object.assign(hotkey[2], options);
                } else {
                    hotkey[2] = options;
                }

                this.add.apply(this, hotkey);
            }
        },
    },
    down: {
        value: down,
    },
    listeners: {
        value: (()=>{
            return Object.assign([], {
                add(elem, action) {
                    function listener(e) {
                        if (hotkeys.active) {
                            let hotkey = hotkeys[action][e.code];
                            if (!hotkey) hotkey = hotkeys[action][e.key];
                            if (
                                hotkey &&
                                hotkey.active &&
                                hotkey.context()
                            ) {
                                if (hotkey.defaultPrevented) e.preventDefault();
                                hotkey.func(e);
                            }
                        }
                    }

                    let event = hotkeys.actionToEvent(action);
                    elem.addEventListener(event, listener);
                    this.push({
                        elem: elem,
                        event: event,
                        listener: listener,
                    })
                },
            });
        })(),
    },
    remove: {
        value: function(hkName, action = 'down') {
            try {
                let hotkey = this[action][hkName];
                if (Object.keys(this[action]).length === 1) {
                    let event = this.actionToEvent(action);
                    hotkey.scope.removeEventListener(event, this.listeners.find(l =>
                        l.elem == hotkey.scope &&
                        l.event == event
                    ).listener)
                }

                delete this[action][hkName]
            } catch(error) {
                console.error(error);
            }
        }
    },
    specialKeys: {
        value: [
            'Alt',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'AudioVolumeDown',
            'AudioVolumeMute',
            'AudioVolumeUp',
            'Backspace',
            'CapsLock',
            'Clear',
            'ContextMenu',
            'Control',
            'Delete',
            'End',
            'Enter',
            'Escape',
            'F1',
            'F2',
            'F3',
            'F4',
            'F5',
            'F6',
            'F7',
            'F8',
            'F9',
            'F10',
            'F11',
            'F12',
            'Home',
            'Insert',
            'MediaPlayPause',
            'MediaTrackPrevious',
            'NumLock',
            'PageDown',
            'PageUp',
            'Pause',
            'ScrollLock',
            'Shift',
            'Tab',
        ]
    },
    up: {
        value: up,
    },
});

export default hotkeys;

/*
let firefox = [
    ['AltLeft', 'Alt'],
    ['AltRight', 'Alt'],
    ['ArrowDown', 'ArrowDown'],
    ['ArrowLeft', 'ArrowLeft'],
    ['ArrowRight', 'ArrowRight'],
    ['ArrowUp', 'ArrowUp'],
    ['Backquote', '`'],
    ['Backquote', '~'],
    ['Backslash', '\\'],
    ['Backslash', '|'],
    ['Backspace', 'Backspace'],
    ['BracketLeft', '['],
    ['BracketLeft', '{'],
    ['BracketRight', ']'],
    ['BracketRight', '}'],
    ['CapsLock', 'CapsLock'],
    ['Comma', ','],
    ['Comma', '<'],
    ['ContextMenu', 'ContextMenu'],
    ['ControlLeft', 'Control'],
    ['ControlRight', 'Control'],
    ['Delete', 'Delete'],
    ['Digit0', ')'],
    ['Digit0', '0'],
    ['Digit1', '!'],
    ['Digit1', '1'],
    ['Digit2', '2'],
    ['Digit2', '@'],
    ['Digit3', '#'],
    ['Digit3', '3'],
    ['Digit4', '$'],
    ['Digit4', '4'],
    ['Digit5', '%'],
    ['Digit5', '5'],
    ['Digit6', '6'],
    ['Digit6', '^'],
    ['Digit7', '&'],
    ['Digit7', '7'],
    ['Digit8', '*'],
    ['Digit8', '8'],
    ['Digit9', '('],
    ['Digit9', '9'],
    ['End', 'End'],
    ['Enter', 'Enter'],
    ['Equal', '+'],
    ['Equal', '='],
    ['Escape', 'Escape'],
    ['F1', 'F1'],
    ['F10', 'F10'],
    ['F11', 'F11'],
    ['F12', 'F12'],
    ['F2', 'F2'],
    ['F3', 'F3'],
    ['F4', 'F4'],
    ['F5', 'F5'],
    ['F6', 'F6'],
    ['F7', 'F7'],
    ['F8', 'F8'],
    ['F9', 'F9'],
    ['Home', 'Home'],
    ['Insert', 'Insert'],
    ['KeyA', 'A'],
    ['KeyA', 'a'],
    ['KeyB', 'B'],
    ['KeyB', 'b'],
    ['KeyC', 'C'],
    ['KeyC', 'c'],
    ['KeyD', 'D'],
    ['KeyD', 'd'],
    ['KeyE', 'E'],
    ['KeyE', 'e'],
    ['KeyF', 'F'],
    ['KeyF', 'f'],
    ['KeyG', 'G'],
    ['KeyG', 'g'],
    ['KeyH', 'H'],
    ['KeyH', 'h'],
    ['KeyI', 'I'],
    ['KeyI', 'i'],
    ['KeyJ', 'J'],
    ['KeyJ', 'j'],
    ['KeyK', 'K'],
    ['KeyK', 'k'],
    ['KeyL', 'L'],
    ['KeyL', 'l'],
    ['KeyM', 'M'],
    ['KeyM', 'm'],
    ['KeyN', 'N'],
    ['KeyN', 'n'],
    ['KeyO', 'O'],
    ['KeyO', 'o'],
    ['KeyP', 'P'],
    ['KeyP', 'p'],
    ['KeyQ', 'Q'],
    ['KeyQ', 'q'],
    ['KeyR', 'R'],
    ['KeyR', 'r'],
    ['KeyS', 'S'],
    ['KeyS', 's'],
    ['KeyT', 'T'],
    ['KeyT', 't'],
    ['KeyU', 'U'],
    ['KeyU', 'u'],
    ['KeyV', 'V'],
    ['KeyV', 'v'],
    ['KeyW', 'W'],
    ['KeyW', 'w'],
    ['KeyX', 'X'],
    ['KeyX', 'x'],
    ['KeyY', 'Y'],
    ['KeyY', 'y'],
    ['KeyZ', 'Z'],
    ['KeyZ', 'z'],
    ['MediaPlayPause', 'MediaPlayPause'],
    ['MediaStop', 'MediaStop'],
    ['MediaTrackNext', 'MediaTrackNext'],
    ['MediaTrackPrevious', 'MediaTrackPrevious'],
    ['Minus', '-'],
    ['Minus', '_'],
    ['NumLock', 'NumLock'],
    ['Numpad0', '0'],
    ['Numpad0', 'Insert'],
    ['Numpad1', '1'],
    ['Numpad1', 'End'],
    ['Numpad2', '2'],
    ['Numpad2', 'ArrowDown'],
    ['Numpad3', '3'],
    ['Numpad3', 'PageDown'],
    ['Numpad4', '4'],
    ['Numpad4', 'ArrowLeft'],
    ['Numpad5', '5'],
    ['Numpad5', 'Clear'],
    ['Numpad6', '6'],
    ['Numpad6', 'ArrowRight'],
    ['Numpad7', '7'],
    ['Numpad7', 'Home'],
    ['Numpad8', '8'],
    ['Numpad8', 'ArrowUp'],
    ['Numpad9', '9'],
    ['Numpad9', 'PageUp'],
    ['NumpadAdd', '+'],
    ['NumpadDecimal', '.'],
    ['NumpadDecimal', 'Delete'],
    ['NumpadDivide', '/'],
    ['NumpadEnter', 'Enter'],
    ['NumpadMultiply', '*'],
    ['NumpadSubtract', '-'],
    ['OSLeft', 'OS'],
    ['OSRight', 'OS'],
    ['PageDown', 'PageDown'],
    ['PageUp', 'PageUp'],
    ['Pause', 'Pause'],
    ['Period', '.'],
    ['Period', '>'],
    ['Quote', '"'],
    ['Quote', "'"],
    ['ScrollLock', 'ScrollLock'],
    ['Semicolon', ':'],
    ['Semicolon', ';'],
    ['ShiftLeft', 'Shift'],
    ['ShiftRight', 'Shift'],
    ['Slash', '/'],
    ['Slash', '?'],
    ['Space', ' '],
    ['Tab', 'Tab'],
    ['VolumeDown', 'AudioVolumeDown'],
    ['VolumeMute', 'AudioVolumeMute'],
    ['VolumeUp', 'AudioVolumeUp'],
]

let chrome_ = [
    ['', 'AudioVolumeDown'],
    ['', 'AudioVolumeMute'],
    ['', 'AudioVolumeUp'],
    ['', 'MediaPlayPause'],
    ['', 'MediaStop'],
    ['', 'MediaTrackNext'],
    ['', 'MediaTrackPrevious'],
    ['AltLeft', 'Alt'],
    ['AltRight', 'Alt'],
    ['ArrowDown', 'ArrowDown'],
    ['ArrowLeft', 'ArrowLeft'],
    ['ArrowRight', 'ArrowRight'],
    ['ArrowUp', 'ArrowUp'],
    ['Backquote', '`'],
    ['Backquote', '~'],
    ['Backslash', '\\'],
    ['Backslash', '|'],
    ['Backspace', 'Backspace'],
    ['BracketLeft', '['],
    ['BracketLeft', '{'],
    ['BracketRight', ']'],
    ['BracketRight', '}'],
    ['CapsLock', 'CapsLock'],
    ['Comma', ','],
    ['Comma', '<'],
    ['ContextMenu', 'ContextMenu'],
    ['ControlLeft', 'Control'],
    ['ControlRight', 'Control'],
    ['Delete', 'Delete'],
    ['Digit0', ')'],
    ['Digit0', '0'],
    ['Digit1', '!'],
    ['Digit1', '1'],
    ['Digit2', '2'],
    ['Digit2', '@'],
    ['Digit3', '#'],
    ['Digit3', '3'],
    ['Digit4', '$'],
    ['Digit4', '4'],
    ['Digit5', '%'],
    ['Digit5', '5'],
    ['Digit6', '6'],
    ['Digit6', '^'],
    ['Digit7', '&'],
    ['Digit7', '7'],
    ['Digit8', '*'],
    ['Digit8', '8'],
    ['Digit9', '('],
    ['Digit9', '9'],
    ['End', 'End'],
    ['Enter', 'Enter'],
    ['Equal', '+'],
    ['Equal', '='],
    ['Escape', 'Escape'],
    ['F1', 'F1'],
    ['F10', 'F10'],
    ['F11', 'F11'],
    ['F12', 'F12'],
    ['F2', 'F2'],
    ['F3', 'F3'],
    ['F4', 'F4'],
    ['F5', 'F5'],
    ['F6', 'F6'],
    ['F7', 'F7'],
    ['F8', 'F8'],
    ['F9', 'F9'],
    ['Home', 'Home'],
    ['Insert', 'Insert'],
    ['KeyA', 'A'],
    ['KeyA', 'a'],
    ['KeyB', 'B'],
    ['KeyB', 'b'],
    ['KeyC', 'C'],
    ['KeyC', 'c'],
    ['KeyD', 'D'],
    ['KeyD', 'd'],
    ['KeyE', 'E'],
    ['KeyE', 'e'],
    ['KeyF', 'F'],
    ['KeyF', 'f'],
    ['KeyG', 'G'],
    ['KeyG', 'g'],
    ['KeyH', 'H'],
    ['KeyH', 'h'],
    ['KeyI', 'I'],
    ['KeyI', 'i'],
    ['KeyJ', 'J'],
    ['KeyJ', 'j'],
    ['KeyK', 'K'],
    ['KeyK', 'k'],
    ['KeyL', 'L'],
    ['KeyL', 'l'],
    ['KeyM', 'M'],
    ['KeyM', 'm'],
    ['KeyN', 'N'],
    ['KeyN', 'n'],
    ['KeyO', 'O'],
    ['KeyO', 'o'],
    ['KeyP', 'P'],
    ['KeyP', 'p'],
    ['KeyQ', 'Q'],
    ['KeyQ', 'q'],
    ['KeyR', 'R'],
    ['KeyR', 'r'],
    ['KeyS', 'S'],
    ['KeyS', 's'],
    ['KeyT', 'T'],
    ['KeyT', 't'],
    ['KeyU', 'U'],
    ['KeyU', 'u'],
    ['KeyV', 'V'],
    ['KeyV', 'v'],
    ['KeyW', 'W'],
    ['KeyW', 'w'],
    ['KeyX', 'X'],
    ['KeyX', 'x'],
    ['KeyY', 'Y'],
    ['KeyY', 'y'],
    ['KeyZ', 'Z'],
    ['KeyZ', 'z'],
    ['MetaLeft', 'Meta'],
    ['MetaRight', 'Meta'],
    ['Minus', '-'],
    ['Minus', '_'],
    ['NumLock', 'NumLock'],
    ['Numpad0', '0'],
    ['Numpad0', 'Insert'],
    ['Numpad1', '1'],
    ['Numpad1', 'End'],
    ['Numpad2', '2'],
    ['Numpad2', 'ArrowDown'],
    ['Numpad3', '3'],
    ['Numpad3', 'PageDown'],
    ['Numpad4', '4'],
    ['Numpad4', 'ArrowLeft'],
    ['Numpad5', '5'],
    ['Numpad5', 'Clear'],
    ['Numpad6', '6'],
    ['Numpad6', 'ArrowRight'],
    ['Numpad7', '7'],
    ['Numpad7', 'Home'],
    ['Numpad8', '8'],
    ['Numpad8', 'ArrowUp'],
    ['Numpad9', '9'],
    ['Numpad9', 'PageUp'],
    ['NumpadAdd', '+'],
    ['NumpadDecimal', '.'],
    ['NumpadDecimal', 'Delete'],
    ['NumpadDivide', '/'],
    ['NumpadEnter', 'Enter'],
    ['NumpadMultiply', '*'],
    ['NumpadSubtract', '-'],
    ['PageDown', 'PageDown'],
    ['PageUp', 'PageUp'],
    ['Pause', 'Pause'],
    ['Period', '.'],
    ['Period', '>'],
    ['Quote', '"'],
    ['Quote', "'"],
    ['ScrollLock', 'ScrollLock'],
    ['Semicolon', ':'],
    ['Semicolon', ';'],
    ['ShiftLeft', 'Shift'],
    ['ShiftRight', 'Shift'],
    ['Slash', '/'],
    ['Slash', '?'],
    ['Space', ' '],
    ['Tab', 'Tab'],
]
*/