// create by scratch3-extension generator
const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Clone = require("../../util/clone");
const formatMessage = require("format-message");
const fetchWithTimeout = require("../../util/fetch-with-timeout");
const log = require("../../util/log");
const { v4: uuidv4 } = require("uuid");

const menuIconURI = null;
const blockIconURI = null;

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
        return new Promise((resolve) => {
            if(!location) {
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
