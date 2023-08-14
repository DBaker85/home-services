import { type Topology, type TopologyObject } from "types/topology";

export const unifiTopologyMapper = (topology: Topology): TopologyObject[] =>
  (
    topology.vertices.map((vertex) => {
      const parent = topology.edges.find(
        (edge) => edge.downlinkMac === vertex.mac
      );
      const child = topology.edges.find(
        (edge) => edge.uplinkMac === vertex.mac
      );
      // if from and to are null return false
      if (parent == null && child == null) {
        return false;
      }

      return {
        parent: parent != null ? parent.uplinkMac.toLowerCase() : null,
        mac: vertex.mac.toLowerCase(),
        name: vertex.name,
        model: vertex.model !== undefined ? vertex.model : null,
      };
    }) as TopologyObject[]
  ).filter(Boolean);
