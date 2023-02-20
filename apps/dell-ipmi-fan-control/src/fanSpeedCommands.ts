import { execSync } from "child_process";
import { createFanSpeedCommand, FanNumber } from "./ipmiCommands";

export const idleCommandSet = (): void => {
  execSync(
    createFanSpeedCommand({
      fanNumber: FanNumber.NIDEC_THREE,
      speed: 5,
    })
  );
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
};

export const warningCommandSet = (): void => {
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
  execSync(
    createFanSpeedCommand({
      fanNumber: FanNumber.NIDEC_THREE,
      speed: 10,
    })
  );
};

export const alertCommandSet = (): void => {
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
};
