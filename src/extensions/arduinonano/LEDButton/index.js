const ArgumentType = require('../../../extension-support/argument-type');
const BlockType = require('../../../extension-support/block-type');
const Cast = require('../../../util/cast');
const MathUtil = require('../../../util/math-util');
const Clone = require('../../../util/clone');
const formatMessage = require('format-message');
const ArduinoPeripheral = require('../../../devices/common/arduino-peripheral');
// const MathUtil = require('../../util/math-util');

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = '';
const menuIconURI = blockIconURI;

const Pins = [
    ["A0-A1", "A0-A1"],
    ["A2-A3", "A2-A3"],
    ["A4-A5", "A4-A5"],
    
    ["D2-D3", "2-3"],
    ["D4-D7", "4-7"],
    ["D5-D6", "5-6"],
    ["D8-D9", "8-9"],
    ["D10-D11", "10-11"],
    ["D12-D13", "12-13"]
]

const Switch = {
    ON: "HIGH",
    OFF: "LOW"
}

class ArduinoNanoLEDButton {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this._peripheral = this.runtime.peripheralExtensions.arduinoNano;
    }


    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return 'Scratch.ArduinoNanoLEDButton';
    }

    /**
     * The default state, to be used when a target has no existing state.
     * @type {HelloWorldState}
     */
    static get DEFAULT_HELLOWORLD_STATE() {
        return {
        };
    }

    get DEVICE_ID() {
        return 'arduinoNano';
    }

    get ANALOG_PINS_MENU() {
        return Pins.map(pin => ({
            text: pin[0],
            value: pin[1]
        }));
    }


    /**
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(ArduinoNanoLEDButton.STATE_KEY);
        if (!state) {
            state = Clone.simple(ArduinoNanoLEDButton.DEFAULT_HELLOWORLD_STATE);
            target.setCustomState(ArduinoNanoLEDButton.STATE_KEY, state);
        }
        return state;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'ArduinoNanoLEDButton',
            name: "指示灯按钮",
            color1: '#A66EFF',
            color2: '#A66EFF',
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'digitalWrite',
                    blockType: BlockType.COMMAND,
                    text: '[SWITCH] [PIN] 的按钮指示灯',
                    arguments: {
                        SWITCH: {
                            type: ArgumentType.STRING,
                            menu: 'SWITCH_MENU',
                            defaultValue: Switch.ON
                        },
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'ANALOG_PINS_MENU',
                            defaultValue: 'A0-A1'
                        }
                    }
                },
                {
                    opcode: 'readAnalogPin',
                    blockType: BlockType.BOOLEAN,
                    text: '按键 [PIN] 检测到被按下？',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'ANALOG_PINS_MENU',
                            defaultValue: 'A0-A1'
                        }
                    }
                }
            ],
            menus: {
                ANALOG_PINS_MENU: {
                    items: this.ANALOG_PINS_MENU
                },
                SWITCH_MENU: {
                    items: [
                        {
                            text: '开',
                            value: Switch.ON
                        },
                        {
                            text: '关',
                            value: Switch.OFF
                        }
                    ]
                }
            }
        };
    }

    digitalWrite(args, util) {
        const pinList = args.PIN;
        const [a, b] = pinList.split('-');
        const SWITCH = args.SWITCH;
        this._peripheral.setPinMode(b, 'OUTPUT');
        let mode = 0
        if (a.charAt(0) === 'A') {
            mode = 0;
        } else {
            mode = 1;
        }
        switch (mode) {
            case 0:
                return this._peripheral.setDigitalOutput(b, SWITCH);
                break;
            case 1:
                return this._peripheral.setDigitalOutput(b, SWITCH);
                break;
        }
    }

    readAnalogPin(args, util) {
        const pinList = args.PIN;
        const [a, b] = pinList.split('-');
        this._peripheral.setPinMode(a, 'INPUT');
        let mode = 0
        if (a.charAt(0) === 'A') {
            mode = 0;
        } else {
            mode = 1;
        }
        switch (mode) {
            case 0:
                return this._peripheral.readAnalogPin(a);
            case 1:
                return this._peripheral.readDigitalPin(a);
        }
    }
}

module.exports = ArduinoNanoLEDButton;