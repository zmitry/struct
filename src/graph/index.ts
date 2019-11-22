export * from './CompoundGraph';
export * from './OrientedGraph';
import { createHierarchy, IHierarchy } from './CompoundGraph';
import {
  createOrientedGraph,
  IOrientedGraph,
  IUnorientedGraph,
  createGraph as createUnorientedGraph,
} from './OrientedGraph';

export function createCompoundGraph<N, E>(
  type: 'graph'
): IHierarchy & IUnorientedGraph<N, E>;
export function createCompoundGraph<N, E>(
  type: 'digraph'
): IHierarchy & IOrientedGraph<N, E>;

export function createCompoundGraph<N, E>(type: string): any {
  const hierarchy = createHierarchy();
  const graph =
    type === 'graph'
      ? createUnorientedGraph<N, E>()
      : createOrientedGraph<N, E>();
  return Object.assign(graph, hierarchy, {
    ...graph,
    setNode(node, value) {
      const hasNode = graph.setNode(node, value);
      if (!hasNode) {
        hierarchy.addNode(node);
      }
      return hasNode;
    },
    removeNode(node) {
      const hasNode = graph.removeNode(node);
      if (hasNode) {
        hierarchy.removeHierarchyNode(node);
      }
      return hasNode;
    },
  } as IOrientedGraph<N, E>);
}
