import * as dotenv from "dotenv";
import { clientId, clientSecret, dailyDriveId } from "secrets/spotify";

import { Playlist } from "./types/spotify/playlist";

dotenv.config();

// // your application requests authorization
// var authOptions = {
//   url: 'https://accounts.spotify.com/api/token',
//   headers: {
//     'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//   },
//   form: {
//     grant_type: 'client_credentials'
//   },
//   json: true
// };

// fetch(authOptions, function(error, response, body) {
//   if (!error && response.statusCode === 200) {

//     // use the access token to access the Spotify Web API
//     var token = body.access_token;
//     var options = {
//       url: 'https://api.spotify.com/v1/users/jmperezperez',
//       headers: {
//         'Authorization': 'Bearer ' + token
//       },
//       json: true
//     };
//     request.get(options, function(error, response, body) {
//       console.log(body);
//     });
//   }
// });

const getData = async (): Promise<void> => {
  const authResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
  });
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { access_token } = await authResponse.json();

  const playlistResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${dailyDriveId}`,
    {
      headers: {
        Authorization: "Bearer " + (access_token as string),
      },
    }
  );
  const playlist = (await playlistResponse.json()) as Playlist;

  console.log(playlist);
};
getData()
  .then(() => console.log("done"))
  .catch((err) => console.log(err));
