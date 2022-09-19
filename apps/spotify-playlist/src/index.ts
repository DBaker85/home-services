// import { readJSON, writeJSON, pathExists } from "fs-extra";
import { resolve } from "path";
import Koa from "koa";
import KoaRouter from "koa-router";
import serve from "koa-static";
import { compileFile } from "pug";
import chalk from "chalk";

import {
  clientId,
  // clientSecret, dailyDriveId, userId
} from "secrets/spotify";
import SpotifyWebApi from "spotify-web-api-node";

// import { Playlist } from "./types/spotify/playlist";

// const playlistPath = resolve(process.cwd(), "playlist.json");

const scopes = [
  "playlist-modify-public",
  " playlist-read-private",
  "playlist-modify-private",
];
const redirectUri = "http://localhost:5888/callback";
const state = "";

console.log(resolve(__dirname, "index.pug"));

const app = new Koa();
const router = new KoaRouter();

const compiledFunction = compileFile(resolve(__dirname, "index.pug"));

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
const spotifyApi = new SpotifyWebApi({
  redirectUri,
  clientId,
});

// Create the authorization URL
const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

router.get("callback", "/callback", async (context) => {
  console.log(context);
});

router.get("root", "/", async (context) => {
  context.body = compiledFunction({ authorizeURL });
});

app.use(router.routes()).use(router.allowedMethods());
app.use(serve(resolve(__dirname, "public"), { gzip: true }));

app.listen(5888);
console.log(`
App running on port : ${chalk.green("5888")}
`);
console.log("click the link to open:");
console.log(
  `
  ${chalk.blue("http://localhost:5888")}

  `
);

// const getData = async (): Promise<void> => {
//   try {
//     // let playlistID;
//     // const playlistExists = await pathExists(playlistPath)
//     // console.log({playlistExists})
//     // if (playlistExists){
//     //   console.log('reading file')
//     //   const playlistData = await readJSON(playlistPath)
//     //   playlistID = playlistData.playlistID;
//     // }
//     // if (!playlistExists) {
//     //   console.log('creating playlist')
//     //   writeJSON(playlistPath,{playlistID})
//     // }
//   } catch (err) {
//     console.error(err);
//   }
// };
// authenticate()
//   .then(() => console.log("done"))
//   .catch((err) => console.log(err));

// auth
// check for existingplaylist.json
// if !exists then create
// give nice image?
// dowload dailydrive
// upload filtered playlist to cool playlist
