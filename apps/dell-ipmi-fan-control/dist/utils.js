"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getHighestTemp = void 0;

var _types = require("./types");

const getHighestTemp = (json) => {
  const cpuTemps = json.sensors.filter(
    (sensor) => sensor.type === _types.SensorType.TemperatureCore
  );
  const maxValue = Math.max.apply(
    Math,
    cpuTemps.map((temp) => temp.value)
  );
  return isFinite(maxValue) ? maxValue : 0;
};

exports.getHighestTemp = getHighestTemp;
