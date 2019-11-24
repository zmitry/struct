import { createHeap } from './pairing-heap';
// TODO add more cases
test('basic', () => {
  const h = createHeap();
  h.push(2);
  h.push(4);
  h.push(3);
  h.push(1);
  h.push(5);
  h.push(6);
  h.push(1);
  expect(h.top()).toBe(1);
  h.pop();
  h.pop();
  expect(h.top()).toBe(2);
}, 1000);

// test.only('child', () => {
//   const res = merge(new HeapNode(0, null, null), new HeapNode(1, null, null));
//   const res2 = merge(
//     res,
//     merge(new HeapNode(5, null, null), new HeapNode(2, null, null))
//   );
//   console.log('res: ', merge(res2, new HeapNode(4)));
// });
