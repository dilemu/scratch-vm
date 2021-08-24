const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const MathUtil = require("../../util/math-util");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
// const MathUtil = require('../../util/math-util');

const REMOTE_HOST = "http://152.136.211.42:60002";

const RECOGNITION_URL = {
    NORMAL: "/api/image/general/classify",
    ANIMAL: "/api/image/animal/classify",
    BOTANY: "/api/image/plant/classify",
    FRUIT: "/api/image/ingredient/classify",
    CURRENCY: "/api/image/currency/classify",
    LANDMARK: "/api/image/landmark/classify",
};

const TOKEN =
    "eyJhbGciOiJIUzUxMiIsImlhdCI6MTYyOTA0Mjk3MSwiZXhwIjoxNjI5MDQzNTcxfQ.eyJ1c2VybmFtZSI6InV0ZXN0IiwicmVxdWVzdF9pZCI6ImNsYXNzcm9vbTAwMDAwMDEifQ.D2qJTLOuQ8SpEbfxaoHE2ELkyLRFdDcLeQURQWNYZe2db_MEgaAkdAtRowEG19zAzM7IdtRHL1vQMkro9YS3Xg";

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
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABnUlEQVRIS72VMUvDUBSFz0naOmoFwYLo5KqFLg5uim4uTjqJg3lP0K17f4OFpFFc3JxdHNTFQXFRBxERBKFCQRAs1SVNrkSpVGlKbKmBR5bLl3vOu+eG6NHDHnHxP2DHcaShgOSmUqrYTlGpVNoQka1Gjdb6u9EfHYdgkrOJROLR9/1ny7Je24Fd1+03TXOoXq+PichRW3AymRwvl8sPmUxmMI7/6XS6Wq1WRz3Pu48Eh9JI7gVBsAtgMQ4YwJNhGFkRWWq2ruXlOY5zBWCS5E0QBOckV4HoizYMY+C3bVHgawATJBeUUge2bV+SzEYp+DMYQPiBUwDrAIxmMMmiiNwAKP0F/GlFVIckt5VSlm3bUyTPOgKTFBE5BDAHwCS5X6lUlguFQtAVGMCO1nrNdd1pEVkhqS3L8kI13YDvarVaLp/Pv7WypRPw51QAmNFan0R5HRvcFJBjADkALwDeya+pFJHGeIbv8PQBSKdSqRHP8xYjAxLuijDSvu8Pi8h8nOSRvDVN86JtpHu6hHqyNuNIj1vzP3+QuN3EqfsAkHTlFzqLqg4AAAAASUVORK5CYII=";

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
            color1: "#0079FF",
            color2: "#0061CC",
            color3: "#3373CC",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: "inputFile",
                    blockType: BlockType.EVENT,
                    text: formatMessage({
                        id: "imageRecognition.inputFile",
                        default: "选择本地图片",
                        description: "upload img to recogntion",
                    }),
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
                        default: "结果",
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
        const state = this._getState(util.target);
        const input = document.createElement("input");
        input.setAttribute("style", "display: none;");
        input.setAttribute("id", "imageRecognition");
        input.setAttribute("type", "file");
        input.setAttribute("name", "file");
        document.querySelector("body").appendChild(input);
        input.onchange = () => {
            const file = input.files[0];
            state.file = file;
        };
        input.click();
    }

    inputRemote(args, util) {
        const remote_url = args.REMOTE;
        const state = this._getState(util.target);
        let reg = /^\w+[^\s]+(\.[^\s]+){1,}$/;
        if (reg.test(remote_url)) state.remote_url = remote_url;
        else alert("url格式不合法");
    }

    recognition(args, util) {
        if (util.stackTimerNeedsInit()) {
            const duration = Math.max(0, 1000 * Cast.toNumber(args.WAIT_TIME));
            util.startStackTimer(duration);
            this.runtime.requestRedraw();
            util.yield();
        } else if (!util.stackTimerFinished()) {
            util.yield();
        } else {
            const state = this._getState(util.target);
            if (state.remote_url) {
                return new Promise(resolve => {
                    fetchWithTimeout(state.remote_url, {}, serverTimeoutMs)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const form = new FormData();
                        form.append("file", blob);
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", REMOTE_HOST + args.RECOGNITION_TYPE);
                        xhr.setRequestHeader("Token", TOKEN);
                        xhr.send(form);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                const res = JSON.parse(xhr.response);
                                state.result = res.data && res.data.name || "未能识别";
                            }
                            resolve()
                        };
                    });
                })
            }
        }

        // console.log(REMOTE_HOST + args.RECOGNITION_TYPE)
    }

    result(args, util) {
        const state = this._getState(util.target);
        return state.result;
    }
}

module.exports = DiImageRecognition;
