// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");
const { v4: uuidv4 } = require("uuid");

const menuIconURI = "data:image/png;base64,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";
const blockIconURI = "data:image/png;base64,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";

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
    WORLD_TIME: "/api/weather/time"
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
        this.cityList = [];
        this._getCityList("青岛").then((list) => (this.cityList = list));
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

    _getCityList(location) {
        return new Promise((resolve, reject) => {
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL.CITY_LIST,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Token": this.runtime.getToken(),
                    },
                    body: JSON.stringify({
                        location,
                    }),
                },
                serverTimeoutMs
            )
                .then((response) => response.json())
                .then((data) => {
                    const list =
                        Array.isArray(data.data) &&
                        data.data.map((elem) => ({
                            text: elem.name,
                            value: elem.id,
                        }));
                    resolve(data.data);
                })
                .catch((err) => {
                    console.log("RequestError", state.remote_url, err);
                    reject(err);
                });
        });
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
            color2: "#5DE1FC",
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
                {
                    id: "123",
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
}

module.exports = IntelligentRecognition;
