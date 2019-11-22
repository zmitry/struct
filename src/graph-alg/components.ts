import { IDirectedGraph } from 'graph/graph';

export function components(g: IDirectedGraph<any, any>) {
  const visited = {} as Record<string, boolean>;
  const cmpts = [] as string[][];
  let cmpt: string[];

  function dfs(v: string) {
    if (visited[v]) return;
    visited[v] = true;
    cmpt.push(v);
    g.successors(v).forEach(dfs);
    g.predecessors(v).forEach(dfs);
  }

  g.nodes().forEach(v => {
    cmpt = [];
    dfs(v[0]);
    if (cmpt.length) {
      cmpts.push(cmpt);
    }
  });

  return cmpts;
}
