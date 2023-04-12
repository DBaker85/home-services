import { execSync } from "child_process";
import fetch from "node-fetch";

import { timer } from "rxjs";
import { concatMap } from "rxjs/operators";
import ora from "ora";
import { cyan, green, red, yellow } from "chalk";

import { ip as glancesIp } from "secrets/glances";
import { errorLogger } from "logging";

import { manualModeCommand } from "./ipmiCommands";
import { getHighestTemp } from "./utils";
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

(() => {
  try {
    console.log(`Config found, Initializing control`);
    sendingCommands = true;
    console.log(`Setting ${cyan("Manual")} mode`);
    execSync(manualModeCommand);
    console.log(`Setting ${green("idle")} fan mode`);
    idleCommandSet();

    sendingCommands = false;
    spinner.start();

    timer(1, 5000)
      .pipe(
        concatMap(async () => {
          const res = await fetch(`http://${glancesIp}/api/3/all`, {
            method: "GET",
          });
          const json = await res.json();
          return { cpuTemp: getHighestTemp(json) };
        })
      )
      .subscribe(({ cpuTemp }) => {
        if (sendingCommands) {
          return;
        }

        if (!tempAlert) {
          if (cpuTemp > cpuWarmThreshold && cpuTemp < cpuHotThreshold) {
            // cpu warm ramp up noctuas 100 and nidec 10
            console.log(`Cpu temp ${yellow("warning")}, ramping up fans`);
            tempAlert = true;
            sendingCommands = true;
            warningCommandSet();
            sendingCommands = false;
          }

          if (cpuTemp > cpuHotThreshold) {
            //  cpu hot ramp up noctuas 100 and nidec to 60

            console.log(`Cpu temp ${red("alert")}, ramping up fans`);
            tempAlert = true;
            sendingCommands = true;
            alertCommandSet();
            sendingCommands = false;
          }
        }
        if (tempAlert && cpuTemp < cpuWarmThreshold) {
          //  cpu normal go to noctuas 70 and nidec 5
          console.log(
            `Cpu temperatures within safe limits, setting ${cyan("Idle")} mode`
          );
          sendingCommands = true;
          console.log(`Setting ${green("idle")} fan mode`);
          idleCommandSet();
          tempAlert = false;
          sendingCommands = false;
        }
      });
  } catch (err) {
    errorLogger({ err, appName });
    spinner.fail(err as string);
    process.exit(1);
  }
})();
