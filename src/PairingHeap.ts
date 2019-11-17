// TODO
class HeapNode {
  constructor(
    public weight: number,
    public leftChild: HeapNode | null,
    public sibling: HeapNode | null
  ) {}
}

const NIL = new HeapNode(-Infinity, null, null);

export function addChild(currNode: HeapNode, newNode: HeapNode) {
  if (currNode.leftChild === null) {
    currNode.leftChild = newNode;
  } else {
    newNode.sibling = currNode.leftChild;
    currNode.leftChild = newNode;
  }
  return currNode;
}

export function merge(A: HeapNode | null, B: HeapNode | null): HeapNode | null {
  // If any of the two-nodes is null
  // the return the not null node
  if (A == null) return B;
  if (B == null) return A;

  // To maintain the min heap condition compare
  // the nodes and node with minimum value become
  // parent of the other node
  if (A.weight < B.weight) {
    return addChild(A, B);
  } else {
    return addChild(B, A);
  }
}

export function takeMin(root: HeapNode) {
  // remove top element
  let p = root.leftChild as HeapNode;
  root.leftChild = NIL;
  root = p;

  while (true) {
    var q = root.sibling;
    if (q === NIL) {
      break;
    }
    p = root;
    var r = q?.sibling;
    var s = merge(p, q);
    root = s as HeapNode;
    while (true) {
      p = r as HeapNode;
      q = r?.sibling as HeapNode;
      if (q === NIL) {
        break;
      }
      r = q.sibling;
      if (s) {
        s.sibling = merge(p, q);
      }
      s = s?.sibling as HeapNode;
    }
    if (p !== NIL) {
      p.sibling = root;
      root = p;
    }
  }
  return root;
}
