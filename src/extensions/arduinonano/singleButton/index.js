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

class ArduinoNanoSingleButton {
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
        return 'Scratch.ArduinoNanoSingleButton';
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
        let state = target.getCustomState(ArduinoNanoSingleButton.STATE_KEY);
        if (!state) {
            state = Clone.simple(ArduinoNanoSingleButton.DEFAULT_HELLOWORLD_STATE);
            target.setCustomState(ArduinoNanoSingleButton.STATE_KEY, state);
        }
        return state;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'ArduinoNanoSingleButton',
            name: "单按钮模块",
            colour1: "#A66EFF",
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'readAnalogPin',
                    blockType: BlockType.BOOLEAN,
                    text: '引脚 [PIN] 按钮被按下？',
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
            }
        };
    }

    readAnalogPin(args, util) {
        const PIN = args.PIN;
        const state = this._getState(util.target);
        const [a, b] = PIN.split('-');
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

module.exports = ArduinoNanoSingleButton;