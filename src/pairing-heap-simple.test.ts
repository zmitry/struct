import { createHeap, toString, MergePass } from './pairing-heap-simple';
// TODO add more cases
test('basic', () => {
  const h = createHeap();
  h.push(6);
  h.push(1);
  h.push(1);
  h.push(2);
  h.push(4);
  h.push(3);
  h.push(5);
  console.log(toString(h.root), h.root);
  const r = MergePass(h.root?.left as any);
  console.log(toString(r));
  const r2 = MergePass(r as any);
  console.log(toString(r2));
}, 1000);

// test.only('child', () => {
//   const res = merge(new HeapNode(0, null, null), new HeapNode(1, null, null));
//   const res2 = merge(
//     res,
//     merge(new HeapNode(5, null, null), new HeapNode(2, null, null))
//   );
//   console.log('res: ', merge(res2, new HeapNode(4)));
// });
