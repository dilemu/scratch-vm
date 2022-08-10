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
    
    ["D2-D3", "D2-D3"],
    ["D5-D6", "D5-D6"],
    ["D4-D7", "D4-D7"],
    ["D8-D9", "D8-D9"],
    ["D10-D11", "D10-D11"],
    ["D12-D13", "D12-D13"]
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
        let laststate = 1;
        const MAXTIMINGS = 85;
        const pinList = args.PIN;
        const type = args.TYPE;
        const data = new Array(6);
        const [a, b] = pinList.split("-");
        data[0] = data[1] = data[2] = data[3] = data[4] = 0;
        this._peripheral.setDigitalOutput(a, 'HIGH');
        await sleep(250);
        this._peripheral.setPinMode(a, 'OUTPUT');
        this._peripheral.setDigitalOutput(a, 'LOW');
        await sleep(20);
        this._peripheral.setDigitalOutput(a, 'HIGH');
        await sleep(0.04);
        this._peripheral.setPinMode(a, 'INPUT');
        let j = 0;
        for (let i = 0; i < MAXTIMINGS; i++) {
            let counter = 0;
            while (await this._peripheral.readDigitalPin(a) == laststate) {
                counter++;
                await sleep(0.01);
                if (counter === 255) {
                    break;
                }
            }
            laststate = await this._peripheral.readDigitalPin(a);

            if (counter == 255) break;
            
            if(i >=4 && i%2 === 0) {
                data[j / 8] <<= 1;
                if(counter > 6) {
                    data[j/8] |= 1;
                }
                j++;
            }
        }
        if ((j >= 40) &&
            (data[4] == ((data[0] + data[1] + data[2] + data[3]) & 0xFF))) {
            return data[2];
        }
        return false;
        return this._peripheral.readDigitalPin(a);
    }
}

module.exports = ArduinoNanoDHT;