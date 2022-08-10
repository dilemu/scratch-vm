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
    
    ["D2-D3", "D2-D3"],
    ["D5-D6", "D5-D6"],
    ["D4-D7", "D4-D7"],
    ["D8-D9", "D8-D9"],
    ["D10-D11", "D10-D11"],
    ["D12-D13", "D12-D13"]
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

class ArduinoNanoUltrasonic {
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
        return 'Scratch.ArduinoNanoUltrasonic';
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
        let state = target.getCustomState(ArduinoNanoUltrasonic.STATE_KEY);
        if (!state) {
            state = Clone.simple(ArduinoNanoUltrasonic.DEFAULT_HELLOWORLD_STATE);
            target.setCustomState(ArduinoNanoUltrasonic.STATE_KEY, state);
        }
        return state;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'ArduinoNanUltrasonic',
            name: "超声波传感器",
            color1: "#A66EFF",
            color2: "#A66EFF",
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'readAnalogPin',
                    blockType: BlockType.BOOLEAN,
                    text: '读取 [PIN] 的超声波测距值(cm)',
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

    async readAnalogPin(args, util) {
        const PIN = args.PIN;
        const st = Date.now();
        const micros = () => { return (Date.now() - st) / 1000; }
        const state = this._getState(util.target);
        const [a, b] = PIN.split('-');
        const CM = 28;
        const delayMicroseconds = ms => {
            return new Promise(resolve => {
                setTimeout(resolve, ms/1000);
            })
        }
        // init pin
        this._peripheral.setPinMode(a, 'OUTPUT');
        this._peripheral.setPinMode(b, 'INPUT');
        // read
        const timing = () => {
            this._peripheral.digitalWrite(a, 0);
            delayMicroseconds(2);
            this._peripheral.digitalWrite(a, 1);
            delayMicroseconds(10);
            this._peripheral.digitalWrite(a, 0);

            let previousMicros = micros();
            while (!await this._peripheral.readDigitalPin(echo) && (micros() - previousMicros) <= timeout); // wait for the echo pin HIGH or timeout
            previousMicros = micros();
            while (digitalRead(echo) && (micros() - previousMicros) <= timeout); // wait for the echo pin LOW or timeout

            return micros() - previousMicros; // duration
        }
        return timing() / CM / 2;
    }
}


module.exports = ArduinoNanoUltrasonic;