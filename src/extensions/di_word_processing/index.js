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
    LEXICAL: "/api/nlp/lexical/analysis",
    EMO: "/api/nlp/affective/tendency/analysis",
    SIMILAR: "/api/nlp/semantic/similarity",
    CHINESE_QA: "/api/nlp/Chinese/retrieval",
    CORRECTION: "/api/nlp/text/recognition",
    ADDRESS: "/api/nlp/address/identification",
};

const RECO_TMAP = {};

class WordProcessing {
    constructor(runtime) {
        this.runtime = runtime;
        // communication related
        this.comm = runtime.ioDevices.comm;
        this.session = null;
        this.runtime.registerPeripheralExtension("diWordProcessing", this);
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
        return "Di.WordProcessing";
    }
    /**
     * The default state, to be used when a target has no existing state.
     * @type {HelloWorldState}
     */
    static get DEFAULT_STATE() {
        return {
            lexicalResult: [],
            similarResult: null,
            chineseQAResult: "",
            chineseQAResult1: "",
            correctionResult: {},
            addressResult: {},
        };
    }

    get REMOTE_URL() {
        return REMOTE_URL;
    }

    get RECO_TYPE_INFO() {
        return [
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.lexical",
                    default: "词法分析",
                }),
                value: "LEXICAL",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.emo",
                    default: "情感倾向分析",
                }),
                value: "EMO",
            },
        ];
    }

    get ADDRESS_TYPE_INFO() {
        return [
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.province",
                    default: "省",
                }),
                value: "province",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.city",
                    default: "市",
                }),
                value: "city",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.county",
                    default: "区",
                }),
                value: "county",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.town",
                    default: "街道",
                }),
                value: "town",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.person",
                    default: "姓名",
                }),
                value: "person",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.detail",
                    default: "地址",
                }),
                value: "detail",
            },
            {
                name: formatMessage({
                    id: "textRecognition.reco_type.phonenum",
                    default: "电话",
                }),
                value: "phonenum",
            },
        ];
    }

    get SINGLE_CHINESE_TYPE_INFO() {
        return [
            {
                name: formatMessage({
                    id: "textRecognition.chinese_type.1",
                    default: "单字",
                }),
                value: "含义",
            },
            {
                name: formatMessage({
                    id: "textRecognition.chinese_type.2",
                    default: "词语",
                }),
                value: "词语",
            },
            {
                name: formatMessage({
                    id: "textRecognition.chinese_type.3",
                    default: "成语",
                }),
                value: "成语",
            },
            {
                name: formatMessage({
                    id: "textRecognition.chinese_type.4",
                    default: "诗词",
                }),
                value: "诗词",
            },
            {
                name: formatMessage({
                    id: "textRecognition.chinese_type.5",
                    default: "古文",
                }),
                value: "古文",
            },
            {
                name: formatMessage({
                    id: "textRecognition.chinese_type.6",
                    default: "俗语歇后语",
                }),
                value: "俗语歇后语",
            },
            {
                name: formatMessage({
                    id: "textRecognition.chinese_type.7",
                    default: "名言警句",
                }),
                value: "名言警句",
            },
        ];
    }

    /**
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(WordProcessing.STATE_KEY);
        if (!state) {
            state = Clone.simple(WordProcessing.DEFAULT_STATE);
            target.setCustomState(WordProcessing.STATE_KEY, state);
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
            id: "diWordProcessing",
            name: "文本识别",
            color1: "#0079FF",
            color2: "#0061CC",
            color3: "#3373CC",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "lexicalAndEmo",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "textRecognition.recognition",
                        default: "[RECO_TYPE]文本[TXT]",
                        description: "start recogntion",
                    }),
                    arguments: {
                        RECO_TYPE: {
                            type: ArgumentType.STRING,
                            menu: "RECO_TYPE_LIST",
                            defaultValue: "LEXICAL",
                        },
                        TXT: {
                            type: ArgumentType.STRING,
                            defaultValue:
                                "迪乐姆儿童教育，创新生态，触控未来，让创新教育更简单",
                        },
                    },
                },
                {
                    opcode: "lexicalResult",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "textRecognition.lexicalResult",
                        default: "词法分析结果：第[INDEX]个词汇的词性",
                        description: "lexicalResult",
                    }),
                    arguments: {
                        INDEX: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1,
                        },
                    },
                },
                {
                    opcode: "emoResult",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "textRecognition.emoResult",
                        default: "情感倾向分析结果",
                        description: "emoResult",
                    }),
                },
                {
                    opcode: "wordSimilar",
                    text: formatMessage({
                        id: "diWordProcessing.wordSimilar",
                        default: "词义相似度分析 文本1：[TXT1] 文本2：[TXT2]",
                        description: "wordSimilar",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TXT1: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diWordProcessing.wordSimilar1",
                                default: "北京",
                                description: "default word",
                            }),
                        },
                        TXT2: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diWordProcessing.wordSimilar2",
                                default: "上海",
                                description: "default word",
                            }),
                        },
                    },
                },
                {
                    opcode: "wordSimilarResult",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diWordProcessing.wordSimilarResult",
                        default: "词义相似度分析结果",
                        description: "wordSimilarResult",
                    }),
                },
                {
                    opcode: "chineseQA1",
                    text: formatMessage({
                        id: "diWordProcessing.chineseQA1",
                        default: "对[TXT]进行[TYPE]检索",
                        description: "chineseQA1",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diWordProcessing.chineseQATXT1",
                                default: "迪",
                                description: "default word",
                            }),
                        },
                        TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diWordProcessing.chineseQATXTTYPE",
                                default: "含义",
                                description: "default word",
                            }),
                            menu: "SINGLE_CHINESE_TYPE_LIST",
                        },
                    },
                },
                {
                    opcode: "chineseQAResult1",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diWordProcessing.chineseQAResult1",
                        default: "汉语检索结果",
                        description: "chineseQAResult1",
                    }),
                },
                {
                    opcode: "chineseQA",
                    text: formatMessage({
                        id: "diWordProcessing.chineseQA",
                        default: "对[TXT]进行汉语问答",
                        description: "chineseQA",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diWordProcessing.chineseQATXT",
                                default: "三个火念什么",
                                description: "default word",
                            }),
                        },
                    },
                },
                {
                    opcode: "chineseQAResult",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diWordProcessing.chineseQAResult",
                        default: "汉语问答结果",
                        description: "chineseQAResult",
                    }),
                },
                {
                    opcode: "correction",
                    text: formatMessage({
                        id: "diWordProcessing.correction",
                        default: "对[TXT]进行文本纠错",
                        description: "correction",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diWordProcessing.correctionTXT",
                                default: "人工只能公司",
                                description: "default word",
                            }),
                        },
                    },
                },
                {
                    opcode: "correctionResult",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diWordProcessing.correctionResult",
                        default: "文本纠错结果",
                        description: "correctionResult",
                    }),
                },
                {
                    opcode: "address",
                    text: formatMessage({
                        id: "diWordProcessing.address",
                        default: "对[TXT]进行地址分析",
                        description: "address",
                    }),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diWordProcessing.addressTXT",
                                default:
                                    "上海市自由贸易试验区金沪路1222号2幢2层202室",
                                description: "default word",
                            }),
                        },
                    },
                },
                {
                    opcode: "addressResult",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diWordProcessing.addressResult",
                        default: "地址[ADDRESS_TYPE]分析结果",
                        description: "addressResult",
                    }),
                    arguments: {
                        ADDRESS_TYPE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diWordProcessing.addressResultType",
                                default: "province",
                                description: "default address type",
                            }),
                            menu: "ADDRESS_TYPE_LIST",
                        },
                    },
                    label: "地址分析结果",
                },
            ],
            menus: {
                RECO_TYPE_LIST: {
                    items: this._buildMenu(this.RECO_TYPE_INFO),
                },
                ADDRESS_TYPE_LIST: {
                    items: this._buildMenu(this.ADDRESS_TYPE_INFO),
                },
                SINGLE_CHINESE_TYPE_LIST: {
                    items: this._buildMenu(this.SINGLE_CHINESE_TYPE_INFO),
                },
            },
        };
    }

    lexicalAndEmo(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const RECO_TYPE = args.RECO_TYPE;
        const TXT = args.TXT;
        return new Promise((resolve, reject) => {
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL[RECO_TYPE],
                {
                    method: "POST",
                    body: JSON.stringify({
                        text: TXT,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Token": this.runtime.getToken(),
                    },
                },
                serverTimeoutMs
            )
                .then((response) => response.json())
                .then((data) => {
                    switch (RECO_TYPE) {
                        case "LEXICAL":
                            state.lexicalResult = data.data;
                            break;
                        case "EMO":
                            state.emoResult = data.data;
                    }
                    resolve();
                })
                .catch((err) => {
                    console.log("RequestError", err);
                    reject(err);
                });
        });
    }

    lexicalResult(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const INDEX = args.INDEX - 1;
        return (
            (state.lexicalResult[INDEX] && state.lexicalResult[INDEX].ne) ||
            "未识别"
        );
    }

    emoResult(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        return (state.emoResult && state.emoResult[sentiment]) || "未识别";
    }

    wordSimilar(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const TXT1 = args.TXT1;
        const TXT2 = args.TXT2;
        return new Promise((resolve, reject) => {
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL["SIMILAR"],
                {
                    method: "POST",
                    body: JSON.stringify({
                        text: TXT1,
                        text_2: TXT2,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Token": this.runtime.getToken(),
                    },
                },
                serverTimeoutMs
            )
                .then((response) => response.json())
                .then((data) => {
                    state.similarResult = data.data;
                    resolve(data.data);
                })
                .catch((err) => {
                    console.log("RequestError", err);
                    reject(err);
                });
        });
    }

    wordSimilarResult(args, util) {
        const state = this._getState(util.target);
        return state.similarResult ? state.similarResult + "%" : "未能识别";
    }

    chineseQA(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const TXT = args.TXT;
        const TYPE = args.TYPE;
        return new Promise((resolve, reject) => {
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL["CHINESE_QA"],
                {
                    method: "POST",
                    body: JSON.stringify({
                        text: TYPE ? TXT + "的" + TYPE : TXT,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Token": this.runtime.getToken(),
                    },
                },
                serverTimeoutMs
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 0) {
                         const ramIndex = Math.round(
                             Math.random() * data.data.answer.length - 1
                         );
                         if (TYPE) state.chineseQAResult1 = data.data.answer[ramIndex];
                         else state.chineseQAResult = data.data.answer[ramIndex];
                    }
                    else {
                        if (TYPE) state.chineseQAResult1 = "";
                        else state.chineseQAResult = "";
                    }
                    resolve();
                })
                .catch((err) => {
                    console.log("RequestError", err);
                    reject(err);
                });
        });
    }

    chineseQAResult(args, util) {
        const state = this._getState(util.target);
        return state.chineseQAResult || "";
    }

    chineseQA1(args, util) {
        return this.chineseQA(args, util);
    }

    chineseQAResult1(args, util) {
        const state = this._getState(util.target);
        return state.chineseQAResult1 || "";
    }

    correction(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const TXT = args.TXT;
        return new Promise((resolve, reject) => {
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL["CORRECTION"],
                {
                    method: "POST",
                    body: JSON.stringify({
                        text: TXT,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Token": this.runtime.getToken(),
                    },
                },
                serverTimeoutMs
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 0) state.correctionResult = data.data;
                    else state.correctionResult = {};
                    resolve();
                })
                .catch((err) => {
                    console.log("RequestError", err);
                    reject(err);
                });
        });
    }

    correctionResult(args, util) {
        const state = this._getState(util.target);
        return state.correctionResult.correct_query || "";
    }

    address(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const TXT = args.TXT;
        return new Promise((resolve, reject) => {
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL["ADDRESS"],
                {
                    method: "POST",
                    body: JSON.stringify({
                        text: TXT,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Token": this.runtime.getToken(),
                    },
                },
                serverTimeoutMs
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.code === 0) state.addressResult = data.data;
                    else state.addressResult = {};
                    resolve();
                })
                .catch((err) => {
                    console.log("RequestError", err);
                    reject(err);
                });
        });
    }

    addressResult(args, util) {
        const ADDRESS_TYPE = args.ADDRESS_TYPE;
        const state = this._getState(util.target);
        return state.addressResult[ADDRESS_TYPE] || "";
    }
}

module.exports = WordProcessing;
