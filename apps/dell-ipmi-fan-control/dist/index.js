"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _child_process = require("child_process");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _ora = _interopRequireDefault(require("ora"));

var _chalk = require("chalk");

var _ipmiCommands = require("./ipmiCommands");

var _utils = require("./utils");

var _secrets = require("../secrets.json");

const tempThreshold = 60;
let automode = "on";
let sendingCommands = false;
const spinner = (0, _ora.default)("Begin monitoring");

(async () => {
  try {
    console.log(`Config found, Initializing control`);
    sendingCommands = true;
    console.log(`Setting ${(0, _chalk.cyan)("Manual")} mode`);
    (0, _child_process.execSync)(
      `ipmitool -I lanplus -H ${_secrets.IpmiIp} -U ${_secrets.IpmiUser} -P ${_secrets.IpmiPassword} ${_ipmiCommands.manualMode}`
    );
    console.log(
      `Setting ${(0, _chalk.cyan)("Fans")} to ${(0, _chalk.green)("15%")}`
    );
    (0, _child_process.execSync)(
      `ipmitool -I lanplus -H ${_secrets.IpmiIp} -U ${_secrets.IpmiUser} -P ${_secrets.IpmiPassword} ${_ipmiCommands.fanSpeed8}`
    );
    console.log(
      `Setting ${(0, _chalk.cyan)("Fan 5")} to ${(0, _chalk.green)("1%")}`
    );
    (0, _child_process.execSync)(
      `ipmitool -I lanplus -H ${_secrets.IpmiIp} -U ${_secrets.IpmiUser} -P ${_secrets.IpmiPassword} ${_ipmiCommands.fan5Off}`
    );
    automode = "off";
    sendingCommands = false;
    spinner.start();
    (0, _rxjs.timer)(1, 5000)
      .pipe(
        (0, _operators.concatMap)(async () => {
          const res = await (0, _nodeFetch.default)(
            `http://${_secrets.glancesIp}/api/3/all`,
            {
              method: "GET",
            }
          );
          const json = await res.json();
          return (0, _utils.getHighestTemp)(json);
        })
      )
      .subscribe((temp) => {
        if (sendingCommands === false) {
          if (automode === "off" && temp > tempThreshold) {
            console.log(
              `Threshold ${(0, _chalk.red)("Exceeded")}, setting ${(0,
              _chalk.yellowBright)("Auto")} mode`
            );
            sendingCommands = true;
            (0, _child_process.execSync)(
              `ipmitool -I lanplus -H ${_secrets.IpmiIp} -U ${_secrets.IpmiUser} -P ${_secrets.IpmiPassword} ${_ipmiCommands.autoMode}`
            );
            automode = "on";
            sendingCommands = false;
          }

          if (automode === "on" && temp < tempThreshold) {
            console.log(
              `Temperatures within safe limits, setting ${(0, _chalk.cyan)(
                "Manual"
              )} mode`
            );
            sendingCommands = true;
            (0, _child_process.execSync)(
              `ipmitool -I lanplus -H ${_secrets.IpmiIp} -U ${_secrets.IpmiUser} -P ${_secrets.IpmiPassword} ${_ipmiCommands.manualMode}`
            );
            console.log(
              `Setting ${(0, _chalk.cyan)("fans")} to ${(0, _chalk.green)(
                "15%"
              )}`
            );
            (0, _child_process.execSync)(
              `ipmitool -I lanplus -H ${_secrets.IpmiIp} -U ${_secrets.IpmiUser} -P ${_secrets.IpmiPassword} ${_ipmiCommands.fanSpeed8}`
            );
            console.log(
              `Setting ${(0, _chalk.cyan)("fan 5")} to ${(0, _chalk.green)(
                "1%"
              )}`
            );
            (0, _child_process.execSync)(
              `ipmitool -I lanplus -H ${_secrets.IpmiIp} -U ${_secrets.IpmiUser} -P ${_secrets.IpmiPassword} ${_ipmiCommands.fan5Off}`
            );
            automode = "off";
            sendingCommands = false;
          }
        }
      });
  } catch (err) {
    console.error(err);
    spinner.fail(err);
    process.exit(1);
  }
})();
