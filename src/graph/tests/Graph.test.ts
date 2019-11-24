import { createGraph, IDirectedGraph } from '../Graph';

const getEvents = () => ({
  onAddNode: jest.fn(),
  onRemoveNode: jest.fn(),
});

describe('Graph', () => {
  let events = getEvents();
  let graph: IDirectedGraph<unknown, unknown>;

  beforeEach(() => {
    events = getEvents();
    graph = createGraph({
      events,
      directed: true,
    });
  });

  it('should have a correct initial state', function() {
    expect(graph.nodesCount()).toBe(0);
    expect(graph.edgesCount()).toBe(0);
    expect(events.onAddNode.mock.calls.length).toBe(0);
    expect(events.onRemoveNode.mock.calls.length).toBe(0);
  });

  describe('nodes', () => {
    it('should is empty if there are nodes in the graph', () => {
      expect(graph.nodes()).toEqual([]);
    });

    it('should return the ids and values of nodes in the graph', () => {
      graph.setNode('a', {});
      graph.setNode('b', {});

      expect(graph.nodes()).toEqual([
        ['a', {}],
        ['b', {}],
      ]);
    });
  });

  describe('sources', () => {
    it('should return nodes in the graph that have no in-edges', () => {
      graph.setEdge('a', 'b');
      graph.setEdge('b', 'c');
      graph.setNode('d');

      expect(graph.sources().sort()).toEqual(['a', 'd']);
    });
  });

  describe('sinks', () => {
    it('should nodes in the graph that have no out-edges', () => {
      graph.setEdge('a', 'b');
      graph.setEdge('b', 'c');
      graph.setNode('d');

      expect(graph.sinks()).toEqual(['c', 'd']);
    });
  });

  describe('setNode', () => {
    it("should create the node if it isn't part of the graph", () => {
      graph.setNode('a');

      expect(graph.hasNode('a')).toBe(true);
      expect(graph.getNodeValue('a')).toBeUndefined();
      expect(graph.nodesCount()).toBe(1);
      expect(events.onAddNode.mock.calls.length).toBe(1);
    });

    it('should can set a value for the node', () => {
      graph.setNode('a', 'foo');

      expect(graph.getNodeValue('a')).toBe('foo');
      expect(events.onAddNode.mock.calls.length).toBe(1);
    });

    it("should does not change the node's value with a 1-arg invocation", () => {
      graph.setNode('a', 'foo');
      graph.setNode('a');

      expect(graph.getNodeValue('a')).toBe('foo');
      expect(events.onAddNode.mock.calls.length).toBe(1);
    });

    it("should can remove the node's value by passing undefined", () => {
      graph.setNode('a', undefined);

      expect(graph.getNodeValue('a')).toBeUndefined();
      expect(events.onAddNode.mock.calls.length).toBe(1);
    });

    it('should filter idempotent nodes', () => {
      graph.setNode('a', 'foo');
      graph.setNode('a', 'foo');

      expect(graph.getNodeValue('a')).toBe('foo');
      expect(graph.nodesCount()).toBe(1);
      expect(events.onAddNode.mock.calls.length).toBe(1);
    });
  });

  describe('hasNode', () => {
    it("should return false if the node isn't part of the graph", () => {
      expect(graph.hasNode('a')).toBe(false);
    });

    it('should return true if node it is part of the graph', () => {
      graph.setNode('a');

      expect(graph.hasNode('a')).toBe(true);
    });
  });

  describe('removeNodeValue', () => {
    it('should remove value of the node', () => {
      graph.setNode('a', 'foo');
      graph.removeNodeValue('a');

      expect(graph.getNodeValue('a')).toBeUndefined();
    });

    it('should idempotent remove value of the node', () => {
      graph.setNode('a', 'foo');
      graph.removeNode('a');
      graph.removeNode('a');

      expect(graph.getNodeValue('a')).toBeUndefined();
    });
  });

  describe('getNodeValue', () => {
    it("should return undefined if the node isn't part of the graph", () => {
      expect(graph.getNodeValue('a')).toBeUndefined();
    });

    it('should return value of the node if it is part of the graph', () => {
      graph.setNode('a', 'foo');
      expect(graph.getNodeValue('a')).toBe('foo');
    });
  });

  describe('removeNode', () => {
    it('should does nothing if the node is not in the graph', () => {
      expect(graph.nodesCount()).toBe(0);

      graph.removeNode('a');

      expect(graph.hasNode('a')).toBe(false);
      expect(graph.nodesCount()).toBe(0);
      expect(events.onRemoveNode.mock.calls.length).toBe(0);
    });

    it('should remove the node if it is in the graph', () => {
      graph.setNode('a');
      graph.removeNode('a');

      expect(graph.hasNode('a')).toBe(false);
      expect(graph.nodesCount()).toBe(0);
      expect(events.onRemoveNode.mock.calls.length).toBe(1);
    });

    it('should is idempotent', () => {
      graph.setNode('a');
      graph.removeNode('a');
      graph.removeNode('a');

      expect(graph.hasNode('a')).toBe(false);
      expect(graph.nodesCount()).toBe(0);
      expect(events.onRemoveNode.mock.calls.length).toBe(1);
    });

    it('should remove edges incident on the node', () => {
      graph.setEdge('a', 'b');
      graph.setEdge('b', 'c');
      graph.removeNode('b');

      expect(graph.edgesCount()).toBe(0);
      expect(events.onRemoveNode.mock.calls.length).toBe(1);
    });
  });

  describe('neighbors', () => {
    it('should return empty array for a node that is not in the graph', () => {
      expect(graph.neighbors('a')).toEqual([]);
    });

    it('should return the neighbors of a node', () => {
      graph.setEdge('a', 'b');
      graph.setEdge('b', 'c');
      graph.setEdge('a', 'a');

      expect(graph.neighbors('a').sort()).toEqual(['a', 'b']);
      expect(graph.neighbors('b').sort()).toEqual(['a', 'c']);
      expect(graph.neighbors('c').sort()).toEqual(['b']);
    });
  });

  describe('predecessors', function() {
    it('should return undefined for a node that is not in the graph', function() {
      expect(graph.predecessors('a')).toBeUndefined();
    });

    it('should return the predecessors of a node', function() {
      graph.setEdge('a', 'b');
      graph.setEdge('b', 'c');
      graph.setEdge('a', 'a');

      expect(graph.predecessors('a').sort()).toEqual(['a']);
      expect(graph.predecessors('b').sort()).toEqual(['a']);
      expect(graph.predecessors('c').sort()).toEqual(['b']);
    });
  });

  describe('successors', function() {
    it('should return undefined for a node that is not in the graph', function() {
      expect(graph.successors('a')).toEqual([]);
    });

    it('should return the successors of a node', function() {
      graph.setEdge('a', 'b');
      graph.setEdge('b', 'c');
      graph.setEdge('a', 'a');

      expect(graph.successors('a').sort()).toEqual(['a', 'b']);
      expect(graph.successors('b').sort()).toEqual(['c']);
      expect(graph.successors('c').sort()).toEqual([]);
    });
  });

  describe('edges', () => {
    it('should is empty if there are no edges in the graph', () => {
      expect(graph.edges()).toEqual([]);
    });

    it('should return the keys for edges in the graph', () => {
      graph.setEdge('a', 'b');
      graph.setEdge('b', 'c');

      const sortedEdges = graph
        .edges()
        .sort((edgeA, edgeB) => (edgeA.to === edgeB.from ? -1 : 1));

      expect(sortedEdges).toEqual([
        {
          from: 'a',
          to: 'b',
        },
        {
          from: 'b',
          to: 'c',
        },
      ]);
    });
  });

  describe('setEdge', () => {
    it("should create the edge if it isn't part of the graph", () => {
      graph.setNode('a');
      graph.setNode('b');
      graph.setEdge('a', 'b');

      expect(graph.getEdgeValue('a', 'b')).toBeUndefined();
      expect(graph.hasEdge('a', 'b')).toBe(true);
      expect(graph.edgesCount()).toBe(1);
    });

    it('should create the nodes for the edge if they are not part of the graph', () => {
      graph.setEdge('a', 'b');

      expect(graph.hasNode('a')).toBe(true);
      expect(graph.hasNode('b')).toBe(true);
      expect(graph.nodesCount()).toBe(2);
    });

    it('should change the value for an edge if it is already in the graph', () => {
      graph.setEdge('a', 'b', 'foo');
      graph.setEdge('a', 'b', 'bar');

      expect(graph.getEdgeValue('a', 'b')).toBe('bar');
    });

    it('should delete the value for the edge if the value arg is undefined', () => {
      graph.setEdge('a', 'b', 'foo');
      graph.setEdge('a', 'b', undefined);

      expect(graph.getEdgeValue('a', 'b')).toBeUndefined();
      expect(graph.hasEdge('a', 'b')).toBe(true);
    });

    it('should can take an edge object as the first parameter', () => {
      graph.setEdge('a', 'b', 'value');

      expect(graph.getEdgeValue('a', 'b')).toBe('value');
    });

    it('should treat edges in opposite directions as distinct in a digraph', () => {
      graph.setEdge('a', 'b');

      expect(graph.hasEdge('a', 'b')).toBe(true);
      expect(graph.hasEdge('b', 'a')).toBe(false);
    });

    it('should handle undirected graph edges', () => {
      const undigraph = createGraph({
        events,
        directed: false,
      });

      undigraph.setEdge('a', 'b', 'foo');

      expect(undigraph.getEdgeValue('a', 'b')).toBe('foo');
      expect(undigraph.getEdgeValue('b', 'a')).toBe('foo');
    });
  });

  describe('getEdgeValue', () => {
    it("should return undefined if the edge isn't part of the graph", () => {
      expect(graph.getEdgeValue('a', 'b')).toBeUndefined();
      expect(graph.getEdgeValue('b', 'c')).toBeUndefined();
    });

    it('should return the value of the edge if it is part of the graph', () => {
      graph.setEdge('a', 'b', {
        foo: 'bar',
      });

      expect(graph.getEdgeValue('a', 'b')).toEqual({
        foo: 'bar',
      });
      expect(graph.getEdgeValue('b', 'a')).toBeUndefined();
    });

    it("should return an edge in either direction in an undirected graph", function() {
      const undigraph = createGraph({
        events,
        directed: false,
      });

      undigraph.setEdge("a", "b", { foo: "bar" });
      expect(undigraph.getEdgeValue("a", "b")).toEqual({ foo: "bar" });
      expect(undigraph.getEdgeValue("b", "a")).toEqual({ foo: "bar" });
    });
  });

  describe('hasEdge', () => {
    it("should return false if the edge isn't part of the graph", () => {
      expect(graph.hasEdge('a', 'b')).toBe(false);
    });

    it('should return true if edge it is part of the graph', () => {
      graph.setEdge('a', 'b');

      expect(graph.hasEdge('a', 'b')).toBe(true);
    });
  });

  describe('removeEdge', () => {
    it('should has no effect if the edge is not in the graph', () => {
      graph.removeEdge('a', 'b');

      expect(graph.hasEdge('a', 'b')).toBe(false);
      expect(graph.edgesCount()).toBe(0);
    });

    it('should remove neighbors', () => {
      graph.setEdge('a', 'b');
      graph.removeEdge('a', 'b');

      expect(graph.neighbors('b')).toEqual([]);
    });

    it('should works with undirected graphs', () => {
      const undigraph = createGraph({
        events,
        directed: false,
      });

      undigraph.setEdge('h', 'g');
      undigraph.removeEdge('g', 'h');
      expect(undigraph.neighbors('g')).toEqual([]);
      expect(undigraph.neighbors('h')).toEqual([]);
    })
  });

  describe('removeEdgeByObj', () => {
    it('should has no effect if the edge is not in the graph', () => {
      graph.removeEdgeByObj({
        from: 'a',
        to: 'b',
      });

      expect(graph.hasEdge('a', 'b')).toBe(false);
      expect(graph.edgesCount()).toBe(0);
    });

    it('should remove neighbors', () => {
      graph.setEdge('a', 'b');
      graph.removeEdgeByObj({
        from: 'a',
        to: 'b',
      });

      expect(graph.neighbors('b')).toEqual([]);
    });

    it('should works with undirected graphs', () => {
      const undigraph = createGraph({
        events,
        directed: false,
      });

      undigraph.setEdge('h', 'g');
      undigraph.removeEdgeByObj({
        from: 'g',
        to: 'h'
      });
      expect(undigraph.neighbors('g')).toEqual([]);
      expect(undigraph.neighbors('h')).toEqual([]);
    })
  });
});
