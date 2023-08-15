import { io, Socket } from "socket.io-client";
import { Middleware } from "redux";
import { Edge, MappedDhcpData, SocketEvents, TreeNode } from "types/topology";

import { connectionEstablished, startConnecting } from "./slices/socket.slice";
import { updateEdges } from "./slices/edges.slice";
import { updateLeases } from "./slices/dhcp.slice";
import { updateTopology } from "./slices/topology.slice";

export const topologySocketMiddleware: Middleware = (store) => {
  let socket: Socket;
  let isSubscribed = false; // Track if the subscription is already made
  let isConnecting = false; // Track if the connection is already being established

  return (next) => (action) => {
    const isConnectionEstablished =
      socket && store.getState().socket.isConnected;

    if (
      !isConnectionEstablished &&
      !isConnecting &&
      startConnecting.match(action)
    ) {
      isConnecting = true;
      socket = io(
        `https://${import.meta.env.VITE_WS_IP}:${import.meta.env.VITE_WS_PORT}`,
        {
          withCredentials: false,
        }
      );

      socket.on("connect", () => {
        isConnecting = false;
        store.dispatch(connectionEstablished());

        if (!isSubscribed) {
          socket.on(SocketEvents.TOPOLOGY, (topology: TreeNode) => {
            store.dispatch(updateTopology(topology));
          });

          socket.on(SocketEvents.EDGES, (edges: Edge[]) => {
            store.dispatch(updateEdges(edges));
          });

          socket.on(SocketEvents.DHCP, (leases: MappedDhcpData[]) => {
            store.dispatch(updateLeases(leases));
          });

          isSubscribed = true;
        }
      });
    }

    next(action);
  };
};
