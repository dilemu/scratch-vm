// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require('../../util/cast');
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");

const menuIconURI = null;
const blockIconURI = null;

const REMOTE_URL = {
    SPEAK: "/api/voice/speech/synthesis",
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
        };
    }

    get REMOTE_URL() {
        return REMOTE_URL;
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
            name: "Test",
            color1: "#0079FF",
            color2: "#0061CC",
            color3: "#3373CC",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
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
            ],
        };
    }

    speakAndWait(args, util) {
        // Cast input to string
        let words = Cast.toString(args.WORDS);

        const state = this._getState(util.target);

        let gender = "3";
        let playbackRate = "100";

        // Perform HTTP request to get audio file
        return fetchWithTimeout(
            this.runtime.REMOTE_HOST + this.REMOTE_URL.SPEAK,
            {
                method: "POST",
                body: JSON.stringify({ str: words }),
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

                soundPlayer.setPlaybackRate(playbackRate);

                // Increase the volume
                const engine = this.runtime.audioEngine;
                const chain = engine.createEffectChain();
                chain.set("volume", 100);
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
                log.warn(err);
            });
    }
}

module.exports = diVoice;
