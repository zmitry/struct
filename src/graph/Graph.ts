import { upsertSet, Optional } from './helpers';

export const meta = Symbol();
interface IBaseGraphApi<N, E> {
  /**
   * get list of all edges
   */
  edges(): GraphEdge<E>[];
  /**
   * get list of all nodes
   */
  nodes(): Array<[string, N]>;
  hasNode(node: string): boolean;
  /**
   *  s
   * @param node node key
   * @param value optional value associated with node
   */
  setNode(node: string, value?: N): boolean;
  removeNode(node: string): boolean;
  hasEdge(from: string, to: string): boolean;
  /**
   *
   * @param from node key
   * @param to  node key
   * @param value optional value associated edge
   */
  setEdge(from: string, to: string, value?: E): void;
  /**
   * it will remove edges but it won't remove nodes
   */
  removeEdge(from: string, to: string, value?: E): boolean;
  edgesCount(): number;
  /**
   *
   * @param node node key
   * @returns value associated with node
   */
  getNodeValue(node: string): N | undefined;
  getEdgeValue(from: string, to: String): E | undefined;
  removeNodeValue(node: string): boolean;
  removeEdgeByObj(edge: Optional<GraphEdge<E>, 'value'>): boolean;
  nodesCount(): number;
}
export interface IUndirectedGraph<N, E> extends IBaseGraphApi<N, E> {
  /**
   *  list of all nodes connected with provided key
   */
  neighbors(node: string): string[];
  [meta]?: {
    directed: boolean;
  };
}
// type for basic graph implementation
export interface IDirectedGraph<N, E> extends IBaseGraphApi<N, E> {
  /**
   * list of nodes without incoming edges
   */
  sources(): string[];
  /**
   * list of nodes without outgoing edges
   */
  sinks(): string[];
  /**
   * list of nodes without  edges
   */
  orphans(): string[];
  /**
   * list of incoming edges for particular node
   * @param n node key
   */
  predecessors(node: string): string[];
  /**
   * list of outgoing edges for particular node
   */
  successors(node: string): string[];
  /**
   *  predecessors and successors
   */
  neighbors(node: string): string[];
  [meta]?: {
    directed: boolean;
  };
}

type GraphEdge<T> = { to: string; from: string; value: T };

type Events = {
  onAddNode: (k: string) => void;
  onRemoveNode: (k: string) => void;
};

function createBaseGraph<N, E>(events: Events) {
  const nodesMap = new Map<string, N>();
  const edgesMap = new Map<string, GraphEdge<E>>();

  const graph = {
    nodesMap,
    edgesMap,
    // returns node value N
    getNodeValue(n: string) {
      return nodesMap.get(n);
    },
    setNode(n: string, value?: N) {
      const hasNode = graph.hasNode(n);
      if (!hasNode) {
        events.onAddNode(n);
      }

      if (hasNode && typeof value === 'undefined') {
        return hasNode;
      }

      nodesMap.set(n, value as N);
      return hasNode;
    },
    hasNode(n: string) {
      return nodesMap.has(n);
    },
    removeNode(n: string): boolean {
      if (!nodesMap.has(n)) {
        return false;
      }
      events.onRemoveNode(n);
      nodesMap.delete(n);
      for (let edge of edgesMap.values()) {
        if (edge.from === n || edge.to === n) {
          graph.removeEdgeByObj(edge);
        }
      }
      return true;
    },
    removeNodeValue(n: string) {
      return nodesMap.delete(n);
    },
    getEdgeValue(from: string, to: string) {
      return edgesMap.get(edgeToString(from, to))?.value;
    },
    setEdge(from: string, to: string, value?: E) {
      if (!graph.hasNode(from)) {
        graph.setNode(from);
      }
      if (!graph.hasNode(to)) {
        graph.setNode(to);
      }
      const edge = edgeToString(from, to);
      const hasEdge = edgesMap.has(edge);
      edgesMap.set(edge, {
        value: value as E,
        from,
        to,
      });
      return hasEdge;
    },
    // it doesn't remove node itself
    removeEdge(from: string, to: string) {
      return edgesMap.delete(edgeToString(from, to));
    },
    // remove edge by object
    removeEdgeByObj({ from, to }: Optional<GraphEdge<E>, 'value'>) {
      if (from && to) {
        return graph.removeEdge(from, to);
      }
      return false;
    },
    hasEdge(from: string, to: string) {
      return edgesMap.has(edgeToString(from, to));
    },

    // returns nodes without in edges
    nodes() {
      return Array.from(nodesMap.entries());
    },
    // returns list of edges
    edges() {
      return Array.from(edgesMap.values());
    },
    edgesCount() {
      return edgesMap.size;
    },
    nodesCount() {
      return nodesMap.size;
    },
    filterNodes(cond: (k: string) => boolean) {
      const result = [] as string[];
      for (let key of nodesMap.keys()) {
        if (cond(key)) {
          result.push(key);
        }
      }
      return result;
    },
  };
  return graph;
}

export function createGraph<N, E>(events: Events) {
  const nodesEdges = new Map<string, Set<string>>();
  const base = createBaseGraph<N, E>(events);

  const graph: IUndirectedGraph<N, E> = {
    getNodeValue: base.getNodeValue,
    setNode: base.setNode,
    hasNode: base.hasNode,
    removeNodeValue: base.removeNodeValue,
    getEdgeValue: base.getEdgeValue,
    removeEdgeByObj: base.removeEdgeByObj,
    hasEdge: base.hasEdge,
    nodes: base.nodes,
    edges: base.edges,
    edgesCount: base.edgesCount,
    nodesCount: base.nodesCount,
    removeNode(n: string): boolean {
      const hasNode = base.removeNode(n);
      if (hasNode) {
        nodesEdges.delete(n);
      }
      return hasNode;
    },
    setEdge(from: string, to: string, value?: E) {
      const hasEdge = base.setEdge(from, to, value);
      upsertSet(nodesEdges, from, to);
      return hasEdge;
    },
    removeEdge(from: string, to: string) {
      const hasEdge = base.removeEdge(from, to);
      if (hasEdge) {
        nodesEdges.get(from)?.delete(to);
      }
      return hasEdge;
    },
    neighbors(n: string) {
      return Array.from(nodesEdges.get(n)?.values() || []);
    },
    [meta]: { directed: true },
  };
  return graph;
}

export function createOrientedGraph<N, E>(
  events: Events
): IDirectedGraph<N, E> {
  const inNodes = new Map<string, Set<string>>();
  const outNodes = new Map<string, Set<string>>();
  const base = createBaseGraph<N, E>(events);

  const graph: IDirectedGraph<N, E> = {
    getNodeValue: base.getNodeValue,
    setNode: base.setNode,
    hasNode: base.hasNode,
    removeNodeValue: base.removeNodeValue,
    getEdgeValue: base.getEdgeValue,
    removeEdgeByObj: base.removeEdgeByObj,
    hasEdge: base.hasEdge,
    nodes: base.nodes,
    edges: base.edges,
    edgesCount: base.edgesCount,
    nodesCount: base.nodesCount,
    removeNode(n: string): boolean {
      const hasNode = base.removeNode(n);
      if (hasNode) {
        inNodes.delete(n);
        outNodes.delete(n);
      }
      return hasNode;
    },
    setEdge(from: string, to: string, value?: E) {
      const hasEdge = base.setEdge(from, to, value);
      upsertSet(inNodes, to, from);
      upsertSet(outNodes, from, to);
      return hasEdge;
    },
    // it doesn't not remove node itself
    removeEdge(from: string, to: string) {
      const hasEdge = base.removeEdge(from, to);
      if (hasEdge) {
        inNodes.get(to)?.delete(from);
        outNodes.get(from)?.delete(to);
      }
      return hasEdge;
    },
    predecessors(n: string) {
      return Array.from(inNodes.get(n)?.values() || []);
    },
    successors(n: string) {
      return Array.from(outNodes.get(n)?.values() || []);
    },
    neighbors(n: string) {
      const outItems = outNodes.get(n)?.values();
      const inItems = outNodes.get(n)?.values();
      if (outItems && inItems) {
        return Array.from(outItems).concat(Array.from(inItems));
      }
      return Array.from(outItems || inItems || []);
    },
    sources() {
      return base.filterNodes(k => !inNodes.has(k));
    },
    sinks() {
      return base.filterNodes(k => !outNodes.has(k));
    },
    orphans() {
      return base.filterNodes(k => !outNodes.has(k) && !outNodes.has(k));
    },
  };
  return graph;
}

function edgeToString(from: string, to: string) {
  return `edge-${from}-${to}`;
}
