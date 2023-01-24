import path = require("path");
import AVProcessDriver from "./avProcessDriver";
import MusicDriver from "./musicDriver";

async function init() {
  const avDriver = new AVProcessDriver();
  await avDriver.init();
  await avDriver.get("AV_PROCESSOR_URL");
  await avDriver.createProject();
  const files = [
    "C:/Users/leopa/desktop/me/ytmusic/downloads/imgs/1_Night Owl_Broke For Free.png",
    "C:/Users/leopa/desktop/me/ytmusic/downloads/music/Broke For Free - Night Owl.mp3",
  ];

  const files1 = ["C:/Users/leopa/desktop/me/ytmusic/downloads/1.txt"];
  await avDriver.uploadFiles(files1);
}

init();
