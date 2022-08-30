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

    ["D2-D3", "2-3"],
    ["D4-D7", "4-7"],
    ["D5-D6", "5-6"],
    ["D8-D9", "8-9"],
    ["D10-D11", "10-11"],
    ["D12-D13", "12-13"]
]

const LEDIndex = [
    ["全部", "0"],
    ["第一个", "1"],
    ["第二个", "2"],
    ["第三个", "4"],
    ["第四个", "3"],
]

class ArduinoNanRGBLED {
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
        return 'Scratch.ArduinoNanRGBLED';
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

    get LEDIndex () {
        return LEDIndex.map(pin => ({
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
        let state = target.getCustomState(ArduinoNanRGBLED.STATE_KEY);
        if (!state) {
            state = Clone.simple(ArduinoNanRGBLED.DEFAULT_HELLOWORLD_STATE);
            target.setCustomState(ArduinoNanRGBLED.STATE_KEY, state);
        }
        return state;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'ArduinoNanRGBLED',
            name: "红绿双色灯",
            color1: colour,
            color2: colour,
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'digitalWrite',
                    blockType: BlockType.COMMAND,
                    text: '设置 [PIN]的 全彩灯 [INDEX] 灯 颜色为 R [R] G [G] B [B]',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'ANALOG_PINS_MENU',
                            defaultValue: 'A0-A1'
                        },
                        INDEX: {
                            type: ArgumentType.STRING,
                            menu: 'LED_INDEX',
                            defaultValue: '0'
                        },
                        R: {
                            type: ArgumentType.UINT8_NUMBER,
                            defaultValue: '100'
                        },
                        G: {
                            type: ArgumentType.UINT8_NUMBER,
                            defaultValue: '100'
                        },
                        B: {
                            type: ArgumentType.UINT8_NUMBER,
                            defaultValue: '100'
                        },
                    }
                }
            ],
            menus: {
                ANALOG_PINS_MENU: {
                    items: this.ANALOG_PINS_MENU
                },
                LED_INDEX: {
                    items: this.LEDIndex
                }
            }
        };
    }

    digitalWrite(args, util) {
        const { PIN: pinList, INDEX, R, G, B } = args;
        const [a, b] = pinList.split('-');
        return this._peripheral.RGBLEDDisplay(a,INDEX,R,G,B);
    }
}

module.exports = ArduinoNanRGBLED;