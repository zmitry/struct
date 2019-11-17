export function LRUCache<K, V>(cap: number) {
  let map = new Map();

  function popFirst() {
    let val = map.keys().next();
    if (!val.done) {
      map.delete(val.value);
    }
  }
  return {
    has(key: K) {
      return map.has(key);
    },
    get(key: K) {
      let value = map.get(key);
      if (value != null) {
        map.delete(key);
        map.set(key, value);
      }
      return value;
    },
    set(key: K, value: V) {
      map.delete(key);
      map.set(key, value);
      if (map.size > cap) {
        popFirst();
      }
    },
    delete(key: K) {
      map.delete(key);
    },
    size() {
      return map.size;
    },
  };
}
