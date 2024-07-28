export function buildItemKey(key: string, id: unknown) {
  return `${key}:item:${id}`;
}

export function buildListKey(key: string, args: unknown) {
  return `${key}:list:${JSON.stringify(args)}`;
}
