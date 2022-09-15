"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _koa = _interopRequireDefault(require("koa"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _child_process = require("child_process");

var _util = _interopRequireDefault(require("util"));

var _secrets = require("../secrets.json");

const exec = _util.default.promisify(_child_process.exec);

const ipmiCommand = `ipmitool -I lanplus -H ${_secrets.IpmiIp} -U ${_secrets.IpmiUser} -P ${_secrets.IpmiPassword} delloem powermonitor powerconsumptionhistory | grep "Average Power Consumption" | awk '{print $4}'`;
const app = new _koa.default();
const router = new _koaRouter.default();
router.get("server-power", "/api/server-power", async (context) => {
  const response = await exec(ipmiCommand);
  const power = +response.stdout;
  context.body = {
    power,
    unit: "W",
  };
});
router.get("root", "/", (context) => {
  context.throw(500, "Sample error message");
});
app.use(router.routes()).use(router.allowedMethods());
app.listen(5878);
console.log("app running on port 5878");
