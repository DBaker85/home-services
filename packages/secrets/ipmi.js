const defaults = {
  ip: "0.0.0.0",
  user: "username",
  password: "password",
};
let ipmiConfig;
try {
  const localconf = require("./ipmi.local.json");
  ipmiConfig = {
    ip: localconf?.ip || defaults.ip,
    user: localconf?.user || defaults.user,
    password: localconf?.password || defaults.password,
  };
} catch {
  ipmiConfig = defaults;
}
module.exports = ipmiConfig;
