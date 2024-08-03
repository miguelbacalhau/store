const separator = ':';

export function buildItemKey(key: string, id: unknown) {
  return `${key}${separator}item${separator}${id}`;
}

export function buildListKey(key: string, args: unknown) {
  return `${key}${separator}list${separator}${JSON.stringify(args)}`;
}

export function buildNewItemsKey(key: string) {
  return `${key}${separator}new-items`;
}

export function deconstructKey(
  key: string,
): [string, string, unknown | undefined] {
  const [keyK, type, idOrArgs] = key.split(separator);

  return [keyK, type, idOrArgs];
}
