import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomTreeNodeDatum } from "../utils";
import { TreeNodeMeta } from "types/topology";

type UiState = {
  selectedMac: string;
  data: {
    name: string;
    meta: TreeNodeMeta;
  };
  drawerOpen: boolean;
};

const initialState: UiState = {
  selectedMac: "",
  drawerOpen: false,
  data: {
    name: "",
    meta: {},
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    selectDevice: (state, action: PayloadAction<CustomTreeNodeDatum>) => {
      if (action.payload.mac !== "") {
        state.selectedMac = action.payload.mac;
        state.data = {
          name: action.payload.name,
          meta: action.payload.meta,
        };
        state.drawerOpen = true;
      }
    },
    closeDrawer: (state) => {
      console.log("ui/close drawer");
      state.drawerOpen = false;
    },
  },
});

export const { selectDevice, closeDrawer } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
