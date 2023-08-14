import { TreeLinkDatum, Orientation } from "types/react-d3-tree";
import { HierarchyPointNode } from "d3-hierarchy";
import { CustomTreeNodeDatum } from "./types";
import { Edge } from "types/topology";

export interface CustomTreeLinkDatum extends TreeLinkDatum {
  source: HierarchyPointNode<CustomTreeNodeDatum>;
  target: HierarchyPointNode<CustomTreeNodeDatum>;
}

// PathFunction: (link: TreeLinkDatum, orientation: Orientation) => string
export type GetDynamicPathClassProps = {
  link: CustomTreeLinkDatum;
  edges: Edge[];
  orientation?: Orientation;
};

export const getDynamicPathClass = ({
  link,
  edges,
}: GetDynamicPathClassProps) => {
  const { source, target } = link;
  const topologyLink = edges.find(
    (edge) =>
      edge.uplinkMac === source.data.mac && edge.downlinkMac === target.data.mac
  );
  if (topologyLink && topologyLink.essid) {
    if (topologyLink.essid.endsWith("iot")) {
      return `link link-iot`;
    }
    if (topologyLink.essid.endsWith("guest")) {
      return `link link-guest`;
    }
    if (topologyLink.essid.endsWith("cam")) {
      return `link link-cam`;
    }
  }
  return `link`;
};
