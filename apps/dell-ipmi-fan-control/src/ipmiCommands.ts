import { ip, user, password } from "secrets/ipmi";
import { fanSpeedToHex } from "./utils";

/**
 *  Manual mode

    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw 0x30 0x30 0x01 0x00

    auto mode 

    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw 0x30 0x30 0x01 0x01

    80%
    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw 0x30 0x30 0x02 0xff 0x50

    Fan 3 10% 
    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw 0x30 0x30 0x02 0x02 0x0a
 * 
 */

const ipmiCommand = `ipmitool -I lanplus -H ${ip} -U ${user} -P ${password}`;

const fanCommand = `raw 0x30 0x30`;

const manualMode = `${fanCommand} 0x01 0x00`;

const autoMode = `${fanCommand} 0x01 0x01`;

export enum FanNumber {
  ALL = "0xff",
  NOCTUA_ONE = "0x00",
  NOCTUA_TWO = "0x01",
  NIDEC_THREE = "0x02",
  NOCTUA_FOUR = "0x03",
  NOCTUA_FIVE = "0x04",
}

export const createFanSpeedCommand = ({
  fanNumber,
  speed,
}: {
  fanNumber: FanNumber;
  speed: number;
}): string =>
  `${ipmiCommand} ${fanCommand} 0x02 ${fanNumber} ${fanSpeedToHex(speed)}`;

export const autoModeCommand = `${ipmiCommand} ${manualMode}`;

export const manualModeCommand = `${ipmiCommand} ${autoMode}`;

export const ambientTempCommand = `${ipmiCommand} sensor | grep "Ambient Temp" | awk '{print $4}'`;
