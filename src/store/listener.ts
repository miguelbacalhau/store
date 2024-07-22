const listenerMap: Record<string, (() => void)[]> = {};

export function addListener(key: string, listener: () => void) {
  if (listenerMap[key]) {
    listenerMap[key].push(listener);
  } else {
    listenerMap[key] = [listener];
  }
}

export function removeListener(key: string, listener: () => void) {
  listenerMap[key] = listenerMap[key]?.filter((l) => l !== listener);
}

export function triggerListener(key: string) {
  listenerMap[key]?.forEach((listener) => listener());
}
