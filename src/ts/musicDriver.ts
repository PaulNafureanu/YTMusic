import fs = require("fs");
import path = require("path");
import { By } from "selenium-webdriver";
import CommonDriver from "./commonDriver";
import DriverBase, {
  DriverConfig,
  ErrorMessage,
  LogMessage,
} from "./driverBase";
import Utility from "./utility";

/**
 * @interface DriverUrls Interface for predefined url targets.
 */
export interface DriverUrls {
  SOURCE_URL: string;
  GENRES_URL: string;
  WEEK_RANK_URL: string;
  MONTH_RANK_URL: string;
  ALL_TIME_RANK_URL: string;
  TEST_SONG_URL: string;
  AV_PROCESSOR_URL: string;
  TARGET_URL: string;
  CHANNEL_URL: string;
}

interface SongMetadata {
  id: string;
  title: string;
  artist: string;
  contactLink: string;
  website?: string;
  social?: string[];
  album: string;
  genres: string[];
  duration: string;
  released: string;
  licenseLink: string;
  filename: string;
  // download link to add
}

/**
 * @class Creates a new WebDriver client based with browser and builder configuration.
 */
export default class MusicDriver extends CommonDriver<DriverUrls> {
  /**
   * Predefined url targets
   */
  static readonly urls: DriverUrls = {
    SOURCE_URL: "https://freemusicarchive.org",
    GENRES_URL: "https://freemusicarchive.org/genres",
    WEEK_RANK_URL: "https://freemusicarchive.org/music/charts/this-week",
    MONTH_RANK_URL: "https://freemusicarchive.org/music/charts/this-month",
    ALL_TIME_RANK_URL: "https://freemusicarchive.org/music/charts/all",
    TEST_SONG_URL:
      "https://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/Broke_For_Free_-_Directionless_EP_-_01_Night_Owl/",
    AV_PROCESSOR_URL:
      "https://www.veed.io/workspaces/9ef7ad3b-f77b-497c-b3fa-40bdf5bdbde6/home",
    TARGET_URL: "https://www.youtube.com/",
    CHANNEL_URL: "https://www.youtube.com/channel/UCopd8ft4OZRkVa2nG7ZA4HQ",
  };

  static readonly XPaths = {
    downloadSong: {
      downloadBtnXPath:
        "/html/body/div[1]/div[2]/div/div[1]/div[1]/div[2]/a[2]",
      acceptDownloadXPath: "/html/body/div[4]/div[2]/div[1]/div[2]/a",
    },
    downloadImage: {
      imageXPath: "/html/body/div[1]/div[2]/div/div[1]/div[1]/div[1]/img",
    },
    metadataSong: {
      titleXPath:
        "/html/body/div[1]/div[2]/div/div[2]/div[1]/div/div/span[2]/div/a",
      artistXPath:
        "/html/body/div[1]/div[2]/div/div[2]/div[1]/div/div/span[2]/div/span/a",
      artistContactXPath: "/html/body/div[1]/div[2]/div/div[1]/div[4]/a",
      albumXPath: "/html/body/div[1]/div[2]/div/div[2]/div[2]/div/div[1]/p/a",
      genresListXPath:
        "/html/body/div[1]/div[2]/div/div[2]/div[2]/div/div[2]/span[2]", // should also get the anchors, then text
      durationXPath:
        "/html/body/div[1]/div[2]/div/div[2]/div[1]/div/div/span[4]",
      releasedXPath:
        "/html/body/div[1]/div[2]/div/div[1]/div[2]/div[1]/span[2]",
      licenseLinkXPath: "/html/body/div[1]/div[2]/div/div[1]/div[3]/a[3]",
      artistWebSite: "/html/body/div[1]/div[2]/div/div/div/div[1]/span/a",
      artistSocialMedia: "/html/body/div[1]/div[2]/div/div/div/div[2]", //test XPaths
    },
  };

  /**
   * @constructor for the MyDriver class
   */
  constructor(config: DriverConfig = DriverBase.defaultConfig) {
    config.downloadDir = "/music";
    config.urls = MusicDriver.urls;
    super(config);
  }

  //Specific driver functions for this project app

  async downloadSong() {
    //Download a song from archive
    const operationId = ++this.operationId;

    let logMessage: LogMessage = {
      message: `Downloaded song`,
      operationId: operationId,
      webDriverId: this.webDriverId,
    };
    let errorMessage: ErrorMessage = {
      functName: "downloadSong",
      retryCount: 0,
    };

    await this._errorWrapper(this._downloadSong, logMessage, errorMessage)();
  }
  async downloadImage(fileName: string) {
    // Download image from the song page
    const operationId = ++this.operationId;

    let logMessage: LogMessage = {
      message: `Downloaded thumbnail image`,
      operationId: operationId,
      webDriverId: this.webDriverId,
    };
    let errorMessage: ErrorMessage = {
      functName: "downloadImage",
      retryCount: 0,
    };

    return await this._errorWrapper(
      this._downloadImage,
      logMessage,
      errorMessage
    )({ fileName: fileName });
  }
  async getMetaAboutSong(id: number) {
    // Download the metadata about a song and store it in a json file. Returns path to the file
    const operationId = ++this.operationId;

    let logMessage: LogMessage = {
      message: `Downloaded song metadata`,
      operationId: operationId,
      webDriverId: this.webDriverId,
    };
    let errorMessage: ErrorMessage = {
      functName: "getMetaAboutSong",
      retryCount: 0,
    };

    return await this._errorWrapper(
      this._getMetaAboutSong,
      logMessage,
      errorMessage
    )({ id: id });
  }

  private async _downloadSong() {
    const { downloadBtnXPath, acceptDownloadXPath } =
      MusicDriver.XPaths.downloadSong;

    const downloadBtn = await this.webDriver.findElement(
      By.xpath(downloadBtnXPath)
    );
    await downloadBtn.click();

    const acceptDownload = await this.webDriver.findElement(
      By.xpath(acceptDownloadXPath)
    );
    await acceptDownload.click();
  }
  private async _downloadImage(params: { fileName: string }) {
    const { imageXPath } = MusicDriver.XPaths.downloadImage;
    const image = await this.webDriver.findElement(By.xpath(imageXPath));
    const src = await image.getAttribute("src");
    return await Utility.downloadImageWithNaming(src, params.fileName);
  }
  private async _getMetaAboutSong(params: { id: number }) {
    const {
      titleXPath,
      artistXPath,
      artistContactXPath,
      albumXPath,
      genresListXPath,
      durationXPath,
      releasedXPath,
      licenseLinkXPath,
    } = MusicDriver.XPaths.metadataSong;

    const metadata: SongMetadata = {
      id: "",
      title: "",
      artist: "",
      contactLink: "",
      website: "",
      social: [],
      album: "",
      genres: [],
      duration: "",
      released: "",
      licenseLink: "",
      filename: "",
    };

    metadata.id = params.id.toString();

    const titleElement = await this.webDriver.findElement(By.xpath(titleXPath));
    metadata.title = await titleElement.getText();

    const artistElement = await this.webDriver.findElement(
      By.xpath(artistXPath)
    );
    metadata.artist = await artistElement.getText();

    const contactElement = await this.webDriver.findElement(
      By.xpath(artistContactXPath)
    );
    metadata.contactLink = await contactElement.getAttribute("href");

    const albumElement = await this.webDriver.findElement(By.xpath(albumXPath));
    metadata.album = await albumElement.getText();

    const genresElement = await this.webDriver.findElement(
      By.xpath(genresListXPath)
    );
    const genresList = await genresElement.findElements(By.css("a"));
    for (let genre of genresList) {
      let name = await genre.getText();
      if (!name) continue;
      metadata.genres.push(name);
    }

    const durationElement = await this.webDriver.findElement(
      By.xpath(durationXPath)
    );
    metadata.duration = await durationElement.getText();

    const releasedElement = await this.webDriver.findElement(
      By.xpath(releasedXPath)
    );
    metadata.released = await releasedElement.getText();

    const licenseElement = await this.webDriver.findElement(
      By.xpath(licenseLinkXPath)
    );
    metadata.licenseLink = await licenseElement.getAttribute("href");

    const filename = `${params.id.toString()}_${metadata.title}_${
      metadata.artist
    }.json`;
    metadata.filename = filename;

    const jsonMetadata = JSON.stringify(metadata);

    const filePath = path.join(__dirname, `./../../downloads/meta/${filename}`);

    fs.writeFile(filePath, jsonMetadata, "utf8", () => {});

    return metadata;
  }
}
