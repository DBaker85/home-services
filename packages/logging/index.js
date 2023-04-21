const { outputFileSync } = require("fs-extra");
const { join } = require("path");

const getFormattedDateStamp = /*#__PURE__*/ () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${day}-${month}-${year}-${hour}-${minute}-${seconds}`;
};

const logToFile = (appName) => {
  const logger = logToConsole(appName);
  const error = (err) => {
    const dateStamp = getFormattedDateStamp();
    logger.error(err, dateStamp);
    const logname = `${appName}_error-log_${dateStamp}.log`;
    outputFileSync(join("logs", logname), JSON.stringify(err));
  };
  return { error };
};

const logToConsole = (appName) => {
  const logPrefix = `[${appName}] - `;
  const log = (msg, dateStamp = getFormattedDateStamp()) => {
    console.log(`${logPrefix}${dateStamp} : ${msg}`);
  };
  const warn = (msg, dateStamp = getFormattedDateStamp()) => {
    console.warn(`${logPrefix}${dateStamp} : ${msg}`);
  };
  const error = (msg, dateStamp = getFormattedDateStamp()) => {
    console.error(`${logPrefix}${dateStamp} : ${msg}`);
  };

  return { log, warn, error };
};

module.exports = {
  logToFile,
  logToConsole,
};
