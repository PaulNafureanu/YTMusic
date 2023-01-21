// Imports
import { Builder, By, ThenableWebDriver } from "selenium-webdriver";

// Types and interfaces
interface DriverUrls {
  SOURCE_URL: string;
  TARGET_URL: string;
}

export interface DriverConfig {
  browser: "chrome";
  setTimeouts: { implicit: number };
}

export interface DriverData {
  title: string | undefined;
}

interface Identifier {
  locators: By[];
  texts: string[];
}

export default class MyDriver {
  static readonly urls: DriverUrls = {
    SOURCE_URL: "https://freemusicarchive.org/genres",
    TARGET_URL: "https://www.youtube.com/",
  };

  static readonly defaultConfig: DriverConfig = {
    browser: "chrome",
    setTimeouts: { implicit: 10_000 },
  };

  static readonly cookieIdentifiers: Identifier = {
    locators: [By.css("button"), By.css("div"), By.css["a"]],
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

  private static webDriverCount: number = 0;
  private webDriver: ThenableWebDriver;
  private webDriverId: number = 0;
  private operationId: number = 0;
  private operationCount: number = 0;
  private data: DriverData;

  constructor() {
    ++MyDriver.webDriverCount;
  }

  init(config: DriverConfig = MyDriver.defaultConfig) {
    // Init driver with config
    const id = ++this.operationId;
    return new Promise((resolve, reject) => {
      this.webDriver = new Builder().forBrowser(config.browser).build();
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

  get(url: keyof DriverUrls) {
    // Same as get. To use only as onfulfilled callback function in a then promise
    return (driver: MyDriver) => driver._get(url);
  }

  private _get(url: keyof DriverUrls) {
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
    return (driver: MyDriver) => driver._getTitle();
  }

  private _getTitle() {
    // Get the title of a web page
    const id = ++this.operationId;
    return new Promise((resolve, reject) => {
      const value = this.webDriver.getTitle();
      return resolve(value);
    }).then((value: string) => {
      this.data.title = value;
      const message = `(Operation ${id}) Got title ${value}.`;
      this.logInfo(message);
      return this;
    });
  }

  acceptCookies(identifiers?: Identifier) {
    // Same as accept cookies. To use only as onfulfilled callback function in a then promise
    return (driver: MyDriver) => driver._acceptCookies(identifiers);
  }

  private _acceptCookies(identifiers?: Identifier) {
    //Accept cookies for a web pahe
    async function accept(identifierList: Identifier, myDriver: MyDriver) {
      let shouldBreak = false;
      for (let locator of identifierList.locators) {
        if (shouldBreak) break;
        let elements = await myDriver.webDriver.findElements(locator);
        let len = elements.length;
        for (let index = 0; index < len; index++) {
          if (shouldBreak) break;
          let element = elements[index];
          if (!element) continue;
          let textElement = await element.getText();
          if (!textElement) continue;
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
    let prom: Promise<any>;
    if (identifiers) {
      console.log("here1");
      prom = new Promise((resolve, reject) => {
        return resolve(accept(identifiers, this));
      }).then((shouldBreak) => {
        console.log("here2");
        if (!shouldBreak) return accept(MyDriver.cookieIdentifiers, this);
        else this.logInfo(`(Operation ${id}) Accepted cookies.`);
      });
    } else {
      prom = new Promise((resolve, reject) => {
        console.log("here3");
        return resolve(accept(MyDriver.cookieIdentifiers, this));
      });
    }

    return prom.then((value) => {
      console.log("here4");
      if (value) this.logInfo(`(Operation ${id}) Accepted cookies.`);
      else this.logInfo(`(Operation ${id}) Could not accept cookies.`);
      return this;
    });
  }

  wait(ms: number) {
    // Same as wait. To use only as onfulfilled callback function in a then promise
    return (driver: MyDriver) => driver._wait(ms);
  }

  private _wait(ms: number) {
    // Wait couple of milliseconds
    const id = ++this.operationId;
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        return resolve(timeoutId);
      }, ms);
    }).then((timeoutId: number | string | NodeJS.Timeout) => {
      clearTimeout(timeoutId);
      const message = `(Operation ${id}) Waited ${ms}.`;
      this.logInfo(message);
      return this;
    });
  }

  private logInfo(message: any) {
    // Log information on the console
    console.info(++this.operationCount, `Driver ${this.webDriverId}:`, message);
  }
}
