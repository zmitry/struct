class HeapNode {
  constructor(public weight: number, public children: HeapNode[] = []) {}
}

export function addChild(currNode: HeapNode, newNode: HeapNode) {
  currNode.children.push(newNode);
  return currNode;
}

export function merge(A: HeapNode | null, B: HeapNode | null): HeapNode | null {
  if (A == null) return B;
  if (B == null) return A;
  return A.weight < B.weight ? addChild(A, B) : addChild(B, A);
}

function mergePairs(roots: HeapNode[]): HeapNode | null {
  if (roots.length === 0) {
    return null;
  } else if (roots.length === 1) {
    return roots[0];
  } else {
    const root = merge(roots[0], roots[1]);
    return merge(root, mergePairs(roots.slice(2)));
  }
}

export class Heap {
  root: HeapNode | null = null;
  pop() {
    if (this.root === null) {
      return null;
    }
    const removed = this.root.weight;
    this.root = mergePairs(this.root.children);
    return removed;
  }
  push(value: number) {
    this.root = merge(this.root, new HeapNode(value));
  }
  top() {
    return this.root?.weight;
  }
  join(node: HeapNode) {
    this.root = merge(this.root, node);
  }
}
