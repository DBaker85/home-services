import { execSync } from "child_process";
import fetch from "node-fetch";

import { timer } from "rxjs";
import { concatMap } from "rxjs/operators";
import ora from "ora";
import { cyan, green, red } from "chalk";

import { ip as glancesIp } from "secrets/glances";
import { errorLogger } from "logging";

import {
  manualModeCommand,
  createFanSpeedCommand,
  FanNumber,
} from "./ipmiCommands";
import { getHighestTemp } from "./utils";

const cpuThreshold = 60;
let cpuHotAlert = false;

let sendingCommands = false;

const spinner = ora("Begin monitoring");

(() => {
  try {
    console.log(`Config found, Initializing control`);
    sendingCommands = true;
    console.log(`Setting ${cyan("Manual")} mode`);
    execSync(manualModeCommand);
    console.log(`Setting ${cyan("Fans")} to ${green("70%")}`);
    execSync(
      createFanSpeedCommand({
        fanNumber: FanNumber.ALL,
        speed: 70,
      })
    );
    console.log(`Setting ${cyan("Fan 3")} to ${green("5%")}`);
    execSync(
      createFanSpeedCommand({
        fanNumber: FanNumber.NIDEC_THREE,
        speed: 5,
      })
    );

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
        if (!sendingCommands) {
          if (!cpuHotAlert && cpuTemp > cpuThreshold) {
            console.log(`Cpu threshold ${red("Exceeded")}, ramping up fans`);
            cpuHotAlert = true;
            sendingCommands = true;
            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NIDEC_THREE,
                speed: 60,
              })
            );
            sendingCommands = false;
          }

          if (cpuHotAlert && cpuTemp < cpuThreshold) {
            console.log(
              `Cpu temperatures within safe limits, setting ${cyan(
                "Idle"
              )} mode`
            );
            sendingCommands = true;
            console.log(`Setting ${cyan("Fan 3")} to ${green("5%")}`);
            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NIDEC_THREE,
                speed: 5,
              })
            );
            cpuHotAlert = false;
            sendingCommands = false;
          }
        }
      });
  } catch (err) {
    errorLogger({ err, appName: "dell-ipmi-fan-control" });
    spinner.fail(err as string);
    process.exit(1);
  }
})();
