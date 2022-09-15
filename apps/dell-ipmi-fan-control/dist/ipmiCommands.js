"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.manualMode =
  exports.fanSpeed8 =
  exports.fanSpeed15 =
  exports.fan5Off =
  exports.autoMode =
    void 0;

/**
 *  Manual mode

    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw 0x30 0x30 0x01 0x00

    auto mode 

    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw 0x30 0x30 0x01 0x01

    15%
    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw 0x30 0x30 0x02 0xff 0x0f

    Fan 5 0% 
    ipmitool -I lanplus -H [ip] -U [user] -P [password] raw  0x30 0x30 0x02 0x04 0x00
 * 
 */
const manualMode = `raw 0x30 0x30 0x01 0x00`;
exports.manualMode = manualMode;
const autoMode = `raw 0x30 0x30 0x01 0x01`;
exports.autoMode = autoMode;
const fanSpeed15 = `raw 0x30 0x30 0x02 0xff 0x0f`;
exports.fanSpeed15 = fanSpeed15;
const fanSpeed8 = `raw 0x30 0x30 0x02 0xff 0x08`;
exports.fanSpeed8 = fanSpeed8;
const fan5Off = `raw 0x30 0x30 0x02 0x04 0x01`;
exports.fan5Off = fan5Off;
