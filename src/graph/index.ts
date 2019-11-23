import { createHierarchy, IHierarchy } from './compound-graph';
import { IDirectedGraph, IUndirectedGraph, createGraph } from './graph';
export * from './compound-graph';
export * from './graph';

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
      ? createGraph<N, E>({ events, directed: false })
      : createGraph<N, E>({ events, directed: true });
  return Object.assign({}, graph, hierarchy);
}
