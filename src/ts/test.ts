import path = require("path");
import { env } from "node:process";

const g = path.join(env.APPDATA, "../Google/Chrome/User Data");
console.log(g);
