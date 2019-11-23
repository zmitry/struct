import { createGraph, createOrientedGraph } from '../Graph';

const getEvents = () => ({
  onAddNode: jest.fn(),
  onRemoveNode: jest.fn(),
});

describe('Graph', () => {
  let events = getEvents();

  beforeEach(() => {
    events = getEvents();
  });

  it('should have a correct initial state', function() {
    const graph = createGraph(events);

    expect(graph.nodesCount()).toBe(0);
    expect(graph.edgesCount()).toBe(0);
    expect(events.onAddNode.mock.calls.length).toBe(0);
    expect(events.onRemoveNode.mock.calls.length).toBe(0);
  });

  it('should return the ids and values of nodes in the graph', () => {
    const graph = createGraph(events);

    graph.setNode('a', {});
    graph.setNode('b', {});

    expect(graph.nodes()).toEqual([
      ['a', {}],
      ['b', {}],
    ]);
  });
});

describe('Digraph', () => {
  let events = getEvents();

  beforeEach(() => {
    events = getEvents();
  });

  it('should have a correct initial state', function() {
    const graph = createOrientedGraph(events);

    expect(graph.nodesCount()).toBe(0);
    expect(graph.edgesCount()).toBe(0);
    expect(events.onAddNode.mock.calls.length).toBe(0);
    expect(events.onRemoveNode.mock.calls.length).toBe(0);
  });

  it('should return the ids and values of nodes in the graph', () => {
    const graph = createOrientedGraph(events);

    graph.setNode('a', {});
    graph.setNode('b', {});

    expect(graph.nodes()).toEqual([
      ['a', {}],
      ['b', {}],
    ]);
  });

  it('should return nodes in the graph that have no in-edges', () => {
    const graph = createOrientedGraph(events);

    graph.setEdge('a', 'b');
    graph.setEdge('b', 'c');
    graph.setNode('d');

    expect(graph.sources()).toEqual(['a', 'd']);
  });

  it('should nodes in the graph that have no out-edges', () => {
    const graph = createOrientedGraph(events);

    graph.setEdge('a', 'b');
    graph.setEdge('b', 'c');
    graph.setNode('d');

    expect(graph.sinks()).toEqual(['c', 'd']);
  });
});
