import { type TopologyObject, type Edge } from "types/topology";

export const applyOverrides = (
  data: TopologyObject[],
  overrides: TopologyObject[]
): TopologyObject[] => {
  const newData = [...data];
  overrides.forEach((override) => {
    const index = data.findIndex((item) => item.mac === override.mac);
    if (index > -1) {
      if (override.model !== undefined) {
        newData[index].model = override.model;
      }
      if (override.parent !== undefined) {
        newData[index].parent = override.parent;
      }
    }
  });
  return newData;
};

export const applyEdgeOverrides = (data: Edge[], overrides: Edge[]): Edge[] => {
  const newData = [...data];
  overrides.forEach((override) => {
    const index = data.findIndex(
      (item) =>
        item.downlinkMac === override.downlinkMac &&
        item.uplinkMac === override.uplinkMac
    );
    if (index > -1) {
      if (override.essid !== undefined) {
        newData[index].essid = override.essid;
      }
    }
  });
  return newData;
};
