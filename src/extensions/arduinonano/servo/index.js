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
    ["A0", "A0"],
    ["A2", "A2"],
    ["A4", "A4"],
    ["A5", "A5"],
    ["0", "0"],
    ["2", "2"],
    ["4", "4"],
    ["5", "5"],
    ["10", "10"],
    ["12", "12"],
]

const PNPID_LIST = [
    // For chinese clones that use CH340
    'USB\\VID_1A86&PID_7523'
];

/**
 * Configuration of serialport
 * @readonly
 */
const SERIAL_CONFIG = {
    baudRate: 57600,
    dataBits: 8,
    stopBits: 1
};

/**
 * Configuration for arduino-cli.
 * @readonly
 */
const DIVECE_OPT = {
    type: 'arduino',
    fqbn: 'arduino:avr:nano:cpu=atmega328',
    firmware: 'arduinoUnoUltra.standardFirmata.ino.hex'
};

class ArduinoUno extends ArduinoPeripheral {
    /**
     * Construct a Arduino communication object.
     * @param {Runtime} runtime - the OpenBlock runtime
     * @param {string} deviceId - the id of the extension
     * @param {string} originalDeviceId - the original id of the peripheral, like xxx_arduinoUno
     */
    constructor(runtime, deviceId, originalDeviceId) {
        super(runtime, deviceId, originalDeviceId, PNPID_LIST, SERIAL_CONFIG, DIVECE_OPT);
    }
}

class ArduinoNanoServo {
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
        return 'Scratch.ArduinoNanoServo';
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
        let state = target.getCustomState(ArduinoNanoServo.STATE_KEY);
        if (!state) {
            state = Clone.simple(ArduinoNanoServo.DEFAULT_HELLOWORLD_STATE);
            target.setCustomState(ArduinoNanoServo.STATE_KEY, state);
        }
        return state;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'ArduinoNanoServo',
            name: "舵机模块（180°）",
            color1: '#00AAFF',
            color2: '#00AAFF',
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'readAnalogPin',
                    blockType: BlockType.COMMAND,
                    text: '设置 [PIN] 引脚伺服舵机为 [ANGLE]度',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'ANALOG_PINS_MENU',
                            defaultValue: 'A0-A1'
                        },
                        ANGLE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 90
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

    async readAnalogPin(args, util) {
        const PIN = args.PIN;
        const parsePin = (pin) => {
            if (pin.charAt(0) === 'A') {
                return parseInt(pin.slice(1), 10) + 14;
            }
            return parseInt(pin, 10);
        }
        let degrees = 10;
        let incrementer = 10;
        this._peripheral._firmata.servoConfig(parsePin(PIN), 544, 2400);
        setInterval(() => {
            if (degrees >= 180 || degrees === 0) {
                incrementer *= -1;
            }
            degrees += incrementer;
            this._peripheral._firmata.servoWrite(parsePin(PIN), degrees);
            console.log(degrees);
        }, 500);
    }
}


module.exports = ArduinoNanoServo;