import DriverBase, { DriverConfig, Identifier } from "./driverBase";

export default class CommonDriver<T> extends DriverBase {
  /**
   * @constructor for the MyDriver class
   */
  constructor(config: DriverConfig = DriverBase.defaultConfig) {
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
  async get(url: keyof T) {
    await this._getByHref(CommonDriver.defaultConfig.urls[url]);
  }

  /**
   * Schedules a command to navigate to the given URL.
   *
   * @param url A generic website url.
   */
  async getByHref(url: string) {
    await this._getByHref(url);
  }

  /**
   * Get's the title of a web page.
   *
   * @return {Promise<string>} A strings that represents the title of the current web page.
   */
  async getTitle(): Promise<string> {
    return await this._getTitle();
  }

  /**
   * Accept cookies for the current web site
   *
   *@param identifiers A object with two lists for detecting the accept button: a locator By list and a string list.
   */
  async acceptCookies(identifiers?: Identifier) {
    await this._acceptCookies(identifiers);
  }

  /**
   * Makes any execution to be delayed.
   *
   * @param ms The number of milliseconds for delay.
   */
  async wait(ms: number) {
    await this._wait(ms);
  }

  /**
   * Quit and close the web driver after couple of milliseconds.
   *
   * @param ms The number of milliseconds before quitting and closing the web driver.
   */
  async quit(ms: number) {
    await this._quit(ms);
  }
}
