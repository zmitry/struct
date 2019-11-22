import { upsertSet } from './helpers';

const ROOT_NODE = '_____root_graph_node_____';

export interface IHierarchy {
  addNode(node: string): void;
  setParent(node: string, parent: string): void;
  getParent(node: string): string;
  removeHierarchyNode(node: string): void;
  getChildren(node: string): string[];
}

export function createHierarchy(): IHierarchy {
  const hierarchyChildren = new Map<string, Set<string>>();
  const hierarchyParent = new Map<string, string>();

  const hierarchy: IHierarchy = {
    addNode(node: string) {
      hierarchy.setParent(node, ROOT_NODE);
    },
    setParent(node: string, parent: string = ROOT_NODE) {
      upsertSet(hierarchyChildren, parent, node);
      hierarchyParent.set(node, parent);
    },
    getParent(node: string): string {
      return hierarchyParent.get(node) || ROOT_NODE;
    },
    removeHierarchyNode(node: string) {
      if (node === ROOT_NODE) {
        return;
      }
      const parent = hierarchy.getParent(node);
      hierarchyParent.delete(node);
      const childSet = hierarchyChildren.get(parent);
      childSet?.delete(node);
    },
    getChildren(node: string = ROOT_NODE): string[] {
      return Array.from(hierarchyChildren.get(node) || []);
    },
  };
  return hierarchy;
}
