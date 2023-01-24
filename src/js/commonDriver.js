"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driverBase_1 = require("./driverBase");
class CommonDriver extends driverBase_1.default {
    /**
     * @constructor for the MyDriver class
     */
    constructor(config = driverBase_1.default.defaultConfig) {
        super(config);
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
        await this._getByHref(CommonDriver.defaultConfig.urls[url]);
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
     * Accept cookies for the current web site
     *
     *@param identifiers A object with two lists for detecting the accept button: a locator By list and a string list.
     */
    async acceptCookies(identifiers) {
        await this._acceptCookies(identifiers);
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
exports.default = CommonDriver;
//# sourceMappingURL=commonDriver.js.map