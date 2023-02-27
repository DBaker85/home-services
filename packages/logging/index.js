const { outputFileSync } = require("fs-extra");
const { join } = require("path");

const errorLogger = /*#__PURE__*/ ({ err, appName }) => {
  const date = new Date();
  const logname = `${appName}_error-log_${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.log`;
  console.error(err);
  outputFileSync(join("logs", logname), JSON.stringify(err));
};

module.exports = {
  errorLogger,
};
