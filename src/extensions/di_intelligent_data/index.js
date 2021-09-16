// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");
const { v4: uuidv4 } = require("uuid");

const menuIconURI = "data:image/png;base64,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";
const blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjJweCIgaGVpZ2h0PSIyMnB4IiB2aWV3Qm94PSIwIDAgMjIgMjIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbi3mmbrog73lpKnmsJQtMjI8L3RpdGxlPgogICAgPGcgaWQ9Iumhtemdoi0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iOS4xMy3kv67mlLnku6PnoIHlnZfpopzoibItLWljb27lj5jnmb3oibIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMC4wMDAwMDAsIC05MTYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJpY29uLeaZuuiDveWkqeawlC0yMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCA5MTYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjIiIGhlaWdodD0iMjIiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMjEzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjAwMDAwMCwgMy4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik05LjEyMzk2NjkzLDkuOTgzNDcxMDcgTDEyLjA5OTE3MzYsMTIuOTU4Njc3NyBDMTIuMjMxNDA1LDEzLjA5MDkwOTEgMTIuNDI5NzUyMSwxMy4xNTcwMjQ4IDEyLjU2MTk4MzUsMTMuMTU3MDI0OCBDMTIuNjk0MjE0OSwxMy4xNTcwMjQ4IDEyLjg5MjU2MiwxMy4wOTA5MDkxIDEzLjAyNDc5MzQsMTIuOTU4Njc3NyBDMTMuMjg5MjU2MiwxMi42OTQyMTQ5IDEzLjI4OTI1NjIsMTIuMjk3NTIwNiAxMy4wMjQ3OTM0LDEyLjAzMzA1NzggTDEwLjA0OTU4NjgsOS4wNTc4NTEyNCBDMTAuMjQ3OTMzOSw4LjcyNzI3MjczIDEwLjMxNDA0OTYsOC4zMzA1Nzg1MiAxMC4zMTQwNDk2LDcuOTMzODg0MyBDMTAuMzE0MDQ5Niw3LjUzNzE5MDA4IDEwLjE4MTgxODIsNy4xNDA0OTU4NyAxMC4wNDk1ODY4LDYuODA5OTE3MzYgTDEzLjAyNDc5MzQsMy44MzQ3MTA3NCBDMTMuMjg5MjU2MiwzLjU3MDI0NzkyIDEzLjI4OTI1NjIsMy4xNzM1NTM3MSAxMy4wMjQ3OTM0LDIuOTA5MDkwOTEgQzEyLjc2MDMzMDYsMi42NDQ2MjgxMSAxMi4zNjM2MzY0LDIuNjQ0NjI4MDkgMTIuMDk5MTczNiwyLjkwOTA5MDkxIEw5LjEyMzk2NjkzLDUuODg0Mjk3NTEgQzguNzkzMzg4NDIsNS42ODU5NTA0IDguMzk2Njk0MjEsNS42MTk4MzQ3IDcuOTk5OTk5OTksNS42MTk4MzQ3MSBDNy42MDMzMDU3OCw1LjYxOTgzNDczIDcuMjA2NjExNTYsNS43NTIwNjYxMSA2Ljg3NjAzMzA1LDUuODg0Mjk3NTEgTDMuOTAwODI2NDUsMi45MDkwOTA5MSBDMy43MDI0NzkzNCwyLjY0NDYyODA5IDMuMjM5NjY5NDIsMi42NDQ2MjgwOSAyLjk3NTIwNjYyLDIuOTA5MDkwOTEgQzIuNzEwNzQzODIsMy4xNzM1NTM3MiAyLjcxMDc0MzgsMy41NzAyNDc5NCAyLjk3NTIwNjYyLDMuODM0NzEwNzQgTDUuOTUwNDEzMjIsNi44MDk5MTczNiBDNS43NTIwNjYxMSw3LjE0MDQ5NTg3IDUuNjg1OTUwNCw3LjUzNzE5MDA4IDUuNjg1OTUwNCw3LjkzMzg4NDMgQzUuNjg1OTUwNCw4LjMzMDU3ODUyIDUuODE4MTgxOCw4LjcyNzI3MjczIDUuOTUwNDEzMjIsOS4wNTc4NTEyNCBMMi45NzUyMDY2MiwxMi4wMzMwNTc4IEMyLjcxMDc0MzgsMTIuMjk3NTIwNyAyLjcxMDc0MzgsMTIuNjk0MjE0OSAyLjk3NTIwNjYyLDEyLjk1ODY3NzcgQzMuMTA3NDM4MDIsMTMuMDkwOTA5MSAzLjMwNTc4NTEyLDEzLjE1NzAyNDggMy40MzgwMTY1MiwxMy4xNTcwMjQ4IEMzLjU3MDI0NzkyLDEzLjE1NzAyNDggMy43Njg1OTUwMywxMy4wOTA5MDkxIDMuOTAwODI2NDUsMTIuOTU4Njc3NyBMNi44NzYwMzMwNSw5Ljk4MzQ3MTA3IEM3LjIwNjYxMTU2LDEwLjE4MTgxODIgNy42MDMzMDU3OCwxMC4yNDc5MzM5IDcuOTk5OTk5OTksMTAuMjQ3OTMzOSBDOC4zOTY2OTQyMSwxMC4yNDc5MzM5IDguNzkzMzg4NDIsMTAuMTE1NzAyNSA5LjEyMzk2NjkzLDkuOTgzNDcxMDcgWiBNOC45OTE3MzU1Myw3LjkzMzg4NDMgQzguOTkxNzM1NTMsOC40NjI4MDk5MiA4LjUyODkyNTYxLDguOTI1NjE5ODQgNy45OTk5OTk5OSw4LjkyNTYxOTg0IEM3LjQ3MTA3NDM4LDguOTI1NjE5ODQgNy4wMDgyNjQ0Nyw4LjQ2MjgwOTkyIDcuMDA4MjY0NDcsNy45MzM4ODQzIEM3LjAwODI2NDQ3LDcuNDA0OTU4NjggNy40NzEwNzQzOSw2Ljk0MjE0ODc2IDcuOTk5OTk5OTksNi45NDIxNDg3NiBDOC41Mjg5MjU1OSw2Ljk0MjE0ODc2IDguOTkxNzM1NTMsNy40MDQ5NTg2OCA4Ljk5MTczNTUzLDcuOTMzODg0MyBMOC45OTE3MzU1Myw3LjkzMzg4NDMgWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLjkwOTA5MDkxLDYuNzQzODAxNjUgTDMuMDQxMzIyMzEsNi43NDM4MDE2NSBDMy4zNzE5MDA4Miw2Ljc0MzgwMTY1IDMuNjM2MzYzNjMsNi41NDU0NTQ1NCAzLjcwMjQ3OTM0LDYuMjE0ODc2MDQgQzMuNzY4NTk1MDUsNS44ODQyOTc1MyAzLjUwNDEzMjIzLDUuNDg3NjAzMzEgMy4xNzM1NTM3MSw1LjQyMTQ4NzYgQzIuNzEwNzQzNzgsNS4zNTUzNzE5IDIuMzE0MDQ5NTcsNS4xNTcwMjQ3OSAxLjk4MzQ3MTA4LDQuODkyNTYxOTkgQzEuMTkwMDgyNjQsNC4wOTkxNzM1NiAxLjE5MDA4MjY0LDIuNzc2ODU5NTEgMS45ODM0NzEwOCwxLjk4MzQ3MTA4IEMyLjc3Njg1OTUxLDEuMTkwMDgyNjQgNC4wOTkxNzM1NiwxLjE5MDA4MjY0IDQuODkyNTYxOTksMS45ODM0NzEwOCBDNS4yMjMxNDA1LDIuMzE0MDQ5NTggNS40MjE0ODc2LDIuNjQ0NjI4MTEgNS40ODc2MDMzLDMuMTA3NDM4MDIgQzUuNTUzNzE5LDMuNDM4MDE2NTIgNS44ODQyOTc1MSwzLjcwMjQ3OTM0IDYuMjgwOTkxNzMsMy42MzYzNjM2MyBDNi42MTE1NzAyNCwzLjU3MDI0NzkyIDYuODc2MDMzMDUsMy4yMzk2Njk0MiA2LjgwOTkxNzM2LDIuODQyOTc1MiBDNi42Nzc2ODU5NiwyLjExNTcwMjQ4IDYuMzQ3MTA3NDQsMS41MjA2NjExNSA1Ljg4NDI5NzUxLDAuOTkxNzM1NTM2IEM0LjU2MTk4MzQ2LC0wLjMzMDU3ODUxMiAyLjM4MDE2NTI4LC0wLjMzMDU3ODUxMiAxLjA1Nzg1MTI0LDAuOTkxNzM1NTM2IEMtMC4yNjQ0NjI3ODksMi4zMTQwNDk1OCAtMC4yNjQ0NjI4MDQsNC40OTU4Njc3NyAxLjA1Nzg1MTI0LDUuODE4MTgxODIgQzEuNTg2Nzc2ODYsNi4yODA5OTE3NCAyLjE4MTgxODE4LDYuNjExNTcwMjUgMi45MDkwOTA5MSw2Ljc0MzgwMTY1IEwyLjkwOTA5MDkxLDYuNzQzODAxNjUgWiBNNi4yODA5OTE3MywxMi4yOTc1MjA3IEM1Ljg4NDI5NzUxLDEyLjIzMTQwNSA1LjU1MzcxOSwxMi40OTU4Njc4IDUuNDg3NjAzMywxMi44MjY0NDYzIEM1LjQyMTQ4NzU5LDEzLjIyMzE0MDUgNS4yMjMxNDA0OCwxMy42MTk4MzQ3IDQuODkyNTYxOTksMTMuOTUwNDEzMiBDNC4wOTkxNzM1NiwxNC43NDM4MDE2IDIuNzc2ODU5NTEsMTQuNzQzODAxNiAxLjk4MzQ3MTA4LDEzLjk1MDQxMzIgQzEuMTkwMDgyNjQsMTMuMTU3MDI0OCAxLjE5MDA4MjY0LDExLjgzNDcxMDcgMS45ODM0NzEwOCwxMS4wNDEzMjIzIEMyLjMxNDA0OTU4LDEwLjcxMDc0MzggMi42NDQ2MjgxMSwxMC41MTIzOTY3IDMuMTA3NDM4MDIsMTAuNDQ2MjgxIEMzLjQzODAxNjUyLDEwLjM4MDE2NTMgMy43MDI0NzkzNCwxMC4wNDk1ODY4IDMuNjM2MzYzNjMsOS42NTI4OTI1NiBDMy41NzAyNDc5Miw5LjMyMjMxNDA2IDMuMjM5NjY5NDIsOS4wNTc4NTEyNCAyLjg0Mjk3NTIsOS4xMjM5NjY5MyBDMi4xMTU3MDI0OCw5LjI1NjE5ODMzIDEuNTIwNjYxMTUsOS41ODY3NzY4NiAwLjk5MTczNTUzNiwxMC4wNDk1ODY4IEMtMC4zMzA1Nzg1MTIsMTEuMzcxOTAwOCAtMC4zMzA1Nzg1MTIsMTMuNTUzNzE5IDAuOTkxNzM1NTM2LDE0Ljg3NjAzMzEgQzEuNjUyODkyNTcsMTUuNTM3MTkwMSAyLjUxMjM5NjY5LDE1Ljg2Nzc2ODYgMy4zNzE5MDA4MiwxNS44Njc3Njg2IEM0LjIzMTQwNDk2LDE1Ljg2Nzc2ODYgNS4wOTA5MDkwOCwxNS41MzcxOTAxIDUuNzUyMDY2MTEsMTQuODc2MDMzMSBDNi4yODA5OTE3MywxNC4zNDcxMDc0IDYuNjExNTcwMjUsMTMuNzUyMDY2MSA2LjY3NzY4NTk0LDEzLjAyNDc5MzQgQzYuODc2MDMzMDUsMTIuNjk0MjE0OSA2LjYxMTU3MDI0LDEyLjM2MzYzNjQgNi4yODA5OTE3MywxMi4yOTc1MjA3IEw2LjI4MDk5MTczLDEyLjI5NzUyMDcgWiBNMTMuMDkwOTA5MSw5LjEyMzk2NjkzIEMxMi42OTQyMTQ5LDkuMDU3ODUxMjIgMTIuMzYzNjM2NCw5LjMyMjMxNDA0IDEyLjI5NzUyMDcsOS42NTI4OTI1NiBDMTIuMjMxNDA1LDkuOTgzNDcxMDcgMTIuNDk1ODY3OCwxMC4zODAxNjUzIDEyLjgyNjQ0NjMsMTAuNDQ2MjgxIEMxMy4yMjMxNDA1LDEwLjUxMjM5NjcgMTMuNjE5ODM0NywxMC43MTA3NDM4IDEzLjk1MDQxMzIsMTEuMDQxMzIyMyBDMTQuNzQzODAxNiwxMS44MzQ3MTA3IDE0Ljc0MzgwMTYsMTMuMTU3MDI0OCAxMy45NTA0MTMyLDEzLjk1MDQxMzIgQzEzLjE1NzAyNDgsMTQuNzQzODAxNiAxMS44MzQ3MTA3LDE0Ljc0MzgwMTYgMTEuMDQxMzIyMywxMy45NTA0MTMyIEMxMC43MTA3NDM4LDEzLjYxOTgzNDcgMTAuNTEyMzk2NywxMy4yODkyNTYyIDEwLjQ0NjI4MSwxMi44MjY0NDYzIEMxMC4zODAxNjUzLDEyLjQ5NTg2NzggMTAuMDQ5NTg2OCwxMi4yMzE0MDUgOS42NTI4OTI1NiwxMi4yOTc1MjA3IEM5LjMyMjMxNDA2LDEyLjM2MzYzNjQgOS4wNTc4NTEyNCwxMi42OTQyMTQ5IDkuMTIzOTY2OTMsMTMuMDkwOTA5MSBDOS4yNTYxOTgzMywxMy44MTgxODE4IDkuNTg2Nzc2ODYsMTQuNDEzMjIzMSAxMC4wNDk1ODY4LDE0Ljk0MjE0ODggQzEwLjcxMDc0MzgsMTUuNjAzMzA1OCAxMS41NzAyNDc5LDE1LjkzMzg4NDMgMTIuNDI5NzUyMSwxNS45MzM4ODQzIEMxMy4yODkyNTYyLDE1LjkzMzg4NDMgMTQuMTQ4NzYwMywxNS42MDMzMDU4IDE0LjgwOTkxNzQsMTQuOTQyMTQ4OCBDMTYuMTMyMjMxNCwxMy42MTk4MzQ3IDE2LjEzMjIzMTQsMTEuNDM4MDE2NSAxNC44MDk5MTc0LDEwLjExNTcwMjUgQzE0LjQxMzIyMzEsOS41ODY3NzY4NiAxMy44MTgxODE4LDkuMjU2MTk4MzMgMTMuMDkwOTA5MSw5LjEyMzk2NjkzIEwxMy4wOTA5MDkxLDkuMTIzOTY2OTMgWiBNOS43MTkwMDgyNiwzLjU3MDI0NzkyIEMxMC4xMTU3MDI1LDMuNjM2MzYzNjMgMTAuNDQ2MjgxLDMuMzcxOTAwODIgMTAuNTEyMzk2NywzLjA0MTMyMjMxIEMxMC41Nzg1MTI0LDIuNjQ0NjI4MDkgMTAuNzc2ODU5NSwyLjI0NzkzMzg4IDExLjEwNzQzOCwxLjkxNzM1NTM3IEMxMS45MDA4MjY0LDEuMTIzOTY2OTQgMTMuMjg5MjU2MiwxLjEyMzk2Njk0IDE0LjAxNjUyODksMS45MTczNTUzNyBDMTQuODA5OTE3NCwyLjcxMDc0MzggMTQuODA5OTE3NCw0LjAzMzA1Nzg1IDE0LjAxNjUyODksNC44MjY0NDYyOCBDMTMuNjg1OTUwNCw1LjE1NzAyNDc5IDEzLjM1NTM3MTksNS4zNTUzNzE5IDEyLjg5MjU2Miw1LjQyMTQ4NzYgQzEyLjU2MTk4MzUsNS40ODc2MDMzMSAxMi4yOTc1MjA3LDUuODE4MTgxODIgMTIuMzYzNjM2NCw2LjIxNDg3NjA0IEMxMi40Mjk3NTIxLDYuNTQ1NDU0NTQgMTIuNjk0MjE0OSw2Ljc0MzgwMTY1IDEzLjAyNDc5MzQsNi43NDM4MDE2NSBMMTMuMTU3MDI0OCw2Ljc0MzgwMTY1IEMxMy44ODQyOTc1LDYuNjExNTcwMjUgMTQuNDc5MzM4OCw2LjI4MDk5MTczIDE1LjAwODI2NDUsNS44MTgxODE4MiBDMTYuMzMwNTc4NSw0LjQ5NTg2Nzc3IDE2LjMzMDU3ODUsMi4zMTQwNDk1OCAxNS4wMDgyNjQ1LDAuOTkxNzM1NTM2IEMxMy42ODU5NTA0LC0wLjMzMDU3ODUxMiAxMS41MDQxMzIyLC0wLjMzMDU3ODUxMiAxMC4xODE4MTgyLDAuOTkxNzM1NTM2IEM5LjY1Mjg5MjU2LDEuNTIwNjYxMTUgOS4zMjIzMTQwNCwyLjExNTcwMjQ4IDkuMjU2MTk4MzUsMi44NDI5NzUyIEM5LjEyMzk2Njk1LDMuMTczNTUzNzEgOS4zODg0Mjk3NSwzLjUwNDEzMjIzIDkuNzE5MDA4MjYsMy41NzAyNDc5MiBMOS43MTkwMDgyNiwzLjU3MDI0NzkyIFoiIGlkPSLlvaLnirYiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+";

/**
 * How long to wait in ms before timing out requests to translate server.
 * @type {int}
 */
const serverTimeoutMs = 10000; // 10 seconds (chosen arbitrarily).

const REMOTE_URL = {
    CITY_LIST: "/api/weather/city",
    WEATHER_DAY: "/api/weather/day",
    WEATHER_NOW: "/api/weather/now",
    WEATHER_AIR: "/api/weather/air",
    WORLD_TIME: "/api/weather/time",
    INDICES: "/api/weather/indices"
};

const AIR_INDEX = ["AQI", "PM2.5", "PM10", "CO", "SO2", "NO2"];

class IntelligentRecognition {
    constructor(runtime) {
        this.runtime = runtime;
        this.session = null;
        this.runtime.registerPeripheralExtension(
            "diIntelligentRecognition",
            this
        );
        // session callbacks
        this.reporter = null;
        // string op
        this.decoder = new TextDecoder();
        this.lineBuffer = "";
    }

    /**
     * The key to load & store a target's pen-related state.
     * @type {string}
     */
    static get STATE_KEY() {
        return "Di.IntelligentRecognition";
    }
    /**
     * The default state, to be used when a target has no existing state.
     * @type {HelloWorldState}
     */
    static get DEFAULT_STATE() {
        return {
            cityList: [],
            city: {}
        };
    }

    get REMOTE_URL() {
        return REMOTE_URL;
    }

    get AIR_INDEX() {
        return AIR_INDEX;
    }

    /**
     * @param {Target} target - collect  state for this target.
     * @returns {HelloWorldState} the mutable state associated with that target. This will be created if necessary.
     * @private
     */
    _getState(target) {
        let state = target.getCustomState(IntelligentRecognition.STATE_KEY);
        if (!state) {
            state = Clone.simple(IntelligentRecognition.DEFAULT_STATE);
            target.setCustomState(IntelligentRecognition.STATE_KEY, state);
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

    getInfo() {
        return {
            id: "diIntelligentRecognition",
            name: "智能数据",
            color1: "#2DDCFF",
            color2: "#2DDCFF",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    opcode: "chooseCity",
                    blockType: BlockType.REPORTER,
                    checkboxInFlyout: false,
                    text: formatMessage({
                        id: "diIntelligentRecognition.chooseCity",
                        default: "选择城市",
                        description: "chooseCity",
                    }),
                },
                {
                    opcode: "getHighTemperatureM",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.heightemperaturem",
                        default: "[CITY]的最高气温（°C）",
                        description: "temperature",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                    },
                },
                {
                    opcode: "getLowTemperatureM",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.lowtemperaturem",
                        default: "[CITY]的最低气温（°C）",
                        description: "temperature",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                    },
                },
                {
                    opcode: "getHighTemperatureI",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.heightemperaturei",
                        default: "[CITY]的最高气温（°F）",
                        description: "temperature",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                    },
                },
                {
                    opcode: "getLowTemperatureI",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.lowtemperaturei",
                        default: "[CITY]的最低气温（°F）",
                        description: "temperature",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                    },
                },
                {
                    opcode: "getHumidity",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.getHumidity",
                        default: "[CITY]的湿度（%）",
                        description: "getHumidity",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                    },
                },
                {
                    opcode: "getWeather",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.getWeather",
                        default: "[CITY]的天气",
                        description: "getWeather",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                    },
                },
                {
                    opcode: "getAirQuality",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.getAirQuality",
                        default: "[CITY]空气质量的[INDEX]指标",
                        description: "getAirQuality",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                        INDEX: {
                            type: ArgumentType.STRING,
                            defaultValue: "AQI",
                            menu: "AIR_INDEX",
                        },
                    },
                },
                {
                    opcode: "getSunRiseTime",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.getSunRiseTime",
                        default: "[CITY]的日出时间[UNIT]",
                        description: "getSunRiseTime",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                        UNIT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            menu: "TIME_UNIT",
                        },
                    },
                },
                {
                    opcode: "getSunSetTime",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.getSunSetTime",
                        default: "[CITY]的日落时间[UNIT]",
                        description: "getSunSetTime",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                        UNIT: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0,
                            menu: "TIME_UNIT",
                        },
                    },
                },
                {
                    opcode: "getWorldTime",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.getWorldTime",
                        default: "[CITY]的当前时间",
                        description: "getWorldTime",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                    },
                },
                {
                    opcode: "getUVI",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "diIntelligentRecognition.getUVI",
                        default: "[CITY]的紫外线指数",
                        description: "getUVI",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                    },
                },
            ],
            menus: {
                AIR_INDEX: this.AIR_INDEX,
                TIME_UNIT: [
                    {
                        text: "小时",
                        value: 0
                    },
                    {
                        text: "分钟",
                        value: 1
                    }
                ]
            },
        };
    }

    chooseCity(args, util) {
        if (!this.runtime.isLogin()) return;
        const uuid = uuidv4();
        const state = this._getState(util.target);
        this.runtime.emit("start_choose_city", uuid);
        return new Promise((resolve) => {
            this.runtime.on(uuid, (city) => {
                console.log(city)
                state.city = city;
                resolve(city);
            });
        });
    }

    getWeatherAll(city, unit = "m") {
        return new Promise((resolve, reject) => {
            const location = city.value;
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL.WEATHER_DAY,
                {
                    method: "POST",
                    body: JSON.stringify({
                        location,
                        unit,
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
                    resolve(data.data);
                })
                .catch((err) => {
                    console.log("RequestError", err);
                    reject(err);
                });
        });
    }

    getHighTemperatureM(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            if (typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！");
            }
            this.getWeatherAll(location, "m")
                .then((data) => {
                    resolve(
                        Array.isArray(data) ? data[0].tempMax : data.tempMax
                    );
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getLowTemperatureM(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            if (typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！");
            }
            this.getWeatherAll(location, "m")
                .then((data) => {
                    resolve(
                        Array.isArray(data) ? data[0].tempMax : data.tempMin
                    );
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getHighTemperatureI(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            if (typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！");
            }
            this.getWeatherAll(location, "i")
                .then((data) => {
                    resolve(
                        Array.isArray(data) ? data[0].tempMax : data.tempMax
                    );
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getLowTemperatureI(args, util) {
        if (!this.runtime.isLogin()) return;
        const state = this._getState(util.target);
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            if (typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！");
            }
            this.getWeatherAll(location, "i")
                .then((data) => {
                    resolve(
                        Array.isArray(data) ? data[0].tempMax : data.tempMin
                    );
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getHumidity(args, util) {
        if (!this.runtime.isLogin()) return;
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            if (typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！");
            }
            this.getWeatherAll(location)
                .then((data) => {
                    resolve(data.humidity);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getWeather(args) {
        if (!this.runtime.isLogin()) return;
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            if (typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！");
            }
            this.getWeatherAll(location)
                .then((data) => {
                    resolve(data.textDay);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getAirQuality(args) {
        if (!this.runtime.isLogin()) return;
        const location = args.CITY;
        const index = args.INDEX;
        return new Promise((resolve, reject) => {
            if(typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！")
            }
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL.WEATHER_AIR,
                {
                    method: "POST",
                    body: JSON.stringify({
                        location: location.value,
                        unit: "m",
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
                    let key = "";
                    switch (index) {
                        case "AQI":
                            key = "aqi";
                            break;
                        case "PM2.5":
                            key = "pm2p5";
                            break;
                        case "PM10":
                            key = "pm10";
                            break;
                        case "CO":
                            key = "co";
                            break;
                        case "SO2":
                            key = "so2";
                            break;
                        case "NO2":
                            key = "no2";
                            break;
                        default:
                            key = "aqi";
                            break;
                    }
                    resolve(data.data[key]);
                })
                .catch((err) => {
                    console.log("RequestError", err);
                    reject(err);
                });
        });
    }

    getSunRiseTime(args) {
        if (!this.runtime.isLogin()) return;
        const location = args.CITY;
        const unitIndex = args.UNIT;
        return new Promise((resolve, reject) => {
            if (typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！");
            }
            this.getWeatherAll(location)
                .then((data) => {
                    const sunriseTime = data.sunrise.split(":")
                    resolve(sunriseTime[unitIndex]);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getSunSetTime(args) {
        if (!this.runtime.isLogin()) return;
        const location = args.CITY;
        const unitIndex = args.UNIT;
        return new Promise((resolve, reject) => {
            if (typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！");
            }
            this.getWeatherAll(location)
                .then((data) => {
                    const sunsetTime = data.sunset.split(":")
                    resolve(sunsetTime[unitIndex]);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getWorldTime(args) {
        if (!this.runtime.isLogin()) return;
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            if (typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！");
            }
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL.WORLD_TIME,
                {
                    method: "POST",
                    body: JSON.stringify({
                        timeZone: location.tz
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
                    resolve(data.data);
                })
                .catch((err) => {
                    console.log("RequestError", err);
                    reject(err);
                });
        })
    }

    getUVI(args) {
        if (!this.runtime.isLogin()) return;
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            if (typeof location !== 'object') {
                this.runtime.emit("MESSAGE_INFO", "请选择城市！");
                reject("请选择城市！");
            }
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL.INDICES,
                {
                    method: "POST",
                    body: JSON.stringify({
                        type: 5,
                        location: location.value
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
                    resolve(data.data.category);
                })
                .catch((err) => {
                    console.log("RequestError", err);
                    reject(err);
                });
        })
    }
}

module.exports = IntelligentRecognition;
