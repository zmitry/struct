export * from './compound-graph';
export * from './graph';
import { createHierarchy, IHierarchy } from './compound-graph';
import {
  createOrientedGraph,
  IDirectedGraph,
  IUndirectedGraph,
  createGraph as createUnorientedGraph,
} from './graph';

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
