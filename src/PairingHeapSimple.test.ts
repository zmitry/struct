import { Heap } from './PairingHeapSimple';
// TODO add more cases
test('basic', () => {
  const h = new Heap();
  h.push(2);
  h.push(1);
  h.push(3);
  h.push(1);
  expect(h.top()).toBe(1);
  h.pop();
  expect(h.top()).toBe(2);
  h.push(4);
  expect(h.top()).toBe(2);
});
