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

const digitalPins = [
    ["5-6", "5-6"],
    ["10-11", "10-11"]
]

const directionList = [
    ["正转", 1],
    ["反转", 2]
]

class ArduinoNanoMotor {
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
        return 'Scratch.ArduinoNanoMotor';
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
        return digitalPins.map(pin => ({
            text: pin[0],
            value: pin[1]
        }));
    }

    get DIRECTION_MENU() {
        return directionList.map(direction => ({
            text: direction[0],
            value: direction[1]
        }));
    }


    /**
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(ArduinoNanoMotor.STATE_KEY);
        if (!state) {
            state = Clone.simple(ArduinoNanoMotor.DEFAULT_HELLOWORLD_STATE);
            target.setCustomState(ArduinoNanoMotor.STATE_KEY, state);
        }
        return state;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'ArduinoNanoMotor',
            name: "电机驱动模块",
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'start',
                    blockType: BlockType.COMMAND,
                    text: '电机 [PIN] 以 [SPEED] 速度 [DIRECTION]',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'ANALOG_PINS_MENU',
                            defaultValue: '5-6'
                        },
                        DIRECTION: {
                            type: ArgumentType.STRING,
                            menu: 'DIRECTION_MENU',
                            defaultValue: 1
                        },
                        SPEED: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 100
                        }
                    }
                }
            ],
            menus: {
                ANALOG_PINS_MENU: {
                    items: this.ANALOG_PINS_MENU
                },
                DIRECTION_MENU: {
                    items: this.DIRECTION_MENU
                }
            }
        };
    }

    start(args) {
        const pin = args.PIN;
        const direction = args.DIRECTION;
        const speed = args.SPEED;
        return this.FanControl(...pin.split('-'), direction, parseInt(speed));
    }

    FanControl(pinA, pinB, direction, speed) {
        if(direction == 1) {
            pinA = 0;
            this._peripheral.setPwmOutput(pinB, speed);
        } else if(direction == 2) {
            pinB = 0;
            this._peripheral.setPwmOutput(pinA, speed);
        }
    }
}

module.exports = ArduinoNanoMotor;