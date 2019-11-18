export interface IOrientedGraph<N, E> {
  edges(): GraphEdge<E>[];
  nodes(): Array<[string, N]>;
  sources(): string[];
  sinks(): string[];
  orphans(): string[];
  hasNode(v: string): boolean;
  setNode(node: string, value?: N): void;
  removeNode(node: string): void;
  predecessors(n: string): string[];
  successors(n: string): string[];
  neighbors(n: string): string[];
  hasEdge(from: string, to: string): boolean;
  setEdge(from: string, to: string, value?: E): void;
  removeEdge(from: string, to: string, value?: E): boolean;
  edgesCount(): number;
  nodesCount(): number;
}

function upsertSet<K, V>(map: Map<K, Set<V>>, key: K, value: V) {
  let old = map.get(key);
  if (!old) {
    map.set(
      key,
      new Set<V>([value])
    );
  } else {
    map.set(key, old.add(value));
  }
}

type GraphEdge<T> = { to: string; from: string; value: T };

function edgeToString(from: string, to: string) {
  return `edge-${from}-${to}`;
}

export class OrientedGraph<N, E = any> implements IOrientedGraph<N, E> {
  private inNodes = new Map<string, Set<string>>();
  private outNodes = new Map<string, Set<string>>();
  private nodesMap = new Map<string, N>();
  private edgesMap = new Map<string, GraphEdge<E>>();
  private filterNodes(cond: (k: string) => boolean) {
    const result = [] as string[];
    for (let key of this.nodesMap.keys()) {
      if (cond(key)) {
        result.push(key);
      }
    }
    return result;
  }
  // returns node value N
  getNodeValue(n: string) {
    return this.nodesMap.get(n);
  }
  setNode(n: string, value?: N) {
    this.nodesMap.set(n, value as N);
  }
  hasNode(n: string) {
    return this.nodesMap.has(n);
  }
  removeNode(n: string) {
    this.inNodes.delete(n);
    this.outNodes.delete(n);
    this.nodesMap.delete(n);
    for (let edge of this.edgesMap.values()) {
      if (edge.from === n || edge.to === n) {
        this.removeEdgeByObj(edge);
      }
    }
  }
  removeNodeValue(n: string) {
    return this.nodesMap.delete(n);
  }
  getEdgeValue(from: string, to: string) {
    return this.edgesMap.get(edgeToString(from, to));
  }
  setEdge(from: string, to: string, value?: E) {
    upsertSet(this.inNodes, to, from);
    upsertSet(this.outNodes, from, to);
    this.edgesMap.set(edgeToString(from, to), {
      value: value as E,
      from,
      to,
    });
  }
  // it doesn't not remove node itself
  removeEdge(from: string, to: string) {
    this.inNodes.get(to)?.delete(from);
    this.outNodes.get(from)?.delete(to);
    return this.edgesMap.delete(edgeToString(from, to));
  }
  // remove edge by object
  removeEdgeByObj({ from, to }: GraphEdge<E>) {
    if (from && to) {
      return this.removeEdge(from, to);
    }
    return false;
  }
  hasEdge(from: string, to: string) {
    return this.edgesMap.has(edgeToString(from, to));
  }
  // returns all incoming nodes for node
  predecessors(n: string) {
    return Array.from(this.inNodes.get(n)?.values() || []);
  }
  // returns all outgoing nodes for node
  successors(n: string) {
    return Array.from(this.outNodes.get(n)?.values() || []);
  }
  // returns all both incoming and outgoing for node
  neighbors(n: string) {
    const outItems = this.outNodes.get(n)?.values();
    const inItems = this.outNodes.get(n)?.values();
    if (outItems && inItems) {
      return Array.from(outItems).concat(Array.from(inItems));
    }
    return Array.from(outItems || inItems || []);
  }

  //  returns nodes without in edges
  sources() {
    return this.filterNodes(k => !this.inNodes.has(k));
  }
  //  returns nodes without out edges
  sinks() {
    return this.filterNodes(k => !this.outNodes.has(k));
  }
  // returns nodes without links, for instance if you set node but didn't set edge for that node
  orphans() {
    return this.filterNodes(
      k => !this.outNodes.has(k) && !this.outNodes.has(k)
    );
  }
  // returns nodes without in edges
  nodes() {
    return Array.from(this.nodesMap.entries());
  }
  // returns list of edges
  edges() {
    return Array.from(this.edgesMap.values());
  }
  edgesCount() {
    return this.edgesMap.size;
  }
  nodesCount() {
    return this.nodesMap.size;
  }
}
