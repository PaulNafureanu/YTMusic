"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const selenium_webdriver_1 = require("selenium-webdriver");
const commonDriver_1 = require("./commonDriver");
const driverBase_1 = require("./driverBase");
const utility_1 = require("./utility");
/**
 * @class Creates a new WebDriver client based with browser and builder configuration.
 */
class MusicDriver extends commonDriver_1.default {
    /**
     * Predefined url targets
     */
    static urls = {
        SOURCE_URL: "https://freemusicarchive.org",
        GENRES_URL: "https://freemusicarchive.org/genres",
        WEEK_RANK_URL: "https://freemusicarchive.org/music/charts/this-week",
        MONTH_RANK_URL: "https://freemusicarchive.org/music/charts/this-month",
        ALL_TIME_RANK_URL: "https://freemusicarchive.org/music/charts/all",
        TEST_SONG_URL: "https://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/Broke_For_Free_-_Directionless_EP_-_01_Night_Owl/",
        AV_PROCESSOR_URL: "https://www.veed.io/workspaces/9ef7ad3b-f77b-497c-b3fa-40bdf5bdbde6/home",
        TARGET_URL: "https://www.youtube.com/",
        CHANNEL_URL: "https://www.youtube.com/channel/UCopd8ft4OZRkVa2nG7ZA4HQ",
    };
    static XPaths = {
        downloadSong: {
            downloadBtnXPath: "/html/body/div[1]/div[2]/div/div[1]/div[1]/div[2]/a[2]",
            acceptDownloadXPath: "/html/body/div[4]/div[2]/div[1]/div[2]/a",
        },
        downloadImage: {
            imageXPath: "/html/body/div[1]/div[2]/div/div[1]/div[1]/div[1]/img",
        },
        metadataSong: {
            titleXPath: "/html/body/div[1]/div[2]/div/div[2]/div[1]/div/div/span[2]/div/a",
            artistXPath: "/html/body/div[1]/div[2]/div/div[2]/div[1]/div/div/span[2]/div/span/a",
            artistContactXPath: "/html/body/div[1]/div[2]/div/div[1]/div[4]/a",
            albumXPath: "/html/body/div[1]/div[2]/div/div[2]/div[2]/div/div[1]/p/a",
            genresListXPath: "/html/body/div[1]/div[2]/div/div[2]/div[2]/div/div[2]/span[2]",
            durationXPath: "/html/body/div[1]/div[2]/div/div[2]/div[1]/div/div/span[4]",
            releasedXPath: "/html/body/div[1]/div[2]/div/div[1]/div[2]/div[1]/span[2]",
            licenseLinkXPath: "/html/body/div[1]/div[2]/div/div[1]/div[3]/a[3]",
            artistWebSite: "/html/body/div[1]/div[2]/div/div/div/div[1]/span/a",
            artistSocialMedia: "/html/body/div[1]/div[2]/div/div/div/div[2]", //test XPaths
        },
    };
    /**
     * @constructor for the MyDriver class
     */
    constructor(config = driverBase_1.default.defaultConfig) {
        config.downloadDir = "/music";
        config.urls = MusicDriver.urls;
        super(config);
    }
    //Specific driver functions for this project app
    async downloadSong() {
        //Download a song from archive
        const operationId = ++this.operationId;
        let logMessage = {
            message: `Downloaded song`,
            operationId: operationId,
            webDriverId: this.webDriverId,
        };
        let errorMessage = {
            functName: "downloadSong",
            retryCount: 0,
        };
        await this._errorWrapper(this._downloadSong, logMessage, errorMessage)();
    }
    async downloadImage(fileName) {
        // Download image from the song page
        const operationId = ++this.operationId;
        let logMessage = {
            message: `Downloaded thumbnail image`,
            operationId: operationId,
            webDriverId: this.webDriverId,
        };
        let errorMessage = {
            functName: "downloadImage",
            retryCount: 0,
        };
        return await this._errorWrapper(this._downloadImage, logMessage, errorMessage)({ fileName: fileName });
    }
    async getMetaAboutSong(id) {
        // Download the metadata about a song and store it in a json file. Returns path to the file
        const operationId = ++this.operationId;
        let logMessage = {
            message: `Downloaded song metadata`,
            operationId: operationId,
            webDriverId: this.webDriverId,
        };
        let errorMessage = {
            functName: "getMetaAboutSong",
            retryCount: 0,
        };
        return await this._errorWrapper(this._getMetaAboutSong, logMessage, errorMessage)({ id: id });
    }
    async _downloadSong() {
        const { downloadBtnXPath, acceptDownloadXPath } = MusicDriver.XPaths.downloadSong;
        const downloadBtn = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(downloadBtnXPath));
        await downloadBtn.click();
        const acceptDownload = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(acceptDownloadXPath));
        await acceptDownload.click();
    }
    async _downloadImage(params) {
        const { imageXPath } = MusicDriver.XPaths.downloadImage;
        const image = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(imageXPath));
        const src = await image.getAttribute("src");
        return await utility_1.default.downloadImageWithNaming(src, params.fileName);
    }
    async _getMetaAboutSong(params) {
        const { titleXPath, artistXPath, artistContactXPath, albumXPath, genresListXPath, durationXPath, releasedXPath, licenseLinkXPath, } = MusicDriver.XPaths.metadataSong;
        const metadata = {
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
        const titleElement = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(titleXPath));
        metadata.title = await titleElement.getText();
        const artistElement = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(artistXPath));
        metadata.artist = await artistElement.getText();
        const contactElement = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(artistContactXPath));
        metadata.contactLink = await contactElement.getAttribute("href");
        const albumElement = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(albumXPath));
        metadata.album = await albumElement.getText();
        const genresElement = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(genresListXPath));
        const genresList = await genresElement.findElements(selenium_webdriver_1.By.css("a"));
        for (let genre of genresList) {
            let name = await genre.getText();
            if (!name)
                continue;
            metadata.genres.push(name);
        }
        const durationElement = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(durationXPath));
        metadata.duration = await durationElement.getText();
        const releasedElement = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(releasedXPath));
        metadata.released = await releasedElement.getText();
        const licenseElement = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(licenseLinkXPath));
        metadata.licenseLink = await licenseElement.getAttribute("href");
        const filename = `${params.id.toString()}_${metadata.title}_${metadata.artist}.json`;
        metadata.filename = filename;
        const jsonMetadata = JSON.stringify(metadata);
        const filePath = path.join(__dirname, `./../../downloads/meta/${filename}`);
        fs.writeFile(filePath, jsonMetadata, "utf8", () => { });
        return metadata;
    }
}
exports.default = MusicDriver;
//# sourceMappingURL=musicDriver.js.map