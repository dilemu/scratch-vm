// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const { v4: uuidv4 } = require("uuid");
const log = require("../../util/log");

const menuIconURI = "data:image/png;base64,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";
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMjIgMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbi3or63pn7PkuqTkupItMjI8L3RpdGxlPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iOS4xMy3kv67mlLnku6PnoIHlnZfpopzoibItLWljb27lj5jnmb3oibIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC4wMDAwMDAsIC02NzYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY29uLeivremfs+S6pOS6ki0yMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCA2NzYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2i5aSH5Lu9LTI3IiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMuMDAwMDAwLCA0LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTguMiw5LjQ2NjY2NjY2IEM4LjI2NjY2NjY3LDkuNjY2NjY2NjYgOC40NjY2NjY2Nyw5LjggOC42NjY2NjY2Nyw5LjggQzguODY2NjY2NjcsOS44IDkuMDY2NjY2NjcsOS42NjY2NjY2NyA5LjEzMzMzMzMzLDkuNDY2NjY2NjYgTDkuNjY2NjY2NjcsNy44IEwxMC42NjY2NjY3LDcuOCBDMTAuOTMzMzMzMyw3LjggMTEuMiw3LjYgMTEuMiw3LjI2NjY2NjY2IEMxMS4yLDYuOTMzMzMzMzEgMTEsNi43MzMzMzMzMyAxMC42NjY2NjY3LDYuNzMzMzMzMzMgTDkuMzMzMzMzMzMsNi43MzMzMzMzMyBDOS4xMzMzMzMzMyw2LjczMzMzMzMzIDguOTMzMzMzMzMsNi44NjY2NjY2NiA4Ljg2NjY2NjY3LDcuMDY2NjY2NjYgTDguNjY2NjY2NjcsNy43MzMzMzMzMyBMNy44LDUuMTMzMzMzMzMgQzcuNzMzMzMzMzMsNC45MzMzMzMzMyA3LjUzMzMzMzMzLDQuOCA3LjMzMzMzMzMzLDQuOCBDNy4xMzMzMzMzMyw0LjggNi45MzMzMzMzMyw0LjkzMzMzMzMzIDYuODY2NjY2NjcsNS4xMzMzMzMzMyBMNi4zMzMzMzMzMyw2LjggTDUuMzMzMzMzMzMsNi44IEM1LjA2NjY2NjY2LDYuOCA0LjgsNyA0LjgsNy4zMzMzMzMzMyBDNC44LDcuNjY2NjY2NjYgNSw3Ljg2NjY2NjY2IDUuMzMzMzMzMzMsNy44NjY2NjY2NiBMNi42NjY2NjY2Nyw3Ljg2NjY2NjY2IEM2Ljg2NjY2NjY3LDcuODY2NjY2NjYgNy4wNjY2NjY2Nyw3LjczMzMzMzMzIDcuMTMzMzMzMzMsNy41MzMzMzMzMyBMNy4zMzMzMzMzMyw2LjkzMzMzMzMzIEw4LjIsOS40NjY2NjY2NiBMOC4yLDkuNDY2NjY2NjYgWiIgaWQ9Iui3r+W+hCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy4zMzMzMzMzLDUuMzMzMzMzMzMgQzEzLjMzMzMzMzMsMi40IDEwLjkzMzMzMzMsMCA4LDAgQzUuMDY2NjY2NjcsMCAyLjY2NjY2NjY3LDIuNCAyLjY2NjY2NjY3LDUuMzMzMzMzMzMgQzEuMiw1LjMzMzMzMzMzIDAsNi41MzMzMzMzMyAwLDggQzAsOS40NjY2NjY2NyAxLjIsMTAuNjY2NjY2NyAyLjY2NjY2NjY3LDEwLjY2NjY2NjcgTDMuMzMzMzMzMzMsMTAuNjY2NjY2NyBDMy43MzMzMzMzMywxMC42NjY2NjY3IDQsMTAuNCA0LDEwIEw0LDUuMzMzMzMzMzMgQzQsMy4xMzMzMzMzMyA1LjgsMS4zMzMzMzMzMyA4LDEuMzMzMzMzMzMgQzEwLjIsMS4zMzMzMzMzMyAxMiwzLjEzMzMzMzMzIDEyLDUuMzMzMzMzMzMgTDEyLDkuMzMzMzMzMzMgQzEyLDExLjUzMzMzMzMgMTAuMiwxMy4zMzMzMzMzIDgsMTMuMzMzMzMzMyBDNy42LDEzLjMzMzMzMzMgNy4zMzMzMzMzMywxMy42IDcuMzMzMzMzMzMsMTQgQzcuMzMzMzMzMzMsMTQuNCA3LjYsMTQuNjY2NjY2NyA4LDE0LjY2NjY2NjcgQzEwLjQ2NjY2NjcsMTQuNjY2NjY2NyAxMi41MzMzMzMzLDEyLjkzMzMzMzMgMTMuMTMzMzMzMywxMC42NjY2NjY3IEwxMy4zMzMzMzMzLDEwLjY2NjY2NjcgQzE0LjgsMTAuNjY2NjY2NyAxNiw5LjQ2NjY2NjY2IDE2LDggQzE2LDYuNTMzMzMzMzQgMTQuOCw1LjMzMzMzMzMzIDEzLjMzMzMzMzMsNS4zMzMzMzMzMyBaIiBpZD0i6Lev5b6EIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";

const REMOTE_URL = {
    SPEAK: "/api/voice/speech/synthesis",
    RECOGNITION: "/api/voice/classify",
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
            voiceResult: [],
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
                value: "4",
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
        ];
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
            color1: "#FE695A",
            color2: "#FE695A",
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
                    opcode: "speak",
                    text: formatMessage({
                        id: "textRecognition.speakBlock",
                        default: "朗读 [WORDS]",
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
                {
                    opcode: "speakAndWait",
                    text: formatMessage({
                        id: "textRecognition.speakWaitBlock",
                        default: "朗读 [WORDS]直到结束",
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
                {
                    opcode: "voiceRecognition",
                    text: formatMessage({
                        id: "textRecognition.voiceRecognitionBlock",
                        default:
                            "开始[RECO_LANG]语音识别，持续[VOICE_RECO_TIME]秒",
                        description: "Voice recognition",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        RECO_LANG: {
                            type: ArgumentType.STRING,
                            defaultValue: "1537",
                            menu: "RECO_LANG",
                        },
                        VOICE_RECO_TIME: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 2,
                            menu: "VOICE_RECO_TIME",
                        },
                    },
                },
                {
                    opcode: "voiceRecognitionResult",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "textRecognition.voiceRecognitionResult",
                        default: "语音识别结果",
                        description: "recogntion result",
                    }),
                },
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
                    items: this._buildMenu(this.RECO_LANG_INFO),
                },
                VOICE_RECO_TIME: {
                    acceptReporters: true,
                    items: this._buildMenu(this.VOICE_RECO_TIME_INFO),
                },
            },
        };
    }

    speak(args, util) {
        // Cast input to string
        if (!this.runtime.isLogin()) return;
        let words = Cast.toString(args.WORDS);
        if(!isNaN(words)) words = words.split('').join(',');
        const state = this._getState(util.target);
        const { speaker, spd, pit, vol } = state;
        // Perform HTTP request to get audio file
        return fetchWithTimeout(
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
                    "Access-Token": this.runtime.getToken(),
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
            });
    }

    speakAndWait(args, util) {
        // Cast input to string
        if (!this.runtime.isLogin()) return;
        let words = Cast.toString(args.WORDS);
        if(!isNaN(words)) words = words.split('').join(',');
        const state = this._getState(util.target);
        const { speaker, spd, pit, vol } = state;
        // Perform HTTP request to get audio file
        return fetchWithTimeout(
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
                    "Access-Token": this.runtime.getToken(),
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
                // var audioCtx = new AudioContext();

                // audioCtx.decodeAudioData(buffer, function (audioBuffer) {
                //     // audioBuffer就是AudioBuffer
                //     // 创建AudioBufferSourceNode对象
                //     var source = audioCtx.createBufferSource();
                //     // 设置AudioBufferSourceNode对象的buffer为复制的3秒AudioBuffer对象
                //     source.buffer = audioBuffer;
                //     // 这一句是必须的，表示结束，没有这一句没法播放，没有声音
                //     // 这里直接结束，实际上可以对结束做一些特效处理
                //     source.connect(audioCtx.destination);
                //     // 资源开始播放
                //     source.start();
                // });
                // Play the sound
                const sound = {
                    data: {
                        buffer,
                    },
                };
                return this.runtime.audioEngine.decodeSoundPlayer(sound);
            })
            .then((soundPlayer) => {
                this._soundPlayers.set(soundPlayer.id, soundPlayer);

                soundPlayer.setPlaybackRate(0.89);

                // Increase the volume
                const engine = this.runtime.audioEngine;
                const chain = engine.createEffectChain();
                chain.set("volume", 250);
                soundPlayer.connect(chain);

                soundPlayer.play();
                return new Promise((resolve) => {
                    soundPlayer.on("stop", () => {
                        this._soundPlayers.delete(soundPlayer.id);
                        resolve();
                    });
                });
            })
            .catch((err) => {
                console.log("RequestError", state.remote_url, err);
            });
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
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const dev_pid = args.RECO_LANG;
        const duration = args.VOICE_RECO_TIME;
        const uuid = uuidv4();
        const options = {
            uuid,
            type: "audio",
            duration,
        };
        this.runtime.emit("start_web_cam", options);
        return new Promise((resolve, reject) => {
            this.runtime.on(uuid, (blob) => {
                if (!blob) reject();
                const form = new FormData();
                form.append("file", blob);
                form.append("format", "pcm");
                form.append("rate", 16000);
                form.append("dev_pid", dev_pid);
                const xhr = new XMLHttpRequest();
                xhr.open(
                    "POST",
                    this.runtime.REMOTE_HOST + this.REMOTE_URL.RECOGNITION
                );
                xhr.setRequestHeader("Access-Token", this.runtime.getToken());
                xhr.send(form);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        const res = JSON.parse(xhr.response);
                        state.voiceResult = res.data || [];
                    }
                    resolve();
                };
            });
        });
    }

    voiceRecognitionResult(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        return state.voiceResult.join("，") || "未能识别";
    }
}

module.exports = diVoice;
