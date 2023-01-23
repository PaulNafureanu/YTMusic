import path = require("path");
import fs = require("fs");
import { Builder, By, WebDriver } from "selenium-webdriver";
import { Options as ChromeOptions } from "selenium-webdriver/chrome";
import { Options as FirefoxOptions } from "selenium-webdriver/firefox";

export interface DriverConfig {
  maxRetries: number;
  downloadDir: string;
  browser: "chrome" | "firefox";
  setTimeouts: { implicit: number };
}

export interface Identifier {
  locators: By[];
  texts: string[];
}

export interface CallbackInfo {
  funct: (params: object) => Promise<any>;
  params: object;
  retryCount: number;
}

export interface ErrorMessage {
  functName: string;
  retryCount: number;
}

export interface LogMessage {
  message: any;
  operationId: number;
  webDriverId: number;
}

interface DriverUrls {
  SOURCE_URL: string;
}

export default class MyDriverBase<T extends DriverUrls> {
  static readonly defaultConfig: DriverConfig = {
    maxRetries: 2,
    downloadDir: "",
    browser: "chrome",
    setTimeouts: { implicit: 10_000 },
  };

  protected urls: T = {
    SOURCE_URL: "https://www.google.com/",
  } as T;

  static readonly cookieIdentifiers: Identifier = {
    locators: [By.css("button"), By.css("div"), By.css("a")],
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

  private static webDriverCount: number = 0;
  protected config: DriverConfig;
  protected webDriver: WebDriver;
  protected webDriverId: number = 0;
  protected operationId: number = 0;
  protected operationCount: number = 0;

  constructor(config: DriverConfig = MyDriverBase.defaultConfig) {
    this._checkApp();
    this.config = config;
    MyDriverBase.webDriverCount++;
  }
  private _checkApp() {
    // Check if a directory exists, otherwise create the folder in the app
    function existsIfNotCreate(path: fs.PathLike) {
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
      throw new Error(
        "Userdata directory is not present on this application. Please provide a profile for the browser. Check appdata browser directory."
      );
    }
  }
  protected async _init() {
    // Init the browser
    let operationId = ++this.operationId;
    this.webDriverId = MyDriverBase.webDriverCount;
    let logMessage: LogMessage = {
      message: `Initialized for ${this.config.browser} browser.`,
      operationId: operationId,
      webDriverId: this.webDriverId,
    };
    let errorMessage: ErrorMessage = { functName: "init", retryCount: 0 };
    await this._errorWrapper(this.__init, logMessage, errorMessage)();

    //Set some configs on the browser
    operationId = ++operationId;
    logMessage.message = `Setted implicit timeout to ${this.config.setTimeouts.implicit}`;
    logMessage.operationId = operationId;
    errorMessage.functName = "_config";
    await this._errorWrapper(this.__config, logMessage, errorMessage)();
  }
  protected async _getByHref(url: string) {
    //Navigate to a given url
    const operationId = ++this.operationId;
    let logMessage: LogMessage = {
      message: `Navigated to url ${url}.`,
      operationId: operationId,
      webDriverId: this.webDriverId,
    };
    let errorMessage: ErrorMessage = { functName: "get", retryCount: 0 };
    await this._errorWrapper(
      this.__get,
      logMessage,
      errorMessage
    )({ url: url });
  }
  protected async _getTitle() {
    //Navigate to a given url
    const operationId = ++this.operationId;
    let logMessage: LogMessage = {
      message: `Got title.`,
      operationId: operationId,
      webDriverId: this.webDriverId,
    };
    let errorMessage: ErrorMessage = { functName: "getTitle", retryCount: 0 };
    return await this._errorWrapper(
      this.__getTitle,
      logMessage,
      errorMessage
    )();
  }
  protected async _wait(ms: number) {
    //Navigate to a given url
    const operationId = ++this.operationId;
    let logMessage: LogMessage = {
      message: `Waited ${ms / 1000.0} seconds.`,
      operationId: operationId,
      webDriverId: this.webDriverId,
    };
    let errorMessage: ErrorMessage = { functName: "wait", retryCount: 0 };
    await this._errorWrapper(this.__wait, logMessage, errorMessage)({ ms: ms });
  }
  protected async _quit(ms: number) {
    //Navigate to a given url
    const operationId = ++this.operationId;
    let logMessage: LogMessage = {
      message: `Quit after ${ms / 1000.0} seconds.`,
      operationId: operationId,
      webDriverId: this.webDriverId,
    };
    let errorMessage: ErrorMessage = { functName: "quit", retryCount: 0 };
    await this._errorWrapper(this.__quit, logMessage, errorMessage)({ ms: ms });
  }

  private async __init(this: MyDriverBase<T>) {
    const config = this.config;
    const downloadDir = path.join(
      __dirname,
      `../../downloads${config.downloadDir}`
    );
    const userdataDir = path.join(__dirname, "../../userdata");
    const userPreferences = { "download.default_directory": downloadDir };
    let builder = new Builder().forBrowser(config.browser);
    let options: ChromeOptions | FirefoxOptions;
    if (this.config.browser === "chrome") {
      options = new ChromeOptions()
        .setUserPreferences(userPreferences)
        .addArguments(`user-data-dir=${userdataDir}`)
        .addArguments("profile-directory=Default");
      builder = builder.setChromeOptions(options);
    } else {
      // firefox options should be tested
      options = new FirefoxOptions()
        .setPreference("download.default_directory", downloadDir)
        .addArguments(`user-data-dir=${userdataDir}`)
        .addArguments("profile-directory=Default");
      builder = builder.setFirefoxOptions(options);
    }
    this.webDriver = await builder.build();
  }
  private async __config(this: MyDriverBase<T>) {
    await this.webDriver
      .manage()
      .setTimeouts({ implicit: this.config.setTimeouts.implicit });
  }
  private async __get(this: MyDriverBase<T>, params: { url: string }) {
    await this.webDriver.get(params.url);
  }
  private async __getTitle(this: MyDriverBase<T>) {
    return await this.webDriver.getTitle();
  }
  private async __wait(this: MyDriverBase<T>, params: { ms: number }) {
    const timeoutId: NodeJS.Timeout | number | string = await new Promise(
      (resolve) => {
        const timeoutId = setTimeout(() => {
          resolve(timeoutId);
        }, params.ms);
      }
    );
    clearTimeout(timeoutId);
  }
  private async __quit(this: MyDriverBase<T>, params: { ms: number }) {
    const timeoutId: NodeJS.Timeout | number | string = await new Promise(
      (resolve) => {
        const timeoutId = setTimeout(() => {
          this.webDriver.quit();
          resolve(timeoutId);
        }, params.ms);
      }
    );
    clearTimeout(timeoutId);
  }
  protected _errorWrapper<P>(
    funct: (params: object) => Promise<P>,
    logMessage: LogMessage,
    errorMessage: ErrorMessage
  ): (params?: object) => Promise<P> {
    // Error Wrapper and handler function
    async function inner(this: MyDriverBase<T>, params?: object) {
      let isError = true;
      let retryCount = 0;
      while (isError && retryCount <= this.config.maxRetries) {
        try {
          const result = await funct.bind(this)(params);
          this._log(logMessage);
          isError = false;
          return result;
        } catch (error) {
          errorMessage.retryCount = retryCount;
          this._log(logMessage, errorMessage);
          retryCount++;
        }
      }
    }
    return inner.bind(this);
  }
  protected _log(logMessage: LogMessage, error?: ErrorMessage) {
    // Log information on the console
    const { message, operationId, webDriverId } = logMessage;
    const fGreen = "\x1b[32m%s%s\x1b[0m";
    const fRed = "\x1b[31m%s%s\x1b[0m";
    let ms: string;

    if (error) {
      //Err Drv. 1 with Op. 3: Navigate to the url (retry 0 for get())
      const { functName, retryCount } = error;
      ms = ` Err Drv. ${webDriverId} with Op. ${operationId}: ${message} (retry ${retryCount} for ${functName}())`;
      console.error(fRed, ++this.operationCount, ms);
    } else {
      //Run Drv. 1 with Op. 3: Navigate to the url
      ms = ` Run Drv. ${webDriverId} with Op. ${operationId}: ${message}`;
      console.log(fGreen, ++this.operationCount, ms);
    }
  }
}
