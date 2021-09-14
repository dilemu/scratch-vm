const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const MathUtil = require("../../util/math-util");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const { v4: uuidv4 } = require("uuid");
// const MathUtil = require('../../util/math-util');

const RECOGNITION_URL = {
    NORMAL: "/api/image/general/classify",
    ANIMAL: "/api/image/animal/classify",
    BOTANY: "/api/image/plant/classify",
    FRUIT: "/api/image/ingredient/classify",
    CURRENCY: "/api/image/currency/classify",
    LANDMARK: "/api/image/landmark/classify",
};
/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADXElEQVRIS7WVTWgUSRTH/1Xd0z3TM/mYdJKJYxYN4lcSRYiCIkGUFYXsIZfEw15WFM966aPIokJ7UA9exIMnvxI8eFEUFRXBdXE9iJIsWUkUMTNjEpOZnpr0zHTVUjPJOCaSiei8U3V11fvV/71XrwiqbET6X+E4V4Qn1s+zOMFooiZ0AITwZfGFoM0p5wYVaJtfTxTy73go9HsB0DKTesHdzEZK6DBAwYkYTZgN/d8FmJwaoIK0ARxc8A1UDwzF6mq2lgDIZhFrMrcu68QVFrV8mnwBTcMCQI7Emhq6fg5g6h9oPlECNCdTg8jlkTDDfcOf0tFgUL+YzPCwAFCQCECOpS38lnMKAQw/AefiZltIO9c8+XkQPhWJ2pq+4vqBAQV9fULG/CObPXr9L+/cq7EshAA8KFDggcx7/oZECd/T4cOeTs1pNXxhIhMxOEjQ3+8t2jbOXOvMHddOzHhYE3yH3yJ38CDejdfpDpCCDrnlaz1CCLSvVPBHt59FDS1MCMmWqmnhgeLMtey7rv1xhuD4mtNYhRHEkyZOTJwGBy34lu6FIKBElHjtUQUHd+qspRJggrnWqfuuHU8K7Ao+Qq/vGu6n9+F2rncuFwTrIqNYGxnD87dbMJmuL8x3rFBwaIfOmgMVFEwx1zr5MGvHU15ho0Ly8IRaEtpSO4GeLQ9BCUfKDeLWy73IZP3YFKE4tF1njZUA08y1/nzyBVAewpDOsG/zY/jVUogx4YRx73U3OpsUHN7mZ2bAt3QOksy1TjzN2XHHg2l8hpvX4LhBUOph98a/UR9MlhWszIHAf7FV4JkOHOnSWXhZgGc5O6S/RXtkBB6neP6+C61NcawMx+fq5+viExAgmfXo+aWN1Rvq0goc5loX3sTsOmOkFB2iEihasTTlfZD3o/zSSRVhxcSvZierraTAcXLW1Q9D9rSbKSZZ5fAHiglfyhrVevQ0bmDBgLK0AsY86/K7MXs8k4FCOWpCs6CFiJRfrvlxUYcM0WqtAfvN1cwIfCtEZa2Cseyx6bx39n16Fj6FFyCLbUFHEgRRzUBI01IBv9KwqFWUN7t0Oh1VVf0S4aiTroun/2J87vByvnwMUMF5/qbf0M4vanbywUG2iu26CKjyg1PVJ7Pqj36lGv+R//8D7LmuKB40RKIAAAAASUVORK5CYII=";
const blockIconURI =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMjIgMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbi3lm77lg4/or4bliKstMjI8L3RpdGxlPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iOS4xMy3kv67mlLnku6PnoIHlnZfpopzoibItLWljb27lj5jnmb3oibIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC4wMDAwMDAsIC03NjYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY29uLeWbvuWDj+ivhuWIqy0yMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCA3NjYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNi4xMjI1LDUuOTE5ODU3MTQgTDYuMTE5Mjg1NzEsNS45MTk4NTcxNCBDNS41ODgsNS45MTk4NTcxNCA1LjE4MTc4NTcxLDYuMzI2Mjg1NzEgNS4xODE3ODU3MSw2Ljg1NzY0Mjg2IEw1LjE4MTc4NTcxLDE1LjU3ODkyODYgQzUuMTgxNzg1NzEsMTYuMDc5MTQyOSA1LjU4ODA3MTQzLDE2LjUxNjg1NzEgNi4xMTkyODU3MSwxNi41MTY4NTcxIEwxNi4xMjI0Mjg2LDE2LjUxNjg1NzEgQzE2LjYyMjY0MjksMTYuNTE2ODU3MSAxNy4wNjA1LDE2LjA3OTE0MjkgMTcuMDYwNSwxNS41Nzg5Mjg2IEwxNy4wNjA1LDYuODU3NzE0MjkgQzE3LjA2MDUsNi4zNTc1IDE2LjY1NCw1LjkxOTg1NzE0IDE2LjEyMjQyODYsNS45MTk4NTcxNCBMMTYuMTIyNSw1LjkxOTg1NzE0IFogTTguMjQ1MjE0MjksNy41MTQxNDI4NiBDOC43NzY3MTQyOSw3LjUxNDE0Mjg2IDkuMjQ1NSw3Ljk1MTcxNDI5IDkuMjQ1NSw4LjUxNDI4NTcxIEM5LjI0NTUsOS4wNzY5Mjg1NyA4LjgwNzkyODU3LDkuNTE0NTcxNDMgOC4yNDUyMTQyOSw5LjUxNDU3MTQzIEM3LjcxMzg1NzE0LDkuNTE0NTcxNDMgNy4yNDQ5Mjg1Nyw5LjA3NjkyODU3IDcuMjQ0OTI4NTcsOC41MTQyODU3MSBDNy4yNDQ5Mjg1Nyw3Ljk1MTcxNDI5IDcuNzEzODU3MTQsNy41MTQwNzE0MyA4LjI0NTIxNDI5LDcuNTE0MDcxNDMgTDguMjQ1MjE0MjksNy41MTQxNDI4NiBaIE03LjUyNjM1NzE0LDE1LjExMDA3MTQgQzcuNDMyMzU3MTQsMTUuMTEwMDcxNCA3LjMzODc4NTcxLDE1LjA3ODcxNDMgNy4yNDQ5Mjg1NywxNS4wMTYyODU3IEM3LjA1NzM1NzE0LDE0Ljg2IDcuMDU3MzU3MTQsMTQuNjQxMTQyOSA3LjIxMzc4NTcxLDE0LjQ1MzcxNDMgTDkuMTUxODU3MTQsMTEuNzM0MTQyOSBDOS4zMDgwNzE0MywxMS41Nzc3MTQzIDkuNTI3MDcxNDMsMTEuNTQ2NTcxNCA5LjcxNDUsMTEuNjcxNTcxNCBMMTEuNDAyNTcxNCwxMi44NTk0Mjg2IEwxNC40MzQ5Mjg2LDkuNjA4MzU3MTQgQzE0LjU5MTE0MjksOS40NTIxNDI4NiAxNS4zNDExNDI5LDguNjM5Mjg1NzEgMTUuNzc4OTI4Niw5LjU0NTcxNDI5IEwxNS43Nzg5Mjg2LDE1LjA3ODcxNDMgQzE1Ljc3ODc4NTcsMTUuMTEwMTQyOSA3LjUyNjM1NzE0LDE1LjExMDE0MjkgNy41MjYzNTcxNCwxNS4xMTAxNDI5IEw3LjUyNjM1NzE0LDE1LjExMDA3MTQgWiBNMTcuODU3MTQyOSw0LjE0Mjg1NzE0IEwxNS41NzE0Mjg2LDQuMTQyODU3MTQgTDE1LjU3MTQyODYsMyBMMTksMyBMMTksNi40Mjg1NzE0MyBMMTcuODU3MTQyOSw2LjQyODU3MTQzIEwxNy44NTcxNDI5LDQuMTQyODU3MTQgWiBNMTcuODU3MTQyOSwxNy44NTcxNDI5IEwxNy44NTcxNDI5LDE1LjU3MTQyODYgTDE5LDE1LjU3MTQyODYgTDE5LDE5IEwxNS41NzE0Mjg2LDE5IEwxNS41NzE0Mjg2LDE3Ljg1NzE0MjkgTDE3Ljg1NzE0MjksMTcuODU3MTQyOSBaIE00LjE0Mjg1NzE0LDE3Ljg1NzE0MjkgTDYuNDI4NTcxNDMsMTcuODU3MTQyOSBMNi40Mjg1NzE0MywxOSBMMywxOSBMMywxNS41NzE0Mjg2IEw0LjE0Mjg1NzE0LDE1LjU3MTQyODYgTDQuMTQyODU3MTQsMTcuODU3MTQyOSBaIE00LjE0Mjg1NzE0LDQuMTQyODU3MTQgTDQuMTQyODU3MTQsNi40Mjg1NzE0MyBMMyw2LjQyODU3MTQzIEwzLDMgTDYuNDI4NTcxNDMsMyBMNi40Mjg1NzE0Myw0LjE0Mjg1NzE0IEw0LjE0Mjg1NzE0LDQuMTQyODU3MTQgWiIgaWQ9IuW9oueKtiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";

class DiImageRecognition {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return "Di.imageRecognition";
    }

    /**
     * The default state, to be used when a target has no existing state.
     * @type {HelloWorldState}
     */
    static get DEFAULT_IMAGERECOGNITION_STATE() {
        return {
            remote_url: "",
            result: "待识别",
            uploadFile: null,
        };
    }

    static get RECOGNITION_URL() {
        return RECOGNITION_URL;
    }

    get RECOGNITION_TYPE_INFO() {
        return [
            {
                name: formatMessage({
                    id: "imageRecognition.normal",
                    default: "通用物体",
                }),
                value: RECOGNITION_URL.NORMAL,
            },
            {
                name: formatMessage({
                    id: "imageRecognition.animal",
                    default: "动物",
                }),
                value: RECOGNITION_URL.ANIMAL,
            },
            {
                name: formatMessage({
                    id: "imageRecognition.botany",
                    default: "植物",
                }),
                value: RECOGNITION_URL.BOTANY,
            },
            {
                name: formatMessage({
                    id: "imageRecognition.fruit",
                    default: "果蔬",
                }),
                value: RECOGNITION_URL.FRUIT,
            },
            {
                name: formatMessage({
                    id: "imageRecognition.currency",
                    default: "货币",
                }),
                value: RECOGNITION_URL.CURRENCY,
            },
            {
                name: formatMessage({
                    id: "imageRecognition.landmark",
                    default: "地标",
                }),
                value: RECOGNITION_URL.LANDMARK,
            },
        ];
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

    /**
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(DiImageRecognition.STATE_KEY);
        if (!state) {
            state = Clone.simple(
                DiImageRecognition.DEFAULT_IMAGERECOGNITION_STATE
            );
            target.setCustomState(DiImageRecognition.STATE_KEY, state);
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

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: "imageRecognition",
            name: formatMessage({
                id: "imageRecognition.categoryName",
                default: "图像识别",
                description: "Label for the hello world extension category",
            }),
            color1: "#DF7CFA",
            color2: "#DF7CFA",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: "inputFile",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "imageRecognition.inputFile",
                        default: "选择本地图片开始识别[RECOGNITION_TYPE]",
                        description: "upload img to recogntion",
                    }),
                    arguments: {
                        RECOGNITION_TYPE: {
                            type: ArgumentType.STRING,
                            menu: "RECOGNITION_TYPE",
                            defaultValue: this.RECOGNITION_TYPE_INFO.NORMAL,
                        },
                    },
                },
                {
                    opcode: "inputRemote",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "imageRecognition.inputRemote",
                        default: "图片地址：[REMOTE]",
                        description: "use img url to recogntion",
                    }),
                    arguments: {
                        REMOTE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "imageRecognition.remoteURL",
                                default: "图片url",
                                description: "img url",
                            }),
                        },
                    },
                },
                {
                    opcode: "recognition",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "imageRecognition.recognition",
                        default: "[WAIT_TIME]秒后开始识别[RECOGNITION_TYPE]",
                        description: "start recogntion",
                    }),
                    arguments: {
                        RECOGNITION_TYPE: {
                            type: ArgumentType.STRING,
                            menu: "RECOGNITION_TYPE",
                            defaultValue: this.RECOGNITION_TYPE_INFO.NORMAL,
                        },
                        WAIT_TIME: {
                            type: ArgumentType.NUMBER,
                            menu: "WAIT_TIME_LIST",
                            defaultValue: 2,
                        },
                    },
                },
                {
                    opcode: "result",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "imageRecognition.result",
                        default: "图像识别结果",
                        description: "recogntion result",
                    }),
                },
            ],
            menus: {
                RECOGNITION_TYPE: {
                    acceptReporters: true,
                    items: this._buildMenu(this.RECOGNITION_TYPE_INFO),
                },
                WAIT_TIME_LIST: {
                    acceptReporters: true,
                    items: this._buildMenu(this.WAIT_LIST),
                },
            },
        };
    }

    inputFile(args, util) {
        if (!this.runtime.isLogin()) return;
        const uuid = uuidv4();
        const state = this._getState(util.target);
        this.runtime.emit("start_upload_file", uuid);
        return new Promise((resolve, reject) => {
            this.runtime.on(uuid, (file) => {
                if (!file) return;
                const form = new FormData();
                form.append("file", file);
                const xhr = new XMLHttpRequest();
                xhr.open(
                    "POST",
                    this.runtime.REMOTE_HOST + args.RECOGNITION_TYPE
                );
                xhr.setRequestHeader("Access-Token", this.runtime.getToken());
                xhr.send(form);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        const res = JSON.parse(xhr.response);
                        state.result =
                            (res.data && res.data.name) || "未能识别";
                    }
                    resolve();
                };
            });
        });
    }

    inputRemote(args, util) {
        const remote_url = args.REMOTE;
        const state = this._getState(util.target);
        let reg = /^\w+[^\s]+(\.[^\s]+){1,}$/;
        if (reg.test(remote_url)) state.remote_url = remote_url;
        else this.runtime.emit("MESSAGE_ERROR", "url格式不合法");
    }

    recognition(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        if (state.remote_url) {
            if (util.stackTimerNeedsInit()) {
                const duration = Math.max(
                    0,
                    1000 * Cast.toNumber(args.WAIT_TIME)
                );
                util.startStackTimer(duration);
                this.runtime.requestRedraw();
                util.yield();
            } else if (!util.stackTimerFinished()) {
                util.yield();
            } else {
                return new Promise((resolve) => {
                    fetchWithTimeout(state.remote_url, {}, serverTimeoutMs)
                        .then((response) => response.blob())
                        .then((blob) => {
                            const form = new FormData();
                            form.append("file", blob);
                            const xhr = new XMLHttpRequest();
                            xhr.open(
                                "POST",
                                this.runtime.REMOTE_HOST + args.RECOGNITION_TYPE
                            );
                            xhr.setRequestHeader(
                                "Access-Token",
                                this.runtime.getToken()
                            );
                            xhr.send(form);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    const res = JSON.parse(xhr.response);
                                    state.result =
                                        (res.data && res.data.name) ||
                                        "未能识别";
                                }
                                state.remote_url = "";
                                resolve();
                            };
                        })
                        .catch((err) => {
                            console.log("RequestError", state.remote_url, err);
                            state.remote_url = "";
                        });
                });
            }
        } else {
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
                        this.runtime.REMOTE_HOST + args.RECOGNITION_TYPE
                    );
                    xhr.setRequestHeader(
                        "Access-Token",
                        this.runtime.getToken()
                    );
                    xhr.send(form);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            const res = JSON.parse(xhr.response);
                            state.result =
                                (res.data && res.data.name) || "未能识别";
                        }
                        resolve();
                    };
                });
            });
        }

        // console.log(this.runtime.REMOTE_HOST + args.RECOGNITION_TYPE)
    }

    result(args, util) {
        const state = this._getState(util.target);
        return state.result;
    }
}

module.exports = DiImageRecognition;
