"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Username =
  exports.Unit =
  exports.Status =
  exports.SensorType =
  exports.SensorKey =
  exports.PercpuKey =
  exports.DiskioKey =
    void 0;
let DiskioKey;
exports.DiskioKey = DiskioKey;

(function (DiskioKey) {
  DiskioKey["DiskName"] = "disk_name";
})(DiskioKey || (exports.DiskioKey = DiskioKey = {}));

let PercpuKey;
exports.PercpuKey = PercpuKey;

(function (PercpuKey) {
  PercpuKey["CPUNumber"] = "cpu_number";
})(PercpuKey || (exports.PercpuKey = PercpuKey = {}));

let Status;
exports.Status = Status;

(function (Status) {
  Status["I"] = "I";
  Status["R"] = "R";
  Status["S"] = "S";
})(Status || (exports.Status = Status = {}));

let Username;
exports.Username = Username;

(function (Username) {
  Username["Messagebus"] = "messagebus";
  Username["Postfix"] = "postfix";
  Username["RPC"] = "_rpc";
  Username["Root"] = "root";
  Username["SystemdTimesync"] = "systemd-timesync";
  Username["WWWData"] = "www-data";
})(Username || (exports.Username = Username = {}));

let SensorKey;
exports.SensorKey = SensorKey;

(function (SensorKey) {
  SensorKey["Label"] = "label";
})(SensorKey || (exports.SensorKey = SensorKey = {}));

let SensorType;
exports.SensorType = SensorType;

(function (SensorType) {
  SensorType["TemperatureCore"] = "temperature_core";
})(SensorType || (exports.SensorType = SensorType = {}));

let Unit;
exports.Unit = Unit;

(function (Unit) {
  Unit["C"] = "C";
})(Unit || (exports.Unit = Unit = {}));
