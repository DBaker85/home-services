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

const cpuWarmThreshold = 55;
const cpuHotThreshold = 70;

let tempAlert = false;

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
        if (sendingCommands) {
          return;
        }

        if (!tempAlert) {
          if (cpuTemp > cpuWarmThreshold && cpuTemp < cpuHotThreshold) {
            // cpu warm ramp up noctuas 100 and nidec 10
            console.log(`Cpu threshold ${red("Exceeded")}, ramping up fans`);
            tempAlert = true;
            sendingCommands = true;
            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NOCTUA_TWO,
                speed: 100,
              })
            );
            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NOCTUA_FOUR,
                speed: 100,
              })
            );
            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NIDEC_THREE,
                speed: 10,
              })
            );

            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NOCTUA_ONE,
                speed: 100,
              })
            );
            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NOCTUA_FIVE,
                speed: 100,
              })
            );
            sendingCommands = false;
          }

          if (cpuTemp > cpuHotThreshold) {
            //  cpu hot ramp up noctuas 100 and nidec to 60

            console.log(
              `Cpu upper threshold ${red("Exceeded")}, ramping up fans`
            );
            tempAlert = true;
            sendingCommands = true;
            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NIDEC_THREE,
                speed: 50,
              })
            );

            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NOCTUA_TWO,
                speed: 100,
              })
            );

            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NOCTUA_FOUR,
                speed: 100,
              })
            );

            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NOCTUA_ONE,
                speed: 100,
              })
            );
            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NOCTUA_FIVE,
                speed: 100,
              })
            );
            sendingCommands = false;
          }
        }
        if (tempAlert && cpuTemp < cpuWarmThreshold) {
          //  cpu normal go to noctuas 70 and nidec 5
          console.log(
            `Cpu temperatures within safe limits, setting ${cyan("Idle")} mode`
          );
          sendingCommands = true;
          console.log(`Setting ${cyan("Fan 3")} to ${green("5%")}`);

          execSync(
            createFanSpeedCommand({
              fanNumber: FanNumber.NOCTUA_ONE,
              speed: 70,
            })
          );
          execSync(
            createFanSpeedCommand({
              fanNumber: FanNumber.NOCTUA_TWO,
              speed: 70,
            })
          );
          execSync(
            createFanSpeedCommand({
              fanNumber: FanNumber.NIDEC_THREE,
              speed: 5,
            })
          );
          execSync(
            createFanSpeedCommand({
              fanNumber: FanNumber.NOCTUA_FOUR,
              speed: 70,
            })
          );
          execSync(
            createFanSpeedCommand({
              fanNumber: FanNumber.NOCTUA_FIVE,
              speed: 70,
            })
          );
          tempAlert = false;
          sendingCommands = false;
        }
      });
  } catch (err) {
    errorLogger({ err, appName: "dell-ipmi-fan-control" });
    spinner.fail(err as string);
    process.exit(1);
  }
})();
