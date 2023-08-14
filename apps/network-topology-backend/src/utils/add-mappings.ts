import { type Edge, type TopologyObject } from "types/topology";

export const addMappings = (
  data: TopologyObject[],
  addtionalMaps: TopologyObject[]
): TopologyObject[] => [...data, ...addtionalMaps];

export const addEdgeMappings = (
  data: Edge[],
  addtionalEdges: Edge[]
): Edge[] => [...data, ...addtionalEdges];
