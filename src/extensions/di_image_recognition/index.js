const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const MathUtil = require("../../util/math-util");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
// const MathUtil = require('../../util/math-util');

const REMOTE_HOST = "//192.168.31.204:60002";

const RECOGNITION_URL = {
    NORMAL: "/api/image/general/classify",
    ANIMAL: "",
    BOTANY: "",
    FRUIT: "",
    CURRENCY: "",
    LANDMARK: "",
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
const blockIconURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAFjCAMAAAAkZ61JAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA/VpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOjVEMjA4OTI0OTNCRkRCMTE5MTRBODU5MEQzMTUwOEM4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY3Mzc0QzA0NTQ0RTExRUE4N0I0QkVCMkE4M0IxMDA4IiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY3Mzc0QzAzNTQ0RTExRUE4N0I0QkVCMkE4M0IxMDA4IiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIElsbHVzdHJhdG9yIENDIDIzLjAgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0idXVpZDo4YTA1ZWE3NS0xNDVjLThlNDItOWMwMy05YjUzN2Y0NTJhMjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDJjNTNiNDMtZGI5NS00YWJjLWE1ZGQtNDllM2Y4MmRlYjM5Ii8+IDxkYzp0aXRsZT4gPHJkZjpBbHQ+IDxyZGY6bGkgeG1sOmxhbmc9IngtZGVmYXVsdCI+5omT5Y2wPC9yZGY6bGk+IDwvcmRmOkFsdD4gPC9kYzp0aXRsZT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7vvOciAAAADFBMVEX19PQiGBaSjYv////tE2uTAAAABHRSTlP///8AQCqp9AAACnRJREFUeNrs3dli4ygQBdDr4v//eXrcScd2tLDUBlx6XsZJZOCoCi0IobCkKmAXEISFIARhIQhBWAhCEBaCEISFICwEIQgLQQjCQhCCsBCEICwEYSEIQVgIQhAWghCEhSAEYSEIC0EIwkIQgrAQhCAsBCEIC0FYCLIwCL7Lsr0D9yais6Lypzx+yv//u5LLs4GPt+LURHTV9XFSllC5aqB9Cxu3flXXnyrPrHHfwIepCZQrO7VJdQMfdg1EQ20fDWVCk8YGIhakrbbGe1FocBi3D1YcU5F0cFi1r2qTePSWKUg6d7dn+yJABuo7BYlIpubBMDymIBnb3f4UOIOM1vd5xLUuh3ragn2FEwcJ8rUOHh76gZ0mPNRFYL8DWR2P5AgPbRE4eeRLW6LaOjiAQLfKudKWduPUdjd47UK50pb6zqbWNjh65BFB3rbB0yOLCEzaBlMQmzrnEBGjtsEQxMojg4ikbhqcKx0vgtxNg3elo0XEsmkwAjH1iBVB9pbBfS8KPUM03tUURBBQ6ziRCVqGgAAJE7H3GA8RhFQ7aBhx2NOGdzXEVDtEZIqGISRAQkBcPIZDBCH1DpnXCJlhVwsAiZtlCsk/isD9SD32NpWDiTKIbX0zPD5inbpEFQTrBodbmGAOkFzPViHr9Wz4ZKyEM+UgU4DswvFsOxLmLNhnrMzPgSJdiMA4Y6V/GsEic+UFWf15HYOcBcMhZJon2kSygmBHDoOxRPKBTPdUNFKCyK4cyuNnMpDEj7B5je5QAtk3PJRJlECwN4fiUJIGRKZfnUknSCQJiJQFSuyj0lAc02WVJeVkDRApy5ThIEkAImuthCmzg0hZrAwGSTTIigvFSnyEMF2pnZOERoiURctA2oqMkJVXK5f5IkTWXj0es40hUhYvnWkrKkJ2eLmCTASyx8suZJYTQ9nl5SOYI0Jkn5fBNA8kEREiZaPSKhIAspVHe/ZwB9nNwy19dN4x3M/DK3/0gezo0STiPMlhT48WEa15WUIPnRMSV5B9PapjxHUq6c4etTHiCbK3h30SaX0cYXePOhG/J6joUSWiByK8nqgg4vfQJz2qRBRBQA8FEa+FA+hRefCjCHJlzwG9UsRp8Rl61Ir4LM9Ej+pUogpy+kUcQGpFdFeUO/seehSfXbdyEUx61A8jyiCH8BxA6kXU1+0FPYaSlvrK1r+/hlewGkT0137//S30aEhaBiCfIvRoESnmIBxAWpKWxQtd3r+FHtf9p51Obt/SxoTVkrRsXgr2GiL0aEpaMAIBE1aXiNV7DP+J0KMpadm9evWbnQmrKUQsQZ5HD/RoOtKyfFv0MxCZsNpCBKYgf9wZIE0iOvsvO11tXAdBUoWIUk8SRClEtAZcgij1IwiyqCy7gCAsBCEIC0EIwkIQgrAQhCANvy0sdQU+IIZvhV+tOEUIO9p6STFGyNQRQhBGCCOEYwgjhBFCEEYII4RjCCOEhWMII4SFYwgjhBHCMYQRQhCOIYwQRgjHEJY9IwQnJU8NNxtDkH2X2S5C0teQILlimBGyZ4SAEZIrQvCQl3+MkDeCiKmkafbGhCAZFg4AU9b4oLE4iBCEIGOjOFMWI4QpixFCEI4hBGHKYsoiCCOEIBxDmLJmBJG3/6QQJLT1DfngY9aDECRXa8ExJFdrwQjZFCTHQsrvqwPtBvIxRy8DiFvbM1bK5m0ec4AIQQhCEIJwDCEII4QgBCEIxxCCMEIIQhCCEIRjCCOEIJW30N/+DYDIx+14guRp6xSVJMi6IOV511DlmdCkIErPdbqB6DU9KYjH64gIQhCCEIQgBCEIQQhCEIIQhCAEIQhBCEIQgliBAENvax64Ci1zgwy86/vi6Zf6pzihX60yN4hFkWw79OYgkmQkIkjfsCQEyRQgD7VHlQmiBQKCmJYHQSaPECEII8QNRHvJgn3GkKZeQ9UG39fNuD6XTgQi0RA/C47IQ+q6DRUbPZnF528y03nIab/doOBGI9e1CZkkY+FyJZ7LffnqR5LuchGmCJChjsPAVgMaLfkDpLbj0ARSf5XbN0iQPkAweDUa46kBSUMk/4EgakEk78EMUntgvOcwvlXftiNxwoLCtR0MH+znFJHUw8dFPaGxVV8RSXeo0Xtl50gEw1Hnv0NiIY9fXQedrT5SHfyGHPB2T3vCFUj/rKVEo2fMCWF/1+EcZGBym/dFFEk2+2eg6+QcJOXsz6YLeGGTsbSmqEIn6mISxdes0q/1UMJu0wwGyPvOjPEjrJmnpSUYQT52Zqht9LGzx+ASKmICAoIo9B30NirMWAp9B4uNEiQFyMY5a3wVrgOQ8Y0SRKHvNEGEGUsTRAhCEIL86jtNkAdBckXIvqP6I2mEEIQRsshRL0F0QYTnIaulrEKQ2KMseV0m+/VtAwRxBvl7Y/NiMRdeXHQDqbrHfA4iH2vPS30eJMi1BT7LMQhe//j42YXPxz+Zse7T/avF8YPMbx++gtxkt5vdYetJDvezxO6eKf/+8VX/46icfjsIctYptQ+qn/zeSXJ7+QuhR52IfHVaS/Y7orhhPMqZe8/KusgarUtf1Ka4TxHJMYEztwj+dlYrSPMKJs9ffplaS45DEenxKF2ryXz9DX7m08YuSpNSpM+jd3mmj5OZb5TNReRjUO3pkO4+/Jvn3oee7ePke2j9ThvFEeTkQGD7MPnXJZ0dAYsacYTv7wVkqsxqQZIFpDtc944NS5DgIIn89tGvRtaKjR9shCzZifANJCQ5vhM0Q3jYgoSJ4CZqUjcYJb9Ia0eiNp9lbC6SxvDBTefqbcGE2Wn3s84qLbXEzWgMizapiWilg+hxDvXHRCYgenm1zAFSTiewNKfy2t9ERFeqBVrIsWBf7o4Dud9x1PrR5dV8UPpWG5B7EeAupBUPDSLOl5AL5H6cO8u2BmdcPuduv26amA6c0N4wLhKZ9hmw08m0DkixAindAwS0O9Hr6gZUvtQM5FoEfh5+IFABgVmbukD6b52Hg7xVOyVIz0tW9APE8S1tGiDFDqTUPdV0ECBlVhBogEArjFr+DhefY1qQl6rbghRobxx+AeL6YkkFkGIYIed/Cb8A8QVBcpDSBAKT/vNdRF8BBKYgaARBmRsEoz1WU2EUbW+4jSDeLydOD3JcN7iNIO4g49fimh69V9o+/ALE+/Xd+UGO7t7AL0DcQcbbYQ1SDp49dhvS/V9wPwFIqQGxChB/kOE96/6Ga1EOEc8AcQdRaIk5yK8bnH5DehQIcoN8VNAzY/mDFPOcpTLDFhUghSBuIHf305YCgXHOUp9jC8eMVSLerWYcIupzdeEYIASp+JYtQAxzlvbzBSfXUhYCGQ8RnyadXgo1HEIiQKxzluYzUedTq1EIUllraEfzHiCYAsRqj0oGYpuzXJ7Sw0ogZXYQyy+ZE6QQJBsICJIqCV+u2U0Q/1G9BIJgPZAyPcjwkiHrgSAOpPtLfijOTWYFKQjbxXorX7d+K0GcKg9UfjYtCKYCASo/DQKB3WqRKUGA2s8J4gHScFQVuCyiUc5KCNJy6Y0gHiAtB1/dpzZDSxZqnOxOA4KWPQvtGtcfEKS5Rm8//0+AAQA/KmUWGARK+QAAAABJRU5ErkJggg==";
const menuIconURI = blockIconURI;

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
            result: "图像识别结果",
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
            // menuIconURI: menuIconURI,
            // blockIconURI: blockIconURI,
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
        console.log(1);
        if (util.stackTimerNeedsInit()) {
            const duration = Math.max(0, 1000 * Cast.toNumber(args.WAIT_TIME));
            util.startStackTimer(duration);
            this.runtime.requestRedraw();
            util.yield();
        } else if (!util.stackTimerFinished()) {
            util.yield();
            console.log(5);
        } else {
            const state = this._getState(util.target);
            if (state.remote_url) {
                return fetchWithTimeout(state.remote_url, {}, serverTimeoutMs)
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
                                state.result =
                                    (res.data.words_result &&
                                        res.data.words_result.length &&
                                        res.data.words_result[0].words) ||
                                    "";
                            }
                        };
                    });
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
