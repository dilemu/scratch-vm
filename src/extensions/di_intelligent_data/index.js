// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");

const menuIconURI = null;
const blockIconURI = null;

/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

const REMOTE_URL = {
    UNIT: "/api/talk/classify",
};

class TextRecognition {
    constructor(runtime) {
        this.runtime = runtime;
        // communication related
        this.comm = runtime.ioDevices.comm;
        this.session = null;
        this.runtime.registerPeripheralExtension("diTextRecognition", this);
        // session callbacks
        this.reporter = null;
        // string op
        this.decoder = new TextDecoder();
        this.lineBuffer = "";
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return "Di.TextRecognition";
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
        let state = target.getCustomState(TextRecognition.STATE_KEY);
        if (!state) {
            state = Clone.simple(
                TextRecognition.DEFAULT_IMAGERECOGNITION_STATE
            );
            target.setCustomState(TextRecognition.STATE_KEY, state);
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

    getInfo() {
        return {
            id: "diTextRecognition",
            name: "智能数据",
            color1: "#D8D8D8",
            color2: "#009AFF",
            color3: "#3373CC",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "RobotAnswer",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diTextRecognition.talkBack",
                        default: "我的回答是[TXT]",
                        description: "Robot saying",
                    }),
                    arguments: {
                      TXT: {
                          type: ArgumentType.IMAGE,
                          defaultValue: formatMessage({
                              id: "diTextRecognition.defaultSayWords",
                              default: "你好",
                              description: "default word",
                          }),
                      },
                  },
                },
            ],
        };
    }

    sayToRobot(args, util) {
        const TXT = args.TXT;
        const state = this._getState(util.target);
        state.robotQuestion = TXT;
        const generateAnswer = (list) => {
            state.robotAnswer =
                list[Math.floor(Math.random() * list.length)].say;
        };
        if (TXT) {
            return new Promise((resolve, reject) => {
                fetchWithTimeout(
                    this.runtime.REMOTE_HOST + this.REMOTE_URL.UNIT,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            terminal_id: this.runtime.uuid,
                            query: state.robotQuestion,
                        }),
                    },
                    serverTimeoutMs
                )
                    .then((response) => response.json())
                    .then((data) => {
                        state.robotAnswerList = data.data;
                        generateAnswer(state.robotAnswerList);
                        resolve();
                    })
                    .catch(err => {
                        console.log('RequestError', state.remote_url, err)
                    });
            });
        } else {
            alert("请输入智能对话内容！");
        }
    }

    RobotAnswer(args, util) {
        const state = this._getState(util.target);
        return state.robotAnswer;
    }
}

module.exports = TextRecognition;
