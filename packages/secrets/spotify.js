const defaults = {
  clientId: "client id",
  clientSecret: "client secret",
  dailyDriveId: "daily drive",
  userId: "user id",
};

let spotifyConfig;

try {
  const localconf = require("./spotify.local.json");
  spotifyConfig = {
    clientId: localconf?.clientId || defaults.clientId,
    clientSecret: localconf?.clientSecret || defaults.clientSecret,
    dailyDriveId: localconf?.dailyDriveId || defaults.dailyDriveId,
    userId: localconf?.userId || defaults.userId,
  };
} catch {
  spotifyConfig = defaults;
}
module.exports = spotifyConfig;
