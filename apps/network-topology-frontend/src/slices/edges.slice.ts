import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Edge } from "types/topology";

type EdgeState = {
  edges: Edge[];
  hasData: boolean;
  hasError: boolean;
};

const initialState: EdgeState = {
  edges: [],
  hasData: false,
  hasError: false,
};

const edgesSlice = createSlice({
  name: "edges",
  initialState,
  reducers: {
    updateEdges: (state, action: PayloadAction<Edge[]>) => {
      if (action.payload.length > 0) {
        state.edges = action.payload;
        state.hasData = true;
      }
    },
  },
});

export const { updateEdges } = edgesSlice.actions;
export const edgesReducer = edgesSlice.reducer;
