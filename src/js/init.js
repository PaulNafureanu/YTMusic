"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import MyDriver from "./drivern";
const driver_1 = require("./driver");
async function init() {
    //Download the file song
    // const driver = new MyDriver();
    // await driver.init();
    // await driver.get("ALL_TIME_RANK_URL");
    // await driver.acceptCookies();
    // const hrefSongs = await driver.getSongs();
    // await driver.getByHref(hrefSongs[0]);
    // await driver.downloadSong();
    // await driver.quit(5_000);
    //Upload the file song
    const driver = new driver_1.default();
    await driver.init();
    await driver.get("CHANNEL_URL");
    await driver.quit(600000);
}
init();
//# sourceMappingURL=init.js.map