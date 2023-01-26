"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const avProcessDriver_1 = require("./avProcessDriver");
async function init() {
    const avDriver = new avProcessDriver_1.default();
    await avDriver.init();
    await avDriver.get("AV_PROCESSOR_URL");
    await avDriver.createProject();
    const files = [
        "C:/Users/leopa/desktop/me/ytmusic/downloads/imgs/1_Night Owl_Broke For Free.png",
        "C:/Users/leopa/desktop/me/ytmusic/downloads/music/Broke For Free - Night Owl.mp3",
    ];
    await avDriver.uploadFiles(files);
}
init();
//# sourceMappingURL=init.js.map