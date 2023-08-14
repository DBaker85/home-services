import Koa, { type BaseContext as Context } from "koa";
import KoaRouter from "koa-router";
import { Server } from "socket.io";
import { timer } from "rxjs";
import { concatMap } from "rxjs/operators";
import { logToConsole } from "logging";
import { connect, connection, model, Schema } from "mongoose";
import { type DhcpData, SocketEvents } from "types/topology";

import { unifiTopologyUrl, unifiClient } from "./unifiClient";
import {
  type PreparedTopologyType,
  prepareTopology,
} from "./utils/prepare-topology";
import { buildTree } from "./utils/build-tree";
import { pfSenseClient, pfSenseDHCPleaseUrl } from "./pfsenseClient";
import { mapDhcpdata } from "./utils/map-dhcp-data";

const appName = "network-topology-backend";
const consoleLogger = logToConsole(appName);

const port = 8080;
const app = new Koa();
const router = new KoaRouter();

connect(
  `mongodb://${process.env.MONGO_IP as string}:${
    process.env.MONGO_PORT as string
  }/${process.env.MONGO_DB as string}`,
  {
    ssl: false,
    directConnection: true,
    readPreference: "primary",
  }
).catch((err) => {
  console.log(err);
});

const OverridesSchema = new Schema({
  parent: String,
  mac: String,
  name: String,
  model: String,
  id: String,
});

const EdgeOverridesSchema = new Schema({
  uplinkMac: String,
  downlinkMac: String,
  essid: String,
});

let topologyOverrides: {
  overrides: any[];
  addtionalMaps: any[];
  edgeOverrides: any[];
  addtionalEdges: any[];
};

const overridedb = model("overrides", OverridesSchema);
const additionalMapdb = model("additional-maps", OverridesSchema);
const edgeOverridedb = model("edge-overrides", EdgeOverridesSchema);
const additionalEdgedb = model("additional-edges", EdgeOverridesSchema);
// const macIDdb = model("macs", MacSchema);

const getDBData = async (): Promise<void> => {
  const overrides = await overridedb.find();
  const addtionalMaps = await additionalMapdb.find();
  const edgeOverrides = await edgeOverridedb.find();
  const addtionalEdges = await additionalEdgedb.find();

  topologyOverrides = {
    overrides,
    addtionalMaps,
    edgeOverrides,
    addtionalEdges,
  };
};

// eslint-disable-next-line @typescript-eslint/no-misused-promises
connection.once("open", async (): Promise<void> => {
  console.log("connected to database");
  try {
    await getDBData();
  } catch (err) {
    console.log(err);
  }
});
connection.on("error", console.error);

router.get("root", "/", (context: Context) => {
  context.body = `Websocket server running at ${port}`;
});

app.use(router.routes()).use(router.allowedMethods());
const httpServer = app.listen(port);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const connectedClients = new Set();

const sendEventToConnectedClients = (event: string, data: any): void => {
  if (connectedClients.size === 0) {
    return; // No connected clients, nothing to do
  }

  connectedClients.forEach((clientId) => {
    console.log("sending data to client", clientId);
    // console.log("data", data);
    io.to(clientId as string).emit(event, data);
  });
};

io.on(SocketEvents.CONNECT, (socket) => {
  console.log("client connected");
  const clientId = socket.id;
  if (connectedClients.has(clientId)) {
    // Client is already connected, handle accordingly
    return;
  }
  connectedClients.add(clientId);
  // unfi after 1 second then every 5 seconds
  const unifiTimer = timer(1000, 5000)
    .pipe(
      concatMap(async () => {
        try {
          const unifiResponse = await unifiClient.get(unifiTopologyUrl);
          const topologyResp = await prepareTopology({
            data: unifiResponse.data,
            topologyData: topologyOverrides,
          });
          const { topology, edges } = topologyResp as PreparedTopologyType;

          const topologyTree = buildTree(topology);
          return { topologyTree, edges };
        } catch {
          return new Error("Error fetching data from Unifi");
        }
      })
    )
    .subscribe((topologyData) => {
      if (topologyData instanceof Error) {
        sendEventToConnectedClients(SocketEvents.ERROR, topologyData.message);
        return;
      }
      const { topologyTree, edges } = topologyData;

      sendEventToConnectedClients(SocketEvents.TOPOLOGY, topologyTree);
      sendEventToConnectedClients(SocketEvents.EDGES, edges);
    });

  // pfsense after 1 second then every 5 mins
  const pfSenseTimer = timer(1000, 300000)
    .pipe(
      concatMap(async () => {
        try {
          const dhcpRespponse = await pfSenseClient.get(pfSenseDHCPleaseUrl);
          return mapDhcpdata(dhcpRespponse.data.data as DhcpData[]);
        } catch (error) {
          console.log(error);
          return new Error("Error fetching data from pfSense");
        }
      })
    )
    .subscribe((dhcpData) => {
      if (dhcpData instanceof Error) {
        sendEventToConnectedClients(SocketEvents.ERROR, dhcpData.message);
        return;
      }
      sendEventToConnectedClients(SocketEvents.DHCP, dhcpData);
    });

  // cancel the timer when client disconnects
  socket.on(SocketEvents.DISCONNECT, () => {
    console.log(`client disconnected : ${socket.id}`);
    // Remove client from the connected clients collection
    connectedClients.delete(clientId);
    // cancel the timers if no clients are connected
    if (connectedClients.size === 0) {
      unifiTimer.unsubscribe();
      pfSenseTimer.unsubscribe();
    }
  });
});

consoleLogger.log(`running on port ${port}`);
consoleLogger.log(`websocket on port ${port}`);
