const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const MathUtil = require("../../util/math-util");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const { v4: uuidv4 } = require("uuid");

const menuIconURI =
    "data:image/png;base64,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";
const blockIconURI =
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMjIgMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbi3lm77lg4/lpITnkIYtMjI8L3RpdGxlPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iOS4xMy3kv67mlLnku6PnoIHlnZfpopzoibItLWljb27lj5jnmb3oibIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC4wMDAwMDAsIC03MzYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY29uLeWbvuWDj+WkhOeQhi0yMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCA3MzYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMjExIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjAwMDAwMCwgMy4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNC40NDcxNzQ0LDEuMDYxNDI1MDYgTDEzLjc0OTM4NTcsMC44MTU3MjQ4MTYgQzEzLjY3MDc2MTcsMC4zNjM2MzYzNjQgMTMuMjU3OTg1MywwIDEyLjc2NjU4NDgsMCBDMTIuMTk2NTYwMiwwIDExLjc0NDQ3MTcsMC40NTIwODg0NTIgMTEuNzQ0NDcxNywxLjAyMjExMzAyIEMxMS43NDQ0NzE3LDEuNTkyMTM3NTkgMTIuMTk2NTYwMiwyLjA0NDIyNjA0IDEyLjc2NjU4NDgsMi4wNDQyMjYwNCBDMTMuMDUxNTk3MSwyLjA0NDIyNjA0IDEzLjI1Nzk4NTMsMS45MjYyODk5MyAxMy40NjQzNzM1LDEuNzU5MjEzNzYgTDE0LjAzNDM5OCwyLjAwNDkxNCBDMTQuNDg2NDg2NSwyLjE3MTk5MDE3IDE0Ljc3MTQ5ODgsMi43NDIwMTQ3NCAxNC43NzE0OTg4LDMuMjcyNzI3MjcgTDE0Ljc3MTQ5ODgsMTIuMzYzNjM2NCBDMTQuNzcxNDk4OCwxMi44OTQzNDg5IDE0LjQ4NjQ4NjUsMTMuNDY0MzczNSAxNC4wMzQzOTgsMTMuNjMxNDQ5NiBMMTMuNTAzNjg1NSwxMy44Mzc4Mzc4IEMxMy4yOTcyOTczLDEzLjYzMTQ0OTYgMTMuMDUxNTk3MSwxMy41MTM1MTM1IDEyLjc2NjU4NDgsMTMuNTEzNTEzNSBDMTIuMTk2NTYwMiwxMy41MTM1MTM1IDExLjc0NDQ3MTcsMTMuOTY1NjAyIDExLjc0NDQ3MTcsMTQuNTM1NjI2NSBDMTEuNzQ0NDcxNywxNS4xMDU2NTExIDEyLjE5NjU2MDIsMTUuNTU3NzM5NiAxMi43NjY1ODQ4LDE1LjU1NzczOTYgQzEzLjIxODY3MzIsMTUuNTU3NzM5NiAxMy41ODIzMDk2LDE1LjI3MjcyNzMgMTMuNzQ5Mzg1NywxNC44NTk5NTA5IEwxNC40ODY0ODY1LDE0LjYxNDI1MDYgQzE1LjM1MTM1MTQsMTQuMzI5MjM4MyAxNiwxMy4zNDY0MzczIDE2LDEyLjQwMjk0ODQgTDE2LDMuMjgyNTU1MjggQzE1Ljk2MDY4OCwyLjMzOTA2NjM0IDE1LjMxMjAzOTMsMS4zNTYyNjUzNiAxNC40NDcxNzQ0LDEuMDYxNDI1MDYgWiBNMy41NTc3Mzk1NiwxMy41MTM1MTM1IEMzLjIzMzQxNTIzLDEzLjUxMzUxMzUgMi45NDg0MDI5NSwxMy42ODA1ODk3IDIuNzQyMDE0NzQsMTMuOTI2Mjg5OSBMMi4wMDQ5MTQsMTMuNjgwNTg5NyBDMS41OTIxMzc1OSwxMy40NzQyMDE1IDEuMjI4NTAxMjMsMTIuOTQzNDg4OSAxLjIyODUwMTIzLDEyLjQ5MTQwMDUgTDEuMjI4NTAxMjMsMy4xOTQxMDMxOSBDMS4yMjg1MDEyMywyLjc0MjAxNDc0IDEuNjAxOTY1NiwyLjIxMTMwMjIxIDIuMDA0OTE0LDIuMDQ0MjI2MDQgTDIuODIwNjM4ODIsMS43NTkyMTM3NiBDMy4wMjcwMjcwMywxLjk2NTYwMTk3IDMuMjcyNzI3MjcsMi4wODM1MzgwOCAzLjU1NzczOTU2LDIuMDgzNTM4MDggQzQuMTI3NzY0MTMsMi4wODM1MzgwOCA0LjU3OTg1MjU4LDEuNjMxNDQ5NjMgNC41Nzk4NTI1OCwxLjA2MTQyNTA2IEM0LjU3OTg1MjU4LDAuNDkxNDAwNDkxIDQuMTI3NzY0MTMsMC4wMzkzMTIwMzkzIDMuNTU3NzM5NTYsMC4wMzkzMTIwMzkzIEMzLjEwNTY1MTExLDAuMDM5MzEyMDM5MyAyLjY5Mjg3NDY5LDAuMzI0MzI0MzI0IDIuNTc0OTM4NTcsMC43MzcxMDA3MzcgTDEuNTUyODI1NTUsMS4wNjE0MjUwNiBDMC43MzcxMDA3MzcsMS4zNDY0MzczNSAwLDIuMjg5OTI2MjkgMCwzLjE5NDEwMzE5IEwwLDEyLjUzMDcxMjUgQzAsMTMuNDM0ODg5NCAwLjczNzEwMDczNywxNC4zMjkyMzgzIDEuNjAxOTY1NiwxNC42NjMzOTA3IEwyLjU4NDc2NjU4LDE0Ljk4NzcxNSBDMi43NTE4NDI3NSwxNS4zNjExNzk0IDMuMTE1NDc5MTIsMTUuNTk3MDUxNiAzLjUyODI1NTUzLDE1LjU5NzA1MTYgQzQuMDk4MjgwMSwxNS41OTcwNTE2IDQuNTUwMzY4NTUsMTUuMTQ0OTYzMSA0LjU1MDM2ODU1LDE0LjU3NDkzODYgQzQuNTc5ODUyNTgsMTMuOTY1NjAyIDQuMTI3NzY0MTMsMTMuNTEzNTEzNSAzLjU1NzczOTU2LDEzLjUxMzUxMzUgWiBNNS45NzU0Mjk5OCw2LjA2Mzg4MjA2IEM1Ljk3NTQyOTk4LDYuNTE1OTcwNTIgNi4zMzkwNjYzNCw2Ljg3OTYwNjg4IDYuNzkxMTU0NzksNi44Nzk2MDY4OCBDNy4yNDMyNDMyNCw2Ljg3OTYwNjg4IDcuNjA2ODc5NjEsNi41MTU5NzA1MiA3LjYwNjg3OTYxLDYuMDYzODgyMDYgQzcuNjA2ODc5NjEsNS42MTE3OTM2MSA3LjI0MzI0MzI0LDUuMjQ4MTU3MjUgNi43OTExNTQ3OSw1LjI0ODE1NzI1IEM2LjMzOTA2NjM0LDUuMjM4MzI5MjQgNS45NzU0Mjk5OCw1LjYxMTc5MzYxIDUuOTc1NDI5OTgsNi4wNjM4ODIwNiBaIiBpZD0i5b2i54q2Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9Iui3r+W+hCIgcG9pbnRzPSIxMC44MDA5ODI4IDYuNTE1OTcwNTIgMTIuMzUzODA4NCA4LjAyOTQ4NDAzIDEyLjM5MzEyMDQgMTAuMTYyMTYyMiA0Ljc3NjQxMjc4IDEwLjEyMjg1MDEgNC43NzY0MTI3OCA4Ljg1NTAzNjg2IDYuNTM1NjI2NTQgNy41ODcyMjM1OSA4LjI1NTUyODI2IDguNzM3MTAwNzQgMTAuODAwOTgyOCA2LjUxNTk3MDUyIj48L3BvbHlnb24+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTkuOTg1MjU3OTksMTIuMzYzNjM2NCBMNC40MTI3NzY0MSwxMi4zNjM2MzY0IEMzLjQ2OTI4NzQ3LDEyLjM2MzYzNjQgMi42OTI4NzQ2OSwxMS41ODcyMjM2IDIuNjkyODc0NjksMTAuNjQzNzM0NiBMMi42OTI4NzQ2OSw2LjE0MjUwNjE0IEMyLjY5Mjg3NDY5LDUuNjkwNDE3NjkgMy4wNjYzMzkwNyw1LjMyNjc4MTMzIDMuNTA4NTk5NTEsNS4zMjY3ODEzMyBMMy42NzU2NzU2OCw1LjMyNjc4MTMzIEwzLjY3NTY3NTY4LDEwLjYxNDI1MDYgQzMuNjc1Njc1NjgsMTEuMDI3MDI3IDQsMTEuMzEyMDM5MyA0LjM3MzQ2NDM3LDExLjMxMjAzOTMgTDEwLjc2MTY3MDgsMTEuMzEyMDM5MyBMMTAuNzYxNjcwOCwxMS41MTg0Mjc1IEMxMC44MDA5ODI4LDEyIDEwLjQzNzM0NjQsMTIuMzYzNjM2NCA5Ljk4NTI1Nzk5LDEyLjM2MzYzNjQgWiIgaWQ9Iui3r+W+hCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMi4yNzUxODQzLDEwLjk3Nzg4NyBMNC43MDc2MTY3MSwxMC45Nzc4ODcgQzQuMjk0ODQwMjksMTAuOTc3ODg3IDQuMDA5ODI4MDEsMTAuNjUzNTYyNyA0LjAwOTgyODAxLDEwLjI4MDA5ODMgTDQuMDA5ODI4MDEsNC4zNDM5ODAzNCBDNC4wMDk4MjgwMSwzLjg1MjU3OTg1IDQuNDIyNjA0NDIsMy40Mzk4MDM0NCA0LjkxNDAwNDkxLDMuNDM5ODAzNDQgTDEyLjI4NTAxMjMsMy40Mzk4MDM0NCBDMTIuNzc2NDEyOCwzLjQzOTgwMzQ0IDEzLjE4OTE4OTIsMy44NTI1Nzk4NSAxMy4xODkxODkyLDQuMzQzOTgwMzQgTDEzLjE4OTE4OTIsMTAuMDczNzEwMSBDMTMuMjE4NjczMiwxMC41NjUxMTA2IDEyLjc2NjU4NDgsMTAuOTc3ODg3IDEyLjI3NTE4NDMsMTAuOTc3ODg3IEwxMi4yNzUxODQzLDEwLjk3Nzg4NyBaIE01LjAzMTk0MTAzLDkuOTU1NzczOTYgTDEyLjE5NjU2MDIsOS45NTU3NzM5NiBMMTIuMTk2NTYwMiw0LjYyODk5MjYzIEMxMi4xOTY1NjAyLDQuNTExMDU2NTEgMTIuMTE3OTM2MSw0LjQyMjYwNDQyIDExLjk5MDE3Miw0LjQyMjYwNDQyIEw1LjIzODMyOTI0LDQuNDIyNjA0NDIgQzUuMTIwMzkzMTIsNC40MjI2MDQ0MiA1LjAzMTk0MTAzLDQuNTAxMjI4NSA1LjAzMTk0MTAzLDQuNjI4OTkyNjMgTDUuMDMxOTQxMDMsOS45NTU3NzM5NiBMNS4wMzE5NDEwMyw5Ljk1NTc3Mzk2IFoiIGlkPSLlvaLnirYiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+";
const REMOTE_URL = {
    CONVERT: "/api/image/style/convert",
    OPTIMIZE: "/api/image/optimize",
    PORTRAIT: "/api/image/cartoon/portrait",
    BACKGROUND: "/api/image/replace/background",
};

class DiImageProcessing {
    constructor(runtime) {
        this.runtime = runtime;
        // communication related
        this.comm = runtime.ioDevices.comm;
        this.session = null;
        this.runtime.registerPeripheralExtension("DiImageProcessing", this);
        // session callbacks
        this.reporter = null;
        this.onmessage = this.onmessage.bind(this);
        this.onclose = this.onclose.bind(this);
        this.write = this.write.bind(this);
        // string op
        this.decoder = new TextDecoder();
        this.lineBuffer = "";
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

    scan() {
        this.comm.getDeviceList().then((result) => {
            this.runtime.emit(
                this.runtime.constructor.PERIPHERAL_LIST_UPDATE,
                result
            );
        });
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
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(DiImageProcessing.STATE_KEY);
        if (!state) {
            state = Clone.simple(DiImageProcessing.DEFAULT_STATE);
            target.setCustomState(DiImageProcessing.STATE_KEY, state);
        }
        return state;
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return "Di.imageProcessing";
    }

    /**
     * The default state, to be used when a target has no existing state.
     * @type {HelloWorldState}
     */
    static get DEFAULT_STATE() {
        return {};
    }

    get STYLE_INFO() {
        return [
            {
                name: formatMessage({
                    id: "imageProcessing.style.cartoon",
                    default: "卡通画",
                }),
                value: "cartoon",
            },
            {
                name: formatMessage({
                    id: "imageProcessing.style.pencil",
                    default: "铅笔画",
                }),
                value: "pencil",
            },
            {
                name: formatMessage({
                    id: "imageProcessing.style.color_pencil",
                    default: "彩色铅笔画",
                }),
                value: "color_pencil",
            },
            {
                name: formatMessage({
                    id: "imageProcessing.style.warm",
                    default: "彩色糖块油画",
                }),
                value: "warm",
            },
            {
                name: formatMessage({
                    id: "imageProcessing.style.wave",
                    default: "神奈川冲浪里油画",
                }),
                value: "wave",
            },
            {
                name: formatMessage({
                    id: "imageProcessing.style.lavender",
                    default: "薰衣草油画",
                }),
                value: "lavender",
            },
            {
                name: formatMessage({
                    id: "imageProcessing.style.mononoke",
                    default: "奇异油画",
                }),
                value: "mononoke",
            },
            {
                name: formatMessage({
                    id: "imageProcessing.style.scream",
                    default: "呐喊油画",
                }),
                value: "scream",
            },
            {
                name: formatMessage({
                    id: "imageProcessing.style.gothic",
                    default: "哥特油画",
                }),
                value: "gothic",
            },
        ];
    }

    get SOURCE_INFO() {
        return [
            {
                name: formatMessage({
                    id: "imageProcessing.source.stage",
                    default: "舞台",
                }),
                value: "stage",
            },
            {
                name: formatMessage({
                    id: "imageProcessing.source.costume",
                    default: "角色",
                }),
                value: "costume",
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

    get REMOTE_URL() {
        return REMOTE_URL;
    }

    getInfo() {
        return {
            id: "diImageProcessing",
            name: "图像处理",
            color1: "#18D1B9",
            color2: "#18D1B9",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "imgConvert",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "diImageProcessing.convert",
                        default: "将[SOURCE]转换为[STYLE]风格",
                        description: "use img url to recogntion",
                    }),
                    arguments: {
                        STYLE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diImageProcessing.convert.style",
                                default: "cartoon",
                                description: "style",
                            }),
                            menu: "STYLE_LIST",
                        },
                        SOURCE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diImageProcessing.convert.source",
                                default: "stage",
                                description: "source",
                            }),
                            menu: "SOURCE_LIST",
                        },
                    },
                },
                {
                    opcode: "imgOptimize",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "diImageProcessing.optimize",
                        default: "开始[SOURCE]图像优化",
                        description: "optimize",
                    }),
                    arguments: {
                        SOURCE: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "diImageProcessing.optimize.source",
                                default: "stage",
                                description: "source",
                            }),
                            menu: "SOURCE_LIST",
                        },
                    },
                },
                {
                    opcode: "animation",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "diImageProcessing.animation",
                        default: "[WAIT_TIME]秒后，开始动漫人像",
                        description: "animation",
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
                    opcode: "matting",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "diImageProcessing.matting",
                        default: "开始舞台图像抠图",
                        description: "matting",
                    })
                },
            ],
            menus: {
                STYLE_LIST: {
                    acceptReporters: true,
                    items: this._buildMenu(this.STYLE_INFO),
                },
                SOURCE_LIST: {
                    acceptReporters: true,
                    items: this._buildMenu(this.SOURCE_INFO),
                },
                WAIT_TIME_LIST: {
                    acceptReporters: true,
                    items: this._buildMenu(this.WAIT_LIST),
                },
            },
        };
    }

    imgConvert(args, util) {
        if (!this.runtime.isLogin()) return;
        const style = args.STYLE;
        const source = args.SOURCE;
        const uuid = uuidv4();
        const state = this._getState(util.target);
        return new Promise((resolve, reject) => {
            let stage = null;
            const targets = this.runtime.targets;
            targets.forEach((target) => {
                if (target.isStage && source === "stage") stage = target;
                if (!target.isStage && source === "costume") stage = target;
            });
            const stageList = stage.sprite.costumes_;
            const currentStageIndex = stage.currentCostume;
            const currentStage = stageList[currentStageIndex];
            const stageBlob = new Blob([currentStage.asset.data.buffer], {
                type: currentStage.asset.assetType.contentType,
            });
            const imgType = currentStage.asset.assetType.contentType;
            const form = new FormData();
            form.append("file", stageBlob);
            form.append("style", style);
            const xhr = new XMLHttpRequest();
            xhr.open(
                "POST",
                this.runtime.REMOTE_HOST + this.REMOTE_URL.CONVERT
            );
            xhr.setRequestHeader("Access-Token", this.runtime.getToken());
            xhr.send(form);
            xhr.onreadystatechange = () => {
                state.uploadFile = null;
                if (xhr.readyState == 4) {
                    try {
                        const res = JSON.parse(xhr.response);if(res.code!==0) alert(res.message);
                        const resBase64 = `data:${imgType};base64,${res.data.image}`;
                        const newBlob = dataURLtoBlob(resBase64);
                        const newImg = new File([newBlob], currentStage.name, {
                            type: currentStage.asset.assetType.contentType,
                        });
                        switch (source) {
                            case "stage":
                                this.runtime.emit("add_stage", newImg);
                                break;
                            case "costume":
                                this.runtime.emit("add_costume", newImg);
                                break;
                            default:
                                console.error("param source invalid!");
                        }
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }
            };
        });
    }

    imgOptimize(args, util) {
        if (!this.runtime.isLogin()) return;
        const source = args.SOURCE;
        const state = this._getState(util.target);
        return new Promise((resolve, reject) => {
            let stage = null;
            const targets = this.runtime.targets;
            targets.forEach((target) => {
                if (target.isStage && source === "stage") stage = target;
                if (!target.isStage && source === "costume") stage = target;
            });
            const stageList = stage.sprite.costumes_;
            const currentStageIndex = stage.currentCostume;
            const currentStage = stageList[currentStageIndex];
            const stageBlob = new Blob([currentStage.asset.data.buffer], {
                type: currentStage.asset.assetType.contentType,
            });
            const imgType = currentStage.asset.assetType.contentType;
            const form = new FormData();
            form.append("file", stageBlob);
            const xhr = new XMLHttpRequest();
            xhr.open(
                "POST",
                this.runtime.REMOTE_HOST + this.REMOTE_URL.OPTIMIZE
            );
            xhr.setRequestHeader("Access-Token", this.runtime.getToken());
            xhr.send(form);
            xhr.onreadystatechange = () => {
                state.uploadFile = null;
                if (xhr.readyState == 4) {
                    try {
                        const res = JSON.parse(xhr.response);if(res.code!==0) alert(res.message);
                        const resBase64 = `data:${imgType};base64,${res.data.image}`;
                        const newBlob = dataURLtoBlob(resBase64);
                        const newImg = new File([newBlob], currentStage.name, {
                            type: currentStage.asset.assetType.contentType,
                        });
                        switch (source) {
                            case "stage":
                                this.runtime.emit("add_stage", newImg);
                                break;
                            case "costume":
                                this.runtime.emit("add_costume", newImg);
                                break;
                            default:
                                console.error("param source invalid!");
                        }
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }
            };
        });
    }

    animation(args, util) {
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
                    this.runtime.REMOTE_HOST + this.REMOTE_URL.PORTRAIT
                );
                xhr.setRequestHeader("Access-Token", this.runtime.getToken());
                xhr.send(form);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState == 4) {
                        const res = JSON.parse(xhr.response);if(res.code!==0) alert(res.message);
                        const type = "image/png";
                        const resBase64 = `data:${type};base64,${res.data.image}`;
                        // const newBlob = dataURLtoBlob(resBase64);
                        // const newImg = new File([newBlob], "动漫人像.png", {
                        //     type,
                        // });
                        this.runtime.emit("start_img_preview", resBase64);
                    }
                    resolve();
                };
            });
        });
    }

    matting() {
        
    }
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

module.exports = DiImageProcessing;
