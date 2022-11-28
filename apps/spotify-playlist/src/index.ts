// import { readJSON, writeJSON, pathExists } from "fs-extra";
import { resolve } from "path";
import Koa from "koa";
import KoaRouter from "koa-router";
import serve from "koa-static";
import { compileFile } from "pug";
import chalk from "chalk";
import { stringify } from "query-string";

import {
  clientId,
  clientSecret,
  // dailyDriveId, userId
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

const app = new Koa();
const router = new KoaRouter();

const compiledIndex = compileFile(resolve(__dirname, "views", "index.pug"));
const compiledError = compileFile(resolve(__dirname, "views", "error.pug"));
const compiledSuccess = compileFile(resolve(__dirname, "views", "success.pug"));

console.log(compiledSuccess(), compiledError());

// Setting credentials can be done in the wrapper's constructor, or using the API object's setters.
const spotifyApi = new SpotifyWebApi({
  redirectUri,
  clientId,
  clientSecret,
});

// Create the authorization URL
const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

router.get("success", "/success", async (context) => {
  context.body = compiledSuccess();
});
router.get("error", "/error", async (context) => {
  let errorMsg = "Something went wrong, please try again";

  if (context.query?.error === "access_denied") {
    errorMsg = "App Authentication failed, please try again";
  }

  context.body = compiledError({ errorMsg });
});

router.get("callback", "/callback", async (context) => {
  if (context.query?.error === "access_denied") {
    const queryString = stringify({
      error: "access_denied",
    });
    context.response.redirect(`/error?${queryString}`);
  } else if (context.query?.code !== undefined) {
    const code = context.query?.code;

    // exec the stuff here
    // crontab here?
    spotifyApi.authorizationCodeGrant(code as string).then(
      function (data) {
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        console.log("The token expires in " + data.body.expires_in);
        console.log("The access token is " + data.body.access_token);
        console.log("The refresh token is " + data.body.refresh_token);

        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
    context.response.redirect("success");
  } else {
    context.response.redirect("error");
  }
});

router.get("root", "/", async (context) => {
  context.body = compiledIndex({ authorizeURL });
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

// auth
// check for existingplaylist.json
// if !exists then create
// give nice image?
// dowload dailydrive
// upload filtered playlist to cool playlist
