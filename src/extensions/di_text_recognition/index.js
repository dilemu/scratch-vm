// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Clone = require("../../util/clone");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const { v4: uuidv4 } = require("uuid");
const log = require("../../util/log");

const menuIconURI = "data:image/png;base64,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";
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMjIgMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbi3mlofmnKzor4bliKstMjI8L3RpdGxlPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iOS4xMy3kv67mlLnku6PnoIHlnZfpopzoibItLWljb27lj5jnmb3oibIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC4wMDAwMDAsIC03MDYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY29uLeaWh+acrOivhuWIqy0yMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCA3MDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00LjE0Mjg1NzE0LDQuMTQyODU3MTQgTDQuMTQyODU3MTQsNi40Mjg1NzE0MyBMMyw2LjQyODU3MTQzIEwzLDMgTDYuNDI4NTcxNDMsMyBMNi40Mjg1NzE0Myw0LjE0Mjg1NzE0IEw0LjE0Mjg1NzE0LDQuMTQyODU3MTQgWiBNNC4xNDI4NTcxNCwxNy44NTcxNDI5IEw2LjQyODU3MTQzLDE3Ljg1NzE0MjkgTDYuNDI4NTcxNDMsMTkgTDMsMTkgTDMsMTUuNTcxNDI4NiBMNC4xNDI4NTcxNCwxNS41NzE0Mjg2IEw0LjE0Mjg1NzE0LDE3Ljg1NzE0MjkgWiBNMTcuODU3MTQyOSwxNy44NTcxNDI5IEwxNy44NTcxNDI5LDE1LjU3MTQyODYgTDE5LDE1LjU3MTQyODYgTDE5LDE5IEwxNS41NzE0Mjg2LDE5IEwxNS41NzE0Mjg2LDE3Ljg1NzE0MjkgTDE3Ljg1NzE0MjksMTcuODU3MTQyOSBaIE0xNy44NTcxNDI5LDQuMTQyODU3MTQgTDE1LjU3MTQyODYsNC4xNDI4NTcxNCBMMTUuNTcxNDI4NiwzIEwxOSwzIEwxOSw2LjQyODU3MTQzIEwxNy44NTcxNDI5LDYuNDI4NTcxNDMgTDE3Ljg1NzE0MjksNC4xNDI4NTcxNCBaIE02LjQ0NjQyODU3LDYuNDI4NTcxNDMgTDE1LjU4OTI4NTcsNi40Mjg1NzE0MyBMMTUuNTg5Mjg1Nyw4LjcxNDI4NTcxIEw2LjQ0NjQyODU3LDguNzE0Mjg1NzEgTDYuNDQ2NDI4NTcsNi40Mjg1NzE0MyBaIE05Ljg3NSw4LjcxNDI4NTcxIEwxMi4xNjA3MTQzLDguNzE0Mjg1NzEgTDEyLjE2MDcxNDMsMTYuNzE0Mjg1NyBMOS44NzUsMTYuNzE0Mjg1NyBMOS44NzUsOC43MTQyODU3MSBaIiBpZD0i5b2i54q2IiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+";

/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

const REMOTE_URL = {
    UNIT: "/api/talk/classify",
    NORMAL: "/api/character/normal/classify",
    PLATE: "/api/character/license_plate/classify",
    QR: "/api/character/qr/classify",
    HANDWRITTEN: "/api/character/handwritten/classify",
    PRINT: "/api/character/handwritten/classify",
    BAR: "/api/character/qr/classify",
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
        this.onmessage = this.onmessage.bind(this);
        this.onclose = this.onclose.bind(this);
        this.write = this.write.bind(this);
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
            remote_url: "",
        };
    }

    get REMOTE_URL() {
        return REMOTE_URL;
    }

    get WAIT_LIST() {
        return [
            {
                name: formatMessage({
                    id: "textRecognition.time_1",
                    default: "1",
                }),
                value: 1,
            },
            {
                name: formatMessage({
                    id: "textRecognition.time_2",
                    default: "2",
                }),
                value: 2,
            },
            {
                name: formatMessage({
                    id: "textRecognition.time_31",
                    default: "3",
                }),
                value: 3,
            },
            {
                name: formatMessage({
                    id: "textRecognition.time_4",
                    default: "4",
                }),
                value: 4,
            },
            {
                name: formatMessage({
                    id: "textRecognition.time_5",
                    default: "5",
                }),
                value: 5,
            },
        ];
    }

    get RECO_TYPE_INFO() {
        return [
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.print",
                    default: "印刷体",
                }),
                value: "PRINT",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.handwriting",
                    default: "手写体",
                }),
                value: "HANDWRITTEN",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.plate",
                    default: "车牌",
                }),
                value: "PLATE",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.QR",
                    default: "二维码",
                }),
                value: "QR",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.BAR",
                    default: "条形码",
                }),
                value: "BAR",
            },
        ];
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

    onclose() {
        this.session = null;
    }

    write(data, parser = null) {
        if (this.session) {
            return new Promise((resolve) => {
                if (parser) {
                    this.reporter = {
                        parser,
                        resolve,
                    };
                }
                this.session.write(data);
            });
        }
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
            id: "diTextRecognition",
            name: "文本识别",
            color1: "#23BBFF",
            color2: "#23BBFF",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "inputRemote",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "textRecognition.inputRemote",
                        default: "图片地址：[REMOTE]",
                        description: "use img url to recogntion",
                    }),
                    arguments: {
                        REMOTE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "textRecognition.remoteURL",
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
                        id: "textRecognition.recognition",
                        default: "[WAIT_TIME]秒后开始识别[RECOGNITION_TYPE]",
                        description: "start recogntion",
                    }),
                    arguments: {
                        RECOGNITION_TYPE: {
                            type: ArgumentType.STRING,
                            menu: "RECO_TYPE_LIST",
                            defaultValue: "HANDWRITTEN",
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
                        id: "textRecognition.result",
                        default: "文字识别结果",
                        description: "recogntion result",
                    }),
                },
                {
                    opcode: "sayToRobot",
                    text: formatMessage({
                        id: "diTextRecognition.saySth",
                        default: "来说点什么吧[TXT]",
                        description: "say something to robot",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diTextRecognition.defaultSayWords",
                                default: "你好",
                                description: "default word",
                            }),
                        },
                    },
                },
                {
                    opcode: "RobotAnswer",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diTextRecognition.talkBack",
                        default: "我的回答是",
                        description: "Robot saying",
                    }),
                },
            ],
            menus: {
                RECO_TYPE_LIST: {
                    items: this._buildMenu(this.RECO_TYPE_INFO),
                },
                WAIT_TIME_LIST: {
                    acceptReporters: true,
                    items: this._buildMenu(this.WAIT_LIST),
                },
            },
        };
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
        const WAIT_TIME = args.WAIT_TIME;
        const RECOGNITION_TYPE = args.RECOGNITION_TYPE;
        if (state.remote_url) {
            if (util.stackTimerNeedsInit()) {
                const duration = Math.max(0, 1000 * Cast.toNumber(WAIT_TIME));
                util.startStackTimer(duration);
                this.runtime.requestRedraw();
                util.yield();
            } else if (!util.stackTimerFinished()) {
                util.yield();
            } else {
                return this.fetchRecognitionByUrl(RECOGNITION_TYPE, state);
            }
        } else {
            return this.fetchRecognitionByCam(RECOGNITION_TYPE, WAIT_TIME, state);
        }
    }

    fetchRecognitionByUrl(type, state) {
        return new Promise((resolve, reject) => {
            fetchWithTimeout(state.remote_url, {}, serverTimeoutMs)
                .then((response) => response.blob())
                .then((blob) => {
                    const form = new FormData();
                    form.append("file", blob);
                    const xhr = new XMLHttpRequest();
                    xhr.open(
                        "POST",
                        this.runtime.REMOTE_HOST + this.REMOTE_URL[type]
                    );
                    xhr.setRequestHeader(
                        "Access-Token",
                        this.runtime.getToken()
                    );
                    xhr.send(form);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            const res = JSON.parse(xhr.response);
                            state.result = res.data;
                            state.type = type;
                        }
                        state.remote_url = ""
                        resolve();
                    };
                })
                .catch((err) => {
                    console.log("RequestError", state.remote_url, err);
                    reject();
                });
        });
    }

    fetchRecognitionByCam(type, wait_time, state) {
        const uuid = uuidv4();
        const options = {
            uuid,
            type: "photo",
            countDown: wait_time,
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
                    this.runtime.REMOTE_HOST + this.REMOTE_URL[type]
                );
                xhr.setRequestHeader("Access-Token", this.runtime.getToken());
                xhr.send(form);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        const res = JSON.parse(xhr.response);
                        state.result = res.data;
                        state.type = type;
                        resolve();
                    }
                };
            });
        });
    }

    result(args, util) {
        const state = this._getState(util.target);
        switch (state.type) {
            case "HANDWRITTEN":
            case "PRINT":
                return (
                    Array.isArray(state.result) &&
                    state.result.map((v) => v.words).join("\n")
                );
            case "PLATE":
                return (
                    state.result && state.result.number
                );
            case "QR":
            case "BAR":
                return (
                    Array.isArray(state.result) &&
                    state.result.map((v) => v.text[0]).join("\n")
                );

        }
    }

    sayToRobot(args, util) {
        if (!this.runtime.isLogin()) return;
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
                    .catch((err) => {
                        console.log("RequestError", state.remote_url, err);
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
