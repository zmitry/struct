class HeapNode {
  constructor(
    public weight: number,
    public left: HeapNode | null = null,
    public sibling: HeapNode | null = null
  ) {}
}

export function addChild(currNode: HeapNode, newNode: HeapNode) {
  if (currNode.left === null) {
    currNode.left = newNode;
  } else {
    newNode.sibling = currNode.left;
    currNode.left = newNode;
  }
  return currNode;
}

export function merge(A: HeapNode | null, B: HeapNode | null): HeapNode | null {
  if (A == null) return B;
  if (B == null) return A;
  return A.weight < B.weight ? addChild(A, B) : addChild(B, A);
}

function mergePairs(root: HeapNode | null): HeapNode | null {
  if (!root?.left || !root?.sibling) {
    return null;
  } else if (root.sibling && !root.sibling.sibling) {
    return root.sibling;
  } else {
    let node1 = root?.sibling;
    root = node1;
    let node2 = root?.sibling;
    root = node2;
    let rest = root?.sibling;

    const newRoot = merge(node1, node2);
    return merge(newRoot, mergePairs(rest as HeapNode));
  }
}

export class Heap {
  root: HeapNode | null = null;
  pop() {
    if (this.root === null) {
      return null;
    }
    const removed = this.root.weight;
    this.root = mergePairs(this.root.left as HeapNode);
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
