const { writeFileSync } = require("fs");

export const errorLogger = /*#__PURE__*/ ({ err, appName }) => {
  const date = new Date();
  const logname = `${appName}_error-log_${date.getDate()}-${date.getMonth()}-${date.getUTCFullYear()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.log`;
  console.error(err);
  writeFileSync(logname, JSON.stringify(err));
};
