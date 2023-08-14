import { execSync } from "child_process";
import fetch from "node-fetch";

import { timer } from "rxjs";
import { concatMap } from "rxjs/operators";
import ora from "ora";
import { cyan, green, red, yellow } from "chalk";

import { logToConsole, logToFile } from "logging";

import { manualModeCommand } from "./ipmiCommands";
import { getHighestCoreTemp } from "./utils";
import {
  idleCommandSet,
  warningCommandSet,
  alertCommandSet,
} from "./fanSpeedCommands";

const cpuWarmThreshold = 55;
const cpuHotThreshold = 70;

let tempAlert = false;

let sendingCommands = false;

const appName = "dell-ipmi-fan-control";

const spinner = ora(`[${appName}] - Begin monitoring`);
const errorLogger = logToFile(appName);
const consoleLogger = logToConsole(appName);

(() => {
  try {
    consoleLogger.log(`Config found, Initializing control`);
    sendingCommands = true;
    consoleLogger.log(`Setting ${cyan("Manual")} mode`);
    execSync(manualModeCommand);
    consoleLogger.log(`Setting ${green("idle")} fan mode`);
    idleCommandSet();

    sendingCommands = false;
    spinner.start();

    timer(1, 5000)
      .pipe(
        concatMap(async () => {
          const res = await fetch(
            `http://${process.env.GLANCES_IP as string}:${
              process.env.GLANCES_PORT as string
            }/api/3/all`,
            {
              method: "GET",
            }
          );
          const json = await res.json();
          return { cpuTemp: getHighestCoreTemp(json) };
        })
      )
      .subscribe(({ cpuTemp }) => {
        if (sendingCommands) {
          return;
        }

        if (!tempAlert) {
          if (cpuTemp > cpuWarmThreshold && cpuTemp < cpuHotThreshold) {
            // cpu warm ramp up noctuas 100 and nidec 10
            consoleLogger.log(
              `Cpu temp is ${cpuTemp} - ${yellow(
                "warning"
              )}, ramping up fans to MEDIUM`
            );
            tempAlert = true;
            sendingCommands = true;
            warningCommandSet();
            sendingCommands = false;
          }

          if (cpuTemp > cpuHotThreshold) {
            //  cpu hot ramp up noctuas 100 and nidec to 60

            consoleLogger.log(
              `Cpu temp is ${cpuTemp} - ${red(
                "alert"
              )}, ramping up fans to HIGH`
            );
            tempAlert = true;
            sendingCommands = true;
            alertCommandSet();
            sendingCommands = false;
          }
        }
        if (tempAlert && cpuTemp < cpuWarmThreshold) {
          //  cpu normal go to noctuas 70 and nidec 5
          consoleLogger.log(
            `Cpu temperature is ${cpuTemp} - within safe limits, setting fans to ${cyan(
              "Idle"
            )} mode`
          );
          sendingCommands = true;
          idleCommandSet();
          tempAlert = false;
          sendingCommands = false;
        }
      });
  } catch (err) {
    errorLogger.error(err);
    spinner.fail(err as string);
    process.exit(1);
  }
})();
