// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");
const { v4: uuidv4 } = require("uuid");

const menuIconURI = "data:image/png;base64,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";
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMjIgMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbi3kurrkvZPor4bliKstMjI8L3RpdGxlPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iOS4xMy3kv67mlLnku6PnoIHlnZfpopzoibItLWljb27lj5jnmb3oibIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC4wMDAwMDAsIC03OTYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY29uLeS6uuS9k+ivhuWIqy0yMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCA3OTYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik03LjMzMzMzMzMzLDE3LjY2NjY2NjcgTDQuNzMzMzMzMzMsMTcuNjY2NjY2NyBDNC41MzMzMzMzMywxNy42NjY2NjY3IDQuMzMzMzMzMzMsMTcuNDY2NjY2NyA0LjMzMzMzMzMzLDE3LjI2NjY2NjcgTDQuMzMzMzMzMzMsMTQuNjY2NjY2NyBDNC4zMzMzMzMzMywxNC4yNjY2NjY3IDQuMDY2NjY2NjYsMTQgMy42NjY2NjY2NywxNCBDMy4yNjY2NjY2OSwxNCAzLDE0LjI2NjY2NjcgMywxNC42NjY2NjY3IEwzLDE3LjI2NjY2NjcgQzMsMTguMiAzLjgsMTkgNC43MzMzMzMzMywxOSBMNy4zMzMzMzMzMywxOSBDNy43MzMzMzMzMywxOSA4LDE4LjczMzMzMzMgOCwxOC4zMzMzMzMzIEM4LDE3LjkzMzMzMzMgNy43MzMzMzMzMywxNy42NjY2NjY3IDcuMzMzMzMzMzMsMTcuNjY2NjY2NyBMNy4zMzMzMzMzMywxNy42NjY2NjY3IFogTTE4LjMzMzMzMzMsMTQgQzE3LjkzMzMzMzMsMTQgMTcuNjY2NjY2NywxNC4yNjY2NjY3IDE3LjY2NjY2NjcsMTQuNjY2NjY2NyBMMTcuNjY2NjY2NywxNy4yNjY2NjY3IEMxNy42NjY2NjY3LDE3LjUzMzMzMzMgMTcuNDY2NjY2NywxNy42NjY2NjY3IDE3LjI2NjY2NjcsMTcuNjY2NjY2NyBMMTQuNjY2NjY2NywxNy42NjY2NjY3IEMxNC4yNjY2NjY3LDE3LjY2NjY2NjcgMTQsMTcuOTMzMzMzMyAxNCwxOC4zMzMzMzMzIEMxNCwxOC43MzMzMzMzIDE0LjI2NjY2NjcsMTkgMTQuNjY2NjY2NywxOSBMMTcuMjY2NjY2NywxOSBDMTguMjY2NjY2NywxOSAxOSwxOC4yIDE5LDE3LjI2NjY2NjcgTDE5LDE0LjY2NjY2NjcgQzE5LDE0LjI2NjY2NjcgMTguNzMzMzMzMywxNCAxOC4zMzMzMzMzLDE0IEwxOC4zMzMzMzMzLDE0IFogTTE3LjI2NjY2NjcsMyBMMTQuNjY2NjY2NywzIEMxNC4yNjY2NjY3LDMgMTQsMy4yNjY2NjY2NyAxNCwzLjY2NjY2NjY3IEMxNCw0LjA2NjY2NjY3IDE0LjI2NjY2NjcsNC4zMzMzMzMzNCAxNC42NjY2NjY3LDQuMzMzMzMzMzMgTDE3LjI2NjY2NjcsNC4zMzMzMzMzMyBDMTcuNDY2NjY2Nyw0LjMzMzMzMzMzIDE3LjY2NjY2NjcsNC41MzMzMzMzMyAxNy42NjY2NjY3LDQuNzMzMzMzMzMgTDE3LjY2NjY2NjcsNy4zMzMzMzMzMyBDMTcuNjY2NjY2Nyw3LjczMzMzMzMzIDE3LjkzMzMzMzMsOCAxOC4zMzMzMzMzLDggQzE4LjczMzMzMzMsOCAxOSw3LjczMzMzMzMzIDE5LDcuMzMzMzMzMzMgTDE5LDQuNzMzMzMzMzMgQzE5LDMuOCAxOC4yLDMgMTcuMjY2NjY2NywzIFogTTMuNjY2NjY2NjcsOCBDNC4wNjY2NjY2Nyw4IDQuMzMzMzMzMzQsNy43MzMzMzMzMyA0LjMzMzMzMzMzLDcuMzMzMzMzMzMgTDQuMzMzMzMzMzMsNC43MzMzMzMzMyBDNC4zMzMzMzMzMyw0LjUzMzMzMzMzIDQuNTMzMzMzMzMsNC4zMzMzMzMzMyA0LjczMzMzMzMzLDQuMzMzMzMzMzMgTDcuMzMzMzMzMzMsNC4zMzMzMzMzMyBDNy43MzMzMzMzMyw0LjMzMzMzMzMzIDgsNC4wNjY2NjY2NiA4LDMuNjY2NjY2NjcgQzgsMy4yNjY2NjY2OSA3LjczMzMzMzMzLDMgNy4zMzMzMzMzMywzIEw0LjczMzMzMzMzLDMgQzMuOCwzIDMsMy44IDMsNC43MzMzMzMzMyBMMyw3LjMzMzMzMzMzIEMzLDcuNzMzMzMzMzMgMy4yNjY2NjY2Nyw4IDMuNjY2NjY2NjcsOCBMMy42NjY2NjY2Nyw4IFogTTExLDguMzMzMzMzMzMgQzEyLjEzMzMzMzMsOC4zMzMzMzMzMyAxMyw3LjQ2NjY2NjY2IDEzLDYuMzMzMzMzMzMgQzEzLDUuMiAxMi4xMzMzMzMzLDQuMzMzMzMzMzMgMTEsNC4zMzMzMzMzMyBDOS44NjY2NjY2Nyw0LjMzMzMzMzMzIDksNS4yIDksNi4zMzMzMzMzMyBDOSw3LjQ2NjY2NjY2IDkuODY2NjY2NjcsOC4zMzMzMzMzMyAxMSw4LjMzMzMzMzMzIFogTTExLjY2NjY2NjcsMTAuOCBMMTEuNjY2NjY2NywxMCBMMTUuMzMzMzMzMywxMCBDMTUuNzMzMzMzMywxMCAxNiw5LjczMzMzMzMzIDE2LDkuMzMzMzMzMzMgQzE2LDguOTMzMzMzMzMgMTUuNzMzMzMzMyw4LjY2NjY2NjY3IDE1LjMzMzMzMzMsOC42NjY2NjY2NyBMNi42NjY2NjY2Nyw4LjY2NjY2NjY3IEM2LjI2NjY2NjY3LDguNjY2NjY2NjcgNiw4LjkzMzMzMzM0IDYsOS4zMzMzMzMzMyBDNiw5LjczMzMzMzMxIDYuMjY2NjY2NjcsMTAgNi42NjY2NjY2NywxMCBMMTAuMzMzMzMzMywxMCBMMTAuMzMzMzMzMywxMC44IEM5LjQsMTEuMDY2NjY2NyA4LjY2NjY2NjY2LDEyIDguNjY2NjY2NjcsMTMgTDguNjY2NjY2NjcsMTYuMzMzMzMzMyBDOC42NjY2NjY2NywxNi43MzMzMzMzIDguOTMzMzMzMzQsMTcgOS4zMzMzMzMzMywxNyBDOS43MzMzMzMzMSwxNyAxMCwxNi43MzMzMzMzIDEwLDE2LjMzMzMzMzMgTDEwLDEzIEMxMCwxMi40NjY2NjY3IDEwLjQ2NjY2NjcsMTIgMTEsMTIgQzExLjUzMzMzMzMsMTIgMTIsMTIuNDY2NjY2NyAxMiwxMyBMMTIsMTYuMzMzMzMzMyBDMTIsMTYuNzMzMzMzMyAxMi4yNjY2NjY3LDE3IDEyLjY2NjY2NjcsMTcgQzEzLjA2NjY2NjcsMTcgMTMuMzMzMzMzMywxNi43MzMzMzMzIDEzLjMzMzMzMzMsMTYuMzMzMzMzMyBMMTMuMzMzMzMzMywxMyBDMTMuMzMzMzMzMywxMS45MzMzMzMzIDEyLjYsMTEuMDY2NjY2NyAxMS42NjY2NjY3LDEwLjggWiIgaWQ9IuW9oueKtiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";

const REMOTE_URL = {
    GESTURE: "/api/body/gesture/recognition",
    CHARACTER: "/api/body/characteristics",
    EMOTION: "/api/face/emotion/classify",
    BODYNUM: "/api/body/numbers",
    BODYAXES: "/api/body/keys",
};

/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

class diBodyRecognition {
    constructor(runtime) {
        this.runtime = runtime;
        // communication related
        this.comm = runtime.ioDevices.comm;
        this.runtime.registerPeripheralExtension("diBodyRecognition", this);
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return "Di.diBodyRecognition";
    }
    /**
     * The default state, to be used when a target has no existing state.
     * @type {HelloWorldState}
     */
    static get DEFAULT_IMAGERECOGNITION_STATE() {
        return {
            gestureResult: "待识别",
            emotionResult: "待识别",
            bodyNumResult: "待识别",
            characterResult: {},
            bodyAxesResult: {}
        };
    }

    get REMOTE_URL() {
        return REMOTE_URL;
    }

    get WAIT_LIST() {
        return [
            {
                name: formatMessage({
                    id: "imageRecognition.time_1",
                    default: "1",
                }),
                value: 1,
            },
            {
                name: formatMessage({
                    id: "imageRecognition.time_2",
                    default: "2",
                }),
                value: 2,
            },
            {
                name: formatMessage({
                    id: "imageRecognition.time_31",
                    default: "3",
                }),
                value: 3,
            },
            {
                name: formatMessage({
                    id: "imageRecognition.time_4",
                    default: "4",
                }),
                value: 4,
            },
            {
                name: formatMessage({
                    id: "imageRecognition.time_5",
                    default: "5",
                }),
                value: 5,
            },
        ];
    }

    get CHARACTER_INFO() {
        return [
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.glasses",
                    default: "眼镜类型",
                }),
                value: "glasses",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.headwear",
                    default: "帽子类型",
                }),
                value: "headwear",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.face_mask",
                    default: "佩戴口罩",
                }),
                value: "face_mask",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.gender",
                    default: "性别",
                }),
                value: "gender",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.age",
                    default: "年龄阶段",
                }),
                value: "age",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.upper_color",
                    default: "上半身衣着颜色",
                }),
                value: "upper_color",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.lower_color",
                    default: "下半身衣着颜色",
                }),
                value: "lower_color",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.upper_wear_fg",
                    default: "上身服饰细分类",
                }),
                value: "upper_wear_fg",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.lower_wear",
                    default: "下身服饰",
                }),
                value: "lower_wear",
            },
        ];
    }

    get BODYAXES_INFO() {
        return [
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.left_eye",
                    default: "左眼",
                }),
                value: "left_eye",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.right_eye",
                    default: "右眼",
                }),
                value: "right_eye",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.nose",
                    default: "鼻子",
                }),
                value: "nose",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.left_mouth_corner",
                    default: "左嘴角",
                }),
                value: "left_mouth_corner",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.right_mouth_corner",
                    default: "右嘴角",
                }),
                value: "right_mouth_corner",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.left_wrist",
                    default: "左手腕",
                }),
                value: "left_wrist",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.character_list.right_wrist",
                    default: "右手腕",
                }),
                value: "right_wrist",
            },
        ];
    }
    
    get COORDINATE_INFO() {
        return [
            {
                name: formatMessage({
                    id: "imageRecognition.bodyaxes.x",
                    default: "x坐标",
                }),
                value: "x",
            },
            {
                name: formatMessage({
                    id: "imageRecognition.bodyaxes.y",
                    default: "y坐标",
                }),
                value: "y",
            },
        ];
    }
    /**
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(diBodyRecognition.STATE_KEY);
        if (!state) {
            state = Clone.simple(
                diBodyRecognition.DEFAULT_IMAGERECOGNITION_STATE
            );
            target.setCustomState(diBodyRecognition.STATE_KEY, state);
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
            id: "diBodyRecognition",
            name: "人体识别",
            color1: "#E05471",
            color2: "#E05471",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "gesture",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "imageRecognition.gesture",
                        default: "[WAIT_TIME]秒后开始识别手势",
                        description: "start recogntion",
                    }),
                    arguments: {
                        WAIT_TIME: {
                            type: ArgumentType.NUMBER,
                            menu: "WAIT_TIME_LIST",
                            defaultValue: 2,
                        },
                    },
                },
                {
                    opcode: "reportGesture",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "imageRecognition.reportGesture",
                        default: "手势识别结果",
                        description: "reportGesture",
                    }),
                },
                {
                    opcode: "emotion",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "imageRecognition.emotion",
                        default: "[WAIT_TIME]秒后开始识别情绪",
                        description: "start recogntion",
                    }),
                    arguments: {
                        WAIT_TIME: {
                            type: ArgumentType.NUMBER,
                            menu: "WAIT_TIME_LIST",
                            defaultValue: 2,
                        },
                    },
                },
                {
                    opcode: "reportEmotion",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "imageRecognition.reportEmotion",
                        default: "情绪识别结果",
                        description: "reportEmotion",
                    }),
                },
                {
                    opcode: "bodyNum",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "imageRecognition.bodyNum",
                        default: "[WAIT_TIME]秒后开始检测人流量",
                        description: "start recogntion",
                    }),
                    arguments: {
                        WAIT_TIME: {
                            type: ArgumentType.NUMBER,
                            menu: "WAIT_TIME_LIST",
                            defaultValue: 2,
                        },
                    },
                },
                {
                    opcode: "reportBodyNum",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "imageRecognition.reportBodyNum",
                        default: "人流量识别结果",
                        description: "reportBodyNum",
                    }),
                },
                {
                    opcode: "character",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "imageRecognition.character",
                        default: "[WAIT_TIME]秒后开始识别人体特征",
                        description: "start recogntion",
                    }),
                    arguments: {
                        WAIT_TIME: {
                            type: ArgumentType.NUMBER,
                            menu: "WAIT_TIME_LIST",
                            defaultValue: 2,
                        },
                    },
                },
                {
                    opcode: "reportCharacter",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "imageRecognition.reportCharacter",
                        default: "人体特征识别结果[TYPE]",
                        description: "reportCharacter",
                    }),
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: "CHARACTER_LIST",
                            defaultValue: "gender",
                        },
                    },
                },
                {
                    opcode: "body",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "imageRecognition.body",
                        default: "[WAIT_TIME]秒后开始识别人体部位",
                        description: "start recogntion",
                    }),
                    arguments: {
                        WAIT_TIME: {
                            type: ArgumentType.NUMBER,
                            menu: "WAIT_TIME_LIST",
                            defaultValue: 2,
                        },
                    },
                },
                {
                    opcode: "reportBody",
                    blockType: BlockType.REPORTER,
                    checkboxInFlyout: true,
                    text: formatMessage({
                        id: "imageRecognition.reportBody",
                        default: "关键点[TYPE]的[COORDINATE]",
                        description: "reportBody",
                    }),
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: "BODYAXES_LIST",
                            defaultValue: "nose",
                        },
                        COORDINATE: {
                            type: ArgumentType.STRING,
                            menu: "COORDINATE_LIST",
                            defaultValue: "x",
                        },
                    },
                },
            ],
            menus: {
                WAIT_TIME_LIST: {
                    acceptReporters: true,
                    items: this._buildMenu(this.WAIT_LIST),
                },
                CHARACTER_LIST: {
                    acceptReporters: true,
                    items: this._buildMenu(this.CHARACTER_INFO),
                },
                BODYAXES_LIST: {
                    acceptReporters: true,
                    items: this._buildMenu(this.BODYAXES_INFO),
                },
                COORDINATE_LIST: {
                    acceptReporters: true,
                    items: this._buildMenu(this.COORDINATE_INFO),
                },
            },
        };
    }

    gesture(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const uuid = uuidv4();
        const options = {
            uuid,
            type: "photo",
            countDown: args.WAIT_TIME,
        };
        this.runtime.emit("start_web_cam", options);
        return new Promise((resolve, reject) => {
            this.runtime.on(uuid, (blob) => {
                if (!blob) reject();
                const form = new FormData();
                form.append("file", blob);
                const xhr = new XMLHttpRequest();
                xhr.open(
                    "POST",
                    this.runtime.REMOTE_HOST + this.REMOTE_URL.GESTURE
                );
                xhr.send(form);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        const res = JSON.parse(xhr.response);
                        state.gestureResult =
                            (res.data && res.data.name && res.data.name.replace(/（.*?）/g, '' )) || "未能识别";
                    }
                    resolve();
                };
            });
        });
    }

    reportGesture(args, util) {
        const state = this._getState(util.target);
        return state.gestureResult;
    }

    emotion(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const uuid = uuidv4();
        const options = {
            uuid,
            type: "photo",
            countDown: args.WAIT_TIME,
        };
        this.runtime.emit("start_web_cam", options);
        return new Promise((resolve, reject) => {
            this.runtime.on(uuid, (blob) => {
                if (!blob) reject();
                const form = new FormData();
                form.append("file", blob);
                const xhr = new XMLHttpRequest();
                xhr.open(
                    "POST",
                    this.runtime.REMOTE_HOST + this.REMOTE_URL.EMOTION
                );
                xhr.send(form);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        const res = JSON.parse(xhr.response);
                        state.emotionResult =
                            (res.data && res.data.type) || "未能识别";
                    }
                    resolve();
                };
            });
        });
    }

    reportEmotion(args, util) {
        const state = this._getState(util.target);
        return state.emotionResult;
    }

    bodyNum(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const uuid = uuidv4();
        const options = {
            uuid,
            type: "photo",
            countDown: args.WAIT_TIME,
        };
        this.runtime.emit("start_web_cam", options);
        return new Promise((resolve, reject) => {
            this.runtime.on(uuid, (blob) => {
                if (!blob) reject();
                const form = new FormData();
                form.append("file", blob);
                const xhr = new XMLHttpRequest();
                xhr.open(
                    "POST",
                    this.runtime.REMOTE_HOST + this.REMOTE_URL.BODYNUM
                );
                xhr.send(form);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        const res = JSON.parse(xhr.response);
                        state.bodyNumResult = res.data + "人" || "未能识别";
                    }
                    resolve();
                };
            });
        });
    }

    reportBodyNum(args, util) {
        const state = this._getState(util.target);
        return state.bodyNumResult;
    }

    character(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const uuid = uuidv4();
        const options = {
            uuid,
            type: "photo",
            countDown: args.WAIT_TIME,
        };
        this.runtime.emit("start_web_cam", options);
        return new Promise((resolve, reject) => {
            this.runtime.on(uuid, (blob) => {
                if (!blob) reject();
                const form = new FormData();
                form.append("file", blob);
                const xhr = new XMLHttpRequest();
                xhr.open(
                    "POST",
                    this.runtime.REMOTE_HOST + this.REMOTE_URL.CHARACTER
                );
                xhr.send(form);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        const res = JSON.parse(xhr.response);
                        state.characterResult = res.data;
                    }
                    resolve("识别完毕");
                };
            });
        });
    }

    reportCharacter(args, util) {
        const state = this._getState(util.target);
        const type = args.TYPE;
        return (
            (state.characterResult[type] &&
                state.characterResult[type].name.replace("无口罩", "不确定")) ||
            "未能识别"
        );
    }

    body(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const uuid = uuidv4();
        const options = {
            uuid,
            type: "photo",
            countDown: args.WAIT_TIME,
        };
        this.runtime.emit("start_web_cam", options);
        return new Promise((resolve, reject) => {
            this.runtime.on(uuid, (blob) => {
                if (!blob) reject();
                const form = new FormData();
                form.append("file", blob);
                const xhr = new XMLHttpRequest();
                xhr.open(
                    "POST",
                    this.runtime.REMOTE_HOST + this.REMOTE_URL.BODYAXES
                );
                xhr.send(form);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        const res = JSON.parse(xhr.response);
                        state.bodyAxesResult = res.data;
                    }
                    resolve("识别完毕");
                };
            });
        });
    }

    reportBody(args, util) {
        const state = this._getState(util.target);
        const type = args.TYPE;
        const coordinate = args.COORDINATE;
        return (
            (state.bodyAxesResult[type] && state.bodyAxesResult[type][coordinate]) ||
            "未能识别"
        );
    }
}

module.exports = diBodyRecognition;
