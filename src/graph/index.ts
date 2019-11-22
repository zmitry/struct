export * from './CompoundGraph';
export * from './Graph';
import { createHierarchy, IHierarchy } from './CompoundGraph';
import {
  createOrientedGraph,
  IDirectedGraph,
  IUndirectedGraph,
  createGraph as createUnorientedGraph,
} from './Graph';

export function createCompoundGraph<N, E>(
  type: 'graph'
): IHierarchy & IUndirectedGraph<N, E>;
export function createCompoundGraph<N, E>(
  type: 'digraph'
): IHierarchy & IDirectedGraph<N, E>;

export function createCompoundGraph<N, E>(type: string): any {
  const hierarchy = createHierarchy();
  const events = {
    onAddNode: hierarchy.addNode,
    onRemoveNode: hierarchy.removeHierarchyNode,
  };
  const graph =
    type === 'graph'
      ? createUnorientedGraph<N, E>(events)
      : createOrientedGraph<N, E>(events);
  return Object.assign({}, graph, hierarchy);
}
