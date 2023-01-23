// // Imports
// import { Builder, By, ThenableWebDriver, WebDriver } from "selenium-webdriver";
// import { Options } from "selenium-webdriver/chrome";
// import path = require("path");
// import { env } from "node:process";

// // Types and interfaces
// interface DriverUrls {
//   SOURCE_URL: string;
//   GENRES_URL: string;
//   WEEK_RANK_URL: string;
//   MONTH_RANK_URL: string;
//   ALL_TIME_RANK_URL: string;
//   TARGET_URL: string;
//   CHANNEL_URL: string;
// }

// interface DriverConfig {
//   browser: "chrome";
//   setTimeouts: { implicit: number };
//   maxRetries: number;
// }

// interface DriverData {
//   title: string | undefined;
// }

// interface Identifier {
//   locators: By[];
//   texts: string[];
// }

// type Genres =
//   | "International"
//   | "Blues"
//   | "Jazz"
//   | "Novelty"
//   | "Historic"
//   | "Country"
//   | "Pop"
//   | "Rock"
//   | "Soul-RnB"
//   | "Spoken"
//   | "Experimental"
//   | "Folk"
//   | "Instrumental"
//   | "Classical"
//   | "Electronic"
//   | "Hip-Hop";

// export default class MyDriver {
//   static readonly urls: DriverUrls = {
//     SOURCE_URL: "https://freemusicarchive.org",
//     GENRES_URL: "https://freemusicarchive.org/genres",
//     WEEK_RANK_URL: "https://freemusicarchive.org/music/charts/this-week",
//     MONTH_RANK_URL: "https://freemusicarchive.org/music/charts/this-month",
//     ALL_TIME_RANK_URL: "https://freemusicarchive.org/music/charts/all",
//     TARGET_URL: "https://www.youtube.com/",
//     CHANNEL_URL: "https://www.youtube.com/channel/UCopd8ft4OZRkVa2nG7ZA4HQ",
//   };

//   static readonly defaultConfig: DriverConfig = {
//     browser: "chrome",
//     setTimeouts: { implicit: 10_000 },
//     maxRetries: 2,
//   };

//   static readonly cookieIdentifiers: Identifier = {
//     locators: [By.css("button"), By.css("div")],
//     texts: [
//       "Allow all",
//       "Accept all",
//       "Accept all cookies",
//       "Allow essential and optional cookies",
//       "Accept all & visit the site",
//       "Only allow essential cookies",
//       "Acceptă tot",
//       "Accepta tot",
//       "Permite tot",
//     ],
//   };

//   private static webDriverCount: number = 0;
//   private config: DriverConfig;
//   private webDriver: WebDriver;
//   private webDriverId: number = 0;
//   private operationId: number = 0;
//   private operationCount: number = 0;

//   constructor(config: DriverConfig = MyDriver.defaultConfig) {
//     ++MyDriver.webDriverCount;
//     this.config = config;
//   }

//   async init(retryCount: number = 0) {
//     let operationId: number = ++this.operationId;
//     const config = this.config;
//     // const userdata = path.join(env.APPDATA, "../Google/Chrome/User Data");
//     const q = "C:/Users/leopa/Desktop/Me/YTMusic/userdata";
//     const userdata = path.join(__dirname, "../../userdata");
//     try {
//       this.webDriverId = MyDriver.webDriverCount;
//       this.webDriver = await new Builder()
//         .forBrowser(config.browser)
//         .setChromeOptions(
//           new Options()
//             .setUserPreferences({
//               "download.default_directory": path.join(
//                 __dirname,
//                 "../../downloads"
//               ),
//             })
//             .addArguments(`user-data-dir=${userdata}`)
//             .addArguments("profile-directory=Default")
//         )
//         .build();
//       const message = `(Op. ${operationId}) Initialized for browser ${config.browser}.`;
//       this.logInfo(message);
//     } catch (error) {
//       this.logInfo(error.message, operationId, "init", {}, retryCount, true);
//     }

//     try {
//       operationId = ++this.operationId;
//       this.webDriver
//         .manage()
//         .setTimeouts({ implicit: config.setTimeouts.implicit });
//       const message = `(Op. ${operationId}) Setted implicit timeout to ${config.setTimeouts.implicit}.`;
//       this.logInfo(message);
//     } catch (error) {
//       this.logInfo(
//         error.message,
//         operationId,
//         "init",
//         { config: "DriverConfig" },
//         retryCount,
//         true
//       );
//     }
//   }

//   async getByHref(url: string, retryCount: number = 0) {
//     //Navigate to a specific url
//     const operationId = ++this.operationId;
//     try {
//       this.webDriver.get(url);
//       const message = `(Op. ${operationId}) Navigated to url ${url}.`;
//       this.logInfo(message);
//     } catch (error) {
//       this.logInfo(
//         error.message,
//         operationId,
//         "getByHref",
//         { url: url },
//         retryCount,
//         true
//       );
//     }
//   }

//   async singInGoogle(retryCount: number = 0) {
//     const operationId = ++this.operationId;
//     try {
//       // const closePopUpPath = "/html/body/div[2]/div/div/div/div[2]/div/button";
//       // const signInPath =
//       //   "/html/body/div[1]/div/div[3]/div[1]/div/div/div/div[3]/span[4]/div/p/span/a";
//       // const signInGooglePath =
//       //   "/html/body/div[2]/div/div/div/div[1]/div/div[2]/a";
//       // const cookiePopUp = await this.webDriver.findElement(
//       //   By.xpath(closePopUpPath)
//       // );
//       // await cookiePopUp.click();
//       // const signIn = await this.webDriver.findElement(By.xpath(signInPath));
//       // await signIn.click();
//       // const signInWithGoogle = await this.webDriver.findElement(
//       //   By.xpath(signInGooglePath)
//       // );
//       // await signInWithGoogle.click();
//       // this.logInfo(element);
//     } catch (error) {
//       this.logInfo(
//         error.message,
//         operationId,
//         "singInGoogle",
//         {},
//         retryCount,
//         true
//       );
//     }
//   }

//   async get(url: keyof DriverUrls, retryCount: number = 0) {
//     //Navigate to a specific url
//     const operationId = ++this.operationId;
//     await this.getByHref(MyDriver.urls[url]);
//   }

//   async getTitle(retryCount: number = 0) {
//     // Get the title of a web page
//     const operationId = ++this.operationId;
//     try {
//       const value = await this.webDriver.getTitle();
//       const message = `(Op. ${operationId}) Got title '${value}'.`;
//       this.logInfo(message);
//       return value;
//     } catch (error) {
//       this.logInfo(
//         error.message,
//         operationId,
//         "getTtitle",
//         {},
//         retryCount,
//         true
//       );
//     }
//   }

//   async getSongs(retryCount: number = 0) {
//     const operationId = ++this.operationId;
//     let hrefSongs: string[] = [];
//     try {
//       const table = await this.webDriver.findElement(
//         By.className("flex flex-col gap-3 bg-white overflow-hidden")
//       );
//       if (!table) throw new Error("Table could not be found.");
//       else {
//         const rows = await this.webDriver.findElements(
//           By.className("play-item")
//         );
//         if (rows.length === 0)
//           throw new Error("Play items could not be found.");

//         for (const row of rows) {
//           if (!row) continue;
//           const span = await row.findElement(
//             By.className("chartcol-track flex flex-col col-span-5")
//           );
//           const anchor = await span.findElement(By.css("a"));
//           const href = await anchor.getAttribute("href");
//           hrefSongs.push(href);
//         }
//         this.logInfo("Created a link song array from the page.");
//         return hrefSongs;
//       }
//     } catch (error) {
//       this.logInfo(
//         error.message,
//         operationId,
//         "getSongs",
//         {},
//         retryCount,
//         true
//       );
//     }
//   }

//   async downloadSong(retryCount: number = 0) {
//     const operationId = ++this.operationId;
//     try {
//       const download = await this.webDriver.findElement(
//         By.className("js-download")
//       );
//       await download.click();

//       const acceptDownload = await this.webDriver.findElement(
//         By.className("download font-medium")
//       );
//       await acceptDownload.click();
//       // this.logInfo(`(Op. ${operationId}) Open download panel.`);
//     } catch (error) {
//       this.logInfo(
//         error.message,
//         operationId,
//         "downloadSong",
//         {},
//         retryCount,
//         true
//       );
//     }
//   }

//   async wait(ms: number, retryCount: number = 0) {
//     // Wait couple of milliseconds
//     const operationId = ++this.operationId;
//     try {
//       const timeoutId: NodeJS.Timeout | number | string = await new Promise(
//         (resolve) => {
//           let timeoutId = setTimeout(() => {
//             resolve(timeoutId);
//           }, ms);
//         }
//       );
//       clearTimeout(timeoutId);
//       const message = `(Op. ${operationId}) Waited ${ms}.`;
//       this.logInfo(message);
//     } catch (error) {
//       this.logInfo(
//         error.message,
//         operationId,
//         "wait",
//         { ms: ms },
//         retryCount,
//         true
//       );
//     }
//   }

//   async quit(ms: number, retryCount: number = 0) {
//     const operationId = ++this.operationId;
//     try {
//       const timeoutId: NodeJS.Timeout | number | string = await new Promise(
//         (resolve) => {
//           let timeoutId = setTimeout(() => {
//             this.webDriver.quit();
//             resolve(timeoutId);
//           }, ms);
//         }
//       );
//       clearTimeout(timeoutId);
//       const message = `(Op. ${operationId}) Quit after ${ms}.`;
//       this.logInfo(message);
//     } catch (error) {
//       this.logInfo(
//         error.message,
//         operationId,
//         "quit",
//         { ms: ms },
//         retryCount,
//         true
//       );
//     }
//   }

//   async acceptCookies(identifiers?: Identifier, retryCount: number = 0) {
//     // Accept web site cookies. Should not be reused for a website where the cookies were accepted.
//     const operationId = ++this.operationId;
//     try {
//       async function accept(identifierList: Identifier, myDriver: MyDriver) {
//         let shouldBreak = false;
//         for (const locator of identifierList.locators) {
//           if (shouldBreak) break;
//           let elements = await myDriver.webDriver.findElements(locator);
//           let len = elements.length;
//           for (let index = 0; index < len; index++) {
//             if (shouldBreak) break;
//             let element = elements[index];
//             if (!element) continue;
//             let textElement = await element.getText();
//             if (!textElement) continue;
//             textElement = textElement.toUpperCase();
//             for (const text of identifierList.texts) {
//               if (text.toUpperCase() === textElement) {
//                 await element.click();
//                 shouldBreak = true;
//                 break;
//               }
//             }
//           }
//         }
//         return shouldBreak;
//       }
//       let shouldBreak = false;
//       if (identifiers) shouldBreak = await accept(identifiers, this);
//       if (!shouldBreak)
//         shouldBreak = await accept(MyDriver.cookieIdentifiers, this);
//       if (shouldBreak) this.logInfo(`(Op. ${operationId}) Accepted cookies.`);
//       else throw new Error(`Could not accept cookies.`);
//     } catch (error) {
//       this.logInfo(
//         error.message,
//         operationId,
//         "acceptCookies",
//         { identifiers: identifiers },
//         retryCount,
//         true
//       );
//     }
//   }

//   async getGenre(genre: Genres, retryCount: number = 0) {
//     const operationId = ++this.operationId;
//     try {
//       const genres = await this.webDriver.findElements(By.className("z-10"));
//       const len = genres.length;
//       if (!genres) new Error("No genre could be found.");
//       for (const genreElement of genres) {
//         if (!genreElement) continue;
//         let textElement = await genreElement.getText();
//         if (textElement) textElement = textElement.toUpperCase();
//         else continue;
//         if (textElement === genre.toUpperCase()) {
//           await genreElement.click();
//           this.logInfo(`(Op. ${operationId}) Navigate to genre '${genre}'.`);
//           break;
//         }
//       }
//     } catch (error) {
//       this.logInfo(
//         error.message,
//         operationId,
//         "getGenre",
//         { genre: genre },
//         retryCount,
//         true
//       );
//     }
//   }

//   private logInfo(
//     message: any,
//     operationId?: number,
//     functName?: string,
//     functArgs?: object,
//     retryCount?: number,
//     error: boolean = false
//   ) {
//     try {
//       // Log information on the console
//       if (!error)
//         console.info(
//           "\x1b[32m%s\x1b[0m",
//           ++this.operationCount,
//           `Driver ${this.webDriverId}:`,
//           message
//         );
//       else {
//         console.error(
//           "\x1b[31m%s\x1b[0m",
//           ++this.operationCount,
//           `Error for Driver ${
//             this.webDriverId
//           } at Op. ${operationId}, retry ${retryCount} for [${functName}(${JSON.stringify(
//             functArgs
//           )})]:`,
//           message
//         );

//         if (retryCount < this.config.maxRetries) {
//           ++retryCount;
//           switch (functName) {
//             case "init": {
//               this.init(retryCount);
//               break;
//             }
//             case "getByHref": {
//               this.getByHref(functArgs["url"], retryCount);
//               break;
//             }
//             case "getTitle": {
//               this.getTitle(retryCount);
//               break;
//             }
//             case "wait": {
//               this.wait(functArgs["ms"], retryCount);
//               break;
//             }
//             case "quit": {
//               this.quit(functArgs["ms"], retryCount);
//               break;
//             }
//             case "acceptCookies": {
//               this.acceptCookies(functArgs["identifiers"], retryCount);
//               break;
//             }
//             case "getGenre": {
//               this.getGenre(functArgs["genre"], retryCount);
//               break;
//             }
//             case "getSongs": {
//               this.getSongs(retryCount);
//               break;
//             }
//             case "downloadSong": {
//               this.downloadSong(retryCount);
//               break;
//             }
//             case "singInGoogle": {
//               this.singInGoogle(retryCount);
//             }
//             default: {
//               break;
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Log error:", error.message);
//     }
//   }
// }
