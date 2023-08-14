import Koa from "koa";
import KoaRouter from "koa-router";
import { exec as ChildExec } from "child_process";
import util from "util";
import { logToConsole } from "logging";

const appName = "dell-ipmi-fan-control";
const consoleLogger = logToConsole(appName);
const port = 8080;
const exec = util.promisify(ChildExec);

const ipmiCommand = `ipmitool -I lanplus -H ${
  process.env.IPMI_IP as string
} -U ${process.env.IPMI_USER as string} -P ${
  process.env.IPMI_PASSWORD as string
} delloem powermonitor powerconsumptionhistory | grep "Average Power Consumption" | awk '{print $4}'`;

const app = new Koa();
const router = new KoaRouter();

router.get("server-power", "/api/server-power", async (context) => {
  const response = await exec(ipmiCommand);
  const power = +response.stdout;
  context.body = { power, unit: "W" };
});

router.get("root", "/", (context) => {
  context.body = "Api available on /api/server-power";
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(port);
consoleLogger.log(`running on port ${port}`);
