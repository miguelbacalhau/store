export function buildItemKey(key: string, id: unknown) {
  return `${key} ${id}`;
}

export function buildListKey(key: string) {
  return key;
}
