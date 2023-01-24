import { execFile } from "node:child_process";
const filePath =
  "C:\\Users\\leopa\\Desktop\\Me\\YTMusic\\downloads\\music\\Broke For Free - Night Owl.mp3";
const exe = "C:/Users/leopa/desktop/me/ytmusic/autoit/fileUpload.exe";
const args = [filePath];

const child = execFile(exe, args, (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
