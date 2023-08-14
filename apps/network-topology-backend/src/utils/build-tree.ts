import { type TopologyObject, type TreeNode } from "types/topology";

const findRootNode = (data: TopologyObject[]): TreeNode | null => {
  const uniqueMacSet = new Set(data.map((item) => item.mac));
  for (const item of data) {
    if (item.parent !== undefined && !uniqueMacSet.has(item.parent)) {
      return {
        name: item.name,
        mac: item.mac,
        meta: {
          model: item.model !== undefined ? item.model : "DEFAULT",
        },
      };
    }
  }
  return null;
};

const buildTreeHelper = (
  data: TopologyObject[],
  parentNode: TreeNode
): void => {
  const children: TreeNode[] = [];

  data.forEach((item) => {
    if (item.parent === parentNode.mac) {
      const childNode: TreeNode = {
        name: item.name,
        mac: item.mac,
        meta: {
          model: item.model !== undefined ? item.model : "DEFAULT",
        },
      };
      buildTreeHelper(data, childNode);
      children.push(childNode);
    }
  });

  if (children.length > 0) {
    parentNode.children = children;
  }
};

export const buildTree = (data: TopologyObject[]): TreeNode | null => {
  const rootNode: TreeNode | null = findRootNode(data);
  if (rootNode != null) {
    buildTreeHelper(data, rootNode);
  }
  return rootNode;
};
