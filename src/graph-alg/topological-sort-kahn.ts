import { IDirectedGraph } from 'graph';
import { CycleException } from './helpers';
// TODO use optimal quque implementation
// do topological sort using kahn's algorithm
// we use array as stack with shift/pop
export function topologicalSortKahn<N, E>(graph: IDirectedGraph<N, E>) {
  const queue = graph.sources();
  const result = [];

  const inDegree = graph.edges().reduce((acc, el) => {
    const v = acc[el.to];
    acc[el.to] = v ? 1 : v + 1;
    return acc;
  }, {} as Record<string, number>);

  let count = 0;
  while (queue.length) {
    const node = queue.shift();
    if (!node) {
      throw new Error('failed to do toposort');
    }
    result.push(node);
    for (let item of graph.successors(node)) {
      if (--inDegree[item] === 0) {
        queue.push(item);
      }
    }
    count++;
  }
  if (count !== Object.keys(inDegree).length) {
    throw new CycleException();
  }
  return result;
}
