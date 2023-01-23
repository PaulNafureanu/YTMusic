"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = require("selenium-webdriver/chrome");
const firefox_1 = require("selenium-webdriver/firefox");
class MyDriverBase {
    static defaultConfig = {
        maxRetries: 2,
        downloadDir: "",
        browser: "chrome",
        setTimeouts: { implicit: 10000 },
    };
    urls = {
        SOURCE_URL: "https://www.google.com/",
    };
    static cookieIdentifiers = {
        locators: [selenium_webdriver_1.By.css("button"), selenium_webdriver_1.By.css("div"), selenium_webdriver_1.By.css("a")],
        texts: [
            "Allow all",
            "Accept all",
            "Accept cookies",
            "Accept all cookies",
            "Allow essential and optional cookies",
            "Accept all & visit the site",
            "Only allow essential cookies",
            "I Accept",
            "Accept",
            "Allow",
            "Acceptare",
            "Acceptă tot",
            "Acceptați tot",
            "Acceptati tot",
            "Accepta tot",
            "Acceptă",
            "Accepta",
            "Accept",
            "Permite",
            "Permite tot",
        ],
    };
    static webDriverCount = 0;
    config;
    webDriver;
    webDriverId = 0;
    operationId = 0;
    operationCount = 0;
    constructor(config = MyDriverBase.defaultConfig) {
        this._checkApp();
        this.config = config;
        MyDriverBase.webDriverCount++;
    }
    _checkApp() {
        // Check if a directory exists, otherwise create the folder in the app
        function existsIfNotCreate(path) {
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
        }
        //Check if some folders are on this app exists
        const downloadDir = path.join(__dirname, "../../downloads");
        const metaDir = path.join(downloadDir, "/meta");
        const musicDir = path.join(downloadDir, "/music");
        const imgsDir = path.join(downloadDir, "/imgs");
        const videosDir = path.join(downloadDir, "/videos");
        existsIfNotCreate(downloadDir);
        existsIfNotCreate(metaDir);
        existsIfNotCreate(musicDir);
        existsIfNotCreate(imgsDir);
        existsIfNotCreate(videosDir);
        const userdataDir = path.join(__dirname, "../../userdata");
        const defaultDir = path.join(userdataDir, "/default");
        if (!fs.existsSync(userdataDir) || !fs.existsSync(defaultDir)) {
            //The userdata directory is identical with "C:\Users\PCName\AppData\Local\Google\Chrome\User Data"
            throw new Error("Userdata directory is not present on this application. Please provide a profile for the browser. Check appdata browser directory.");
        }
    }
    async _init() {
        // Init the browser
        let operationId = ++this.operationId;
        this.webDriverId = MyDriverBase.webDriverCount;
        let logMessage = {
            message: `Initialized for ${this.config.browser} browser.`,
            operationId: operationId,
            webDriverId: this.webDriverId,
        };
        let errorMessage = { functName: "init", retryCount: 0 };
        await this._errorWrapper(this.__init, logMessage, errorMessage)();
        //Set some configs on the browser
        operationId = ++operationId;
        logMessage.message = `Setted implicit timeout to ${this.config.setTimeouts.implicit}`;
        logMessage.operationId = operationId;
        errorMessage.functName = "_config";
        await this._errorWrapper(this.__config, logMessage, errorMessage)();
    }
    async _getByHref(url) {
        //Navigate to a given url
        const operationId = ++this.operationId;
        let logMessage = {
            message: `Navigated to url ${url}.`,
            operationId: operationId,
            webDriverId: this.webDriverId,
        };
        let errorMessage = { functName: "get", retryCount: 0 };
        await this._errorWrapper(this.__get, logMessage, errorMessage)({ url: url });
    }
    async _getTitle() {
        //Navigate to a given url
        const operationId = ++this.operationId;
        let logMessage = {
            message: `Got title.`,
            operationId: operationId,
            webDriverId: this.webDriverId,
        };
        let errorMessage = { functName: "getTitle", retryCount: 0 };
        return await this._errorWrapper(this.__getTitle, logMessage, errorMessage)();
    }
    async _wait(ms) {
        //Navigate to a given url
        const operationId = ++this.operationId;
        let logMessage = {
            message: `Waited ${ms / 1000.0} seconds.`,
            operationId: operationId,
            webDriverId: this.webDriverId,
        };
        let errorMessage = { functName: "wait", retryCount: 0 };
        await this._errorWrapper(this.__wait, logMessage, errorMessage)({ ms: ms });
    }
    async _quit(ms) {
        //Navigate to a given url
        const operationId = ++this.operationId;
        let logMessage = {
            message: `Quit after ${ms / 1000.0} seconds.`,
            operationId: operationId,
            webDriverId: this.webDriverId,
        };
        let errorMessage = { functName: "quit", retryCount: 0 };
        await this._errorWrapper(this.__quit, logMessage, errorMessage)({ ms: ms });
    }
    async __init() {
        const config = this.config;
        const downloadDir = path.join(__dirname, `../../downloads${config.downloadDir}`);
        const userdataDir = path.join(__dirname, "../../userdata");
        const userPreferences = { "download.default_directory": downloadDir };
        let builder = new selenium_webdriver_1.Builder().forBrowser(config.browser);
        let options;
        if (this.config.browser === "chrome") {
            options = new chrome_1.Options()
                .setUserPreferences(userPreferences)
                .addArguments(`user-data-dir=${userdataDir}`)
                .addArguments("profile-directory=Default");
            builder = builder.setChromeOptions(options);
        }
        else {
            // firefox options should be tested
            options = new firefox_1.Options()
                .setPreference("download.default_directory", downloadDir)
                .addArguments(`user-data-dir=${userdataDir}`)
                .addArguments("profile-directory=Default");
            builder = builder.setFirefoxOptions(options);
        }
        this.webDriver = await builder.build();
    }
    async __config() {
        await this.webDriver
            .manage()
            .setTimeouts({ implicit: this.config.setTimeouts.implicit });
    }
    async __get(params) {
        await this.webDriver.get(params.url);
    }
    async __getTitle() {
        return await this.webDriver.getTitle();
    }
    async __wait(params) {
        const timeoutId = await new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                resolve(timeoutId);
            }, params.ms);
        });
        clearTimeout(timeoutId);
    }
    async __quit(params) {
        const timeoutId = await new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                this.webDriver.quit();
                resolve(timeoutId);
            }, params.ms);
        });
        clearTimeout(timeoutId);
    }
    _errorWrapper(funct, logMessage, errorMessage) {
        // Error Wrapper and handler function
        async function inner(params) {
            let isError = true;
            let retryCount = 0;
            while (isError && retryCount <= this.config.maxRetries) {
                try {
                    const result = await funct.bind(this)(params);
                    this._log(logMessage);
                    isError = false;
                    return result;
                }
                catch (error) {
                    errorMessage.retryCount = retryCount;
                    this._log(logMessage, errorMessage);
                    retryCount++;
                }
            }
        }
        return inner.bind(this);
    }
    _log(logMessage, error) {
        // Log information on the console
        const { message, operationId, webDriverId } = logMessage;
        const fGreen = "\x1b[32m%s%s\x1b[0m";
        const fRed = "\x1b[31m%s%s\x1b[0m";
        let ms;
        if (error) {
            //Err Drv. 1 with Op. 3: Navigate to the url (retry 0 for get())
            const { functName, retryCount } = error;
            ms = ` Err Drv. ${webDriverId} with Op. ${operationId}: ${message} (retry ${retryCount} for ${functName}())`;
            console.error(fRed, ++this.operationCount, ms);
        }
        else {
            //Run Drv. 1 with Op. 3: Navigate to the url
            ms = ` Run Drv. ${webDriverId} with Op. ${operationId}: ${message}`;
            console.log(fGreen, ++this.operationCount, ms);
        }
    }
}
exports.default = MyDriverBase;
//# sourceMappingURL=driverBase.js.map