import { createSlice } from "@reduxjs/toolkit";

interface SocketState {
  isEstablishingConnection: boolean;
  isConnected: boolean;
}

const initialState: SocketState = {
  isEstablishingConnection: false,
  isConnected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    startConnecting: (state) => {
      state.isEstablishingConnection = true;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
      state.isEstablishingConnection = false;
    },
  },
});

export const { startConnecting, connectionEstablished } = socketSlice.actions;
export const socketReducer = socketSlice.reducer;
