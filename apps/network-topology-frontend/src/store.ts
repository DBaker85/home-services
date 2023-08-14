import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { topologySocketMiddleware } from "./topology-socket.middleware";

import { socketReducer } from "./slices/socket.slice";
import { topologyReducer } from "./slices/topology.slice";
import { edgesReducer } from "./slices/edges.slice";
import { dhcpReducer } from "./slices/dhcp.slice";
import { uiReducer } from "./slices";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    socket: socketReducer,
    topology: topologyReducer,
    edges: edgesReducer,
    dhcp: dhcpReducer,
    ui: uiReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(topologySocketMiddleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
