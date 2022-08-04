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
const colour = '#32C850';

const Pins = [
    ["A0-A1", "A0-A1"],
    ["A2-A3", "A2-A3"],
    ["A4-A5", "A4-A5"],
    ["D0-D1", "0-1"],
    ["D2-D3", "2-3"],
    ["D5-D6", "5-6"],
    ["D4-D7", "4-7"],
    ["D10-D11", "10-11"],
    ["D12-D13", "12-13"]
]

const lightStatus = [
    ["亮红灯", "1"],
    ["灭红灯", "2"],
    ["亮绿灯", "3"],
    ["灭绿灯", "4"],
    ["全亮", "5"],
    ["全灭", "6"],
]

class ArduinoNanRedAndGreenLED {
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
        return 'Scratch.ArduinoNanRedAndGreenLED';
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

    get LIGHT_STATUS_MENU() {
        return lightStatus.map(light => ({
            text: light[0],
            value: light[1]
        }));
    }


    /**
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(ArduinoNanRedAndGreenLED.STATE_KEY);
        if (!state) {
            state = Clone.simple(ArduinoNanRedAndGreenLED.DEFAULT_HELLOWORLD_STATE);
            target.setCustomState(ArduinoNanRedAndGreenLED.STATE_KEY, state);
        }
        return state;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'ArduinoNanRedAndGreenLED',
            name: "红绿双色灯",
            colour: colour,
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'digitalWrite',
                    blockType: BlockType.COMMAND,
                    text: '设置 [PIN] 的 红绿双色灯 [STATUS]',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'ANALOG_PINS_MENU',
                            defaultValue: 'A0-A1'
                        },
                        STATUS: {
                            type: ArgumentType.STRING,
                            menu: 'LIGHT_STATUS_MENU',
                            defaultValue: '1'
                        }
                    }
                }
            ],
            menus: {
                ANALOG_PINS_MENU: {
                    items: this.ANALOG_PINS_MENU
                },
                LIGHT_STATUS_MENU: {
                    items: this.LIGHT_STATUS_MENU
                }
            }
        };
    }

    digitalWrite(args, util) {
        const pinList = args.PIN;
        const [a, b] = pinList.split('-');
        const status = args.STATUS;
        this._peripheral.setPinMode(a, "OUTPUT");
        this._peripheral.setPinMode(b, "OUTPUT");
        switch (parseInt(status)) {
            case 1:
                this._peripheral.setDigitalOutput(a, "HIGH");
                break;
            case 2:
                this._peripheral.setDigitalOutput(a, "LOW");
                break;
            case 3:
                this._peripheral.setDigitalOutput(b, "HIGH");
                break;
            case 4:
                this._peripheral.setDigitalOutput(b, "LOW");
                break;
            case 5:
                this._peripheral.setDigitalOutput(a, "HIGH");
                this._peripheral.setDigitalOutput(b, "HIGH");
                break;
            case 6:
                this._peripheral.setDigitalOutput(a, "LOW");
                this._peripheral.setDigitalOutput(b, "LOW");
                break;
        }
        return;
    }
}

module.exports = ArduinoNanRedAndGreenLED;