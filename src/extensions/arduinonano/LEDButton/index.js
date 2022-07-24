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
    ["0-1", "0-1"],
    ["2-3", "2-3"],
    ["5-6", "5-6"],
    ["4-7", "4-7"],
    ["10-11", "10-11"],
    ["12-13", "12-13"]
]

const Switch = {
    ON: "HIGT",
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
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'digitalWrite',
                    blockType: BlockType.COMMAND,
                    text: '[SWITCH] 引脚 [PIN] LED',
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
        const PIN = args.PIN;
        const SWITCH = args.SWITCH;
        const [a, b] = PIN.split('-');
        return this._peripheral.setDigitalOutput(b, SWITCH);
    }
}

module.exports = ArduinoNanoLEDButton;