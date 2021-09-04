// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Clone = require("../../util/clone");
const Cast = require("../../util/cast");
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
    NORMAL: "/api/character/normal/classify",
    PLATE: "/api/character/license_plate/classify",
    QR: "/api/character/qr/classify",
    HANDWRITTEN: "/api/character/handwritten/classify",
    PRINT: "/api/character/handwritten/classify",
    BAR: "/api/character/qr/classify",
};

const RECO_TMAP = {};

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
            color1: "#0079FF",
            color2: "#0061CC",
            color3: "#3373CC",
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
                return this.fetchRecognitionByUrl(RECOGNITION_TYPE, state.remote_url, state);
            }
        } else {
            return this.fetchRecognitionByCam(RECOGNITION_TYPE, WAIT_TIME, state);
        }
    }

    fetchRecognitionByUrl(type, url, state) {
        return new Promise((resolve, reject) => {
            fetchWithTimeout(url, {}, serverTimeoutMs)
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
                    } else {
                        reject();
                    }
                };
            });
        });
    }

    result(args, util) {
        const state = this._getState(util.target);
        switch (state.type) {
            case "HANDWRITTEN":
                return (
                    Array.isArray(state.result) &&
                    state.result.map((v) => v.words).join("\n")
                );
        }
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
