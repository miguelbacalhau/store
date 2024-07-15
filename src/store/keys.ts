export function getItemKey(key: string, id: unknown) {
  return `${key} ${id}`;
}

export function getListKey(key: string) {
  return key;
}
