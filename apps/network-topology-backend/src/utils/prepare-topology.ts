import { type Edge, type Topology, type TopologyObject } from "types/topology";
import { addMappings, addEdgeMappings } from "./add-mappings";
import { unifiTopologyMapper } from "./map-topology";
import { applyOverrides, applyEdgeOverrides } from "./apply-overrides";

export interface PreparedTopologyType {
  topology: TopologyObject[];
  edges: Edge[];
}

export const prepareTopology = async ({
  data,
  topologyData: { overrides, addtionalMaps, edgeOverrides, addtionalEdges },
}: {
  data: Topology;
  topologyData: {
    overrides: TopologyObject[];
    addtionalMaps: TopologyObject[];
    edgeOverrides: Edge[];
    addtionalEdges: Edge[];
  };
}): Promise<PreparedTopologyType | any> => {
  try {
    let preparedTopologyData = [];
    let preparedEdgeData = [];

    const rawTopology = unifiTopologyMapper(data);
    const completeTopology = addMappings(rawTopology, addtionalMaps);
    const topologyWithOverrides = applyOverrides(completeTopology, overrides);
    preparedTopologyData = topologyWithOverrides;

    const completeEdges = addEdgeMappings(data.edges, addtionalEdges);
    const edgesWithOverrides = applyEdgeOverrides(completeEdges, edgeOverrides);
    preparedEdgeData = edgesWithOverrides;

    return { topology: preparedTopologyData, edges: preparedEdgeData };
  } catch (error) {
    console.log(error);
    return error;
  }
};
