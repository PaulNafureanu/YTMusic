"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driverBase_1 = require("./driverBase");
/**
 * @class Creates a new WebDriver client based with browser and builder configuration.
 */
class MyDriver extends driverBase_1.default {
    /**
     * Predefined url targets
     */
    urls = {
        SOURCE_URL: "https://freemusicarchive.org",
        GENRES_URL: "https://freemusicarchive.org/genres",
        WEEK_RANK_URL: "https://freemusicarchive.org/music/charts/this-week",
        MONTH_RANK_URL: "https://freemusicarchive.org/music/charts/this-month",
        ALL_TIME_RANK_URL: "https://freemusicarchive.org/music/charts/all",
        TARGET_URL: "https://www.youtube.com/",
        CHANNEL_URL: "https://www.youtube.com/channel/UCopd8ft4OZRkVa2nG7ZA4HQ",
    };
    /**
     * @constructor for the MyDriver class
     */
    constructor() {
        super();
    }
    /**
     * The first step to use a webdriver: Initialize the webdriver.
     */
    async init() {
        await this._init();
    }
    /**
     * Schedules a command to navigate to the given URL.
     *
     * @param url The website key url from the Driver Urls Interface.
     */
    async get(url) {
        await this._getByHref(url);
    }
    /**
     * Schedules a command to navigate to the given URL.
     *
     * @param url A generic website url.
     */
    async getByHref(url) {
        await this._getByHref(url);
    }
    /**
     * Get's the title of a web page.
     *
     * @return {Promise<string>} A strings that represents the title of the current web page.
     */
    async getTitle() {
        return await this._getTitle();
    }
    /**
     * Makes any execution to be delayed.
     *
     * @param ms The number of milliseconds for delay.
     */
    async wait(ms) {
        await this._wait(ms);
    }
    /**
     * Quit and close the web driver after couple of milliseconds.
     *
     * @param ms The number of milliseconds before quitting and closing the web driver.
     */
    async quit(ms) {
        await this._quit(ms);
    }
}
exports.default = MyDriver;
//# sourceMappingURL=driver.js.map