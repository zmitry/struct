import {
  createGraph,
  IDirectedGraph,
  ROOT_NODE,
  mapToCompoundGraph,
  ICompoundGraph,
} from '../graph';

const getEvents = () => ({
  onAddNode: jest.fn(),
  onRemoveNode: jest.fn(),
});

describe('Graph', () => {
  let events = getEvents();
  let digraph: IDirectedGraph<unknown, unknown>;

  beforeEach(() => {
    events = getEvents();
    digraph = createGraph({
      events,
      directed: true,
    });
  });

  it('should have a correct initial state', function() {
    expect(digraph.nodesCount()).toBe(0);
    expect(digraph.edgesCount()).toBe(0);
    expect(events.onAddNode.mock.calls.length).toBe(0);
    expect(events.onRemoveNode.mock.calls.length).toBe(0);
  });

  describe('nodes', () => {
    it('should is empty if there are nodes in the graph', () => {
      expect(digraph.nodes()).toEqual([]);
    });

    it('should return the ids and values of nodes in the graph', () => {
      digraph.setNode('a', {});
      digraph.setNode('b', {});

      expect(digraph.nodes()).toEqual([
        ['a', {}],
        ['b', {}],
      ]);
    });
  });

  describe('sources', () => {
    it('should return nodes in the graph that have no in-edges', () => {
      digraph.setEdge('a', 'b');
      digraph.setEdge('b', 'c');
      digraph.setNode('d');

      expect(digraph.sources().sort()).toEqual(['a', 'd']);
    });
  });

  describe('sinks', () => {
    it('should nodes in the graph that have no out-edges', () => {
      digraph.setEdge('a', 'b');
      digraph.setEdge('b', 'c');
      digraph.setNode('d');

      expect(digraph.sinks()).toEqual(['c', 'd']);
    });
  });

  describe('setNode', () => {
    it("should create the node if it isn't part of the graph", () => {
      digraph.setNode('a');

      expect(digraph.hasNode('a')).toBe(true);
      expect(digraph.getNodeValue('a')).toBeUndefined();
      expect(digraph.nodesCount()).toBe(1);
      expect(events.onAddNode.mock.calls.length).toBe(1);
    });

    it('should can set a value for the node', () => {
      digraph.setNode('a', 'foo');

      expect(digraph.getNodeValue('a')).toBe('foo');
      expect(events.onAddNode.mock.calls.length).toBe(1);
    });

    it("should does not change the node's value with a 1-arg invocation", () => {
      digraph.setNode('a', 'foo');
      digraph.setNode('a');

      expect(digraph.getNodeValue('a')).toBe('foo');
      expect(events.onAddNode.mock.calls.length).toBe(1);
    });

    it("should can remove the node's value by passing undefined", () => {
      digraph.setNode('a', undefined);

      expect(digraph.getNodeValue('a')).toBeUndefined();
      expect(events.onAddNode.mock.calls.length).toBe(1);
    });

    it('should filter idempotent nodes', () => {
      digraph.setNode('a', 'foo');
      digraph.setNode('a', 'foo');

      expect(digraph.getNodeValue('a')).toBe('foo');
      expect(digraph.nodesCount()).toBe(1);
      expect(events.onAddNode.mock.calls.length).toBe(1);
    });
  });

  describe('hasNode', () => {
    it("should return false if the node isn't part of the graph", () => {
      expect(digraph.hasNode('a')).toBe(false);
    });

    it('should return true if node it is part of the graph', () => {
      digraph.setNode('a');

      expect(digraph.hasNode('a')).toBe(true);
    });
  });

  describe('removeNodeValue', () => {
    it('should remove value of the node', () => {
      digraph.setNode('a', 'foo');
      digraph.removeNodeValue('a');

      expect(digraph.getNodeValue('a')).toBeUndefined();
    });

    it('should idempotent remove value of the node', () => {
      digraph.setNode('a', 'foo');
      digraph.removeNode('a');
      digraph.removeNode('a');

      expect(digraph.getNodeValue('a')).toBeUndefined();
    });
  });

  describe('getNodeValue', () => {
    it("should return undefined if the node isn't part of the graph", () => {
      expect(digraph.getNodeValue('a')).toBeUndefined();
    });

    it('should return value of the node if it is part of the graph', () => {
      digraph.setNode('a', 'foo');
      expect(digraph.getNodeValue('a')).toBe('foo');
    });
  });

  describe('removeNode', () => {
    it('should does nothing if the node is not in the graph', () => {
      expect(digraph.nodesCount()).toBe(0);

      digraph.removeNode('a');

      expect(digraph.hasNode('a')).toBe(false);
      expect(digraph.nodesCount()).toBe(0);
      expect(events.onRemoveNode.mock.calls.length).toBe(0);
    });

    it('should remove the node if it is in the graph', () => {
      digraph.setNode('a');
      digraph.removeNode('a');

      expect(digraph.hasNode('a')).toBe(false);
      expect(digraph.nodesCount()).toBe(0);
      expect(events.onRemoveNode.mock.calls.length).toBe(1);
    });

    it('should is idempotent', () => {
      digraph.setNode('a');
      digraph.removeNode('a');
      digraph.removeNode('a');

      expect(digraph.hasNode('a')).toBe(false);
      expect(digraph.nodesCount()).toBe(0);
      expect(events.onRemoveNode.mock.calls.length).toBe(1);
    });

    it('should remove edges incident on the node', () => {
      digraph.setEdge('a', 'b');
      digraph.setEdge('b', 'c');
      digraph.removeNode('b');

      expect(digraph.edgesCount()).toBe(0);
      expect(events.onRemoveNode.mock.calls.length).toBe(1);
    });
  });

  describe('neighbors', () => {
    it('should return empty array for a node that is not in the graph', () => {
      expect(digraph.neighbors('a')).toEqual([]);
    });

    it('should return the neighbors of a node', () => {
      digraph.setEdge('a', 'b');
      digraph.setEdge('b', 'c');
      digraph.setEdge('a', 'a');

      expect(digraph.neighbors('a').sort()).toEqual(['a', 'b']);
      expect(digraph.neighbors('b').sort()).toEqual(['a', 'c']);
      expect(digraph.neighbors('c').sort()).toEqual(['b']);
    });
  });

  describe('predecessors', function() {
    it('should return undefined for a node that is not in the graph', function() {
      expect(digraph.predecessors('a')).toEqual([]);
    });

    it('should return the predecessors of a node', function() {
      digraph.setEdge('a', 'b');
      digraph.setEdge('b', 'c');
      digraph.setEdge('a', 'a');

      expect(digraph.predecessors('a').sort()).toEqual(['a']);
      expect(digraph.predecessors('b').sort()).toEqual(['a']);
      expect(digraph.predecessors('c').sort()).toEqual(['b']);
    });
  });

  describe('successors', function() {
    it('should return undefined for a node that is not in the graph', function() {
      expect(digraph.successors('a')).toEqual([]);
    });

    it('should return the successors of a node', function() {
      digraph.setEdge('a', 'b');
      digraph.setEdge('b', 'c');
      digraph.setEdge('a', 'a');

      expect(digraph.successors('a').sort()).toEqual(['a', 'b']);
      expect(digraph.successors('b').sort()).toEqual(['c']);
      expect(digraph.successors('c').sort()).toEqual([]);
    });
  });

  describe('edges', () => {
    it('should is empty if there are no edges in the graph', () => {
      expect(digraph.edges()).toEqual([]);
    });

    it('should return the keys for edges in the graph', () => {
      digraph.setEdge('a', 'b');
      digraph.setEdge('b', 'c');

      const sortedEdges = digraph
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
      digraph.setNode('a');
      digraph.setNode('b');
      digraph.setEdge('a', 'b');

      expect(digraph.getEdgeValue('a', 'b')).toBeUndefined();
      expect(digraph.hasEdge('a', 'b')).toBe(true);
      expect(digraph.edgesCount()).toBe(1);
    });

    it('should create the nodes for the edge if they are not part of the graph', () => {
      digraph.setEdge('a', 'b');

      expect(digraph.hasNode('a')).toBe(true);
      expect(digraph.hasNode('b')).toBe(true);
      expect(digraph.nodesCount()).toBe(2);
    });

    it('should change the value for an edge if it is already in the graph', () => {
      digraph.setEdge('a', 'b', 'foo');
      digraph.setEdge('a', 'b', 'bar');

      expect(digraph.getEdgeValue('a', 'b')).toBe('bar');
    });

    it('should delete the value for the edge if the value arg is undefined', () => {
      digraph.setEdge('a', 'b', 'foo');
      digraph.setEdge('a', 'b', undefined);

      expect(digraph.getEdgeValue('a', 'b')).toBeUndefined();
      expect(digraph.hasEdge('a', 'b')).toBe(true);
    });

    it('should can take an edge object as the first parameter', () => {
      digraph.setEdge('a', 'b', 'value');

      expect(digraph.getEdgeValue('a', 'b')).toBe('value');
    });

    it('should treat edges in opposite directions as distinct in a digraph', () => {
      digraph.setEdge('a', 'b');

      expect(digraph.hasEdge('a', 'b')).toBe(true);
      expect(digraph.hasEdge('b', 'a')).toBe(false);
    });

    it('should handle undirected graph edges', () => {
      const graph = createGraph({
        events,
        directed: false,
      });

      graph.setEdge('a', 'b', 'foo');

      expect(graph.getEdgeValue('a', 'b')).toBe('foo');
      expect(graph.getEdgeValue('b', 'a')).toBe('foo');
    });
  });

  describe('getEdgeValue', () => {
    it("should return undefined if the edge isn't part of the graph", () => {
      expect(digraph.getEdgeValue('a', 'b')).toBeUndefined();
      expect(digraph.getEdgeValue('b', 'c')).toBeUndefined();
    });

    it('should return the value of the edge if it is part of the graph', () => {
      digraph.setEdge('a', 'b', {
        foo: 'bar',
      });

      expect(digraph.getEdgeValue('a', 'b')).toEqual({
        foo: 'bar',
      });
      expect(digraph.getEdgeValue('b', 'a')).toBeUndefined();
    });

    it('should return an edge in either direction in an undirected graph', function() {
      const graph = createGraph({
        events,
        directed: false,
      });

      graph.setEdge('a', 'b', { foo: 'bar' });
      expect(graph.getEdgeValue('a', 'b')).toEqual({ foo: 'bar' });
      expect(graph.getEdgeValue('b', 'a')).toEqual({ foo: 'bar' });
    });
  });

  describe('hasEdge', () => {
    it("should return false if the edge isn't part of the graph", () => {
      expect(digraph.hasEdge('a', 'b')).toBe(false);
    });

    it('should return true if edge it is part of the graph', () => {
      digraph.setEdge('a', 'b');

      expect(digraph.hasEdge('a', 'b')).toBe(true);
    });
  });

  describe('removeEdge', () => {
    it('should has no effect if the edge is not in the graph', () => {
      digraph.removeEdge('a', 'b');

      expect(digraph.hasEdge('a', 'b')).toBe(false);
      expect(digraph.edgesCount()).toBe(0);
    });

    it('should remove neighbors', () => {
      digraph.setEdge('a', 'b');
      digraph.removeEdge('a', 'b');

      expect(digraph.neighbors('b')).toEqual([]);
    });

    it('should works with undirected graphs', () => {
      const graph = createGraph({
        events,
        directed: false,
      });

      graph.setEdge('h', 'g');
      graph.removeEdge('g', 'h');
      expect(graph.neighbors('g')).toEqual([]);
      expect(graph.neighbors('h')).toEqual([]);
    });
  });

  describe('removeEdgeByObj', () => {
    it('should has no effect if the edge is not in the graph', () => {
      digraph.removeEdgeByObj({
        from: 'a',
        to: 'b',
      });

      expect(digraph.hasEdge('a', 'b')).toBe(false);
      expect(digraph.edgesCount()).toBe(0);
    });

    it('should remove neighbors', () => {
      digraph.setEdge('a', 'b');
      digraph.removeEdgeByObj({
        from: 'a',
        to: 'b',
      });

      expect(digraph.neighbors('b')).toEqual([]);
    });

    it('should works with undirected graphs', () => {
      const graph = createGraph({
        events,
        directed: false,
      });

      graph.setEdge('h', 'g');
      graph.removeEdgeByObj({
        from: 'g',
        to: 'h',
      });
      expect(graph.neighbors('g')).toEqual([]);
      expect(graph.neighbors('h')).toEqual([]);
    });
  });
});

describe('CompoundGraph', () => {
  let events = getEvents();
  let compoundDigraph: ICompoundGraph & IDirectedGraph<unknown, unknown>;

  beforeEach(() => {
    events = getEvents();
    const digraph = createGraph({
      events,
      directed: true,
    });
    compoundDigraph = mapToCompoundGraph(digraph);
  });

  it('should includes subgraphs', function() {
    compoundDigraph.setParent('a', 'parent');

    expect(compoundDigraph.getParent('a')).toEqual('parent');
  });

  it('should includes multi-level subgraphs', function() {
    compoundDigraph.setParent('a', 'parent');
    compoundDigraph.setParent('parent', 'root');

    expect(compoundDigraph.getParent('a')).toEqual('parent');
    expect(compoundDigraph.getParent('parent')).toEqual('root');
  });

  describe('removeHierarchyNode', () => {
    it('should remove parent / child relationships for the node', () => {
      compoundDigraph.setParent('c', 'b');
      compoundDigraph.setParent('b', 'a');

      compoundDigraph.removeHierarchyNode('b');

      expect(compoundDigraph.getParent('b')).toBe(ROOT_NODE);
      expect(compoundDigraph.getChildren('b')).toEqual([]);
      expect(compoundDigraph.getChildren('a')).toEqual(
        expect.not.arrayContaining(['b'])
      );
      expect(compoundDigraph.getParent('c')).toBe(ROOT_NODE);
    });
  });

  describe('setParent', () => {
    it('should create the parent if it does not exist', () => {
      compoundDigraph.setNode('a');
      compoundDigraph.setParent('a', 'parent');

      expect(compoundDigraph.hasNode('parent')).toBe(true);
      expect(compoundDigraph.getParent('a')).toBe('parent');
    });

    it('should create the child if it does not exist', () => {
      compoundDigraph.setNode('parent');
      compoundDigraph.setParent('a', 'parent');

      expect(compoundDigraph.hasNode('a')).toBe(true);
      expect(compoundDigraph.getParent('a')).toBe('parent');
    });

    it('should has the parent as ROOT_NODE constant if it has never been invoked', () => {
      compoundDigraph.setNode('a');
      expect(compoundDigraph.getParent('a')).toBe(ROOT_NODE);
    });

    it('should move the node from the previous parent', () => {
      compoundDigraph.setParent('a', 'parent');
      compoundDigraph.setParent('a', 'parent2');

      expect(compoundDigraph.getParent('a')).toBe('parent2');
      expect(compoundDigraph.getChildren('parent')).toEqual([]);
      expect(compoundDigraph.getChildren('parent2')).toEqual(['a']);
    });
  });

  describe('getParent', function() {
    it('should return ROOT_NODE if the graph is not compound', function() {
      expect(compoundDigraph.getParent('a')).toEqual(ROOT_NODE);
    });

    it('should return ROOT_NODE if the node is not in the graph', function() {
      expect(compoundDigraph.getParent('a')).toEqual(ROOT_NODE);
    });

    it('should default to ROOT_NODE for new nodes', function() {
      compoundDigraph.setNode('a');
      expect(compoundDigraph.getParent('a')).toEqual(ROOT_NODE);
    });

    it('should returns the current parent assignment', function() {
      compoundDigraph.setNode('a');
      compoundDigraph.setNode('parent');
      compoundDigraph.setParent('a', 'parent');

      expect(compoundDigraph.getParent('a')).toBe('parent');
    });
  });

  describe('getChildren', () => {
    it('should return undefined if the node is not in the graph', () => {
      expect(compoundDigraph.getChildren('a')).toEqual([]);
    });

    it('should default to en empty list for new nodes', () => {
      compoundDigraph.setNode('a');
      expect(compoundDigraph.getChildren('a')).toEqual([]);
    });

    it('should return undefined for a non-compound graph without the node', () => {
      expect(compoundDigraph.getChildren('a')).toEqual([]);
    });

    it('should return children for the node', () => {
      compoundDigraph.setParent('a', 'parent');
      compoundDigraph.setParent('b', 'parent');
      expect(compoundDigraph.getChildren('parent').sort()).toEqual(['a', 'b']);
    });

    // TODO: fix
    test.skip('should return all nodes without a parent when the parent is not set', () => {
      compoundDigraph.setNode('a');
      compoundDigraph.setNode('b');
      compoundDigraph.setNode('c');
      compoundDigraph.setNode('parent');
      compoundDigraph.setParent('a', 'parent');

      expect(compoundDigraph.getChildren().sort()).toEqual([
        'b',
        'c',
        'parent',
      ]);
      expect(compoundDigraph.getChildren(undefined).sort()).toEqual([
        'b',
        'c',
        'parent',
      ]);
    });
  });
});
