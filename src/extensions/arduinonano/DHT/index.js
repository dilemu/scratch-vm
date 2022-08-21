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
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

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

const typeList = [
    ["温度值", "TEMPERATURE"],
    ["湿度值", "HUMIDITY"]
]

class ArduinoNanoDHT {
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
        return 'Scratch.ArduinoNanoDHT';
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

    get TYPE_MENU() {
        return typeList.map(type => ({
            text: type[0],
            value: type[1]
        }));
    }


    /**
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(ArduinoNanoDHT.STATE_KEY);
        if (!state) {
            state = Clone.simple(ArduinoNanoDHT.DEFAULT_HELLOWORLD_STATE);
            target.setCustomState(ArduinoNanoDHT.STATE_KEY, state);
        }
        return state;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'ArduinoNanoDHT',
            name: "温湿度传感器",
            color1: '#A66EFF',
            color2: '#A66EFF',
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'digitalRead',
                    blockType: BlockType.REPORTER,
                    checkboxInFlyout: false,
                    text: '读取 管脚 [PIN] 的 [TYPE]',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'ANALOG_PINS_MENU',
                            defaultValue: 'A0-A1'
                        },
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'TYPE_MENU',
                            defaultValue: 'TEMPERATURE'
                        }
                    }
                }
            ],
            menus: {
                ANALOG_PINS_MENU: {
                    items: this.ANALOG_PINS_MENU
                },
                TYPE_MENU: {
                    items: this.TYPE_MENU
                }
            }
        };
    }

    async digitalRead(args) {
        const pinList = args.PIN;
        const type = args.TYPE;
        const [a, b] = pinList.split('-');
        if(type === 'TEMPERATURE') {
            return await this._peripheral.DHTRead(a, 0);
        }
    }
}

module.exports = ArduinoNanoDHT;