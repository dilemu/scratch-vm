const ArgumentType = require('../../../extension-support/argument-type');
const BlockType = require('../../../extension-support/block-type');
const Clone = require('../../../util/clone');
const SOUND = require('./sound').default;

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

const note = [
    ['C3', 'note_C3'],
    ['C#3', 'note_Db3'],
    ['D3', 'note_D3'],
    ['D#3', 'note_Eb3'],
    ['E3', 'note_E3'],
    ['F3', 'note_F3'],
    ['F#3', 'note_Gb3'],
    ['G3', 'note_G3'],
    ['G#3', 'note_Ab3'],
    ['A3', 'note_A3'],
    ['A#3', 'note_Bb3'],
    ['B3', 'note_B3'],
    ['C4', 'note_C4'],
    ['C#4', 'note_Db4'],
    ['D4', 'note_D4'],
    ['D#4', 'note_Eb4'],
    ['E4', 'note_E4'],
    ['F4', 'note_F4'],
    ['F#4', 'note_Gb4'],
    ['G4', 'note_G4'],
    ['G#4', 'note_Ab4'],
    ['A4', 'note_A4'],
    ['A#4', 'note_Bb4'],
    ['B4', 'note_B4'],
    ['C5', 'note_C5'],
    ['C#5', 'note_Db5'],
    ['D5', 'note_D5'],
    ['D#5', 'note_Eb5'],
    ['E5', 'note_E5'],
    ['F5', 'note_F5'],
    ['F#5', 'note_Gb5'],
    ['G5', 'note_G5'],
    ['G#5', 'note_Ab5'],
    ['A5', 'note_A5'],
    ['A#5', 'note_Bb5'],
    ['B5', 'note_B5']
];

const beatTime = [
    ['1/2拍', '0.5'],
    ['1/4拍', '0.25'],
    ['1/8拍', '0.125'],
    ['1拍', '1'],
    ['2拍', '2'],
    ['休止', '0'],
];

class ArduinoNanoPassiveBuzzer {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        this._peripheral = this.runtime.peripheralExtensions.arduinoNano;
        // if (this.runtime) {
        //     this.runtime.on("PROJECT_STOP_ALL", this._stopAllSpeech);
        // }
    }


    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return 'Scratch.ArduinoNanoPassiveBuzzer';
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

    get NOTE_MENU() {
        return note.map(n => ({
            text: n[0],
            value: n[1]
        }));
    }

    get BEAT_TIME_MENU() {
        return beatTime.map(b => ({
            text: b[0],
            value: b[1]
        }));
    }


    /**
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(ArduinoNanoPassiveBuzzer.STATE_KEY);
        if (!state) {
            state = Clone.simple(ArduinoNanoPassiveBuzzer.DEFAULT_HELLOWORLD_STATE);
            target.setCustomState(ArduinoNanoPassiveBuzzer.STATE_KEY, state);
        }
        return state;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: 'ArduinoNanoPassiveBuzzer',
            name: "无源蜂鸣器",
            color1: "#00AAFF",
            color2: "#00AAFF",
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: 'play',
                    blockType: BlockType.COMMAND,
                    text: '播放 [PIN] 的 蜂鸣器 音调 [NOTE] 节拍 [BEAT]',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'ANALOG_PINS_MENU',
                            defaultValue: 'A0-A1'
                        },
                        NOTE: {
                            type: ArgumentType.STRING,
                            menu: 'NOTE_MENU',
                            defaultValue: 'note_C3'
                        },
                        BEAT: {
                            type: ArgumentType.STRING,
                            menu: 'BEAT_TIME_MENU',
                            defaultValue: '0.5'
                        }
                    }
                },
                {
                    opcode: 'play1',
                    blockType: BlockType.COMMAND,
                    text: '播放 [PIN] 的 蜂鸣器 频率 [FREQ] 时长 [TIME] ms',
                    arguments: {
                        PIN: {
                            type: ArgumentType.STRING,
                            menu: 'ANALOG_PINS_MENU',
                            defaultValue: 'A0-A1'
                        },
                        FREQ: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 200
                        },
                        TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 500
                        }
                    }
                }
            ],
            menus: {
                ANALOG_PINS_MENU: {
                    items: this.ANALOG_PINS_MENU
                },
                NOTE_MENU: {
                    items: this.NOTE_MENU
                },
                BEAT_TIME_MENU: {
                    items: this.BEAT_TIME_MENU
                }
            }
        };
    }

    play(args, util) {
        const PIN = args.PIN;
        const [a, b] = PIN.split('-');
        const NOTE = args.NOTE;
        const BEAT = args.BEAT;
        const tone = SOUND[NOTE];
        return this._peripheral.passiveBuzzerPlay(a, 0, tone, BEAT);
    }

    play1(args, util) {
        const PIN = args.PIN;
        const [a, b] = PIN.split('-');
        const FREQ = args.FREQ;
        const TIME = args.TIME;
        return this._peripheral.passiveBuzzerPlay(a, 1, FREQ, TIME);
    }
}

module.exports = ArduinoNanoPassiveBuzzer;