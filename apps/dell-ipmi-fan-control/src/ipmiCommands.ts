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

const ipmiCommand = `ipmitool -I lanplus -H ${
  process.env.IPMI_IP as string
} -U ${process.env.IPMI_USER as string} -P ${
  process.env.IPMI_PASSWORD as string
}`;

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
  `${ipmiCommand} ${fanCommand} 0x02 ${fanNumber} 0x${fanSpeedToHex(speed)}`;

export const autoModeCommand = `${ipmiCommand} ${autoMode}`;

export const manualModeCommand = `${ipmiCommand} ${manualMode}`;

export const ambientTempCommand = `${ipmiCommand} sensor reading "Ambient Temp" | awk '{print $4}'`;
