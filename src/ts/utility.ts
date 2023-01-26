import fs = require("fs");
import https = require("https");
import path = require("path");
import child_process = require("child_process");

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

  static async execFileUpload(filePath: string) {
    const exePath = "C:/Users/leopa/desktop/me/ytmusic/autoit/fileUpload.exe";
    const args = [filePath];
    return await new Promise((resolve, reject) => {
      const child = child_process.execFile(
        exePath,
        args,
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
          }
        }
      );
      resolve(child);
    });
  }
}
