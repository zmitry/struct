import {
  createCompoundGraph,
  IHierarchy,
  IDirectedGraph,
  ROOT_NODE,
} from '../index';

describe('CompoundGraph', () => {
  let compoundDigraph: IHierarchy & IDirectedGraph<unknown, unknown>;

  beforeEach(() => {
    compoundDigraph = createCompoundGraph('digraph');
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
    test.skip('should create the parent if it does not exist', () => {
      compoundDigraph.addNode('a');
      compoundDigraph.setParent('a', 'parent');

      expect(compoundDigraph.hasNode('parent')).toBe(true);
      expect(compoundDigraph.getParent('a')).toBe('parent');
    });

    test.skip('should create the child if it does not exist', () => {
      compoundDigraph.addNode('parent');
      compoundDigraph.setParent('a', 'parent');

      expect(compoundDigraph.hasNode('a')).toBe(true);
      expect(compoundDigraph.getParent('a')).toBe('parent');
    });

    it('should has the parent as ROOT_NODE constant if it has never been invoked', () => {
      compoundDigraph.addNode('a');
      expect(compoundDigraph.getParent('a')).toBe(ROOT_NODE);
    });

    it('should move the node from the previous parent', () => {
      compoundDigraph.setParent('a', 'parent');
      compoundDigraph.setParent('a', 'parent2');

      expect(compoundDigraph.getParent('a')).toBe('parent2');
      expect(compoundDigraph.getChildren('parent')).toEqual([]);
      expect(compoundDigraph.getChildren('parent2')).toEqual(['a']);
    });

    test.skip('should remove the parent if the parent is ROOT_NODE', () => {
      compoundDigraph.setParent('a', 'parent');
      compoundDigraph.setParent('a', ROOT_NODE);

      expect(compoundDigraph.getParent('a')).toBe(ROOT_NODE);
      expect(compoundDigraph.getChildren().sort()).toEqual(['a', 'parent']);
    });
  });
});
