"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const https = require("https");
const path = require("path");
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
}
exports.default = Utility;
//# sourceMappingURL=utility.js.map