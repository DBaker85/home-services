import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TreeNode } from "types/topology";

type TopologyState = {
  topology: TreeNode | object;
  hasData: boolean;
};

const initialState: TopologyState = {
  topology: {},
  hasData: false,
};

const topologySlice = createSlice({
  name: "topology",
  initialState,
  reducers: {
    updateTopology: (state, action: PayloadAction<TreeNode>) => {
      if (Object.keys(action.payload).length > 0) {
        state.topology = action.payload;
        state.hasData = true;
      }
    },
  },
});

export const { updateTopology } = topologySlice.actions;
export const topologyReducer = topologySlice.reducer;
