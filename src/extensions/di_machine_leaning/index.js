// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Clone = require("../../util/clone");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");

const menuIconURI =
    "data:image/png;base64,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";
const blockIconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAZ1JREFUWEftmDFPhDAUx/vKRC7hC9xk4q1OzsZVR01YSTSBMvgVHPwSJSQuDA4Mjudo4uxiHNXFuLqQyGACNZgj4bBwFMoZkscGLa+//Pvva/uATOyBifESBB57xlDhf1OYcy4aBn/1fX+hA4xz/kII2ZXF8n1fOvuNlpgsMKX0EgAeSxXyPP9ijD3oUDgIggNK6ayMJYTYz/P8qnjvrbBhGMeu697pANwUIwzDoyzLlgi8Sam+7UMVLlYwAYDzqmfjODaSJNnpC1X9z7Ksd9u2v8tvhaeFENcrS0gzkfLGwTmfE0I+dABTSvc8z3tWiYXAKmqhwjK1oiiapWl61qDkQghxUW0DgGIRPcn6m6Z54zjOp8qsKHu4LTjn/JAQcl8DPmWM3apAtfVFYFS45g+0BFoCLVFRAPOwZAfBLIFZomuWWBU5/lyRxjz8DLoilYUUlWv+0Cwx9BL6W6pSBJ4DwEnteLn0PO+ty/Fy68BdoNr6aAGeXKlKoghWL2U2US4GDvXjWP9r3ZrHglzLOtsYROcYqLBONWWxJqfwD8g1JTxCUUorAAAAAElFTkSuQmCC";

/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

const REMOTE_URL = {};

class MachineLearning {
    constructor(runtime) {
        this.runtime = runtime;
        // communication related
        this.comm = runtime.ioDevices.comm;
        this.session = null;
        this.runtime.registerPeripheralExtension("diMachineLearning", this);
        // session callbacks
        this.reporter = null;
        this.onmessage = this.onmessage.bind(this);
        // string op
        this.decoder = new TextDecoder();
        this.lineBuffer = "";
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return "Di.MachineLearning";
    }
    /**
     * The default state, to be used when a target has no existing state.
     * @type {HelloWorldState}
     */
    static get DEFAULT_IMAGERECOGNITION_STATE() {
        return {};
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
        let state = target.getCustomState(MachineLearning.STATE_KEY);
        if (!state) {
            state = Clone.simple(
                MachineLearning.DEFAULT_IMAGERECOGNITION_STATE
            );
            target.setCustomState(MachineLearning.STATE_KEY, state);
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

    onmessage(data) {
        const dataStr = this.decoder.decode(data);
        this.lineBuffer += dataStr;
        if (this.lineBuffer.indexOf("\n") !== -1) {
            const lines = this.lineBuffer.split("\n");
            this.lineBuffer = lines.pop();
            for (const l of lines) {
                if (this.reporter) {
                    const { parser, resolve } = this.reporter;
                    resolve(parser(l));
                }
            }
        }
    }

    getInfo() {
        return {
            id: "diMachineLearning",
            name: "机器学习",
            color1: "#2D589A",
            color2: "#2D589A",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    callbackKey: "trainModel",
                    blockType: BlockType.BUTTON,
                    text: formatMessage({
                        id: "textRecognition.trainModel",
                        default: "训练模型",
                        description: "trainModel",
                    }),
                },
            ],
            menus: {},
        };
    }

    trainModel(e) {
        console.log(e);
    }
}

module.exports = MachineLearning;
