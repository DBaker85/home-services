import { execSync, exec as ChildExec } from "child_process";
import fetch from "node-fetch";
import util from "util";

import { timer } from "rxjs";
import { concatMap } from "rxjs/operators";
import ora from "ora";
import { cyan, green, red } from "chalk";

import {
  manualModeCommand,
  createFanSpeedCommand,
  FanNumber,
  ambientTempCommand,
} from "./ipmiCommands";
import { getHighestTemp } from "./utils";

import { ip as glancesIp } from "secrets/glances";

const exec = util.promisify(ChildExec);

const cpuThreshold = 60;
let cpuHotAlert = false;

const ambientThreshold = 40;
let ambientHotAlert = false;

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

          const response = await exec(ambientTempCommand);
          const ambientTemp = +response.stdout;

          return { cpuTemp: getHighestTemp(json), ambientTemp };
        })
      )
      .subscribe(({ cpuTemp, ambientTemp }) => {
        if (!sendingCommands) {
          if (!cpuHotAlert && cpuTemp > cpuThreshold) {
            console.log(`Cpu threshold ${red("Exceeded")}, ramping up fans`);
            cpuHotAlert = true;
            sendingCommands = true;
            execSync(
              createFanSpeedCommand({
                fanNumber: FanNumber.NIDEC_THREE,
                speed: 50,
              })
            );
            sendingCommands = false;
          }

          if (!ambientHotAlert && ambientTemp > ambientThreshold) {
            console.log(
              `Ambient threshold ${red("Exceeded")}, ramping up fans`
            );
            ambientHotAlert = true;
            sendingCommands = true;
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

            sendingCommands = false;
          }

          if (ambientHotAlert && cpuTemp < cpuThreshold) {
            console.log(
              `Ambient temperatures within safe limits, setting ${cyan(
                "Idle"
              )} mode`
            );
            sendingCommands = true;
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
            ambientHotAlert = false;
            sendingCommands = false;
          }

          if (cpuHotAlert && cpuTemp < cpuThreshold) {
            console.log(
              `Cpu temperatures within safe limits, setting ${cyan(
                "Idle"
              )} mode`
            );
            sendingCommands = true;
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
            cpuHotAlert = false;
            sendingCommands = false;
          }
        }
      });
  } catch (err) {
    console.error(err);
    spinner.fail(err as string);
    process.exit(1);
  }
})();
