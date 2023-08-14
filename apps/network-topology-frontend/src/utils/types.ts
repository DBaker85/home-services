import { TreeNodeDatum } from "types/react-d3-tree";
import { TreeNode } from "types/topology";

export interface CustomTreeNodeDatum
  extends TreeNodeDatum,
    Omit<TreeNode, "children"> {}
