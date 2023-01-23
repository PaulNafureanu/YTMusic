import MyDriverBase from "./driverBase";

/**
 * @interface DriverUrl Interface for predefined url targets.
 */
export interface DriverUrl {
  SOURCE_URL: string;
  GENRES_URL: string;
  WEEK_RANK_URL: string;
  MONTH_RANK_URL: string;
  ALL_TIME_RANK_URL: string;
  TARGET_URL: string;
  CHANNEL_URL: string;
}

/**
 * @class Creates a new WebDriver client based with browser and builder configuration.
 */
export default class MyDriver extends MyDriverBase<DriverUrl> {
  /**
   * Predefined url targets
   */
  protected urls: DriverUrl = {
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
  async get(url: keyof DriverUrl) {
    await this._getByHref(url);
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
