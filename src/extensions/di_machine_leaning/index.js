// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Clone = require("../../util/clone");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const { v4: uuidv4 } = require("uuid");
const dispatch = require("../../dispatch/central-dispatch");

const menuIconURI =
    "data:image/png;base64,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";
const blockIconURI =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMjIgMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbi3mnLrlmajlrabkuaAtMjI8L3RpdGxlPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iOS4xMy3kv67mlLnku6PnoIHlnZfpopzoibItLWljb27lj5jnmb3oibIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC4wMDAwMDAsIC04ODYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY29uLeacuuWZqOWtpuS5oC0yMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCA4ODYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnn6nlvaIiIHg9IjIiIHk9IjUiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiI+PC9yZWN0PgogICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hOWkh+S7vS0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjAwMDAwMCwgNC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMy40LDEzLjY2NjY2NjcgTDIuNiwxMy42NjY2NjY3IEMyLjIsMTMuNjY2NjY2NyAxLjkzMzMzMzMzLDEzLjkzMzMzMzMgMS45MzMzMzMzMywxNC4zMzMzMzMzIEMxLjkzMzMzMzMzLDE0LjczMzMzMzMgMi4yLDE1IDIuNiwxNSBMMTMuNCwxNSBDMTMuOCwxNSAxNC4wNjY2NjY3LDE0LjczMzMzMzMgMTQuMDY2NjY2NywxNC4zMzMzMzMzIEMxNC4wNjY2NjY3LDEzLjkzMzMzMzMgMTMuNzMzMzMzMywxMy42NjY2NjY3IDEzLjQsMTMuNjY2NjY2NyBaIE0wLjY2NjY2NjY3Miw2LjczMzMzMzMzIEMwLjI2NjY2NjY3Miw2LjczMzMzMzMzIDAsNyAwLDcuNCBMMCwxMC4wNjY2NjY3IEMwLDEwLjQ2NjY2NjcgMC4yNjY2NjY2NzIsMTAuNzMzMzMzMyAwLjY2NjY2NjY3MiwxMC43MzMzMzMzIEMxLjA2NjY2NjY3LDEwLjczMzMzMzMgMS4zMzMzMzMzMywxMC40NjY2NjY3IDEuMzMzMzMzMzMsMTAuMDY2NjY2NyBMMS4zMzMzMzMzMyw3LjQgQzEuMzMzMzMzMzMsNyAxLjA2NjY2NjY2LDYuNzMzMzMzMzMgMC42NjY2NjY2NzIsNi43MzMzMzMzMyBaIE0xNS4zMzMzMzMzLDYuNzMzMzMzMzMgQzE0LjkzMzMzMzMsNi43MzMzMzMzMyAxNC42NjY2NjY3LDcgMTQuNjY2NjY2Nyw3LjQgTDE0LjY2NjY2NjcsMTAuMDY2NjY2NyBDMTQuNjY2NjY2NywxMC40NjY2NjY3IDE0LjkzMzMzMzMsMTAuNzMzMzMzMyAxNS4zMzMzMzMzLDEwLjczMzMzMzMgQzE1LjczMzMzMzMsMTAuNzMzMzMzMyAxNiwxMC40NjY2NjY3IDE2LDEwLjA2NjY2NjcgTDE2LDcuNCBDMTYsNyAxNS43MzMzMzMzLDYuNzMzMzMzMzMgMTUuMzMzMzMzMyw2LjczMzMzMzMzIFogTTEwLDQuMzMzMzMzMzMgTDguNjY2NjY2NjcsNC4zMzMzMzMzMyBMOC42NjY2NjY2NywzLjIgQzkuMjY2NjY2NjcsMi45MzMzMzMzMyA5LjY2NjY2NjY3LDIuMzMzMzMzMzMgOS42NjY2NjY2NywxLjY2NjY2NjY2IEM5LjY2NjY2NjY3LDAuNzMzMzMzMzI4IDguOTMzMzMzMzQsMi4yMjA0NDYwNWUtMTYgOCwyLjIyMDQ0NjA1ZS0xNiBDNy4wNjY2NjY2NiwyLjIyMDQ0NjA1ZS0xNiA2LjMzMzMzMzMzLDAuOCA2LjMzMzMzMzMzLDEuNjY2NjY2NjYgQzYuMzMzMzMzMzMsMi4zMzMzMzMzMyA2LjczMzMzMzMzLDIuOTMzMzMzMzMgNy4zMzMzMzMzMywzLjIgTDcuMzMzMzMzMzMsNC4zMzMzMzMzMyBMNiw0LjMzMzMzMzMzIEMzLjYsNC4zMzMzMzMzMyAxLjY2NjY2NjY3LDYuMjY2NjY2NjYgMS42NjY2NjY2Nyw4LjY2NjY2NjY2IEMxLjY2NjY2NjY3LDExLjA2NjY2NjcgMy42LDEzIDYsMTMgTDEwLDEzIEMxMi40LDEzIDE0LjMzMzMzMzMsMTEuMDY2NjY2NyAxNC4zMzMzMzMzLDguNjY2NjY2NjYgQzE0LjMzMzMzMzMsNi4yNjY2NjY2NCAxMi40LDQuMzMzMzMzMzMgMTAsNC4zMzMzMzMzMyBaIE01LjY2NjY2NjY3LDEwIEM0LjkzMzMzMzM0LDEwIDQuMzMzMzMzMzMsOS40IDQuMzMzMzMzMzMsOC42NjY2NjY2NiBDNC4zMzMzMzMzMyw3LjkzMzMzMzMxIDQuOTMzMzMzMzMsNy4zMzMzMzMzMyA1LjY2NjY2NjY3LDcuMzMzMzMzMzMgQzYuNDAwMDAwMDIsNy4zMzMzMzMzMyA3LDcuOTMzMzMzMzMgNyw4LjY2NjY2NjY2IEM3LDkuNDY2NjY2NjYgNi40LDEwIDUuNjY2NjY2NjcsMTAgWiBNMTAuMzMzMzMzMywxMCBDOS42LDEwIDksOS40IDksOC42NjY2NjY2NiBDOSw3LjkzMzMzMzMxIDkuNiw3LjMzMzMzMzMzIDEwLjMzMzMzMzMsNy4zMzMzMzMzMyBDMTEuMDY2NjY2Nyw3LjMzMzMzMzMzIDExLjY2NjY2NjcsNy45MzMzMzMzMyAxMS42NjY2NjY3LDguNjY2NjY2NjYgQzExLjY2NjY2NjcsOS40NjY2NjY2NiAxMS4wNjY2NjY3LDEwIDEwLjMzMzMzMzMsMTAgWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=";

/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

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

    getInfo(test='哈哈') {
        return {
            id: "diMachineLearning",
            name: "机器学习",
            color1: "#FF7C00",
            color2: "#FF7C00",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: this.getBlocks(test),
            menus: {
                CLASS_LIST: {
                    items: [
                        {
                            text: "分类1",
                            value: "分类1",
                        },
                        {
                            text: "分类2",
                            value: "分类2",
                        },
                        {
                            text: "分类3",
                            value: "分类3",
                        },
                    ],
                },
            },
        };
    }

    getBlocks(test) {
        return [
            {
                func: "trainModel",
                blockType: BlockType.BUTTON,
                text: formatMessage({
                    id: "machineLearning.trainModel",
                    default: "训练模型",
                    description: "trainModel",
                }),
            },
            {
                func: "startImgPredict",
                blockType: BlockType.BUTTON,
                text: formatMessage({
                    id: "machineLearning.startImgPredict",
                    default: "打开识别窗口",
                    description: "startImgPredict",
                }),
            },
            {
                opcode: "test",
                blockType: BlockType.COMMAND,
                text: formatMessage({
                    id: "machineLearning.test",
                    default: test,
                    description: "test",
                }),
            },
            {
                opcode: "predictResult",
                blockType: BlockType.REPORTER,
                text: formatMessage({
                    id: "machineLearning.predictResult",
                    default: "识别结果",
                    description: "predictResult",
                }),
            },
            {
                opcode: "confidence",
                blockType: BlockType.REPORTER,
                text: formatMessage({
                    id: "machineLearning.confidence",
                    default: "[CLASS]信心",
                    description: "confidence",
                }),
                arguments: {
                    CLASS: {
                        type: ArgumentType.NUMBER,
                        defaultValue: "分类1",
                        menu: "CLASS_LIST",
                    },
                },
                label: "已选分类信心",
            },
            {
                opcode: "predictResultBoolean",
                blockType: BlockType.BOOLEAN,
                text: formatMessage({
                    id: "machineLearning.predictResultBoolean",
                    default: "识别结果为[CLASS]",
                    description: "predictResultBoolean",
                }),
                arguments: {
                    CLASS: {
                        type: ArgumentType.NUMBER,
                        defaultValue: "分类1",
                        menu: "CLASS_LIST",
                    },
                },
            },
        ];
    }

    predictResult() {
        return new Promise((resolve, reject) => {
            this.runtime.once("img_predict_result", (result) => {
                console.log(result);
                result.sort((a, b) => b.confidence - a.confidence);
                resolve(result[0].className);
            });
            this.runtime.emit("start_img_predict_result");
        });
    }

    confidence(args) {
        const CLASS = args.CLASS;
        return new Promise((resolve, reject) => {
            this.runtime.once("img_predict_result", (result) => {
                const find = result.find((e) => e.className === CLASS);
                resolve((find.confidence * 100).toFixed(2) + "%");
            });
            this.runtime.emit("start_img_predict_result");
        });
    }

    predictResultBoolean(args) {
        const CLASS = args.CLASS;
        return new Promise((resolve, reject) => {
            this.runtime.once("img_predict_result", (result) => {
                console.log(result);
                result.sort((a, b) => b.confidence - a.confidence);
                resolve(result[0].className === CLASS);
            });
            this.runtime.emit("start_img_predict_result");
        });
    }

    test() {
        dispatch.call("runtime", "_refreshExtensionPrimitives", this.getInfo('嘿嘿嘿'));
    };
}

module.exports = MachineLearning;
