
export type Optional<T extends object, K extends keyof T = keyof T> = Omit<T,K> & Partial<Pick<T, K>>;

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
