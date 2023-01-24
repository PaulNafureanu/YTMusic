"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_child_process_1 = require("node:child_process");
const filePath = "C:\\Users\\leopa\\Desktop\\Me\\YTMusic\\downloads\\music\\Broke For Free - Night Owl.mp3";
const exe = "C:/Users/leopa/desktop/me/ytmusic/autoit/fileUpload.exe";
const args = [filePath];
const child = (0, node_child_process_1.execFile)(exe, args, (error, stdout, stderr) => {
    if (error) {
        throw error;
    }
    console.log(stdout);
});
//# sourceMappingURL=test.js.map