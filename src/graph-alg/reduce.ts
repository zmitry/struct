function doReduce(
  v: string,
  postorder: boolean,
  visited: Set<string>,
  navigation: (f: string) => string[],
  fn: (...args: any) => any,
  acc: any
) {
  if (!visited.has(v)) {
    visited.add(v);

    if (!postorder) {
      acc = fn(acc, v);
    }
    navigation(v).forEach(w => {
      acc = doReduce(w, postorder, visited, navigation, fn, acc);
    });
    if (postorder) {
      acc = fn(acc, v);
    }
  }
  return acc;
}

export function reduce<Acc>(
  graph: { hasNode(n: string): boolean },
  rootNodes: string[],
  fn: <V>(ac: Acc, v: V) => Acc,
  acc: Acc,
  order = false,
  navigate = (n: string) => (graph as any).successors(n)
) {
  var visited = new Set<string>();
  rootNodes.forEach(key => {
    if (!graph.hasNode(key)) {
      throw new Error('Graph does not have node: ' + key);
    }
  });
  rootNodes.forEach(key => {
    acc = doReduce(key, order, visited, navigate, fn, acc);
  });
  return acc;
}
