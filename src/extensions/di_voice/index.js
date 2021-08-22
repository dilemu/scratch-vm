// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");

const menuIconURI = null;
const blockIconURI = null;

const REMOTE_URL = {
    SPEAK: "/api/voice/speech/synthesis",
    RECOGNITION: "/api/voice/classify"
};

/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

class diVoice {
    constructor(runtime) {
        this.runtime = runtime;
        // communication related
        this.comm = runtime.ioDevices.comm;
        this.session = null;
        this.runtime.registerPeripheralExtension("diVoice", this);
        // session callbacks
        this.reporter = null;
        // string op
        this.decoder = new TextDecoder();
        this.lineBuffer = "";
        /**
         * Map of soundPlayers by sound id.
         * @type {Map<string, SoundPlayer>}
         */
        this._soundPlayers = new Map();

        this._stopAllSpeech = this._stopAllSpeech.bind(this);
        if (this.runtime) {
            this.runtime.on("PROJECT_STOP_ALL", this._stopAllSpeech);
        }
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return "Di.diVoice";
    }
    /**
     * The default state, to be used when a target has no existing state.
     * @type {HelloWorldState}
     */
    static get DEFAULT_IMAGERECOGNITION_STATE() {
        return {
            robotAnswer: "",
            robotQuestion: "你好",
            robotAnswerList: [],
            speaker: "103",
            spd: 5,
            pit: 5,
            vol: 5,
        };
    }

    get REMOTE_URL() {
        return REMOTE_URL;
    }

    get VOICE_LIST_INFO() {
        return [
            {
                name: formatMessage({
                    id: "diVoice.xiaodi",
                    default: "小迪",
                }),
                value: "103",
            },
            {
                name: formatMessage({
                    id: "diVoice.lele",
                    default: "乐乐",
                }),
                value: "110",
            },
            {
                name: formatMessage({
                    id: "diVoice.xiaomei",
                    default: "小美",
                }),
                value: "111",
            },
            {
                name: formatMessage({
                    id: "diVoice.man",
                    default: "成年男声",
                }),
                value: "106",
            },
            {
                name: formatMessage({
                    id: "diVoice.woman",
                    default: "成年女声",
                }),
                value: "5",
            },
        ];
    }

    get VOICE_READ_OPTION_INFO() {
        return [
            {
                name: formatMessage({
                    id: "diVoice.spd",
                    default: "语速",
                }),
                value: "spd",
            },
            {
                name: formatMessage({
                    id: "diVoice.pit",
                    default: "语调",
                }),
                value: "pit",
            },
            {
                name: formatMessage({
                    id: "diVoice.vol",
                    default: "音量",
                }),
                value: "vol",
            },
        ];
    }

    get VOICE_READ_OPTION_VALUE_INFO() {
        return [
            {
                name: "1",
                value: 1,
            },
            {
                name: "2",
                value: 2,
            },
            {
                name: "3",
                value: 3,
            },
            {
                name: "4",
                value: 4,
            },
            {
                name: "5",
                value: 5,
            },
            {
                name: "6",
                value: 6,
            },
            {
                name: "7",
                value: 7,
            },
            {
                name: "8",
                value: 8,
            },
            {
                name: "9",
                value: 9,
            },
            {
                name: "10",
                value: 10,
            },
            {
                name: "11",
                value: 11,
            },
            {
                name: "12",
                value: 12,
            },
            {
                name: "13",
                value: 13,
            },
            {
                name: "14",
                value: 14,
            },
            {
                name: "15",
                value: 15,
            },
        ];
    }

    get VOICE_RECO_TIME_INFO() {
        return [
            {
                name: "1",
                value: 1,
            },
            {
                name: "2",
                value: 2,
            },
            {
                name: "3",
                value: 3,
            },
            {
                name: "4",
                value: 4,
            },
            {
                name: "5",
                value: 5,
            },
            {
                name: "6",
                value: 6,
            },
            {
                name: "7",
                value: 7,
            },
            {
                name: "8",
                value: 8,
            },
            {
                name: "9",
                value: 9,
            },
            {
                name: "10",
                value: 10,
            },
        ];
    }

    get RECO_LANG_INFO() {
        return [
            {
                name: formatMessage({
                    id: "diVoice.lang.mandarin",
                    default: "普通话",
                }),
                value: "1537",
            },
            {
                name: formatMessage({
                    id: "diVoice.lang.english",
                    default: "英语",
                }),
                value: "1737",
            },
            {
                name: formatMessage({
                    id: "diVoice.lang.cantonese",
                    default: "粤语",
                }),
                value: "1637",
            },
            {
                name: formatMessage({
                    id: "diVoice.lang.sichuan",
                    default: "四川话",
                }),
                value: "1837",
            },
        ]
    }

    /**
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(diVoice.STATE_KEY);
        if (!state) {
            state = Clone.simple(diVoice.DEFAULT_IMAGERECOGNITION_STATE);
            target.setCustomState(diVoice.STATE_KEY, state);
        }
        return state;
    }

    /**
     * Create data for a menu in scratch-blocks format, consisting of an array
     * of objects with text and value properties. The text is a translated
     * string, and the value is one-indexed.
     * @param {object[]} info - An array of info objects each having a name
     *   property.
     * @return {array} - An array of objects with text and value properties.
     * @private
     */
    _buildMenu(info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = entry.value || String(index + 1);
            return obj;
        });
    }

    _stopAllSpeech() {
        this._soundPlayers.forEach((player) => {
            player.stop();
        });
    }

    getInfo() {
        return {
            id: "diVoice",
            name: "语音交互",
            color1: "#0079FF",
            color2: "#0061CC",
            color3: "#3373CC",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "setSpeaker",
                    text: formatMessage({
                        id: "diVoice.speakerSettingBlock",
                        default: "发音人设置：[SPEAKER]",
                        description: "speaker setting",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SPEAKER: {
                            type: ArgumentType.STRING,
                            defaultValue: this.VOICE_LIST_INFO[0].value,
                            menu: "VOICE_LIST",
                        },
                    },
                },
                {
                    opcode: "setSpeakOptions",
                    text: formatMessage({
                        id: "diVoice.speakSettingBlock",
                        default:
                            "将[VOICE_READ_OPTION]设置为[VOICE_READ_OPTION_VALUE]",
                        description: "speak setting",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VOICE_READ_OPTION: {
                            type: ArgumentType.STRING,
                            defaultValue: this.VOICE_READ_OPTION_INFO[0].value,
                            menu: "VOICE_READ_OPTION",
                        },
                        VOICE_READ_OPTION_VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue:
                                this.VOICE_READ_OPTION_VALUE_INFO[0].value,
                            menu: "VOICE_READ_OPTION_VALUE",
                        },
                    },
                },
                {
                    opcode: "speakAndWait",
                    text: formatMessage({
                        id: "text2speech.speakAndWaitBlock",
                        default: "speak [WORDS]",
                        description: "Speak some words.",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        WORDS: {
                            type: ArgumentType.STRING,
                            defaultValue: "你好",
                        },
                    },
                },
                // {
                //     opcode: "voiceRecognition",
                //     text: formatMessage({
                //         id: "text2speech.voiceRecognitionBlock",
                //         default: "开始[RECO_LANG]语音识别，持续[VOICE_RECO_TIME]秒",
                //         description: "Voice recognition",
                //     }),
                //     blockType: BlockType.COMMAND,
                //     arguments: {
                //         RECO_LANG: {
                //             type: ArgumentType.STRING,
                //             defaultValue: "1537",
                //             menu: "RECO_LANG"
                //         },
                //         VOICE_RECO_TIME: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 2,
                //             menu: "VOICE_RECO_TIME"
                //         },
                //     },
                // },
            ],
            menus: {
                VOICE_LIST: {
                    acceptReporters: true,
                    items: this._buildMenu(this.VOICE_LIST_INFO),
                },
                VOICE_READ_OPTION: {
                    acceptReporters: true,
                    items: this._buildMenu(this.VOICE_READ_OPTION_INFO),
                },
                VOICE_READ_OPTION_VALUE: {
                    acceptReporters: true,
                    items: this._buildMenu(this.VOICE_READ_OPTION_VALUE_INFO),
                },
                RECO_LANG: {
                    acceptReporters: true,
                    items: this._buildMenu(this.RECO_LANG_INFO)
                },
                VOICE_RECO_TIME: {
                    acceptReporters: true,
                    items: this._buildMenu(this.VOICE_RECO_TIME_INFO)
                },
            },
        };
    }

    speakAndWait(args, util) {
        // Cast input to string
        let words = Cast.toString(args.WORDS);

        const state = this._getState(util.target);

        const { speaker, spd, pit, vol } = state;

        // Perform HTTP request to get audio file
        return (
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL.SPEAK,
                {
                    method: "POST",
                    body: JSON.stringify({
                        str: words,
                        per: speaker,
                        spd,
                        pit,
                        vol,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
                serverTimeoutMs
            )
                .then((res) => {
                    if (res.status !== 200) {
                        throw new Error(
                            `HTTP ${res.status} error reaching translation service`
                        );
                    }

                    return res.arrayBuffer();
                })
                .then((buffer) => {
                    var audioCtx = new AudioContext();

                    audioCtx.decodeAudioData(buffer, function (audioBuffer) {
                        // audioBuffer就是AudioBuffer
                        // 创建AudioBufferSourceNode对象
                        var source = audioCtx.createBufferSource();
                        // 设置AudioBufferSourceNode对象的buffer为复制的3秒AudioBuffer对象
                        source.buffer = audioBuffer;
                        // 这一句是必须的，表示结束，没有这一句没法播放，没有声音
                        // 这里直接结束，实际上可以对结束做一些特效处理
                        source.connect(audioCtx.destination);
                        // 资源开始播放
                        source.start();
                    });
                    // Play the sound
                    // const sound = {
                    //     data: {
                    //         buffer,
                    //     },
                    // };
                    // return this.runtime.audioEngine.decodeSoundPlayer(sound);
                })
                // .then((soundPlayer) => {
                //     this._soundPlayers.set(soundPlayer.id, soundPlayer);

                //     soundPlayer.setPlaybackRate(playbackRate);

                //     // Increase the volume
                //     const engine = this.runtime.audioEngine;
                //     const chain = engine.createEffectChain();
                //     chain.set("volume", 250);
                //     soundPlayer.connect(chain);

                //     soundPlayer.play();
                //     return new Promise((resolve) => {
                //         soundPlayer.on("stop", () => {
                //             this._soundPlayers.delete(soundPlayer.id);
                //             resolve();
                //         });
                //     });
                // })
                .catch((err) => {
                    log.warn(err);
                })
        );
    }

    setSpeaker(args, util) {
        const state = this._getState(util.target);
        state.speaker = args.SPEAKER;
    }

    setSpeakOptions(args, util) {
        const state = this._getState(util.target);
        state[args.VOICE_READ_OPTION] = args.VOICE_READ_OPTION_VALUE;
    }

    voiceRecognition(args, util) {
        const dev_pid = args.RECO_LANG
        const duration = args.VOICE_RECO_TIME
    }
}

module.exports = diVoice;
