"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const commonDriver_1 = require("./commonDriver");
const driverBase_1 = require("./driverBase");
const utility_1 = require("./utility");
class AVProcessDriver extends commonDriver_1.default {
    static urls = {
        AV_PROCESSOR_URL: "https://www.veed.io/workspaces/9ef7ad3b-f77b-497c-b3fa-40bdf5bdbde6/home",
    };
    static XPaths = {
        projects: {
            createProjectXPath: "/html/body/div[1]/main/div/div[2]/div/div/div[2]/div[2]/button[1]",
        },
        uploadFiles: {
            closePanelXPath: "/html/body/div[5]/div/div/div[2]/div/button",
            addMediaBtnXPath: "/html/body/div[1]/main/div[2]/div/div/div/div[3]/div[1]/div/div[1]/button[2]",
            browseFilesXPath: "/html/body/div[5]/div/div/div/div/div/div/div/div[1]/div/div/span[2]/span",
        },
    };
    constructor(config = driverBase_1.default.defaultConfig) {
        config.downloadDir = "/videos";
        config.urls = AVProcessDriver.urls;
        super(config);
    }
    async createProject() {
        // Create a new project and return the project's url
        const operationId = ++this.operationId;
        let logMessage = {
            message: `Created a new project`,
            operationId: operationId,
            webDriverId: this.webDriverId,
        };
        let errorMessage = {
            functName: "createProject",
            retryCount: 0,
        };
        return await this._errorWrapper(this._createProject, logMessage, errorMessage)();
    }
    async uploadFiles(files) {
        // Upload the necessary files to create the video
        const operationId = ++this.operationId;
        let logMessage = {
            message: `Upload files`,
            operationId: operationId,
            webDriverId: this.webDriverId,
        };
        let errorMessage = {
            functName: "uploadFiles",
            retryCount: 0,
        };
        await this._errorWrapper(this._uploadFiles, logMessage, errorMessage)({ files: files });
    }
    async _createProject() {
        // Create a new project and return the project's url
        const { createProjectXPath } = AVProcessDriver.XPaths.projects;
        const createButton = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(createProjectXPath));
        await createButton.click();
        return await this.webDriver.getCurrentUrl();
    }
    async _uploadFiles(params) {
        const { closePanelXPath, addMediaBtnXPath, browseFilesXPath } = AVProcessDriver.XPaths.uploadFiles;
        const closePanelBtn = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(closePanelXPath));
        await closePanelBtn.click();
        const addMediaBtn = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(addMediaBtnXPath));
        for (let filePath of params.files) {
            await addMediaBtn.click();
            const browseFilesBtn = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(browseFilesXPath));
            await browseFilesBtn.click();
            await utility_1.default.execFileUpload(filePath);
        }
    }
}
exports.default = AVProcessDriver;
//# sourceMappingURL=avProcessDriver.js.map