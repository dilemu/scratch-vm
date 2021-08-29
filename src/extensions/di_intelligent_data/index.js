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
};

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
        };
    }

    get REMOTE_URL() {
        return REMOTE_URL;
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
                    text: formatMessage({
                        id: "diIntelligentRecognition.chooseCity",
                        default: "选择城市",
                        description: "chooseCity",
                    })
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
                        description: "temperature",
                    }),
                    arguments: {
                        CITY: {
                            type: ArgumentType.STRING,
                            defaultValue: " ",
                        },
                    },
                },
            ],
        };
    }

    chooseCity(args, util) {
        if(!this.runtime.isLogin()) return
        const uuid = uuidv4();
        const state = this._getState(util.target);
        this.runtime.emit("start_choose_city", uuid);
        return new Promise((resolve) => {
            this.runtime.on(uuid, (city) => {
                state.city = city;
                resolve(city);
            });
        });
    }

    getHighTemperature(location, unit="m") {
        return new Promise((resolve) => {
            fetchWithTimeout(
                this.runtime.REMOTE_HOST + this.REMOTE_URL.WEATHER_DAY,
                {
                    method: "POST",
                    body: JSON.stringify({
                        location,unit
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
        if(!this.runtime.isLogin()) return
        const state = this._getState(util.target);
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            this.getHighTemperature(location, "m").then(data => {
                resolve(Array.isArray(data)?data[0].tempMax:data.tempMax)
            }).catch(err => {
                reject(err)
            })
        }) 
    }

    getLowTemperatureM(args, util) {
        if(!this.runtime.isLogin()) return
        const state = this._getState(util.target);
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            this.getHighTemperature(location, "m").then(data => {
                resolve(Array.isArray(data)?data[0].tempMax:data.tempMin)
            }).catch(err => {
                reject(err)
            })
        }) 
    }

    getHighTemperatureI(args, util) {
        if(!this.runtime.isLogin()) return
        const state = this._getState(util.target);
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            this.getHighTemperature(location, "i").then(data => {
                resolve(Array.isArray(data)?data[0].tempMax:data.tempMax)
            }).catch(err => {
                reject(err)
            })
        }) 
    }

    getLowTemperatureI(args, util) {
        if(!this.runtime.isLogin()) return
        const state = this._getState(util.target);
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            this.getHighTemperature(location, "i").then(data => {
                resolve(Array.isArray(data)?data[0].tempMax:data.tempMin)
            }).catch(err => {
                reject(err)
            })
        }) 
    }

    getHumidity(args, util) {
        if(!this.runtime.isLogin()) return
        const location = args.CITY;
        return new Promise((resolve, reject) => {
            this.getHighTemperature(location).then(data => {
                resolve(data.humidity)
            }).catch(err => {
                reject(err)
            })
        }) 
    }
}

module.exports = IntelligentRecognition;
