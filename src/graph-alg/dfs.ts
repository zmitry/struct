import { IDirectedGraph } from 'graph/graph';
import { reduce } from './reduce';
// TODO better types
export function dfs(g: IDirectedGraph<any, any>, vs: string[], order: boolean) {
  return reduce(
    g,
    vs,
    (acc: any, v) => {
      acc.push(v);
      return acc;
    },
    [],
    order
  );
}
