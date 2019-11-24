export class HeapNode {
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
    let oldChildren = currNode.left;
    currNode.left = newNode;
    newNode.sibling = oldChildren;
  }
  return currNode;
}

export function merge(
  A: Optional<HeapNode>,
  B: Optional<HeapNode>
): Optional<HeapNode> {
  if (!A) return B;
  if (!B) return A;
  return A.weight < B.weight ? addChild(A, B) : addChild(B, A);
}

export function toString(q: any) {
  if (!q) {
    return '';
  }
  let res = '';
  if (q.left) {
    res += `${q.weight}>(${toString(q.left)})`;
  } else {
    res += q.weight;
  }

  while ((q = q.sibling)) {
    if (q.left) {
      res += ` ${q.weight}>(${toString(q.left)})`;
      continue;
    }
    res += ' ' + q.weight;
  }

  return res;
}

function link(node1: any, node2: any) {
  node1.sibling = null;
  node2.sibling = null;
  return merge(node1, node2) as HeapNode;
}
function push(link: HeapNode, value: any) {
  link.sibling = value;
  link = link?.sibling as HeapNode;
  return link;
}
export function MergePass(
  iteratorNode: Optional<HeapNode>,
  firstPass = true
): Optional<HeapNode> {
  if (!iteratorNode || !iteratorNode?.sibling) {
    return merge(iteratorNode, iteratorNode?.sibling);
  }
  let next = iteratorNode.sibling.sibling;
  let result = link(iteratorNode, iteratorNode.sibling);
  let resultRoot = result;
  while (next?.sibling) {
    let node1 = next;
    let node2 = next?.sibling;
    next = node2.sibling;
    const res = link(node1, node2);
    result = push(result, res);
  }
  if (next) {
    result = push(result, next);
  }
  return firstPass ? MergePass(resultRoot, false) : resultRoot;
}
type Optional<T> = T | undefined | null;

export function createHeap() {
  let root: Optional<HeapNode>;
  return {
    get root() {
      return root;
    },
    pop() {
      if (root === null) {
        return null;
      }
      const removed = root?.weight;
      root = MergePass(root?.left as HeapNode);
      return removed;
    },
    push(value: number) {
      root = merge(root, new HeapNode(value));
    },
    top() {
      return root?.weight;
    },
    join(node: HeapNode) {
      root = merge(root, node);
    },
  };
}
