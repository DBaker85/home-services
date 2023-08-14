export interface TreeNodeMeta {
  model?: string;
}

export interface TreeNode {
  name: string;
  mac: string;
  children?: TreeNode[];
  meta: TreeNodeMeta;
}
