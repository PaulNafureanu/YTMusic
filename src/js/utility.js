"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const https = require("https");
const path = require("path");
const child_process = require("child_process");
class Utility {
    static async downloadImageWithNaming(url, filename) {
        const filePath = path.join(__dirname, `./../../downloads/imgs/${filename}`);
        return await Utility.downloadImage(url, filePath);
    }
    static async downloadImage(url, filePath) {
        return await new Promise((resolve, reject) => {
            https.get(url, (response) => {
                if (response.statusCode === 200) {
                    response
                        .pipe(fs.createWriteStream(filePath))
                        .on("error", reject)
                        .once("close", () => resolve(filePath));
                }
                else {
                    response.resume();
                    reject(new Error(`Request failled with the status code ${response.statusCode}`));
                }
            });
        });
    }
    static async execFileUpload(filePath) {
        const exePath = "C:/Users/leopa/desktop/me/ytmusic/autoit/fileUpload.exe";
        const args = [filePath];
        return await new Promise((resolve, reject) => {
            const child = child_process.execFile(exePath, args, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                }
            });
            resolve(child);
        });
    }
}
exports.default = Utility;
//# sourceMappingURL=utility.js.map