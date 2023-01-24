"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const commonDriver_1 = require("./commonDriver");
const driverBase_1 = require("./driverBase");
class AVProcessDriver extends commonDriver_1.default {
    static urls = {
        AV_PROCESSOR_URL: "https://www.veed.io/workspaces/9ef7ad3b-f77b-497c-b3fa-40bdf5bdbde6/home",
    };
    static XPaths = {
        projects: {
            createProjectXPath: "/html/body/div[1]/main/div/div[2]/div/div/div[2]/div[2]/button[1]",
            uploadFileXPath: "/html/body/div[5]/div/div/div[2]/div/div/div/div/div[1]/div/div/span[2]/span",
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
        try {
            const dragDropXPath = "/html/body/div[5]/div/div/div[2]/div/div/div/div/div[1]/div";
            const { uploadFileXPath } = AVProcessDriver.XPaths.projects;
            const uploadFileBtn = await this.webDriver.findElement(selenium_webdriver_1.By.xpath(uploadFileXPath));
            await uploadFileBtn.click();
            //   await uploadFileBtn.sendKeys(...params.files);
        }
        catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}
exports.default = AVProcessDriver;
//# sourceMappingURL=avProcessDriver.js.map