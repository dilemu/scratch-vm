const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const MathUtil = require("../../util/math-util");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
// const MathUtil = require('../../util/math-util');

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
            types: [],
        };
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
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: "image_recognition",
            name: formatMessage({
                id: "image_recognition.categoryName",
                default: "hello World",
                description: "Label for the hello world extension category",
            }),
            // menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            // showStatusButton: true,
            blocks: [
                {
                    opcode: "say",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "image_recognition.say",
                        default: "say [TEXT]",
                        description: "say something",
                    }),
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "image_recognition.defaultTextToSay",
                                default: "hello world",
                                description: "default text to say.",
                            }),
                        },
                    },
                },
                {
                    opcode: "upload",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "image_recognition.upload",
                        default: "点击上传图片",
                        description: "say something",
                    }),
                    arguments: {
                        TEXT: {
                            type: ArgumentType.STRING,
                            defaultValue: formatMessage({
                                id: "image_recognition.defaultTextToSay",
                                default: "hello world",
                                description: "default text to say.",
                            }),
                        },
                    },
                },
            ],
            menus: {},
        };
    }

    say(args, util) {
        const message = args.TEXT;
        const state = this._getState(util.target);
        console.log(state);
        console.log(message);
        this.runtime.emit("SAY", util.target, "say", message);
    }
}

module.exports = DiImageRecognition;
