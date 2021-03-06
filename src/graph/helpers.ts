export function upsertSet<K, V>(map: Map<K, Set<V>>, key: K, value: V) {
  let old = map.get(key);
  if (!old) {
    map.set(
      key,
      new Set<V>([value])
    );
  } else {
    map.set(key, old.add(value));
  }
}

export const mapUnique = <T>(arr: T[]): T[] => Array.from(new Set(arr));
