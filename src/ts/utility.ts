import fs = require("fs");
import https = require("https");
import path = require("path");

export default class Utility {
  static async downloadImageWithNaming(
    url: string,
    filename: string
  ): Promise<string> {
    const filePath = path.join(__dirname, `./../../downloads/imgs/${filename}`);
    return await Utility.downloadImage(url, filePath);
  }

  static async downloadImage(url: string, filePath: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          response
            .pipe(fs.createWriteStream(filePath))
            .on("error", reject)
            .once("close", () => resolve(filePath));
        } else {
          response.resume();
          reject(
            new Error(
              `Request failled with the status code ${response.statusCode}`
            )
          );
        }
      });
    });
  }
}
