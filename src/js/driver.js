"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const selenium_webdriver_1 = require("selenium-webdriver");
class MyDriver {
    static urls = {
        SOURCE_URL: "https://freemusicarchive.org/genres",
        TARGET_URL: "https://www.youtube.com/",
    };
    static defaultConfig = {
        browser: "chrome",
        setTimeouts: { implicit: 10000 },
    };
    static cookieIdentifiers = {
        locators: [selenium_webdriver_1.By.css("button"), selenium_webdriver_1.By.css("div"), selenium_webdriver_1.By.css["a"]],
        texts: [
            "Allow all",
            "Accept all",
            "Allow essential and optional cookies",
            "Accept all & visit the site",
            "Allow",
            "Accept",
            "Only allow essential cookies",
            "Acceptă tot",
            "Accepta tot",
            "Permite tot",
            "Acceptă",
            "Accepta",
            "Permite",
        ],
    };
    static webDriverCount = 0;
    webDriver;
    webDriverId = 0;
    operationId = 0;
    operationCount = 0;
    data;
    constructor() {
        ++MyDriver.webDriverCount;
    }
    init(config = MyDriver.defaultConfig) {
        // Init driver with config
        const id = ++this.operationId;
        return new Promise((resolve, reject) => {
            this.webDriver = new selenium_webdriver_1.Builder().forBrowser(config.browser).build();
            return resolve(true);
        })
            .then(() => {
            this.webDriverId = MyDriver.webDriverCount;
            const message = `(Operation ${id}) Initialized for browser ${config.browser}.`;
            this.logInfo(message);
        })
            .then(() => {
            this.data = { title: undefined };
            this.webDriver
                .manage()
                .setTimeouts({ implicit: config.setTimeouts.implicit });
            const id = ++this.operationId;
            return id;
        })
            .then((id) => {
            const message = `(Operation ${id}) Setted implicit timeout to ${config.setTimeouts.implicit}.`;
            this.logInfo(message);
            return this;
        });
    }
    get(url) {
        // Same as get. To use only as onfulfilled callback function in a then promise
        return (driver) => driver._get(url);
    }
    _get(url) {
        //Navigate to a specific url
        const id = ++this.operationId;
        return new Promise((resolve, reject) => {
            this.webDriver.get(MyDriver.urls[url]);
            return resolve(true);
        }).then(() => {
            const message = `(Operation ${id}) Navigated to url ${MyDriver.urls[url]}.`;
            this.logInfo(message);
            return this;
        });
    }
    getTitle() {
        // Same as getTitle. To use only as onfulfilled callback function in a then promise
        return (driver) => driver._getTitle();
    }
    _getTitle() {
        // Get the title of a web page
        const id = ++this.operationId;
        return new Promise((resolve, reject) => {
            const value = this.webDriver.getTitle();
            return resolve(value);
        }).then((value) => {
            this.data.title = value;
            const message = `(Operation ${id}) Got title ${value}.`;
            this.logInfo(message);
            return this;
        });
    }
    acceptCookies(identifiers) {
        // Same as accept cookies. To use only as onfulfilled callback function in a then promise
        return (driver) => driver._acceptCookies(identifiers);
    }
    _acceptCookies(identifiers) {
        //Accept cookies for a web pahe
        async function accept(identifierList, myDriver) {
            let shouldBreak = false;
            for (let locator of identifierList.locators) {
                if (shouldBreak)
                    break;
                let elements = await myDriver.webDriver.findElements(locator);
                let len = elements.length;
                for (let index = 0; index < len; index++) {
                    if (shouldBreak)
                        break;
                    let element = elements[index];
                    if (!element)
                        continue;
                    let textElement = await element.getText();
                    if (!textElement)
                        continue;
                    textElement = textElement.toUpperCase();
                    for (let text of identifierList.texts) {
                        if (text.toUpperCase() === textElement) {
                            await element.click();
                            shouldBreak = true;
                            break;
                        }
                    }
                }
            }
            return shouldBreak;
        }
        const id = ++this.operationId;
        let prom;
        if (identifiers) {
            console.log("here1");
            prom = new Promise((resolve, reject) => {
                return resolve(accept(identifiers, this));
            }).then((shouldBreak) => {
                console.log("here2");
                if (!shouldBreak)
                    return accept(MyDriver.cookieIdentifiers, this);
                else
                    this.logInfo(`(Operation ${id}) Accepted cookies.`);
            });
        }
        else {
            prom = new Promise((resolve, reject) => {
                console.log("here3");
                return resolve(accept(MyDriver.cookieIdentifiers, this));
            });
        }
        return prom.then((value) => {
            console.log("here4");
            if (value)
                this.logInfo(`(Operation ${id}) Accepted cookies.`);
            else
                this.logInfo(`(Operation ${id}) Could not accept cookies.`);
            return this;
        });
    }
    wait(ms) {
        // Same as wait. To use only as onfulfilled callback function in a then promise
        return (driver) => driver._wait(ms);
    }
    _wait(ms) {
        // Wait couple of milliseconds
        const id = ++this.operationId;
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                return resolve(timeoutId);
            }, ms);
        }).then((timeoutId) => {
            clearTimeout(timeoutId);
            const message = `(Operation ${id}) Waited ${ms}.`;
            this.logInfo(message);
            return this;
        });
    }
    logInfo(message) {
        // Log information on the console
        console.info(++this.operationCount, `Driver ${this.webDriverId}:`, message);
    }
}
exports.default = MyDriver;
//# sourceMappingURL=driver.js.map