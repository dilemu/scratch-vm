// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");
const { v4: uuidv4 } = require("uuid");

const menuIconURI = null;
const blockIconURI = null;

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
            color1: "#0079FF",
            color2: "#0061CC",
            color3: "#3373CC",
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
                        default: "手势识别",
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
                        default: "情绪识别",
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
                        default: "人流量",
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
                        }
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
                }
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
                            (res.data && res.data.name) || "未能识别";
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
            (state.characterResult[type] && state.characterResult[type].name) ||
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
