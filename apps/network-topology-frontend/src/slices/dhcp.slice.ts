import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MappedDhcpData } from "types/topology";

type DhcpState = {
  leases: MappedDhcpData[];
  hasData: boolean;
  hasError: boolean;
};

const initialState: DhcpState = {
  leases: [],
  hasData: false,
  hasError: false,
};

const dhcpSlice = createSlice({
  name: "dhcp",
  initialState,
  reducers: {
    updateLeases: (state, action: PayloadAction<MappedDhcpData[]>) => {
      if (action.payload.length > 0) {
        state.leases = action.payload;
        state.hasData = true;
      }
    },
  },
});

export const { updateLeases } = dhcpSlice.actions;
export const dhcpReducer = dhcpSlice.reducer;
