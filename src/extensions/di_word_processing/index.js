// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Clone = require("../../util/clone");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");

const menuIconURI = "data:image/png;base64,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";
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMjIgMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbi3oh6rnhLbor63oqIDlpITnkIYtMjI8L3RpdGxlPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iOS4xMy3kv67mlLnku6PnoIHlnZfpopzoibItLWljb27lj5jnmb3oibIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC4wMDAwMDAsIC04MjYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY29uLeiHqueEtuivreiogOWkhOeQhi0yMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCA4MjYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNy42ODc4NTMyLDE4LjE3MDEyMTUgQzE3LjM0Mzg2MzgsMTguMjExMDA1NSAxNy4wMzE4OTY4LDE3Ljk2NTA5NzQgMTYuOTkxMjE0MiwxNy42MjExMDggQzE2Ljk4Njc4MzQsMTcuNTgyODQyMSAxNi45ODU3NzY0LDE3LjU0NDM3NDkgMTYuOTg4MTkzMiwxNy41MDYxMDkxIEwxNi45ODgxOTMyLDE1LjAyODkwMTkgQzE2Ljk4ODE5MzIsMTQuMzQ5NTgzMiAxNi41NDE2OTE3LDE0LjM0OTU4MzIgMTYuMzczMzIyMiwxNC4zNDk1ODMyIEMxNS45NDQ3NDUyLDE0LjM0MDMxODggMTUuNTg5Njc4OCwxNC42ODA0ODE3IDE1LjU4MDYxNTgsMTUuMTA5MjYwMSBDMTUuNTgwNDE0NCwxNS4xMTg1MjQ0IDE1LjU4MDQxNDQsMTUuMTI3Nzg4OCAxNS41ODA2MTU4LDE1LjEzNjg1MTcgTDE1LjU4MDYxNTgsMTcuNTA2NTExOSBDMTUuNTY1MzA5NSwxNy44ODcxNTYgMTUuMjQ0MDc4MiwxOC4xODM0MTM5IDE0Ljg2MzQzNDEsMTguMTY3OTA2MSBDMTQuNTA0MzM5OCwxOC4xNTM0MDU0IDE0LjIxNjU0MDYsMTcuODY1NjA2MyAxNC4yMDIwMzk5LDE3LjUwNjUxMTkgTDE0LjIwMjAzOTksMTMuNzU3NjcxNiBDMTQuMTc3MjY3OCwxMy40MTA2NjEyIDE0LjQzODQ4MjMsMTMuMTA5MzY4MyAxNC43ODU0OTI3LDEzLjA4NDc5NzcgQzE0LjgxOTUyOTEsMTMuMDgyMzgwOSAxNC44NTM3NjcsMTMuMDgyNzgzNyAxNC44ODc4MDM0LDEzLjA4NTgwNDYgQzE1LjE1MTY4OSwxMy4wNjM4NjEgMTUuNDAyMDc4OSwxMy4yMDU3OTkzIDE1LjUxODc4NjMsMTMuNDQzNDg5MiBDMTUuODM4MjAwMiwxMy4yMDQ5OTU2IDE2LjIyNzcwNTgsMTMuMDc5MTk3OCAxNi42MjYyNzkzLDEzLjA4NTgwNDYgQzE3LjcxNjA0OTEsMTMuMDg1ODA0NiAxOC4zNjczNzMzLDEzLjc2MjMwMzggMTguMzY3MzczMywxNC44OTg5OTk1IEwxOC4zNjczNzMzLDE3LjUwNjEwOTEgQzE4LjM3NTM5OTgsMTcuNjgzMDc0MiAxOC4zMTA3OTY5LDE3Ljg1NTYzOTYgMTguMTg4NTMxLDE3Ljk4MzgyNzUgQzE4LjA1NDE3MTMsMTguMTExNDc5OSAxNy44NzM4MzY4LDE4LjE3OTI2ODggMTcuNjg4NjU4OCwxOC4xNzE3MzI3IEwxNy42ODc4NTMyLDE4LjE3MDEyMTUgTDE3LjY4Nzg1MzIsMTguMTcwMTIxNSBaIE0xMi45OTI4NDA1LDE4LjAxOTg3NzkgTDEwLjI3OTk5NjUsMTguMDE5ODc3OSBDOS40MTg2MTMwOCwxOC4wMTk4Nzc5IDkuMDM0MzQzODYsMTcuNjM4MDI1NSA5LjAzNDM0Mzg2LDE2Ljc3OTg2NDUgTDkuMDM0MzQzODYsMTIuOTU5OTMwMyBDOS4wMzQzNDM4NiwxMi4xMDM1ODE5IDkuNDE4ODE0NDgsMTEuNzE5OTE2OSAxMC4yNzk5OTY1LDExLjcxOTkxNjkgTDEyLjg3MjgwNjcsMTEuNzE5OTE2OSBDMTMuMjMzNzEzNywxMS43MTk5MTY5IDEzLjUyNjM0NjQsMTIuMDEyNTQ5NiAxMy41MjYzNDY0LDEyLjM3MzQ1NjUgQzEzLjUyNjM0NjQsMTIuNzM0MzYzNSAxMy4yMzM3MTM3LDEzLjAyNjk5NjIgMTIuODcyODA2NywxMy4wMjY5OTYyIEwxMC41MzE5NDY2LDEzLjAyNjk5NjIgQzEwLjUwNzM3NTksMTMuMDI1Mzg1IDEwLjQ4MjYwMzgsMTMuMDI4ODA4NyAxMC40NTk0NDI5LDEzLjAzNzA2NjEgQzEwLjQ2MjA2MTEsMTMuMDM3MDY2MSAxMC40NTY0MjIsMTMuMDUzMTc4IDEwLjQ1NjQyMiwxMy4wOTUyNzA0IEwxMC40NTY0MjIsMTQuMTU0MjI2MiBMMTIuNTkxMjUxLDE0LjE1NDIyNjIgQzEyLjkyMDEzNTUsMTQuMTIwNzkzOSAxMy4yMTM3NzUyLDE0LjM2MDQ1ODcgMTMuMjQ3MjA3NCwxNC42ODkzNDMyIEMxMy4yNTA2MzEyLDE0LjcyMzE3ODIgMTMuMjUxMjM1NCwxNC43NTcyMTQ3IDEzLjI0ODgxODYsMTQuNzkxMjUxMSBDMTMuMjY4NTU1NywxNS4xMjY3ODE4IDEzLjAxMjU3NzYsMTUuNDE0OTgzNyAxMi42NzY4NDU1LDE1LjQzNDcyMDggQzEyLjY0ODQ0ODMsMTUuNDM2MzMyIDEyLjYxOTg0OTYsMTUuNDM2MTMwNiAxMi41OTE0NTI0LDE1LjQzMzcxMzggTDEwLjQ1NDgxMDgsMTUuNDMzNzEzOCBMMTAuNDU0ODEwOCwxNi42NDQxMjE2IEMxMC40NTQwMDUyLDE2LjY2NTQ2OTkgMTAuNDU2NDIyLDE2LjY4NzAxOTUgMTAuNDYxODU5NywxNi43MDc1NjIyIEMxMC40ODQ0MTY0LDE2LjcxMDU4MzIgMTAuNTA3MTc0NSwxNi43MTIxOTQ0IDEwLjUyOTkzMjYsMTYuNzEyMzk1OCBMMTIuOTkzMjQzMywxNi43MTIzOTU4IEMxMy4zMzQ4MTYsMTYuNjkwODQ2MSAxMy42MjkyNjEzLDE2Ljk1MDI0OCAxMy42NTA4MTA5LDE3LjI5MTYxOTIgQzEzLjY1MjIyMDcsMTcuMzE0OTgxNSAxMy42NTI0MjIxLDE3LjMzODU0NTIgMTMuNjUxMjEzNywxNy4zNjIxMDg5IEMxMy42Nzg0MDI2LDE3LjY5ODA0MjQgMTMuNDI4MjY1MSwxNy45OTI0ODc2IDEzLjA5MjMzMTYsMTguMDE5Njc2NSBDMTMuMDU5MzAyMiwxOC4wMjIyOTQ3IDEzLjAyNjI3MjcsMTguMDIyMjk0NyAxMi45OTMyNDMzLDE4LjAxOTY3NjUgTDEyLjk5Mjg0MDUsMTguMDE5Njc2NSBMMTIuOTkyODQwNSwxOC4wMTk4Nzc5IFogTTcuMjQ1MzE2ODUsMTAuNDM4MDEyNSBDNi44OTU2ODgyNCwxMC40ODU1NDI2IDYuNTczODUyNywxMC4yNDA2NDE1IDYuNTI2MzIyNTQsOS44OTEwMTI4NiBDNi41MjAyODA1Nyw5Ljg0NjUwMzY5IDYuNTE4ODcwNzgsOS44MDE1OTE3MiA2LjUyMjI5NDU2LDkuNzU2Njc5NzUgTDYuNTIyMjk0NTYsOC4xNzUyOTUwOCBMNC44MDQ5NjU1OCw4LjE3NTI5NTA4IEMzLjg4MTM0OTkzLDguMTc1Mjk1MDggMy40Njk0ODkwNCw3Ljc2MjAyNDQgMy40Njk0ODkwNCw2LjgzOTgxODU0IEwzLjQ2OTQ4OTA0LDQuOTQ5Mjg2NDUgQzMuNDY5NDg5MDQsNC4wMzEzMDk5NiAzLjg4Mjc1OTcyLDMuNjIyMDY3MjcgNC44MDQ5NjU1OCwzLjYyMjA2NzI3IEw2LjUyMjI5NDU2LDMuNjIyMDY3MjcgTDYuNTIyMjk0NTYsMi45ODcwNTYzMyBDNi40OTQ1MDE1LDIuNjQyNDYyNyA2Ljc1MTI4NTE4LDIuMzQwMzY0MjUgNy4wOTU4Nzg4MSwyLjMxMjU3MTE5IEM3LjEzNDU0NzQyLDIuMzA5NTUwMjEgNy4xNzMyMTYwMiwyLjMwOTk1MzAxIDcuMjExODg0NjIsMi4zMTM5ODA5OSBDNy44MjEzMTc4OSwyLjMxMzk4MDk5IDcuOTQ5NjA5MDMsMi42Nzk5MjI5MSA3Ljk0OTYwOTAzLDIuOTg3MDU2MzMgTDcuOTQ5NjA5MDMsMy42MjMyNzU2NiBMOS42ODM0NTI3MiwzLjYyMzI3NTY2IEMxMC42MDcwNjg0LDMuNjIzMjc1NjYgMTEuMDE5MzMyMSw0LjAzMjkyMTE2IDExLjAxOTMzMjEsNC45NTAwOTIwNCBMMTEuMDE5MzMyMSw2Ljg0MTAyNjkzIEMxMS4wMTkzMzIxLDcuNzY0NjQyNTkgMTAuNjA2MDYxNCw4LjE3NjEwMDY3IDkuNjgzNDUyNzIsOC4xNzYxMDA2NyBMNy45NTA0MTQ2Miw4LjE3NjEwMDY3IEw3Ljk1MDQxNDYyLDkuNzU3NDg1MzUgQzcuOTc1NTg5NDksMTAuMTA5MzI5MyA3LjcxMDc0OTg2LDEwLjQxNTA1MyA3LjM1ODkwNTg2LDEwLjQ0MDQyOTIgQzcuMzIxMDQyODYsMTAuNDQzMDQ3NCA3LjI4MzE3OTg1LDEwLjQ0MjQ0MzIgNy4yNDU1MTgyNSwxMC40Mzg0MTUyIEw3LjI0NTUxODI1LDEwLjQzODAxMjUgTDcuMjQ1MzE2ODUsMTAuNDM4MDEyNSBaIE01LjAyMzI4MjA2LDQuOTY4NDE5MzUgQzQuODkyOTc2OTMsNC45Njg0MTkzNSA0Ljg4MDg5Mjk5LDQuOTgwNTAzMjkgNC44ODA4OTI5OSw1LjExMDgwODQyIEw0Ljg4MDg5Mjk5LDYuNjg1NzQ4MzMgQzQuODgwODkyOTksNi44MTcyNjE4NSA0Ljg5Mjk3NjkzLDYuODI5NzQ4NTkgNS4wMjMyODIwNiw2LjgyOTc0ODU5IEw2LjUyMjI5NDU2LDYuODI5NzQ4NTkgTDYuNTIyMjk0NTYsNC45Njg0MTkzNSBMNS4wMjMyODIwNiw0Ljk2ODQxOTM1IEw1LjAyMzI4MjA2LDQuOTY4NDE5MzUgWiBNNy45NTA2MTYwMiw2LjgyODk0Mjk5IEw5LjQ2Njk0ODgzLDYuODI4OTQyOTkgQzkuNTkzNjI4NzgsNi44Mjg5NDI5OSA5LjYwOTc0MDcsNi44MTI4MzEwOCA5LjYwOTc0MDcsNi42ODY1NTM5MiBMOS42MDk3NDA3LDUuMTEwNjA3MDIgQzkuNjA5NzQwNyw0Ljk4MzkyNzA3IDkuNTkzNjI4NzgsNC45Njc4MTUxNSA5LjQ2Njk0ODgzLDQuOTY3ODE1MTUgTDcuOTUwMjEzMjMsNC45Njc4MTUxNSBMNy45NTAyMTMyMyw2LjgyOTE0NDM5IEw3Ljk1MDYxNjAyLDYuODI5MTQ0MzkgTDcuOTUwNjE2MDIsNi44Mjg5NDI5OSBaIE0xMS4wMDAxOTkyLDIwLjAzODkwMjUgQzYuMDE0NTY3NzcsMjAuMDIzOTk5IDEuOTg1MTc4NjcsMTUuOTcwNDQyIDIuMDAwMDQwOTgsMTAuOTg0ODEwNiBDMi4wMDIwOTYxOCwxMC4yNzk5MTQzIDIuMDg2ODg1MTUsOS41Nzc4Mzc0NyAyLjI1MjIzMzcsOC44OTI2NzgxOSBDMi4zNDkxMDY2LDguNTEwMDIwMTYgMi43MzM5ODAwMiw4LjI3NDc4NjE2IDMuMTE4ODUzNDQsOC4zNjMyMDAzMSBDMy41MDM1MjU0Nyw4LjQ1NjA0NTIzIDMuNzQwMzcwNjUsOC44NDI3MzEyNSAzLjY0ODMzMTMyLDkuMjI3NDAzMjcgQzIuNjYyODg2MTksMTMuMzAyMzA4NSA1LjE2NzI4MjMyLDE3LjQwNDQwMjcgOS4yNDIxODc1OSwxOC4zODk4NDc4IEM5LjgxNzg4Nzc3LDE4LjUyOTA4MTIgMTAuNDA3OTA1LDE4LjYwMDQ1OTEgMTEuMDAwMTk5MiwxOC42MDI1MjUxIEMxMS4zOTY3NTM3LDE4LjYwMjkyNzkgMTEuNzE3OTg1MSwxOC45MjQ1NjIxIDExLjcxNzc4MzgsMTkuMzIxMzE4IEMxMS43MTczODA5LDE5LjcxNzQ2OTggMTEuMzk2MzUwOSwyMC4wMzg0OTk3IDExLjAwMDE5OTIsMjAuMDM4OTAyNSBMMTEuMDAwMTk5MiwyMC4wMzg5MDI1IFogTTE5LjAyNTc0NjUsMTMuNzk0NTI3NiBDMTguNjI5MTkyLDEzLjc5NDUyNzYgMTguMzA3NTU3OCwxMy40NzMwOTQ5IDE4LjMwNzU1NzgsMTMuMDc2NTQwMyBDMTguMzA3NTU3OCwxMy4wMTcxMjc2IDE4LjMxNTAwOTYsMTIuOTU3NzE0OSAxOC4zMjk1MTAzLDEyLjkwMDExNDggQzE5LjM2Mjg4ODQsOC44MzU0ODA4OCAxNi45MDU2MTk2LDQuNzAyNzc0MTIgMTIuODQwOTg1NywzLjY2OTM5NjAyIEMxMi4yMzkwMDQyLDMuNTE2MzMyODEgMTEuNjIwNzA5NCwzLjQzNzc4NzIxIDEwLjk5OTU5NSwzLjQzNTM3MDQzIEMxMC42MDMyNDE4LDMuNDM1MzcwNDMgMTAuMjgxODA5LDMuMTE0MTM5MDggMTAuMjgxODA5LDIuNzE3Nzg1OTEgQzEwLjI4MTgwOSwyLjMyMTQzMjc1IDEwLjYwMzA0MDQsMiAxMC45OTkzOTM2LDIgTDEwLjk5OTU5NSwyIEMxNS45ODU2MjkxLDIuMDE1MzA2MzIgMjAuMDE1MjE5Niw2LjA2OTg3MDI5IDE5Ljk5OTk1NjgsMTEuMDU1OTA0NSBDMTkuOTk3Njk3OSwxMS43OTcwNTI3IDE5LjkwNDA0NzQsMTIuNTM0OTc4NSAxOS43MjEzNzg2LDEzLjI1MzE2NzIgQzE5LjY0MDgxOSwxMy41NzEzNzc2IDE5LjM1NDIyODIsMTMuNzk0NTI3NiAxOS4wMjU3NDY1LDEzLjc5NDUyNzYgWiIgaWQ9IuW9oueKtiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==";

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
