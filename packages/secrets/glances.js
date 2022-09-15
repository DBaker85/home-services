const defaults = {
  ip: "0.0.0.0",
};
let glancesConfig;
try {
  const localconf = require("./glances.local.json");
  glancesConfig = {
    ip: localconf?.ip || defaults.ip,
  };
} catch {
  glancesConfig = defaults;
}
module.exports = glancesConfig;
