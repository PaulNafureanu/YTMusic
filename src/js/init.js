"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = require("./driver");
async function init() {
    const driver = new driver_1.default();
    driver
        .init()
        .then(driver.get("SOURCE_URL"))
        .then(driver.wait(3000))
        .then(driver.get("TARGET_URL"))
        .then(driver.acceptCookies())
        .then(driver.getTitle())
        .then(driver.get("SOURCE_URL"))
        .then(driver.acceptCookies())
        .then(driver.getTitle());
    // // Click on a genre
    // let genres = await driver.findElements(By.className("z-10"));
    // len = genres.length;
    // for (let index = 0; index < len; index++) {
    //   let genre = genres[index];
    //   let text = await genre.getText();
    //   if (text.toUpperCase() === "Blues".toUpperCase()) {
    //     await genre.click();
    //     break;
    //   }
    // }
    // // Click on a song
    // let songs = await driver.findElements(By.className("ptxt-track"));
    // len = songs.length;
    // for (let index = 0; index < len; index++) {
    //   let song = songs[index];
    //   let text = await song.getText();
    //   console.log(index, text);
    //   if (text.toUpperCase() === "Sundown".toUpperCase()) {
    //     let link = await song.findElement(By.css("a"));
    //     await link.click();
    //     wait(1000);
    //     await driver.navigate().back();
    //     break;
    //   }
    // }
    // // To click again, you have to find it again
    // songs = await driver.findElements(By.className("ptxt-track"));
    // len = songs.length;
    // for (let index = 1; index < len; index++) {
    //   let song = songs[index];
    //   let text = await song.getText();
    //   console.log(index, text);
    //   if (text.toUpperCase() === "Sundown".toUpperCase()) {
    //     let link = await song.findElement(By.css("a"));
    //     await link.click();
    //     wait(1000);
    //     await driver.navigate().back();
    //     break;
    //   }
    // }
    // setTimeout(() => {
    //   driver.quit();
    // }, 60 * 1000);
}
init();
//# sourceMappingURL=init.js.map