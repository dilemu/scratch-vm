// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Clone = require("../../util/clone");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");

const menuIconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAADiJJREFUaEPNWnl4ltWV/5173/dbsrCOgiAQNnGCSCCBiu1MKY6jIi5VxE6tMBZIGAgoSVCrFD9xq0pYgpFsSoXamQEVKqK1jkA7gEgWEBEGlSVVFnVIJCTk+773vffMc98sJGELIX2euX8lee859/zu2c8N4W+wrsnlXn4b81njLgZAhLeDwONb0uiv7X0ctTfDoa9xTxHF76TAaO3WcScLUAqbI1H8Ym86lbfnme0KIBRi8XY3PCcCeFhHm4tJNqAcLL7zKDJDIdLtBaJdAdyziuWBCmxmgetgbKfpMicxdnQ4ipGbQlSvm0uH0W4AkvO5NwPpAB4E4DuHaA4ILxNjaWka7b908YFLBpCczx0V1K0C8ilhoR8kwBpgp4UCZJ0vwHxz8bVSar6t5briGXTsUoC0GQCDaXgR7iWFGRD4ERnBHdSCsZwELieJ8Vp5ZgPhAziCbVqgGIz7hY1Onok52AFgeW0XLN8zgarbAqRNAK7J5/4+xrNk4Say0JGNRbvY6Ao839nGnyMKMRGlnwREGgnYBHxAEtMqq3G4QxAjoZEFwu0eMBdR1tgsBOaVTKEtFwviogCMfIm7uhKTWeBBYaOHd4suykHIqa5E4b5H6GSDACkFfItmvA5CZ9Z4Ysc0mt/wLTn/SAxw+c8ZMgsCg4QF6CiqGXhdExZ+MhVfgKhlGDgrtrMCuLaQr7QIAT9Q8dEUqkgMsS+mO27XApkkcJ2xZR3hbwFaQ8CLZ3PIlEIey4yVDHRhxrwdafRUSwl+UMjdHO3xnEAW+ni+4/IxBi1BFCt2zKQjw/I4UTI6s0BV/FHsbRnBmgEYWch9XY25EJ6aY0D4lhhbGBgI4HbhB9yod+8rJWNJaRqVnUvlI/P5VhdYaTRAGk+UNtFAS5rkfL4ahGlgToVNQfOdHexixkEijABwGREqmPEXRZj7SSp93sCjEcCohdwlGodXyIc7vUjBXgngRRQSACvv5zIwnqmx8cG+yafN5WwgTFgFsF4zelrApOJptO589j0gh/3xJhjYeBQCNwgJgjnXPS1Lnebx9vedMfHABDrhZfkGpsPzOQ2EJUTwG6Ebl/BCn0Os5we1yN08nSpb62ijc6u7u8HYmCviUL56ApmYdMGVvI5j9GE9kUhkgxDTNCGaiwSjhoB/K0mllc0AJOdxDgUwU0fOjN+scNi1cMOuybTvfBLw/zwfH2U7wWdVldPAUNUFpT3HhlG5PCBiYRNJ9DSab1xUZw1QeKo0jeY1A5CSzyEWeMKYTrMyoI6gFsCMsmm0/FxCMef41UGnQATtf9Y1zjrZ355JNKvxOnj/ghGwxCnqk/HZ+YBdX8R9whrziPALZvhaaoAZYQIyS1Pp5WYAhuXxKCL8B1no7cX1+q/GD+rXd6zxVm0Mntx7Px1tKUR4/wsDbciNolOwpzpR+2VUY0zMgMyvzD4uz74BJJdrpWuF0j+nAVmlZ4BgpuGFuAeMuSAM8fyu4TLrA6qwPefeGQjgji2T6krz0+IZBgWYCsaTIHSvP+A4AweIMUj40cELcwpvlqXS+JYCcPnCwVrjHRGwE3Sts08Q3Ux9Zx8y+9TB7F+J+OCzujoMxTrD1zdrUUv6xGU8MkB4VwTRlaOAZv5vaLKIcC2A2HpJ91qE9O1TaUMD/Rl5ICmPxwrCWgBVIEwvS6VVKcv4bi8HSCSSwtslaTTxTAA5iVq7688K4FD24yLof1rVRDQBj8h+mQta0g/I4f4dfHiVbFyuXayNuHgmaMEQzARjvpCIddgZtWuqb1tT2jMADHuVLxMu9oP5KCJVY0tndfKqxqRF3MmORaJTgz077ljSDaQ6I6FXMdEEz824vG0A+MhLfdxTkX7Wh5mbh9RyF38Q/tImnVtSHg8kwgZp4cooIlfvmhxoFkjOBPAK9yAX+wA+JlR0XMn05gS8Z85AN3DFessnY5V2M6zemf95VgDQN1G/LK/7UocWPCaCgWdaaoAPLO6mSb8r/FZPHY48LfrNyTWpp+kNDy3gwYLxvrTQM6yjibun+veeXwMXAOAeWvhT6bPeMkx0OFogKj5Pp5QCp1EDPitBR51vlZTjfL0fKmYOBfShDnnCb01SYaeZCTlfLRpNjt4o/TZUxNkmnZO30aDQ/7Y7AJOUcXDBIEjtKC2GSmm96QFwdKGoiJ1BKWkOH1l6tQo770mLEiAI7Og/OFqvsCQlQVMWEQc1QxNjjuyfudDQO18uGkNC/0la0nAuFS7fHLGtro527Lj+NXuIQrpdNMCHsq+Hbf/ejTgRMNZISzxibE8p/eFbfXvdNIEmKN6fPU4LvEZEXbRiyBgf4De5n8HVYWjNEIJYK86z+mdONwCiBxZMEaACaUlSriqG4hfIot/AtgI6HJ1oD5iz4ZIAKKJbTeGkDixMFx0DS1ETgevyp4IwxARpBsIkkSMIe7XCLBIySStFwpZQUXcrs84naSUIxmwS6GTiOjOOM3S+AB0B0YMEDCQpoFz9MYE/FlLMQpwf7olwlt0vIzuxgAf72+oDDQCiB7Nn2fHBJfBuEp+DcBWzd6OeuWrF1dIn41hpL1xrRq0gGkcJszfwqlXSTfk6ZMXYc9WpKKQUgCW81tJsVlEX0pIeAGguFhalU1wAblVkjt1v9oJLAmAR3bo9lT53vnxujAzErNaOMiaw3rJoojEJr50BlhNzGQtxrxD0DyTI2PMxQeoW6vvwTm/TgeyJMj7wmq6OgJmjzPwhER0mQWNYcz8DwHVUMWuxVFp6Adm2Xznuz+y+GX+8JBNqCKO86h7pJI8aBluTEOgj2VrNmqEU/9eako9unjBhtQofeH6QBetP0m/3VhHnG0nCZOI6AAcXTpJx/t/iVASu4j9aFXG3G8d3yhffSEq/Jy1R58Ssx8L29YKOWkioKSUKue0CoGlYcw++eIf0+02mhq518sVf16XTTza5/FlunI6JbBMBa7CqPTsAU0qAkSv7ZZrxC6oPvtA9wPJr6bclR51iOr5vLKUUtFcY1ceEqhlXMr1DY+ZLWlTZ6d1/euOKbvFVq4Vtd1ZO9GErIet1L5F9EeqgrfiPhN9OVOHzAND8suyfNcOj+WphUCmslj5rBCLhvH/Zdv/y3RXd1e4Z5BWBZl1TyH9va3zQ6kQ2uIi7BBQOMfN3AYvGbJ1C5QixGNoD4y3i8azpk/d/vOyNTlZtV6v/ye1GzZ4wR0IxOhy/QwR9V+na6LdK4WbfwEwzNmk0IU8DTQB4dFXPdkWlPeyhnXd/teFY3xxb4DKl8arfwb9vT6fjyfk8XAPvSAtXuCLcd+cDQa9AbFjNSolrV3CsHcYsZswn8hz0fQLedAm3CcZdMgCpavFd2W4MwFI6o2FRB7KXiKA9iyPOh6Scu6n/o17bx+WL7kesf4U+WdvMhJoKMjCXk+JtbJQ+dDLzJHZRQoQShtcTDwHBB6WXBE+IX29pMv043ROv4mCkEi+RwH3M8Bvm9b1wDVmINUGfNQ4Tq8dLj8qVOMuA1nRk8Pn7ArHfUL+p3zQIyOWLf6TBa6F1QBClUkLG75sK7/0cYmtID3WjDzIEYDgsWF6ore+LzfkkoDSjqONApG/6Sd18tRHAsEKeSIxcEohr2sZ5LRwQ1hqroxLzP5tCX55x+AX+wAxy92ePsnzSQq/vN5sS4Vwkibkc57eRIRjzWEB6IOqXd6EalYIwtSSVvHLmdFNfwAuFjdnazDSb1INmEsAuPnXi8ONP72t9Q3+xIJvuTynk0VrjXRIINhswEFA/BFtQNo3mNNdAHj9FFuZ6iJsAMG2cdrGVGKNL06jFyPZSxDw3bcoyHq0F1pNATEsARgta4+kdqfTrZgCSXuXrhYPXhY0ETwv1X72hrUKYGC9GapG7+yFqtO3ziT96I1s1X+CHrFBVMg07Wzsq/MFi7qaCyNRAFkmQB6BJT6wdHNI27tv5S9raDID5JSWPzdwzBIkrjapU3UzhCBg9PE1EsU8xntGMdz69wHxoeCHfC40iAJVCYmzJFNp9PsCjirhLmNU4oeRjZGOQ139rmOFBdxkAec9VCl+TRqhkGr3S6BctmY4o4n9UCneamSYBB4XAn5XGGBKYbAa6RjsMvMFRLNo5o+4WzraSC/hXzHgWwAkQHihLpTXn2ptUxD+0GBkM3GWeotjB9xp6hYL+g09b1zFwFQMVUmJt8RT6S1M+rZ5OmyEraTzAEtOtAGJUBN+D8A6c6Itl0/27WgqXnMePMOE5MxzQwL/uTCOv/GjmrEU8TGnMIcZY4UdHHfEK7uWWJZZtn0wlrfGwVgMwzJLz2XbgDJdkPUagccKG0FGYF5b8SA1yPsugioZDU5ZxSAuY6dlJZkzeMY3eaPiWnF/1d4z42QxMlj50M2FbK94KpZ8OhOWmjzLIDNJatS4KQANH85i3/zh+SQLTIZFkQq3r4mOp8BucwscqFj8VjCfMS43nhBLvBSzMPGmjQtTgRkl4VFgYZvjpKPYT8BqA7NI0OtUqqZtsahOABvoRuad6KSuYDvDPRIB6cxguGBs1YYwgSG+yZpKpeYmJYjMDR0EYL3wgHUWlYKx1CTk7U8kru9uyLglAw4FDX+KrhA/pBEwVNgItk6HZZ7TkxXDzfiywRjKeK06l4rYI3SYnvtBBiavYF6zESAYvB9GAM96J6xiYocCksML6PTPa9qjXUo520UBTpkPzON+2kdrwbwaN3+reGfb074xrW/tWcKFL8zTbmk0XsyflZb6FfXgLjEBjGWBqmLqM/thtR/D8/9t/NTBATYT6olI9IEhmk0AHz5G1KV+QLYFQWyLN+S6w3TXgHWZG9UUYAq1vAESMcrHVsrD5b1EM/h8Ih0aaQdWEGwAAAABJRU5ErkJggg==";
const blockIconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAALKADAAQAAAABAAAALAAAAAD8buejAAACMklEQVRYCe2YzysGQRjHvX4U4YBSDk5KueDAVU6kKDcHF6XE0U2JpDhQyh+gnDkqbm4cxEWJwoFEDhwUwoHPo50aa3fNzq43q3nq2zzzzHee53mffXb23S0ocOIq4CrgKmBVgfdwObVyGLCJEKdhYQLon6bCsIW/ai82SGwazr7Ge9T0pOowDso1J23os9rcXNUuVY/5rmRMYvaouGGeMtcSmUs4qofPvMuSZs+GXWlll1gqrrJle8yZpi83gynXkneQy+XklIiUzPWwSzjyeqawGHVKhLl/YuEGNGiEZ/Rrz3bP+ALqgC5iu9IMVejV2jxdVT2BGDfEM+OKZtv2bGKaAl3amlL3PE41hs9EGVvBpUfQH/9CDRSrHiaAnC7j4CLQa7RRqnyHj1tGqfpiNP3rqlXCuKgEA2AI2B53textBNJCxmLTw8r5EkozWAYtymgwzsApAidgE6wBY7GtsASoAKtgEhwDU3mF+AbawQ7oB8aSpMISpAOMggmZGMo8vDJD7jda0oTF4RzYAnqVj5iPACVyxPWqSZLRJuEmAs5qQUvR17nrpR9FuoHclLrUMKmHs8BYoi/E1d2fn7gVi8u3aYmgGA9Bxpi2dF8U6L8g2cXYGTOx/NB92R4y70s7Mj47gHxcSf6xBici52AQJHnghP5O/P74mh+62b+AszGQ6Ejy+/TPU03Y7/w35iYJp3VKWOVPgvJo93+qsvKVl00k/P+/Xualki6Iq4CrQIYr8AGEPmxiEBw3CAAAAABJRU5ErkJggg==";
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
                    id: "diWordProcessing.reco_type.lexical",
                    default: "词法分析",
                }),
                value: "LEXICAL",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.reco_type.emo",
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
                    id: "diWordProcessing.reco_type.province",
                    default: "省",
                }),
                value: "province",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.reco_type.city",
                    default: "市",
                }),
                value: "city",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.reco_type.county",
                    default: "区",
                }),
                value: "county",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.reco_type.town",
                    default: "街道",
                }),
                value: "town",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.reco_type.person",
                    default: "姓名",
                }),
                value: "person",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.reco_type.detail",
                    default: "地址",
                }),
                value: "detail",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.reco_type.phonenum",
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
                    id: "diWordProcessing.chinese_type.1",
                    default: "单字",
                }),
                value: "含义",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.chinese_type.2",
                    default: "词语",
                }),
                value: "词语",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.chinese_type.3",
                    default: "成语",
                }),
                value: "成语",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.chinese_type.4",
                    default: "诗词",
                }),
                value: "诗词",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.chinese_type.5",
                    default: "古文",
                }),
                value: "古文",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.chinese_type.6",
                    default: "俗语歇后语",
                }),
                value: "俗语歇后语",
            },
            {
                name: formatMessage({
                    id: "diWordProcessing.chinese_type.7",
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
            name: "自然语言处理",
            color1: "#3755E5",
            color2: "#3755E5",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "lexicalAndEmo",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "diWordProcessing.recognition",
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
                        id: "diWordProcessing.lexicalResult",
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
                        id: "diWordProcessing.emoResult",
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
        return (state.emoResult && state.emoResult.sentiment) || "未识别";
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
            const bodyJson = {
                text: TYPE && TYPE !== "诗词" ? TXT + "的" + TYPE : TXT,
            };
            if (TYPE === "诗词") bodyJson.type = "poetry";
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL["CHINESE_QA"],
                {
                    method: "POST",
                    body: JSON.stringify(bodyJson),
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
                        const ramIndex =
                            data.data.answer.length > 1
                                ? Math.round(
                                      Math.random() * data.data.answer.length
                                  )
                                : 0;
                        if (TYPE)
                            state.chineseQAResult1 = data.data.answer[ramIndex];
                        else state.chineseQAResult = data.data.answer[ramIndex];
                    } else {
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
