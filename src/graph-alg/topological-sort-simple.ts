import { IDirectedGraph } from 'graph';
import { CycleException } from './helpers';

export function topsort<Node, Edge>(g: IDirectedGraph<Node, Edge>) {
  var visited = {} as Record<string, boolean>;
  var stack = {} as Record<string, boolean>;
  var results = [] as string[];

  function visit(node: string) {
    if (stack[node]) {
      throw new CycleException();
    }
    if (!visited[node]) {
      stack[node] = true;
      visited[node] = true;
      g.predecessors(node).forEach(visit);
      delete stack[node];
      results.push(node);
    }
  }

  g.sinks().forEach(visit);

  if (Object.keys(visited).length !== g.nodesCount()) {
    throw new CycleException();
  }

  return results;
}
